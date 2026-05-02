import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import SEO from "./SEO.js";
import { getFeaturedProducts } from "../data/products.js";

const FeaturedPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const featuredProducts = getFeaturedProducts();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Featured Board Games - Magestic",
    description:
      "Discover our handpicked selection of the most popular and highly-rated board games. These customer favorites are perfect for any occasion.",
    url: "https://magestic.com.au/featured",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: featuredProducts.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.name,
        description: product.description,
        image: product.images?.thumbnail || product.image,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      })),
    },
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <>
      <SEO
        title="Featured Board Games - Best Sellers"
        description="Discover our handpicked selection of the most popular and highly-rated board games. These customer favorites are perfect for any occasion."
        keywords="featured board games, best selling board games, popular board games, customer favorites, top rated games"
        url="/featured"
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-gray-50 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold-600 font-semibold-4">
            Featured Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of most popular and highly-rated
            board games. These customer favorites are perfect for any occasion.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-96 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden group">
                <img
                  src={product.images?.thumbnail || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {product.description?.replace(/\*\*/g, "").slice(0, 120)}...
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gold-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-burgundy-500 text-burgundy-800 text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex-1 px-4 py-2 bg-gold-100 text-burgundy-700 rounded-md hover:bg-gold-200 transition-colors font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-12 text-center">
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 bg-royal-purple-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold text-lg"
          >
            View All Products
          </button>
        </footer>
      </main>
    </>
  );
};

export default FeaturedPage;
