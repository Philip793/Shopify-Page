import stripe from "../config/stripe.js";
import { calculateCartTotal } from "../data/productCatalog.js";
import { createOrder } from "./orderController.js";
import {
  checkInventory,
  reduceInventory,
} from "../services/inventoryService.js";

/**
 * Create a legacy PaymentIntent (deprecated - accepts amount from frontend)
 */
export const createPaymentIntent = async (req, res) => {
  try {
    console.log("Request received at /create-payment-intent (legacy)");
    console.log("Request body:", req.body);
    console.log("Stripe key exists?", !!process.env.STRIPE_SECRET_KEY);

    const { amount } = req.body;

    // Basic input validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).send({ error: "Invalid amount" });
    }

    // Create a PaymentIntent with automatic payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
    });

    console.log("PaymentIntent created:", paymentIntent.id);

    // Send client secret to frontend
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).send({ error: err.message });
  }
};

/**
 * Create a secure checkout session - calculates total from trusted product data
 */
export const createCheckoutSession = async (req, res) => {
  try {
    console.log("Request received at /create-checkout-session");
    const { cartItems } = req.body;

    // Validate cart items
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

    // Create a PaymentIntent with the calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderSummary.totalCents,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_items: JSON.stringify(
          orderSummary.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        ),
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        total: orderSummary.total,
      },
    });

    console.log("Checkout session created:", paymentIntent.id);
    console.log("Order total:", orderSummary.total);

    // Send client secret and order summary to frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
      orderSummary,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(400).send({ error: err.message });
  }
};

/**
 * Confirm Stripe payment and save order to database
 * 
 * SECURITY: This endpoint strictly requires a valid Stripe PaymentIntent ID (pi_xxx).
 * Non-Stripe IDs are rejected in production to prevent fake order creation.
 */
export const confirmPayment = async (req, res) => {
  try {
    console.log("Request received at /confirm-payment");
    const { paymentIntentId, orderSummary, customer } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false,
        error: "Payment intent ID is required" 
      });
    }

    // STRICT VALIDATION: Must be a real Stripe PaymentIntent ID
    const isStripe = paymentIntentId.startsWith("pi_");
    const isDevelopment = process.env.NODE_ENV !== "production";

    // In production, strictly reject non-Stripe IDs
    if (!isStripe && !isDevelopment) {
      console.error("🚫 Production: Rejected non-Stripe payment ID:", paymentIntentId);
      return res.status(400).json({
        success: false,
        error: "Invalid payment verification. Stripe PaymentIntent ID required.",
      });
    }

    let transactionId = paymentIntentId;
    let stripePaymentStatus = null;

    // MUST validate with Stripe for real payment IDs
    if (isStripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        stripePaymentStatus = paymentIntent.status;
        
        if (paymentIntent.status !== "succeeded") {
          console.error("❌ Stripe payment not successful:", paymentIntent.status);
          return res.status(400).json({
            success: false,
            error: "Payment not successful",
            status: paymentIntent.status,
          });
        }
        
        // Verify amount matches (prevent tampering)
        const expectedAmount = Math.round(parseFloat(orderSummary.total) * 100); // Convert to cents
        if (paymentIntent.amount !== expectedAmount) {
          console.error("🚫 Amount mismatch:", {
            stripe: paymentIntent.amount,
            expected: expectedAmount,
          });
          return res.status(400).json({
            success: false,
            error: "Payment amount verification failed",
          });
        }
        
        transactionId = paymentIntent.id;
        console.log("✅ Stripe payment validated:", transactionId);
      } catch (stripeErr) {
        console.error("❌ Stripe validation failed:", stripeErr.message);
        return res.status(400).json({
          success: false,
          error: "Payment verification failed with Stripe",
          details: isDevelopment ? stripeErr.message : undefined,
        });
      }
    } else {
      // Development mode only: Log warning for test payments
      console.warn("⚠️  DEV MODE: Processing test payment without Stripe verification:", paymentIntentId);
    }

    // Prepare order data
    const orderData = {
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
        provider: isStripe ? "stripe" : "test",
        transactionId: transactionId,
        status: stripePaymentStatus || "completed",
        paidAt: new Date(),
      },
      status: "pending",
      customer: customer || {},
    };

    // Save order to database
    const order = await createOrder(orderData);
    
    if (!order) {
      return res.status(500).json({
        success: false,
        error: "Failed to save order to database",
      });
    }
    
    console.log("✅ Order saved:", order.orderId);

    // Reduce inventory after successful payment
    const inventoryResult = reduceInventory(orderSummary.items);
    if (!inventoryResult.success) {
      console.error("⚠️ Inventory reduction failed:", inventoryResult.errors);
    } else {
      console.log("✅ Inventory reduced successfully");
    }

    res.json({
      success: true,
      orderId: order.orderId,
      order: order,
      inventoryUpdated: inventoryResult.success,
    });
  } catch (err) {
    console.error("Confirm payment error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};
