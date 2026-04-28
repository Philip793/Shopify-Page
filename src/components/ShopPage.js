import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import SEO from './SEO.js';
import { products, getProductsByCategory } from '../data/products.js';

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.flatMap(product => Array.isArray(product.category) ? product.category : [product.category]))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : getProductsByCategory(selectedCategory);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop All Board Games - Magestic",
    "description": "Browse our complete collection of premium board games including family games, strategy games, and party games.",
    "url": "https://magestic.com.au/shop",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "image": product.image,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "AUD",
          "availability": "https://schema.org/InStock"
        }
      }))
    }
  };

  return (
    <>
      <SEO 
        title="Shop All Board Games"
        description="Browse our complete collection of premium board games including family games, strategy games, and party games. Fast shipping across Australia."
        keywords="board games shop, buy board games online, family games, strategy games, party games, Australian board game store"
        url="/shop"
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-gray-50 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-center">Shop All Board Games</h1>
          
          {/* Category Filter */}
          <div className="flex justify-center mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-burgundy-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="h-64 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden group">
              <img
                src={product.images?.thumbnail || product.image}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
                className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      </main>
    </>
  );
};

export default ShopPage;
