import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import { useAuth } from "../context/AuthContext.js";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-burgundy-800 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">
          <Link to="/">Magestic</Link>
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/shop" className="hover:underline">
            Shop
          </Link>
          <Link to="/our-story" className="hover:underline">
            Our Story
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {isAuthenticated() ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">Hi, {user?.name?.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-burgundy-700 hover:bg-burgundy-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:underline flex items-center space-x-1">
              <UserCircleIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-gray-300"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-burgundy-700">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/our-story"
              className="hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              className="hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Links */}
            <div className="border-t border-burgundy-700 pt-3 mt-3">
              {isAuthenticated() ? (
                <>
                  <span className="block text-sm py-2">
                    Hi, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-left hover:text-gray-300 py-2 w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-gray-300 py-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
