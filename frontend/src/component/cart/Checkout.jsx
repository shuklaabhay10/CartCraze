import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";


const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {cart,loading,error} =useSelector((state) => state.cart)
  const {user} = useSelector((state) => state.auth)
  const [checkoutId,setCheckoutId] = useState(null)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() =>{
    if (!cart || !cart.products || cart.products.length ===0) {
      navigate("/")
    }
  }, [cart,navigate] )

  const handleCreateCheckout = async (e) =>{
    e.preventDefault()
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod:'PayPal',
          totalPrice: cart.totalPrice,
        })
      )
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id) 
      }
    }
  }
  const handlePaymentSuccess = async (detail) =>{
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus : "paid", paymentDetails: details},
        {
          headers: {
            Authorization :`Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
        await handleFinalizeCheckout(checkoutId) // finalize checkout if payment is successful
      
    } catch (error) {
      console.error(error)
    }
  }

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          }
        }
      );
      navigate("/order-confirmation")

    } catch (error) {
      console.error(error)
    }
  }
  if (loading) return <p>Loading cart ...</p>
  if (error) return <p> Error: {error}</p>
  if (!cart || !cart.products || cart.products.length ===0) {
    return <p>Your cart is empty</p>
  } 
 
// stripe payment
const makePayment = async () => {
  try {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Use environment variable

    const apiURL = import.meta.env.VITE_BACKEND_URL; // Define API URL

    if (!apiURL) {
      console.error("Error: Backend URL is not set.");
      return;
    }

    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      console.error("Error: Cart is empty or invalid.");
      return;
    }

    const body = {
      products: cart.products.map((product) => ({
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "", 
        price: product.price, 
        size: product.selectedSize || "M", 
        color: product.selectedColor || "Default", 
        quantity: product.quantity || 1,
      })),
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return;
    }

    const session = await response.json();

    if (!session.id) {
      console.error("Error: No session ID returned from backend.");
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Stripe Error:", result.error);
    }
  } catch (error) {
    console.error("Stripe Payment Error:", error);
  }
};



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value= {user? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Address Field - Full Width */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* City, Postal Code, Country, and Phone Fields */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mt-6">
                {!checkoutId ? (
                    <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded"
                    >Continue to Payment</button>
                ) : (
                    <div>
                        <h3 className="text-lg mb-4">Pay with Paypal</h3>
                    {/* Paypal component */}
                    <PayPalButton 
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => alert("Payment failed. Try again.")}
                    />
                    {/* Stripe Button */}
                    <h2 className="text-lg mb-4">Pay with Stripe</h2>
             <div className="flex justify-center mt-6">
                 <button 
                 onClick={makePayment}
                  type="button"
                 className="w-3/4 max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all duration-300 text-lg text-center"
                     >
                 Pay with Stripe
                 </button>
                </div>
                    </div>
                    
                ) }
            </div>
          </div>
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Order Summary</h2>
        <div className="space-y-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h3 className="text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.color}, {product.size}
                  </p>
                </div>
              </div>
              <p className="text-lg">Rs.{product.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between">
            <p className="text-lg">Total</p>
            <p className="text-lg font-bold">Rs.{cart.totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;