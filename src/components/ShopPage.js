import React from "react";
import { useCart } from "../context/CartContext.js";

const products = [
  {
    id: 1,
    name: "Product One",
    price: 29.99,
    image: "https://via.placeholder.com/200x200?text=Product+1",
  },
  {
    id: 2,
    name: "Product Two",
    price: 49.99,
    image: "https://via.placeholder.com/200x200?text=Product+2",
  },
  {
    id: 3,
    name: "Product Three",
    price: 19.99,
    image: "https://via.placeholder.com/200x200?text=Product+3",
  },
  {
    id: 4,
    name: "Product Four",
    price: 39.99,
    image: "https://via.placeholder.com/200x200?text=Product+4",
  },
 
];

const ShopPage = () => {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-10">Shop Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
