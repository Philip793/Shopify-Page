// Import dependencies
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import paymentRoutes from "./routes/payments.js";
import connectDB from "./config/database.js";
import productCatalog from "./data/productCatalog.js";
import { validateProductCatalog } from "./middleware/productValidation.js";

// Load environment variables from .env file
dotenv.config();

// Validate product catalog on startup
validateProductCatalog(productCatalog);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware

// 1. Helmet - Security headers (XSS, clickjacking, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. Rate Limiting - Prevent brute force and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter); // Apply to all API routes
app.use("/auth/", authLimiter); // Apply stricter limit to auth

// 3. MongoDB Sanitize - Prevent NoSQL injection
// Note: Express 5 has read-only req.query, so we manually sanitize only req.body
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, {
      replaceWith: "_",
      onSanitize: ({ key }) => {
        console.warn(`⚠️  Sanitized malicious input: ${key} from ${req.ip}`);
      },
    });
  }
  next();
});

// 4. HPP - Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: [ // Allow these parameters to have multiple values
    "price",
    "category",
    "sort",
  ],
}));

// 5. CORS - Configure for security
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parser with size limits
app.use(bodyParser.json({ limit: "10kb" })); // Limit body size to prevent abuse

// Input sanitization middleware
import sanitizeInput from "./middleware/validateInput.js";
app.use(sanitizeInput);

// Routes
app.use("/", paymentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.send({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler - prevent stack traces leaking in production
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  const isDev = process.env.NODE_ENV === "development";
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    ...(isDev && { stack: err.stack }), // Only show stack in development
  });
});

// Start server
const PORT = process.env.PORT || 4242;
const isDev = process.env.NODE_ENV !== "production";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Security: ${isDev ? "HTTP (dev mode)" : "HTTPS required"}`);
  console.log(`\n✅ SECURE Payment Endpoints (Production Safe):`);
  console.log(`   POST /create-checkout-session  - Calculates amount from cart server-side`);
  console.log(`   POST /braintree/checkout-with-cart - Calculates amount from cart server-side`);
  console.log(`   POST /confirm-payment - Validates payment before order creation`);
  
  if (isDev) {
    console.log(`\n⚠️  DEV-ONLY Legacy Endpoints (Disabled in Production):`);
    console.log(`   POST /create-payment-intent    - ⚠️ Accepts amount from frontend (security risk)`);
    console.log(`   POST /braintree/checkout       - ⚠️ Accepts amount from frontend (security risk)`);
  }
  console.log("");
});

export default app;
