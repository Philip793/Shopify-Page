import React from "react";
import { useCart } from "../context/CartContext.js";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛍️</h2>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2 bg-burgundy-600 text-white rounded hover:bg-burgundy-700"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-700">x{item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6 text-xl font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 w-full bg-burgundy-600 text-white py-3 rounded hover:bg-burgundy-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
