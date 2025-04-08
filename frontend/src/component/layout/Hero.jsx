import React from 'react';
import background2 from '../../assets/home.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full">
      <img 
        src={background2} 
        alt="hero" 
        className="w-full h-auto object-cover aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7]"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-4 md:px-10">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase mb-3 leading-tight">
            Coastal <br /> 
            <span className="block md:inline">Cool</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-lg mb-4">
            Effortless outfits for your next adventure.
          </p>
          <Link 
  to="#" 
  className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded text-base sm:text-lg transition hover:bg-gray-100"
>
  Shop Now
</Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;
