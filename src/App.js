import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.js";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./components/HomePage.js";
import CheckoutPage from "./components/CheckoutPage.js";
import Navbar from "./components/Navbar.js";
import ShopPage from "./components/ShopPage.js";
import CartPage from "./components/CartPage.js";
import OurStoryPage from "./components/OurStoryPage.js";
import ContactPage from "./components/ContactPage.js";
import ShippingInfoPage from "./components/ShippingInfoPage.js";
import ReturnsPage from "./components/ReturnsPage.js";
import FAQPage from "./components/FAQPage.js";
import FeaturedPage from "./components/FeaturedPage.js";
import BlogPage from './components/BlogPage.js';
import BlogPostPage from './components/BlogPostPage.js';
import ProductPageFinal from './components/ProductPageFinal.js';
import NotFoundPage from "./components/NotFoundPage.js";
function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
        <Navbar />
        <div className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
                    <Route path="/shipping" element={<ShippingInfoPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          <Route path="/product/:productId" element={<ProductPageFinal />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
