import stripe from "../config/stripe.js";
import { calculateCartTotal } from "../data/productCatalog.js";
import Order from "../models/Order.js";
import PendingOrder from "../models/PendingOrder.js";
import { createOrder } from "./orderController.js";
import {
  reserveInventory,
  confirmInventory,
  releaseInventory,
} from "../services/inventoryService.js";
import { sendOrderConfirmationEmailOnce } from "../services/emailService.js";

const PENDING_ORDER_TTL_MINUTES = 30;

const toNumber = (value) => Number.parseFloat(value);

const countryName = (country) =>
  String(country || "").toUpperCase() === "US" ? "United States" : "Australia";

const buildPendingOrderItems = (orderSummary) => {
  return orderSummary.items.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    sku: item.sku || `SKU-${item.id}`,
  }));
};

const buildInventoryItems = (pendingOrder) => {
  return pendingOrder.items.map((item) => ({
    id: item.productId,
    quantity: item.quantity,
  }));
};

const releasePendingInventory = async (pendingOrder) => {
  if (!pendingOrder || pendingOrder.inventoryStatus !== "reserved") {
    return { success: true, skipped: true };
  }

  const inventoryResult = await releaseInventory(
    buildInventoryItems(pendingOrder),
  );
  if (inventoryResult.success) {
    pendingOrder.inventoryStatus = "released";
    await pendingOrder.save();
  }

  return inventoryResult;
};

const releaseExpiredPendingOrders = async () => {
  const expiredOrders = await PendingOrder.find({
    status: "pending",
    inventoryStatus: "reserved",
    expiresAt: { $lte: new Date() },
  }).limit(50);

  for (const pendingOrder of expiredOrders) {
    const inventoryResult = await releasePendingInventory(pendingOrder);
    if (inventoryResult.success) {
      pendingOrder.status = "expired";
      await pendingOrder.save();
    }
  }
};

const finalizePendingOrder = async (pendingOrder, paymentIntent) => {
  const existingOrder = await Order.findOne({
    "payment.transactionId": paymentIntent.id,
  });

  if (existingOrder) {
    pendingOrder.status = "paid";
    pendingOrder.finalizedOrderId = existingOrder.orderId;
    if (pendingOrder.inventoryStatus === "reserved") {
      const inventoryResult = await confirmInventory(
        buildInventoryItems(pendingOrder),
      );
      if (inventoryResult.success) {
        pendingOrder.inventoryStatus = "confirmed";
      }
    }
    await pendingOrder.save();
    return existingOrder;
  }

  if (paymentIntent.amount !== Math.round(pendingOrder.total * 100)) {
    throw new Error(
      `Payment amount mismatch for ${paymentIntent.id}: Stripe ${paymentIntent.amount}, pending ${Math.round(
        pendingOrder.total * 100,
      )}`,
    );
  }

  const orderData = {
    items: pendingOrder.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku,
    })),
    subtotal: pendingOrder.subtotal,
    shipping: pendingOrder.shipping,
    total: pendingOrder.total,
    currency: pendingOrder.currency,
    payment: {
      provider: "stripe",
      transactionId: paymentIntent.id,
      status: "completed",
      paidAt: new Date(),
    },
    status: "pending",
    customer: pendingOrder.customer || {},
    shippingAddress: {
      ...(pendingOrder.shippingAddress || {}),
      country: countryName(pendingOrder.shippingCountry),
    },
    metadata: {
      pendingOrderId: pendingOrder._id.toString(),
      stripePaymentIntentId: paymentIntent.id,
      shippingCountry: pendingOrder.shippingCountry,
    },
  };

  const order = await createOrder(orderData, { throwOnError: true });

  const inventoryResult = await confirmInventory(
    buildInventoryItems(pendingOrder),
  );
  if (!inventoryResult.success) {
    throw new Error(
      `Inventory confirmation failed for ${paymentIntent.id}: ${JSON.stringify(
        inventoryResult.errors,
      )}`,
    );
  }

  pendingOrder.status = "paid";
  pendingOrder.inventoryStatus = "confirmed";
  pendingOrder.finalizedOrderId = order.orderId;
  await pendingOrder.save();

  return order;
};

/**
 * Create a secure checkout session.
 * The backend validates cart items, reserves inventory, creates a pending order,
 * and stores the pending order id in Stripe metadata for webhook fulfilment.
 */
