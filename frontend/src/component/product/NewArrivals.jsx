import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';  
const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10">
          <button onClick={scrollLeft} className="p-2 bg-white text-black rounded-full shadow-md hover:bg-gray-200">
            <FiChevronLeft className="text-2xl" />
          </button>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10">
          <button onClick={scrollRight} className="p-2 bg-white text-black rounded-full shadow-md hover:bg-gray-200">
            <FiChevronRight className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Products */}
        <div ref={scrollRef} className="container mx-auto overflow-x-auto flex space-x-6 scroll-smooth scrollbar-hide px-4">
          {newArrivals.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="min-w-[250px] p-4 bg-white rounded-lg shadow-md">
                <img
                  src={product.image?.[0]?.url || "https://picsum.photos/500/500?random=1"}
                  alt={product.image?.[0]?.altText || product.name || "Product Image"}
                  className="w-full h-auto object-cover transition-all duration-300 hover:scale-105 hover:opacity-80 rounded-lg"
                />
                <h3 className="text-lg font-bold mt-3">{product.name}</h3>
                <p className="text-gray-600">Rs.{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
