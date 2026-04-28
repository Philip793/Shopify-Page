import React, { useState, useEffect } from "react";
import BraintreeDropInModule from "braintree-web-drop-in-react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// -----------------------------
// Initialize Stripe SDK with publishable key
// -----------------------------
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51SOsktFexVFtH16aSwKB4JNawk8N2QgRhe4FTe5p6EA10JCVOZHBVKrLVQR9EmfbvxxVIfV501DxKMQUnqqdCZNS00yxqNNI0A"); // Use environment variable
const BraintreeDropIn = BraintreeDropInModule.default;

// -----------------------------
// Stripe Checkout Form Component
// -----------------------------
const StripeCheckoutForm = () => {
  const stripe = useStripe();           // Stripe context hook
  const elements = useElements();       // Stripe elements hook
  const [loading, setLoading] = useState(false); // UI loading state
  const [message, setMessage] = useState(null);  // Error/success messages

  // Handle form submission for Stripe payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;   // Ensure Stripe is initialized

    setLoading(true);
    setMessage(null);

    try {
      // Confirm payment with Stripe using PaymentElement
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: process.env.REACT_APP_URL || "http://localhost:3000", // Redirect after payment
        },
      });

      if (error) {
        setMessage(error.message); // Display Stripe error to user
      }
    } catch (err) {
      setMessage("Payment failed. Please try again."); // Fallback error
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded"
    >
      <h2 className="text-xl font-bold mb-4">Pay with Card / Wallet</h2>
      <PaymentElement /> {/* Stripe pre-built payment UI */}
      <button
        disabled={loading || !stripe || !elements}
        className="mt-6 w-full bg-burgundy-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
};

// -----------------------------
// Main Checkout Page (Stripe + Braintree integration)
// -----------------------------
const CheckoutPage = () => {
  // Frontend state
  const [clientSecret, setClientSecret] = useState(""); // Stripe payment intent secret
  const [braintreeToken, setBraintreeToken] = useState(null); // Braintree client token
  const [braintreeInstance, setBraintreeInstance] = useState(null); // Drop-in UI instance
  const [braintreeLoading, setBraintreeLoading] = useState(false); // PayPal loading state
  const [paymentMessage, setPaymentMessage] = useState(null); // Payment success/error messages

  // Fetch Stripe and Braintree tokens on component mount
  useEffect(() => {
    // Fetch Stripe PaymentIntent clientSecret
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4242"}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // $10 AUD
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        setPaymentMessage('Failed to load Stripe payment form. Please refresh the page.');
      });

    // Fetch Braintree client token for Drop-in UI
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4242"}/braintree/token`)
      .then((res) => res.json())
      .then((data) => setBraintreeToken(data.clientToken))
      .catch((err) => {
        setPaymentMessage('Failed to load PayPal. Please refresh the page.');
      });
  }, []);

  // Handle Braintree (PayPal) payment
  const handleBraintreePurchase = async () => {
    if (!braintreeInstance) return;
    setBraintreeLoading(true);

    try {
      // Request payment method from Braintree Drop-in UI
      const { nonce } = await braintreeInstance.requestPaymentMethod();

      // Send nonce and amount to backend for transaction
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4242"}/braintree/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount: "10.00" }),
      });
      const data = await res.json();

      if (data.success) {
        setPaymentMessage("PayPal Payment Successful! Transaction ID: " + data.transactionId);
      } else {
        setPaymentMessage("Payment failed: " + data.error);
      }
    } catch (err) {
      setPaymentMessage('Payment error: ' + err.message);
    }

    setBraintreeLoading(false);
  };

  // Stripe Elements options for theming
  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ---- PayPal (Braintree) Section ---- */}
      {braintreeToken && (
        <div className="mb-8 w-full max-w-md p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2 text-center text-lg">Pay with PayPal</h2>
          <BraintreeDropIn
            options={{
              authorization: braintreeToken,
              paypal: {
                flow: "checkout",
                amount: "10.00",
                currency: "AUD",
                buttonStyle: {
                  color: "blue",
                  shape: "rect",
                  size: "medium",
                  label: "paypal",
                },
                singleUse: true, // Only allow single-use token per checkout
              },
            }}
            onInstance={(instance) => setBraintreeInstance(instance)} // Capture Drop-in instance
          />
          <button
            onClick={handleBraintreePurchase}
            disabled={braintreeLoading}
            className="w-full bg-burgundy-600 text-white py-2 rounded mt-4"
          >
            {braintreeLoading ? "Processing..." : "Pay with PayPal"}
          </button>
        </div>
      )}

      <hr className="my-6 w-1/2 border-gray-300" />
      <p className="text-gray-600 mb-4">Or pay with card / wallet</p>

      {/* ---- Stripe Payment Section ---- */}
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>
      ) : (
        <p>Loading Stripe payment form...</p>
      )}

      {/* Payment Message Display */}
      {paymentMessage && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              paymentMessage.includes('Successful') ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-sm font-bold ${
                paymentMessage.includes('Successful') ? 'text-green-600' : 'text-red-600'
              }`}>
                {paymentMessage.includes('Successful') ? '✓' : '!'}
              </span>
            </div>
            <p className={`text-sm ${
              paymentMessage.includes('Successful') ? 'text-green-800' : 'text-red-800'
            }`}>
              {paymentMessage}
            </p>
          </div>
          <button
            onClick={() => setPaymentMessage(null)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;