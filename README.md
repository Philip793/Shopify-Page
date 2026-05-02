# Merchant Checkout Platform
**React + Node.js | Stripe + Braintree Integration**

Solo-developed full-stack checkout system designed to replace third-party marketplace dependence. Architected a modular React frontend and secure Node.js backend integrating Stripe and Braintree for multi-provider payment processing and scalable transaction handling.
---

## Overview
This project is a custom e-commerce solution for an early-stage merchant transitioning from Etsy to an independent storefront. The goal was to provide greater control over branding, customer experience, and payment processing while designing the system to support future growth.

I developed the full-stack platform independently, designing modular React components and implementing secure Node.js backend endpoints to process multi-method payments.

The system was designed with clear separation between UI, state management, and payment orchestration layers, enabling maintainability, extensibility, and future integration of additional payment providers or services.

This project demonstrates production-style payment architecture, secure credential handling, and scalable component design beyond tutorial-level implementations.
---


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
  - Creating Stripe PaymentIntent  
  - Generating Braintree client tokens  
  - Processing Braintree transactions  
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
/client
  /src
    /components
    /context
    /pages
    App.js

/server
  routes/
  controllers/
  server.js
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Philip793/Shopify-Page.git
cd Shopify-Page
```
### 2. Install Dependencies

From the root directory (installs both frontend and backend dependencies):
```bash
npm install
```
### 3. Environment Variables

Create a `.env` file in the **root** directory:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/shopify_portal

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Braintree
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```
### 4. Run the Application

**Backend** (from root directory):
```bash
npm run server
```

**Frontend** (in a new terminal, from root directory):
```bash
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4242
- Health check: http://localhost:4242/health

### 5. Verify MongoDB

Ensure MongoDB is running locally:
```bash
mongod
```

Or use MongoDB Atlas for cloud database.

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
- Order persistence with database integration
- Merchant dashboard for transaction monitoring
- Payment status logging & analytics
- Unit and integration testing
- Cloud deployment with performance optimizations
- Currently preparing for live deployment

---

## Screenshots
(Add screenshots of checkout UI, Stripe payment element, PayPal flow, etc.)

---