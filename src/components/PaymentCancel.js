import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "./SEO.js";

const PaymentCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get error message from navigation state if available
  const errorMessage =
    location.state?.error ||
    "Your payment could not be processed at this time.";

  return (
    <>
      <SEO
        title="Payment Failed - Order Not Completed"
        description="Your payment was not successful. Please try again or contact support."
      />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-8">{errorMessage}</p>

            {/* Possible Reasons */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-yellow-800 mb-3">
                Common reasons for payment failure:
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Card expired or invalid</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Bank declined the transaction for security reasons
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Network or connection issue</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment was cancelled by user</span>
                </li>
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">
                What you can do:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>
                    Try a different payment method (card, PayPal, etc.)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Check your card details and try again</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Contact your bank if the issue persists</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Reach out to our support team for assistance</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/order-summary")}
                className="px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
              >
                Contact Support
              </button>
            </div>

            {/* Your cart is saved message */}
            <p className="mt-6 text-sm text-gray-500">
              Don't worry - your cart items are saved. You can try again
              anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCancel;
