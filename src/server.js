import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import braintree from "braintree";


dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.BRAINTREE_ENVIRONMENT === "Production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
app.get("/braintree/token", async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({
      // include PayPal if needed:
      customerId: req.query.customerId, 
    });
    res.send({ clientToken: response.clientToken });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/braintree/checkout", async (req, res) => {
  try {
    const { nonce, amount } = req.body; // nonce = payment method token from client
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
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




app.post("/create-payment-intent", async (req, res) => {
  try {
    console.log("Request received at /create-payment-intent"); // ✅ 1st new log
    console.log("Request body:", req.body);                   // ✅ 2nd new log
    console.log("Stripe key exists?", !!process.env.STRIPE_SECRET_KEY); // ✅ 3rd new log

    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).send({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
    });

    console.log("PaymentIntent created:", paymentIntent.id); // optional log

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err); // log Stripe errors
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
