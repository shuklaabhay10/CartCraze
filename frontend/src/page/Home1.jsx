import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilter } from "../redux/slices/productsSlice"; 
import Hero from "../component/layout/Hero";
import GenderCollectionSection from "../component/product/GenderCollectionSection";
import NewArrivals from "../component/product/NewArrivals";
import ProductDetail from "../component/product/ProductDetail";
import FeaturedCollection from "../component/product/FeaturedCollection";
import FeaturedSection from "../component/product/FeaturedSection";
import ProductGrid from "../../src/component/product/ProductGrid";
import axios from "axios";

const Home1 = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilter ({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetail productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center"> Loading best seller product ...</p>
      )}
      <ProductGrid products={products} loading={loading} error={error} />
      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home1;