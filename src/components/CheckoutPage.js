import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import BraintreeDropInModule from "braintree-web-drop-in-react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext.js";
import { useAuth } from "../context/AuthContext.js";
import SEO from "./SEO.js";

// -----------------------------
// Initialize Stripe SDK with publishable key
// -----------------------------
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SOsktFexVFtH16aSwKB4JNawk8N2QgRhe4FTe5p6EA10JCVOZHBVKrLVQR9EmfbvxxVIfV501DxKMQUnqqdCZNS00yxqNNI0A",
); // Use environment variable
const BraintreeDropIn = BraintreeDropInModule.default;

// -----------------------------
// Stripe Checkout Form Component
// -----------------------------
const StripeCheckoutForm = ({ orderSummary }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    try {
      // Save order summary to sessionStorage in case Stripe redirects
      // (redirects lose navigation state, so we need a backup)
      sessionStorage.setItem("pendingOrderSummary", JSON.stringify(orderSummary));
      
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message);
        // If payment failed, redirect to cancel page
        if (error.type === "card_error" || error.type === "validation_error") {
          navigate("/checkout/cancel", { state: { error: error.message } });
        }
      } else if (paymentIntent) {
        // Payment successful - use the REAL PaymentIntent ID from Stripe
        console.log("✅ Payment successful with ID:", paymentIntent.id);
        navigate("/checkout/success", {
          state: {
            orderSummary,
            transactionId: paymentIntent.id, // REAL Stripe PaymentIntent ID
          },
        });
      } else {
        // If no paymentIntent and no error, Stripe may have redirected
        // The success page will handle URL-based extraction
        console.log("⏳ Redirecting to success page...");
      }
    } catch (err) {
      setMessage("Payment failed. Please try again.");
      navigate("/checkout/cancel", { state: { error: err.message } });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Amount to pay:</p>
        <p className="text-2xl font-bold text-gray-800">
          ${orderSummary?.total || "0.00"} AUD
        </p>
      </div>
      <PaymentElement />
      <button
        disabled={loading || !stripe || !elements}
        className="w-full py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? "Processing..." : `Pay ${orderSummary?.total || ""} AUD`}
      </button>
      {message && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {message}
        </div>
      )}
    </form>
  );
};

// -----------------------------
// Main Checkout Page (Stripe + Braintree integration)
// -----------------------------
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: { pathname: "/checkout" } }} replace />;
  }

  // Get checkout session data from OrderSummary page
  const clientSecret = location.state?.clientSecret;
  const orderSummary = location.state?.orderSummary;

  // Braintree state
  const [braintreeToken, setBraintreeToken] = useState(null);
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [braintreeLoading, setBraintreeLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if no checkout session (user navigated directly to /checkout)
  useEffect(() => {
    if (!clientSecret || !orderSummary) {
      navigate("/order-summary");
    }
  }, [clientSecret, orderSummary, navigate]);

  // Fetch Braintree token on mount
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:4242"}/braintree/token`,
    )
      .then((res) => res.json())
      .then((data) => setBraintreeToken(data.clientToken))
      .catch((err) => {
        console.error("Failed to load Braintree token:", err);
        setError("Failed to load PayPal. Please refresh the page.");
      });
  }, []);

  // Handle Braintree (PayPal) payment with cart data
  const handleBraintreePurchase = async () => {
    if (!braintreeInstance || cart.length === 0) return;
    setBraintreeLoading(true);
    setError(null);

    try {
      const { nonce } = await braintreeInstance.requestPaymentMethod();

      // Prepare cart items for backend (only id and quantity)
      const cartItems = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // Send to secure endpoint that calculates total on backend
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:4242"}/braintree/checkout-with-cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nonce, cartItems }),
        },
      );
      const data = await res.json();

      if (data.success) {
        // Navigate to success page with order details
        navigate("/checkout/success", {
          state: {
            orderSummary: data.orderSummary,
            transactionId: data.transactionId,
          },
        });
      } else {
        // Navigate to cancel page with error
        navigate("/checkout/cancel", { state: { error: data.error } });
      }
    } catch (err) {
      navigate("/checkout/cancel", { state: { error: err.message } });
    }

    setBraintreeLoading(false);
  };

  // Stripe Elements options
  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  if (!clientSecret || !orderSummary) {
    return null; // Will redirect
  }

  return (
    <>
      <SEO
        title="Checkout - Secure Payment"
        description="Complete your purchase securely with Stripe or PayPal."
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Checkout
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {orderSummary.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">${item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${orderSummary.shipping}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>${orderSummary.total} AUD</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/order-summary")}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Order Summary
              </button>
            </div>

            {/* Payment Options */}
            <div className="space-y-6">
              {/* PayPal Section */}
              {braintreeToken && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Pay with PayPal
                  </h2>
                  <BraintreeDropIn
                    options={{
                      authorization: braintreeToken,
                      paypal: {
                        flow: "checkout",
                        amount: orderSummary.total,
                        currency: "AUD",
                        buttonStyle: {
                          color: "blue",
                          shape: "rect",
                          size: "medium",
                          label: "paypal",
                        },
                        singleUse: true,
                      },
                    }}
                    onInstance={(instance) => setBraintreeInstance(instance)}
                  />
                  <button
                    onClick={handleBraintreePurchase}
                    disabled={braintreeLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold mt-4"
                  >
                    {braintreeLoading
                      ? "Processing..."
                      : `Pay ${orderSummary.total} AUD with PayPal`}
                  </button>
                </div>
              )}

              {/* Stripe Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Pay with Card
                </h2>
                <Elements options={options} stripe={stripePromise}>
                  <StripeCheckoutForm orderSummary={orderSummary} />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
