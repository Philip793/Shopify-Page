import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to My Shop</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Discover our collection of quality products designed to make your life better.
      </p>
      <button
        onClick={() => navigate("/shop")}
        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Shop Now
      </button>
    </div>
  );
};

export default HomePage;