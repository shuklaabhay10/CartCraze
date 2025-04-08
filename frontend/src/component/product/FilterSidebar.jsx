import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color") || "",
    size: searchParams.get("size") ? searchParams.get("size").split(',') : [],
    material: searchParams.get("material") ? searchParams.get("material").split(',') : [],
    brand: searchParams.get("brand") ? searchParams.get("brand").split(',') : [],
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 100,
  });

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Viscose", "Fleece"];
  const genders = ["Men", "Women"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Fashionista", "ChicStyle", "Beach Breeze"];

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") ? searchParams.get("size").split(',') : [],
      material: searchParams.get("material") ? searchParams.get("material").split(',') : [],
      brand: searchParams.get("brand") ? searchParams.get("brand").split(',') : [],
      minPrice: searchParams.get("minPrice") || 0,
      maxPrice: searchParams.get("maxPrice") || 100,
    });
  }, [searchParams]);

  //  Update filters and URL
  const updateFilter = (key, value) => {
    let newFilters = { ...filters };

    if (Array.isArray(newFilters[key])) {
      newFilters[key] = newFilters[key].includes(value)
        ? newFilters[key].filter((item) => item !== value)
        : [...newFilters[key], value];
    } else {
      newFilters[key] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // SUpdate URL parameters
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(','));
      } else if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Category Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) => (
          <div key={category} className='flex items-center mb-1'>
            <input
              type='radio'
              name='category'
              value={category}
              checked={filters.category === category}
              onChange={() => updateFilter("category", category)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {genders.map((gender) => (
          <div key={gender} className='flex items-center mb-1'>
            <input
              type='radio'
              name='gender'
              value={gender}
              checked={filters.gender === gender}
              onChange={() => updateFilter("gender", gender)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{gender}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Color</label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              name='color'
              value={color}
              onClick={() => updateFilter("color", color)}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.color === color ? 'ring-2 ring-blue-500' : ''}`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Size</label>
        {sizes.map((size) => (
          <div key={size} className='flex items-center mb-1'>
            <input
              type='checkbox'
              name='size'
              value={size}
              checked={filters.size.includes(size)}
              onChange={() => updateFilter("size", size)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{size}</span>
          </div>
        ))}
      </div>
       {/* Material Filter */}
<div className='mb-6'>
  <label className='block text-gray-600 font-medium mb-2'>Material</label>
  {materials.map((material) => (
    <div key={material} className='flex items-center mb-1'>
      <input
        type='checkbox'
        name='material'
        value={material}
        checked={filters.material.includes(material)}
        onChange={() => updateFilter("material", material)} // ✅ Use updateFilter
        className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
      />
      <span className='text-gray-700'>{material}</span>
    </div>
  ))}
</div>


       {/* Brand filter*/}
       <div className='mb-6'>
              <label className='block text-gray-600 font-medium mb-2'>Brand</label>
              {brands.map((brand) =>(
                <div key={brand} className='flex items-center mb-1'>
                  <input
                    type='checkbox'
                    name='brand'
                    value={brand}
                    checked={filters.brand.includes(brand)}
                    onChange={() => updateFilter("brand", brand)}  // ✅ Use updateFilter function
                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                  />

                <span className='text-gray-700'>{brand}</span>
                </div>
              ))}
            </div>

      {/* Price Range Filter */}
      <div className='mb-8'>
        <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
        <input
          type='range'
          name='maxPrice'
          min={0}
          max={100}
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
        />
        <div className='flex justify-between text-gray-600 mt-2'>
          <span>Rs.0</span>
          <span>Rs.{filters.maxPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
