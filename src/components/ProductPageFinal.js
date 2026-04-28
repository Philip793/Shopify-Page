import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import SEO from './SEO.js';
import { getProductById, getRelatedProducts } from '../data/products.js';

const ProductPageFinal = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setHoveredImage(null); // Clear gallery image when hovering main image
  };


  useEffect(() => {
    try {
      setLoading(true);
      if (!productId) {
        setProduct(null);
        return;
      }
      const foundProduct = getProductById(productId);
      setProduct(foundProduct || null);
    } catch (error) {
      console.error('Error loading product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setShowCartPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gold-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gold-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Create structuredData
  const structuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || "Product",
    "image": product.images?.main || product.image || "",
    "description": product.description || "",
    "brand": {
      "@type": "Brand",
      "name": "Magestic"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price || 0,
      "priceCurrency": "AUD",
      "availability": product.inventory?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratings?.average || 0,
      "reviewCount": product.ratings?.reviews || 0
    }
  } : {};

  const relatedProducts = getRelatedProducts(productId, 3);

  return (
    <>
      <SEO 
        title={`${product.name} - Magestic Board Games`}
        description={product.description}
        keywords={`${product.name}, board games, family games, strategy games, premium games`}
        url={`/product/${productId}`}
        structuredData={structuredData}
      />
      
      <main className="min-h-screen bg-gold-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><button onClick={() => navigate('/')} className="hover:text-burgundy-600">Home</button></li>
              <li>/</li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-burgundy-600">Shop</button></li>
              <li>/</li>
              <li className="text-burgundy-600 font-semibold">{product.name}</li>
            </ol>
          </nav>

          {/* Product Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-burgundy-600 mb-4">${product.price.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Main Image Container */}
                    <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200">
                      <div 
                        className="relative overflow-hidden cursor-crosshair w-full h-full"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        <img 
                          src={selectedImage || product.images?.main || product.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'}
                          alt={product.name}
                          className="w-full h-full object-contain main-product-image"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  {product.images?.gallery && product.images.gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {product.images.gallery.map((galleryImage, index) => (
                        <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow-md group relative cursor-pointer">
                          <img
                            src={galleryImage}
                            alt={`${product.name} - Gallery ${index + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                            onClick={() => setSelectedImage(galleryImage)}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 200% Zoom Display - Outside main container */}
                {(isHovering || hoveredImage) && (
                  <div className="aspect-square bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 hidden lg:block pointer-events-none">
                    <img 
                      src={hoveredImage || selectedImage || product.images?.main || product.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'}
                      alt={`${product.name} - Zoom`}
                      className="w-full h-full object-contain"
                      style={{
                        transform: `scale(2)`,
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                )}

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                </div>

              {/* Product Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-burgundy-600 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{Array.isArray(product.category) ? product.category.join(', ') : product.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Availability</p>
                  <p className={`font-semibold ${product.inventory?.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inventory?.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inventory?.inStock}
                  className="w-full px-6 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {product.inventory?.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-gold-100 to-gold-200">
                    <img 
                      src={relatedProduct.images?.thumbnail || relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{relatedProduct.name}</h3>
                    <p className="text-xl font-bold text-burgundy-600 mb-3">${relatedProduct.price.toFixed(2)}</p>
                    <button
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                      className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </main>

      {/* Add to Cart Popup */}
      {showCartPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Added to Cart!</h3>
                <p className="text-gray-600">{quantity} × {product.name}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCartPopup(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  navigate('/cart');
                  setShowCartPopup(false);
                }}
                className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPageFinal;