export const createCheckoutSession = async (req, res) => {
  let pendingOrder = null;
  let reservedItems = [];

  try {
    const {
      cartItems,
      shippingCountry = "AU",
      customer = {},
      shippingAddress = {},
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).send({ error: "Invalid or empty cart" });
    }

    await releaseExpiredPendingOrders();

    const orderSummary = calculateCartTotal(cartItems, { shippingCountry });
    const inventoryItems = orderSummary.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const reservation = await reserveInventory(inventoryItems);
    if (!reservation.success) {
      return res.status(400).send({
        error: "Insufficient inventory",
        details: reservation.errors,
      });
    }
    reservedItems = inventoryItems;

    pendingOrder = await PendingOrder.create({
      items: buildPendingOrderItems(orderSummary),
      subtotal: toNumber(orderSummary.subtotal),
      shipping: toNumber(orderSummary.shipping),
      total: toNumber(orderSummary.total),
      currency: "AUD",
      shippingCountry: orderSummary.shippingCountry,
      customer,
      shippingAddress: {
        ...shippingAddress,
        country: countryName(orderSummary.shippingCountry),
      },
      inventoryStatus: "reserved",
      expiresAt: new Date(Date.now() + PENDING_ORDER_TTL_MINUTES * 60 * 1000),
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderSummary.totalCents,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      metadata: {
        pendingOrderId: pendingOrder._id.toString(),
        shippingCountry: orderSummary.shippingCountry,
      },
    });

    pendingOrder.stripePaymentIntentId = paymentIntent.id;
    await pendingOrder.save();

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      pendingOrderId: pendingOrder._id.toString(),
      orderSummary,
    });
  } catch (err) {
    console.error("Checkout error:", err);

    if (pendingOrder?.inventoryStatus === "reserved") {
      await releasePendingInventory(pendingOrder).catch((releaseErr) => {
        console.error(
          "Failed to release inventory after checkout error:",
          releaseErr,
        );
      });
      pendingOrder.status = "cancelled";
      await pendingOrder.save().catch((saveErr) => {
        console.error("Failed to mark pending order cancelled:", saveErr);
      });
    } else if (reservedItems.length > 0) {
      await releaseInventory(reservedItems).catch((releaseErr) => {
        console.error(
          "Failed to release reserved inventory after checkout error:",
          releaseErr,
        );
      });
    }

    res.status(400).send({ error: err.message });
  }
};

/**
 * Compatibility endpoint for the success page.
 * Order creation is webhook-driven; this endpoint only reports whether the
 * backend has already finalized the Stripe payment into an order.
 */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId || !paymentIntentId.startsWith("pi_")) {
      return res.status(400).json({
        success: false,
        error: "Valid Stripe PaymentIntent ID is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    let order = await Order.findOne({
      "payment.transactionId": paymentIntentId,
    });
    const pendingOrder = await PendingOrder.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!order && pendingOrder && paymentIntent.status === "succeeded") {
      order = await finalizePendingOrder(pendingOrder, paymentIntent);
      await sendOrderConfirmationEmailOnce(order);
    }

    res.json({
      success: paymentIntent.status === "succeeded",
      status: paymentIntent.status,
      orderCreated: Boolean(order),
      orderId: order?.orderId,
      pendingOrderStatus: pendingOrder?.status,
    });
  } catch (err) {
    console.error("Confirm payment status error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to check payment status",
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return res.status(500).send("Webhook secret is not configured");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (
      event.type === "payment_intent.succeeded" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const paymentIntent = event.data.object;
      const pendingOrder = await PendingOrder.findById(
        paymentIntent.metadata?.pendingOrderId,
      );

      if (!pendingOrder) {
        console.error("Pending order not found for webhook:", {
          eventType: event.type,
          paymentIntentId: paymentIntent.id,
          pendingOrderId: paymentIntent.metadata?.pendingOrderId,
        });
        return res.json({ received: true });
      }

      if (event.type === "payment_intent.succeeded") {
        const order = await finalizePendingOrder(pendingOrder, paymentIntent);
        await sendOrderConfirmationEmailOnce(order);
        return res.json({ received: true, orderId: order.orderId });
      }

      pendingOrder.status = "failed";
      await releasePendingInventory(pendingOrder);
      await pendingOrder.save();
      return res.json({ received: true });
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      await Order.findOneAndUpdate(
        { "payment.transactionId": charge.payment_intent },
        { "payment.status": "refunded", status: "cancelled" },
      );
      return res.json({ received: true });
    }

    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object;
      await Order.findOneAndUpdate(
        { "payment.transactionId": dispute.payment_intent },
        {
          status: "cancelled",
          "metadata.disputeId": dispute.id,
          "metadata.disputeStatus": dispute.status,
        },
      );
      return res.json({ received: true });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing failed:", err);
    res.status(500).send("Webhook processing failed");
  }
};
