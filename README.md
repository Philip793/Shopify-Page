# Merchant Checkout Platform
**React + Node.js | Stripe + Braintree Integration**

Merchant Checkout Platform (In Progress) – Solo-developed full-stack checkout platform for a small merchant transitioning from Etsy. Features modular React components, secure Node.js backend, Stripe & Braintree integration, and responsive UI. Currently finalizing deployment to demonstrate live high-volume transaction capabilities.

A full-stack, modular checkout platform enabling small merchants to securely process payments via Stripe and Braintree. Features reusable React components, responsive UI, and a Node.js backend designed for scalability and future high-volume transactions.
---

## Overview
This project is a custom e-commerce solution for an early-stage merchant transitioning from Etsy to an independent storefront. The goal was to provide greater control over branding, customer experience, and payment processing while designing the system to support future growth.

I developed the full-stack platform independently, designing modular React components and implementing secure Node.js backend endpoints to process multi-method payments.

The architecture emphasizes **separation of concerns**, **reusable components**, and **scalability**, enabling expansion beyond marketplace platforms.

---

## Project Goals
- Enable merchant independence from third-party marketplaces  
- Support multiple payment providers within a unified checkout flow  
- Maintain secure transaction handling  
- Deliver a responsive, user-friendly experience  
- Design for scalability and modularity

---

## Key Features
- Implemented modular React components and reusable hooks for checkout flow
- Integrated Stripe PaymentElement and Braintree Drop-In UI for multiple payment options
- Optimized UI/UX and component structure for maintainability and scalability
- Designed architecture supporting potential high-volume transactions and future growth
- Version-controlled the project using Git/GitHub
---

## Tech Stack

**Frontend:**  
- React (Hooks, Context API)  
- Tailwind CSS  
- component-driven architecture for maintainability 

**Backend:**  
- Node.js, Express  
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

---

## Installation & Setup

### 1. Clone the Repository
git clone <repository-url>
cd <project-directory>

### 2. Install Dependencies

Frontend:
npm install

Backend:
cd server
npm install

### 3. Environment Variables

Create a `.env` file inside the `server` directory:
STRIPE_SECRET_KEY=your_stripe_secret_key
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key

### 4. Run the Application

Backend:
node server.js

Frontend:
npm start

App runs locally at: http://localhost:3000

---

## Security & Scalability
- Payment secrets are never exposed to the frontend
- Tokenized payment flows using official Stripe and Braintree SDKs
- Server-side handling of sensitive transaction logic
- Architecture designed to support future high-volume transaction growth

---

## Future Enhancements
- Order persistence with database integration
- Merchant dashboard for transaction monitoring
- Payment status logging & analytics
- Unit and integration testing
- Cloud deployment with performance optimizations

---

## Screenshots
(Add screenshots of checkout UI, Stripe payment element, PayPal flow, etc.)

---