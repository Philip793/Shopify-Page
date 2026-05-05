# Merchant Checkout Platform

**React + Node.js | Stripe + Braintree Integration**

## Solo-developed full-stack checkout system designed to replace third-party marketplace dependence. Architected a modular React frontend and secure Node.js backend integrating Stripe and Braintree for multi-provider payment processing and scalable transaction handling.

## Overview

This project is a custom e-commerce solution for an early-stage merchant transitioning from Etsy to an independent storefront. The goal was to provide greater control over branding, customer experience, and payment processing while designing the system to support future growth.

I developed the full-stack platform independently, designing modular React components and implementing secure Node.js backend endpoints to process multi-method payments.

The system was designed with clear separation between UI, state management, and payment orchestration layers, enabling maintainability, extensibility, and future integration of additional payment providers or services.

## This project demonstrates production-style payment architecture, secure credential handling, and scalable component design beyond tutorial-level implementations.

## Project Goals

- Enable merchant independence from third-party marketplaces
- Support multiple payment providers within a unified checkout flow
- Maintain secure transaction handling
- Deliver a responsive, user-friendly experience
- Design for scalability and modularity

---

## Key Features

- Architected **reusable, component-driven React** checkout flow using **hooks** and context for centralized **state management**
- Integrated **Stripe Payment Element** and **Braintree Drop-In** to support **card, wallet, and PayPal** payments within a unified UI
- Designed backend **REST endpoints** to securely generate PaymentIntents and client tokens
- Implemented **structured error handling** and loading states to ensure resilient UX during asynchronous payment flows
- Structured codebase for extensibility, enabling additional payment providers or order services with minimal refactoring

---

## Tech Stack

**Frontend:**

- **React (Hooks, Context API)**
- **Tailwind CSS**
- component-driven architecture for maintainability

**Backend:**

- **Node.js, Express**
- Stripe SDK
- Braintree SDK
- Environment-based secure credentials

---

## Architecture Overview

### Frontend

- Component-based structure for checkout flow
- Context API for global cart state management
- Separation of UI components and payment logic
- Conditional rendering for multiple payment providers
- Client-side validation, error handling, and loading states

### Backend

- REST API endpoints for:
  - Creating secure checkout sessions (server-side price calculation)
  - Generating Braintree client tokens
  - Processing Braintree transactions with cart validation
- Secure handling of payment credentials via environment variables
- Server-side transaction confirmation

---

### Payment Flow

1. User selects a payment method
2. Frontend requests a secure client token or payment intent from the backend
3. Backend communicates with Stripe or Braintree
4. Payment confirmation or error is returned to the UI

---

## Project Structure

```bash
/public
  /images
    /products
  index.html
  manifest.json

/src
  /components
    AboutSection.js
    AboutUsPage.js
    Banner.js
    BlogArea.js
    BlogPage.js
    BlogPostPage.js
    CartPage.js
    CheckoutPage.js
    ContactPage.js
    FAQPage.js
    FeaturedPage.js
    FeaturedProducts.js
    Footer.js
    HomePage.js
    LoginPage.js
    Navbar.js
    NotFoundPage.js
    OrderSummary.js
    OurStoryPage.js
    PaymentCancel.js
    PaymentSuccess.js
    ProductPageFinal.js
    ReturnsPage.js
    SEO.js
    ShippingInfoPage.js
    ShopPage.js
    WelcomeSection.js
  /context
    AuthContext.js
    CartContext.js
  /data
    products.js
  App.js
  index.css
  index.js

/server
  /config
    braintree.js
    database.js
    stripe.js
  /controllers
    authController.js
    braintreeController.js
    orderController.js
    stripeController.js
  /data
    productCatalog.js
  /middleware
    authMiddleware.js
    productValidation.js
    validateInput.js
  /models
    Inventory.js
    LoginAttempt.js
    Order.js
    User.js
  /routes
    payments.js
  /services
    inventoryService.js
  server.js
```

---

## Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Stripe account** (for payments)
- **Braintree account** (optional, for PayPal)

### 1. Clone and Install

```bash
git clone https://github.com/Philip793/Shopify-Page.git
cd Shopify-Page
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project **root**:

```bash
# ==========================================
# Required: Database
# ==========================================
MONGODB_URI=mongodb://localhost:27017/shopify_portal
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/shopify_portal

# ==========================================
# Required: JWT Authentication
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# ==========================================
JWT_SECRET=your-64-character-random-string-here

# ==========================================
# Optional: Admin Auto-Setup (creates admin user on startup)
# If not set, admin must be created manually via API
# ==========================================
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password-here

# ==========================================
# Required: Stripe Payments
# Get keys from: https://dashboard.stripe.com/apikeys
# ==========================================
STRIPE_SECRET_KEY=sk_test_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ==========================================
# Optional: Braintree (PayPal support)
# Get keys from: https://developer.paypal.com/braintree
# ==========================================
BRAINTREE_ENVIRONMENT=sandbox
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key

# ==========================================
# Application URLs
# ==========================================
FRONTEND_URL=http://localhost:3000
PORT=4242
NODE_ENV=development
```

### 3. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**Or use MongoDB Atlas** - just update `MONGODB_URI` in `.env`.

### 4. Run the Application

**Backend** (Terminal 1):

```bash
npm run server
# Server starts on http://localhost:4242
```

**Frontend** (Terminal 2):

```bash
npm start
# React app starts on http://localhost:3000
```

### 5. Verify Setup

| Check      | URL                          | Expected               |
| ---------- | ---------------------------- | ---------------------- |
| API Health | http://localhost:4242/health | `{"status":"healthy"}` |
| Frontend   | http://localhost:3000        | Shop page loads        |
| Login      | http://localhost:3000/login  | Login form appears     |

### First-Time Setup

1. **Register a customer account** via the "Create Account" option on the login page
2. **Or login as admin** (if `ADMIN_EMAIL`/`ADMIN_PASSWORD` set in `.env`)
3. **Add products to cart** and proceed through checkout
4. **Complete test payment** using Stripe test card: `4242 4242 4242 4242`

### Troubleshooting

| Issue                                      | Solution                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `Missing JWT_SECRET`                       | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `Missing REACT_APP_STRIPE_PUBLISHABLE_KEY` | Add to `.env`, restart frontend                                                           |
| MongoDB connection failed                  | Verify `mongod` is running or check Atlas connection string                               |
| Port 4242 in use                           | Kill process: `npx kill-port 4242`                                                        |
| Stripe payment fails                       | Verify Stripe keys are test keys (start with `pk_test_` / `sk_test_`)                     |

---

## Security & Scalability

- Payment secrets are never exposed to the frontend
- Tokenized payment flows using official Stripe and Braintree SDKs
- Server-side handling of sensitive transaction logic
- Architecture designed to support future high-volume transaction growth

---

## Deployment (In Progress)

- Environment variable configuration in production
- Secure HTTPS payment handling
- Scalable backend hosting

## Future Enhancements

- Merchant dashboard for transaction monitoring
- Payment status logging & analytics
- Cloud deployment with performance optimizations
- Currently preparing for live deployment

---
