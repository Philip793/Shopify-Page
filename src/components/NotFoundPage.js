import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gold-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-burgundy-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-burgundy-600">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-burgundy-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
            tabIndex={0}
            aria-label="Go to homepage"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            onKeyDown={(e) => handleKeyDown(e, () => window.history.back())}
            className="inline-flex items-center px-6 py-3 bg-white text-burgundy-600 border-2 border-burgundy-600 rounded-md hover:bg-burgundy-50 transition-colors font-semibold"
            tabIndex={0}
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Looking for something?
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/shop"
              className="text-burgundy-600 hover:text-burgundy-800 transition-colors"
            >
              Shop Products
            </Link>
            <Link
              to="/blog"
              className="text-burgundy-600 hover:text-burgundy-800 transition-colors"
            >
              Read Our Blog
            </Link>
            <Link
              to="/our-story"
              className="text-burgundy-600 hover:text-burgundy-800 transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              className="text-burgundy-600 hover:text-burgundy-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Support Message */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link
              to="/contact"
              className="text-burgundy-600 hover:text-burgundy-800 font-semibold"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
