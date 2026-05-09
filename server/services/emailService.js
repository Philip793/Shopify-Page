const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const formatMoney = (value, currency = "AUD") => {
  return `${Number(value || 0).toFixed(2)} ${currency}`;
};

const buildAddressLines = (shippingAddress = {}) => {
  return [
    shippingAddress.fullName,
    shippingAddress.street,
    `${shippingAddress.city || ""} ${shippingAddress.state || ""} ${
      shippingAddress.zip || ""
    }`.trim(),
    shippingAddress.country,
  ].filter(Boolean);
};

const buildOrderConfirmationHtml = (order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            ${escapeHtml(item.name)} x ${item.quantity}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${escapeHtml(formatMoney(item.price * item.quantity, order.currency))}
          </td>
        </tr>
      `,
    )
    .join("");

  const addressHtml = buildAddressLines(order.shippingAddress)
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Order confirmed</h1>
      <p>Thanks for your order. We have received your payment and recorded your order.</p>

      <h2 style="font-size: 18px; margin-top: 24px;">Order ${escapeHtml(order.orderId)}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width: 100%; margin-top: 16px;">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td style="text-align: right;">${escapeHtml(formatMoney(order.subtotal, order.currency))}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td style="text-align: right;">${escapeHtml(formatMoney(order.shipping, order.currency))}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-top: 8px;">Total charged</td>
            <td style="font-weight: bold; padding-top: 8px; text-align: right;">
              ${escapeHtml(formatMoney(order.total, order.currency))}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style="font-size: 18px; margin-top: 24px;">Shipping address</h2>
      <div>${addressHtml}</div>

      <p style="margin-top: 24px;">
        Prices are charged in AUD. If your card or bank account uses another currency,
        your bank or payment provider may use its own exchange rate and fees.
      </p>
      <p>We will prepare your order and send tracking details when available.</p>
    </div>
  `;
};

const buildOrderConfirmationText = (order) => {
  const itemLines = order.items
    .map(
      (item) =>
        `- ${item.name} x ${item.quantity}: ${formatMoney(
          item.price * item.quantity,
          order.currency,
        )}`,
    )
    .join("\n");

  const addressLines = buildAddressLines(order.shippingAddress).join("\n");

  return [
    "Order confirmed",
    "",
    "Thanks for your order. We have received your payment and recorded your order.",
    "",
    `Order ${order.orderId}`,
    itemLines,
    "",
    `Subtotal: ${formatMoney(order.subtotal, order.currency)}`,
    `Shipping: ${formatMoney(order.shipping, order.currency)}`,
    `Total charged: ${formatMoney(order.total, order.currency)}`,
    "",
    "Shipping address",
    addressLines,
    "",
    "Prices are charged in AUD. If your card or bank account uses another currency, your bank or payment provider may use its own exchange rate and fees.",
    "We will prepare your order and send tracking details when available.",
  ].join("\n");
};

export const sendOrderConfirmationEmail = async (order) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const supportEmail = process.env.SUPPORT_EMAIL;
  const to = order.customer?.email;

  if (!to) {
    throw new Error("Order does not have a customer email address");
  }

  if (!apiKey || !from) {
    throw new Error("Order confirmation email is not configured");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: supportEmail || from,
      subject: `Order confirmation ${order.orderId}`,
      html: buildOrderConfirmationHtml(order),
      text: buildOrderConfirmationText(order),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email provider rejected request: ${body}`);
  }

  return response.json();
};

export const sendOrderConfirmationEmailOnce = async (order) => {
  if (order.email?.confirmationSentAt) {
    return { skipped: true, reason: "already_sent" };
  }

  try {
    await sendOrderConfirmationEmail(order);
    order.email = {
      ...(order.email || {}),
      confirmationSentAt: new Date(),
      confirmationError: undefined,
    };
    await order.save();
    return { sent: true };
  } catch (error) {
    order.email = {
      ...(order.email || {}),
      confirmationError: error.message,
    };
    await order.save();
    console.error("Order confirmation email failed:", {
      orderId: order.orderId,
      error: error.message,
    });
    return { sent: false, error: error.message };
  }
};
