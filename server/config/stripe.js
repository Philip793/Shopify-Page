import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variable
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY environment variable. Please set it in your .env file.",
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
