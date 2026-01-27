
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; 

const Navbar = () => {
    const { cartCount } = useCart();
    return (
 <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">
        <Link to="/">My Shop</Link>
      </h1>

      <div className="flex space-x-6 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/shop" className="hover:underline">
          Shop
        </Link>
        <Link to="/" className="hover:underline">
          Our Story
        </Link>
        <Link to="/" className="hover:underline">
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
      </div>
    </nav>
  );
};

export default Navbar;