import React, { useState, useEffect } from "react";
import BraintreeDropInModule from "braintree-web-drop-in-react";

import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SOsktFexVFtH16aSwKB4JNawk8N2QgRhe4FTe5p6EA10JCVOZHBVKrLVQR9EmfbvxxVIfV501DxKMQUnqqdCZNS00yxqNNI0A"); // your Stripe publishable key
const BraintreeDropIn = BraintreeDropInModule.default;
// -----------------------------
// Stripe Form Component
// -----------------------------
const StripeCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000", // redirect after payment
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Pay with Card / Wallet</h2>
      <PaymentElement />
      <button
        disabled={loading || !stripe || !elements}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
};

// -----------------------------
// Checkout Page (Stripe + Braintree)
// -----------------------------
const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [braintreeToken, setBraintreeToken] = useState(null);
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [braintreeLoading, setBraintreeLoading] = useState(false);

  useEffect(() => {
    // Stripe clientSecret
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // $10
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(err => console.error("Stripe error:", err));

    // Braintree client token
    fetch("http://localhost:4242/braintree/token")
      .then((res) => res.json())
      .then((data) => setBraintreeToken(data.clientToken))
      .catch(err => console.error(err));
  }, []);

  const handleBraintreePurchase = async () => {
    if (!braintreeInstance) return;
    setBraintreeLoading(true);

    try {
      const { nonce } = await braintreeInstance.requestPaymentMethod();
      const res = await fetch("http://localhost:4242/braintree/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount: "10.00" }),
      });
      const data = await res.json();
      if (data.success) alert("PayPal Payment Successful! Transaction ID: " + data.transactionId);
      else alert("Payment failed: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Payment error: " + err.message);
    }

    setBraintreeLoading(false);
  };

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ---- PayPal (Braintree) ---- */}
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
                buttonStyle:{
                  color: "blue",
                  shape: "rect",
                  size: "medium",
                  label: "paypal"
                },
                singleUse: true
                
              },
              
            }}
            onInstance={(instance) => setBraintreeInstance(instance)}
          />
          <button
            onClick={handleBraintreePurchase}
            disabled={braintreeLoading}
            className="w-full bg-yellow-500 text-white py-2 rounded mt-4"
          >
            {braintreeLoading ? "Processing..." : "Pay with PayPal"}
          </button>
        </div>
      )}

      <hr className="my-6 w-1/2 border-gray-300" />
      <p className="text-gray-600 mb-4">Or pay with card / wallet</p>

      {/* ---- Stripe Payment Element ---- */}
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>
      ) : (
        <p>Loading Stripe payment form...</p>
      )}
    </div>
  );
};

export default CheckoutPage;
