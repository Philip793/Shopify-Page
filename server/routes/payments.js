import express from "express";
import {
  createPaymentIntent,
  createCheckoutSession,
  confirmPayment,
} from "../controllers/stripeController.js";
import {
  getClientToken,
  checkout,
  checkoutWithCart,
} from "../controllers/braintreeController.js";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const isDevelopment = process.env.NODE_ENV !== "production";

// Auth routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authenticate, getMe);
router.post("/auth/logout", authenticate, logout);

// Stripe routes
// Secure endpoint - calculates total from trusted cart data (RECOMMENDED)
router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-payment", confirmPayment);

// ⚠️ DEVELOPMENT ONLY: Legacy endpoint accepting amount from frontend (SECURITY RISK)
// This endpoint is restricted to development mode to prevent price tampering
if (isDevelopment) {
  router.post("/create-payment-intent", createPaymentIntent);
  console.log("⚠️  DEV MODE: Legacy /create-payment-intent endpoint enabled (accepts frontend amount - security risk)");
}

// Braintree routes
// Secure endpoint - calculates total from trusted cart data (RECOMMENDED)
router.get("/braintree/token", getClientToken);
router.post("/braintree/checkout-with-cart", checkoutWithCart);

// ⚠️ DEVELOPMENT ONLY: Legacy endpoint accepting amount from frontend (SECURITY RISK)
// This endpoint is restricted to development mode to prevent price tampering
if (isDevelopment) {
  router.post("/braintree/checkout", checkout);
  console.log("⚠️  DEV MODE: Legacy /braintree/checkout endpoint enabled (accepts frontend amount - security risk)");
}

// Order routes - admin only for list/all, optional auth for single order
router.get("/orders", authenticate, requireAdmin, getOrders);
router.get("/orders/stats", authenticate, requireAdmin, getOrderStats);
router.get("/orders/:orderId", authenticate, getOrderById);
router.patch(
  "/orders/:orderId/status",
  authenticate,
  requireAdmin,
  updateOrderStatus,
);

export default router;
