import React from 'react';
import womensCollectionImage from '../../assets/womens-collection.webp';
import mensCollectionImage from '../../assets/mens-collection.webp';
import { Link } from 'react-router-dom';

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-8">
        {/* Women collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-auto sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-4 rounded-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Women's Collection
            </h2>
            <Link to="/collections/all?gender=women" className="text-gray-900 underline text-sm md:text-base">
              Shop Now!
            </Link>
          </div>
        </div>

        {/* Men collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-auto sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-4 rounded-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Men's Collection
            </h2>
            <Link to="/collections/all?gender=men" className="text-gray-900 underline text-sm md:text-base">
              Shop Now!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
