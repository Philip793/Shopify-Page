import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import SEO from "./SEO.js";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4242";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [saveStatus, setSaveStatus] = useState("saving"); // saving, saved, error
  const hasSaved = useRef(false);

  // Get order summary from navigation state or URL params
  const orderSummary = location.state?.orderSummary;
  const transactionId = location.state?.transactionId;

  // Save order to backend and clear cart (only once)
  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;
    
    const saveOrder = async () => {
      if (!orderSummary || !transactionId) {
        setSaveStatus("error");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: transactionId,
            orderSummary,
          }),
        });

        if (response.ok) {
          console.log("✅ Order saved to database");
          setSaveStatus("saved");
        } else {
          console.error("❌ Failed to save order");
          setSaveStatus("error");
        }
      } catch (error) {
        console.error("❌ Error saving order:", error);
        setSaveStatus("error");
      }
    };

    saveOrder();
    clearCart();
  }, [clearCart, orderSummary, transactionId]);

  return (
    <>
      <SEO
        title="Payment Successful - Order Confirmed"
        description="Your payment was successful. Thank you for your order!"
      />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. We've sent a confirmation email with
              your order details.
            </p>

            {/* Order Details */}
            {orderSummary && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>

                {/* Items */}
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

                {/* Totals */}
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

                {transactionId && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    Transaction ID: {transactionId}
                  </div>
                )}
              </div>
            )}

            {/* What happens next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-800 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>
                    You will receive an order confirmation email shortly
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>
                    We'll prepare and ship your items within 1-2 business days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>
                    You'll receive tracking information once your order ships
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Your order should arrive within 3-5 business days</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
