import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center text-gray-500"></p>;
  }
  
  if (loading) {
    return <p>Loading...</p>;
  }
  
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="w-full h-96 mb-4">
          <img
  src={product.images?.[0]?.url?.trim() ? product.images[0].url : "https://picsum.photos/500/500?random=1"}
  alt={product.images?.[0]?.altText || product.name || "Product"}
  className="w-full h-full object-cover rounded-lg"
  loading="lazy"
  onError={(e) => (e.target.src = "https://picsum.photos/500/500?random=2")} // Fallback image
/>

          </div>
          <h3 className="text-sm mb-2">{product.name || "Unnamed Product"}</h3>
          <p className="text-gray-500 font-medium text-sm tracking-tighter">
            ₹{product.price}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
