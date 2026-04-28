import React from "react";
import Banner from "./Banner.js";
import WelcomeSection from "./WelcomeSection.js";
import FeaturedProducts from "./FeaturedProducts.js";
import AboutSection from "./AboutSection.js";
import BlogArea from "./BlogArea.js";
import Footer from "./Footer.js";
import SEO from "./SEO.js";

const HomePage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Magestic - Premium Board Games Store",
    "description": "Discover premium board games at Magestic. Quality family games, strategy games, and party games with fast shipping across Australia.",
    "url": "https://magestic.com.au",
    "image": "https://magestic.com.au/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Game Street",
      "addressLocality": "Board City",
      "addressRegion": "BC",
      "postalCode": "12345",
      "addressCountry": "AU"
    },
    "telephone": "+61 2 1234 5678",
    "email": "support@magestic.com.au",
    "openingHours": "Mo-Fr 09:00-18:00 Sa 10:00-16:00",
    "priceRange": "$$$",
    "paymentAccepted": ["Credit Card", "PayPal", "Afterpay"],
    "sameAs": [
      "https://facebook.com/magesticgames",
      "https://twitter.com/magesticgames",
      "https://instagram.com/magesticgames"
    ]
  };

  return (
    <div className="min-h-screen bg-gold-50">
      <SEO 
        title="Premium Board Games & Family Games"
        description="Discover premium board games at Magestic. Quality family games, strategy games, and party games with fast shipping across Australia."
        keywords="board games, family games, strategy games, party games, educational games, Australian board game store, premium games"
        structuredData={structuredData}
      />
      <header className="bg-burgundy-900">
        <Banner />
      </header>
      <main className="text-burgundy-600 font-semibold">
        <WelcomeSection />
        <FeaturedProducts />
        <AboutSection />
        <BlogArea />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;