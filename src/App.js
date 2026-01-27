import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.js";
import CheckoutPage from "./components/CheckoutPage.js";
import Navbar from "./components/Navbar.js";
import ShopPage from "./components/ShopPage.js";
import CartPage from "./components/CartPage.js";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-4">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
