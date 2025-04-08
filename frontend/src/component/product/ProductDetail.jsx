import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {fetchProductDetails,fetchSimilarProducts} from "../../redux/slices/productsSlice";
import {addToCart} from '../../redux/slices/cartSlice'
import ProductGrid from "./ProductGrid";
const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProduct } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(selectedProduct?.images[0]?.url || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!selectedProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="p-6">
      
      <Toaster position="top-center" />
      {selectedProduct && (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Images Section */}
          <div className="md:w-1/2 flex flex-col md:flex-row items-center md:items-start">
            {/* Thumbnails - Left Side (Big Screens) / Below (Small Screens) */}
            <div className="flex md:flex-col md:mr-4 justify-center gap-4 md:gap-2 order-2 md:order-1 mt-4 md:mt-0">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-gray-700" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full md:w-auto order-1 md:order-2">
              <img src={mainImage} alt="Main Product" className="w-full h-auto object-cover rounded-lg" />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
            <p className="text-lg text-gray-600 mb-1 line-through">
              {selectedProduct.originalPrice && `Rs.${selectedProduct.originalPrice}`}
            </p>
            <p className="text-xl text-gray-500 mb-2">Rs.{selectedProduct.price}</p>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor((prev) => (prev === color ? "" : color))}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color ? "border-4 border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.9)" }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Sizes:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize((prev) => (prev === size ? "" : size))}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button className="px-2 py-1 bg-gray-200 rounded text-lg" onClick={() => handleQuantityChange("minus")}>
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button className="px-2 py-1 bg-gray-200 rounded text-lg" onClick={() => handleQuantityChange("plus")}>
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
          <ProductGrid products={similarProduct} loading={loading} error={error}/>
        </div>
      </div>
      )}
    </div>
    
  );
};

export default ProductDetail;