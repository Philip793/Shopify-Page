import gateway from "../config/braintree.js";
import { calculateCartTotal } from "../data/productCatalog.js";
import { createOrder } from "./orderController.js";
import {
  checkInventory,
  reduceInventory,
} from "../services/inventoryService.js";

/**
 * Generate a client token for Braintree Drop-in UI
 */
export const getClientToken = async (req, res) => {
  try {
    // Optionally attach a customerId if provided
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
 * Legacy checkout endpoint (deprecated - accepts amount from frontend)
 */
export const checkout = async (req, res) => {
  try {
    const { nonce, amount } = req.body;

    const result = await gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      res.send({ success: true, transactionId: result.transaction.id });
    } else {
      res.status(400).send({ success: false, error: result.message });
    }
  } catch (err) {
    console.error("Braintree checkout error:", err);
    res.status(500).send({ error: err.message });
  }
};

/**
 * Secure checkout endpoint - calculates total from trusted product data
 */
export const checkoutWithCart = async (req, res) => {
  try {
    console.log("Request received at /braintree/checkout-with-cart");
    const { nonce, cartItems } = req.body;

    // Validate inputs
    if (!nonce) {
      return res.status(400).send({ error: "Payment nonce is required" });
    }
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).send({ error: "Invalid or empty cart" });
    }

    // Check inventory availability before proceeding
    const inventoryCheck = checkInventory(cartItems);
    if (!inventoryCheck.available) {
      return res.status(400).send({
        error: "Insufficient inventory",
        details: inventoryCheck.insufficientItems,
      });
    }

    // Calculate total from trusted product catalog (prevents price tampering)
    const orderSummary = calculateCartTotal(cartItems);

    console.log("Processing Braintree payment for amount:", orderSummary.total);

    // Create a transaction sale with the calculated amount
    const result = await gateway.transaction.sale({
      amount: orderSummary.total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
      orderId: `ORDER-${Date.now()}`,
      customFields: {
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        items: JSON.stringify(
          orderSummary.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        ),
      },
    });

    if (result.success) {
      console.log("Braintree transaction successful:", result.transaction.id);

      // Prepare order data for database
      const orderData = {
        items: orderSummary.items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sku: `SKU-${item.id}`,
        })),
        subtotal: parseFloat(orderSummary.subtotal),
        shipping: parseFloat(orderSummary.shipping),
        total: parseFloat(orderSummary.total),
        currency: "AUD",
        payment: {
          provider: "braintree",
          transactionId: result.transaction.id,
          status: "completed",
          paidAt: new Date(),
        },
        status: "pending",
      };

      // Save order to database (non-blocking)
      const order = await createOrder(orderData);

      // Reduce inventory after successful payment
      const inventoryResult = reduceInventory(cartItems);
      if (!inventoryResult.success) {
        console.error("⚠️ Inventory reduction failed:", inventoryResult.errors);
        // Don't fail the response - order is already saved and paid
      }

      res.send({
        success: true,
        transactionId: result.transaction.id,
        orderSummary,
        orderId: order?.orderId,
        inventoryUpdated: inventoryResult.success,
      });
    } else {
      console.error("Braintree transaction failed:", result.message);
      res.status(400).send({ success: false, error: result.message });
    }
  } catch (err) {
    console.error("Braintree checkout error:", err);
    res.status(500).send({ error: err.message });
  }
};
