import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../data/products.js';

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const products = getFeaturedProducts();

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-burgundy-500">Featured Products</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
          >
            SHOP ALL
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => handleViewProduct(product)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="h-64 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden group">
                <img 
                  src={product.images?.thumbnail || product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-gold-100 to-gold-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-burgundy-800">${product.price.toFixed(2)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(product);
                  }}
                  className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
