import React from 'react';
import { IoMdClose } from "react-icons/io";
import CartContent from '../cart/CartContent'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate()
    const {user ,guestId} =useSelector((state) => state.auth)
    const {cart} = useSelector((state) => state.cart)
    const userId = user ? user._id : null;

    const handleCheckout = () => {
        toggleCartDrawer()
        if (!user) {
            navigate("/login?redirect=checkout")
        } else {
            navigate("/checkout")
        }
        
    }
    return (
        <div 
            className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform
            transition-transform duration-300 ease-in-out z-50 
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
           <div className="flex flex-col h-full">
    {/* Close button */}
    <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
    </div>

    {/* Cart content */}
    <div className="flex-1 overflow-y-auto p-4">
    <h2 className="text-lg font-semibold">Your Cart</h2>
    {cart && cart?.products?.length > 0 ? (
        <CartContent cart={cart} userId={userId} guestId={guestId} />
    ) : (
        <p>Your cart is empty</p>
    )}
</div>


    {/* Checkout button (Fixed at Bottom) */}
    <div className="p-4 bg-grey-stripe shadow-lg sticky bottom-0 w-full">
        {cart && cart ?.products?.length > 0 && (
            <>
             <button 
        onClick={handleCheckout}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Checkout
        </button>
        <p className="text-center tracking-tighter text-sm mt-2 text-gray-600">One Step Away from Awesome!</p>

            </>
        )}
       
    </div>
</div>

            </div>
        
    );
};

export default CartDrawer;
