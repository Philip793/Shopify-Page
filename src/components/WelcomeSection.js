import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-gold-50 to-gold-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-burgundy-900 mb-6 leading-tight">
              Welcome to The Ultimate Board Game Adventure
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Discover our carefully curated collection of board games that
              bring families together, challenge your mind, and create
              unforgettable memories. From classic strategy games to modern
              party favorites, we have something for every game night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/our-story")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold text-base sm:text-lg"
              >
                LEARN MORE
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-burgundy-600 border-2 border-burgundy-600 rounded-md hover:bg-gold-50 transition-colors font-semibold text-base sm:text-lg"
              >
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gold-200 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gold-300 to-gold-400 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-6xl">Board Game</span>
                  </div>
                  <p className="text-2xl font-bold">Premium Games</p>
                  <p className="text-lg">Quality Entertainment</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-300 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold-400 rounded-full opacity-30 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
