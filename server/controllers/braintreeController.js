import gateway from "../config/braintree.js";
import { calculateCartTotal } from "../data/productCatalog.js";
import { createOrder } from "./orderController.js";
import {
  reserveInventory,
  confirmInventory,
  releaseInventory,
} from "../services/inventoryService.js";

/**
 * Generate a client token for Braintree Drop-in UI
 */
export const getClientToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({
      customerId: req.query.customerId,
    });

    res.send({ clientToken: response.clientToken });
  } catch (err) {
    console.error("Braintree token error:", err);
    res.status(500).send({ error: err.message });
  }
};

/**
 * Secure checkout endpoint - calculates total from trusted product data
 */
export const checkoutWithCart = async (req, res) => {
  let inventoryReserved = false;
  let paymentSucceeded = false;
  let transactionId = null;

  try {
    console.log("Request received at /braintree/checkout-with-cart");

    const {
      nonce,
      cartItems,
      shippingCountry = "AU",
      customer = {},
      shippingAddress = {},
    } = req.body;

    // Validate inputs
    if (!nonce) {
      return res.status(400).send({ error: "Payment nonce is required" });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).send({ error: "Invalid or empty cart" });
    }

    // Only allow supported shipping countries
    const normalisedShippingCountry =
      shippingCountry === "US" || shippingCountry === "AU"
        ? shippingCountry
        : "AU";

    // Use authenticated user where possible.
    // Do not fully trust customer details from the frontend.
    const safeCustomer = {
      email: req.user?.email || customer.email || "",
      name: customer.name || req.user?.name || "Customer",
    };

    // Calculate total from trusted product catalog
    const orderSummary = calculateCartTotal(cartItems, {
      shippingCountry: normalisedShippingCountry,
    });

    console.log("Processing Braintree payment for amount:", orderSummary.total);

    // Reserve inventory before charging
    const reservationResult = await reserveInventory(cartItems);

    if (!reservationResult.success) {
      return res.status(400).send({
        success: false,
        error: "Insufficient inventory",
        details: reservationResult.errors,
      });
    }

    inventoryReserved = true;

    // Charge Braintree
    const result = await gateway.transaction.sale({
      amount: orderSummary.total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
      orderId: `ORDER-${Date.now()}`,
    });

    if (!result.success) {
      console.error("Braintree transaction failed:", result.message);

      // Payment failed, so release reserved inventory
      await releaseInventory(cartItems);

      return res.status(400).send({
        success: false,
        error: result.message,
      });
    }

    paymentSucceeded = true;
    transactionId = result.transaction.id;

    console.log("Braintree transaction successful:", transactionId);

    // Prepare order data for database
    const orderData = {
      customer: safeCustomer,

      shippingAddress: {
        ...shippingAddress,
        country:
          orderSummary.shippingCountry === "US"
            ? "United States"
            : "Australia",
      },

      items: orderSummary.items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku || `SKU-${item.id}`,
      })),

      subtotal: parseFloat(orderSummary.subtotal),
      shipping: parseFloat(orderSummary.shipping),
      total: parseFloat(orderSummary.total),
      currency: "AUD",

      payment: {
        provider: "braintree",
        transactionId,
        status: "completed",
        paidAt: new Date(),
      },

      status: "pending",

      metadata: {
        shippingCountry: orderSummary.shippingCountry,
        braintreeTransactionId: transactionId,
      },
    };

    // Save order to database
    const order = await createOrder(orderData);

    // Convert reserved inventory into sold inventory
    const inventoryResult = await confirmInventory(cartItems);

    if (!inventoryResult.success) {
      console.error("⚠️ Inventory confirmation failed:", inventoryResult.errors);
      // Do not fail the payment response. The customer has already paid.
      // You should manually review this order.
    }

    return res.send({
      success: true,
      transactionId,
      orderSummary,
      orderId: order?.orderId,
      inventoryUpdated: inventoryResult.success,
    });
  } catch (err) {
    console.error("Braintree checkout error:", err);

    // Only release inventory if payment did NOT succeed.
    // If payment succeeded, do not release stock back for resale.
    if (inventoryReserved && !paymentSucceeded) {
      try {
        await releaseInventory(req.body.cartItems || []);
      } catch (releaseErr) {
        console.error("Failed to release inventory after error:", releaseErr);
      }
    }

    return res.status(500).send({
      success: false,
      error: err.message,
      transactionId,
    });
  }
};