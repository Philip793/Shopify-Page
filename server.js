// Import dependencies
import express from "express";            // Web framework for Node.js
import Stripe from "stripe";              // Stripe SDK for payment integration
import cors from "cors";                  // Enable cross-origin requests
import bodyParser from "body-parser";    // Parse incoming JSON requests
import dotenv from "dotenv";              // Load environment variables from .env
import braintree from "braintree";        // Braintree SDK for PayPal payments

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors({ origin: "http://localhost:3000" }));  // Allow frontend at localhost:3000
app.use(bodyParser.json());                           // Parse JSON request bodies

// Initialize Stripe client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Braintree gateway

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.BRAINTREE_ENVIRONMENT === "Production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Routes for Braintree
// -----------------------------

// Generate a client token for Braintree Drop-in UI
app.get("/braintree/token", async (req, res) => {
  try {
    // Optionally attach a customerId if provided
    const response = await gateway.clientToken.generate({
      
      customerId: req.query.customerId, 
    });
    res.send({ clientToken: response.clientToken });
  } catch (err) {
    // Return error to frontend
    res.status(500).send({ error: err.message });
  }
});

// Handle Braintree payment submission
app.post("/braintree/checkout", async (req, res) => {
  try {
    const { nonce, amount } = req.body; // Payment nonce and amount from frontend
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },// Immediately settle transaction
    });

    if (result.success) {
      res.send({ success: true, transactionId: result.transaction.id });
    } else {
      res.status(400).send({ success: false, error: result.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});


// Route for Stripe PaymentIntent

app.post("/create-payment-intent", async (req, res) => {
  try {
    console.log("Request received at /create-payment-intent"); 
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
});
// Start server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
