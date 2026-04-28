import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [position, setPosition] = useState(0);
  
  const message = "10% OFF SITEWIDE • FREE SHIPPING ON ORDERS $50+ • NEW ARRIVALS EVERY WEEK • ";

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev <= -50) {
          return 0;
        }
        return prev - 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gold-100 to-gold-200 px-4 overflow-hidden">
      <div className="relative h-6 flex items-center">
        <div 
          className="absolute whitespace-nowrap"
          style={{ transform: `translateX(${position}%)` }}
        >
          <span className="text-sm font-semibold">{message}</span>
          <span className="text-sm font-semibold">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
