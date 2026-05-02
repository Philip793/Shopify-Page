import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import SEO from "./SEO.js";

const OrderSummary = () => {
  const { cart, cartCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 10.0 : 0; // $10 shipping
  const total = subtotal + shipping;

  // Prepare cart items for backend
  const cartItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch checkout session from backend with cart items
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:4242"}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems }),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Navigate to checkout with the session data
      navigate("/checkout", {
        state: {
          clientSecret: data.clientSecret,
          orderSummary: data.orderSummary,
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Order Summary - Review Your Order"
        description="Review your order before checkout. Secure payment with Stripe or PayPal."
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Order Summary
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Items ({cartCount})
                  </h2>
                </div>

                <div className="divide-y">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="p-6 flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.thumbnail || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-lg shadow-md mt-6 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Shipping Information
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Free shipping on orders over $100</p>
                  <p>✓ Standard shipping: $10.00 (1-3 business days)</p>
                  <p>✓ Express shipping available at checkout</p>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order Total
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>${total.toFixed(2)} AUD</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Including GST</p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={loading}
                  className="w-full py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/shop")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    Secure checkout with
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600 font-bold">Stripe</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-800 font-bold">PayPal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
