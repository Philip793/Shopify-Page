import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredVars = [
  "BRAINTREE_ENVIRONMENT",
  "BRAINTREE_MERCHANT_ID",
  "BRAINTREE_PUBLIC_KEY",
  "BRAINTREE_PRIVATE_KEY"
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required Braintree environment variables: ${missingVars.join(", ")}`);
}

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.BRAINTREE_ENVIRONMENT === "Production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export default gateway;
