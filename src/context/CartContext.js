import React, { createContext, useContext, useState } from "react";

// -----------------------------
// Cart Context
// Provides global state management for shopping cart functionality.
// -----------------------------
const CartContext = createContext();

// -----------------------------
// CartProvider
// Wrap your app with this provider to give access to cart state and actions
// across all child components.
// -----------------------------
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Holds all cart items

  // -----------------------------
  // addToCart
  // Adds a product to the cart. If product exists, increment quantity.
  // Maintains immutability for predictable React state updates.
  // -----------------------------
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        // Increment quantity for existing product
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new product with initial quantity of 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // -----------------------------
  // removeFromCart
  // Removes a product from the cart by its ID
  // -----------------------------
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // -----------------------------
  // cartCount
  // Returns total number of items in the cart
  // Useful for UI badges or summaries
  // -----------------------------
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// -----------------------------
// useCart
// Custom hook to consume CartContext
// Simplifies access to cart state and actions in components
// -----------------------------
export const useCart = () => useContext(CartContext);