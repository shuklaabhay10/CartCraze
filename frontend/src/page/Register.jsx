import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.jpg';
import { registerUser, loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import mergeCart from "../redux/slices/cartSlice"
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart) || { cart: { product: [] } };

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        console.log("Cart state:", cart); // Debugging
        if (user) {
            if (cart?.product?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await dispatch(registerUser({ name, email, password })).unwrap();
            await dispatch(loginUser({ email, password })).unwrap(); // Automatically log in after signup
            navigate(redirect);
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form 
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
                >
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium"> CartCraze! </h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hello there!</h2>
                    <p className="text-center mb-6">Enter your details to sign up</p>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"  
                            placeholder="Enter your name"  
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"    
                            placeholder="Enter your email address"  
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"    
                            placeholder="Enter your password"  
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <p className="mt-6 text-center text-sm">
                        Already have an account?{" "}
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            <div className="hidden md:block w-1/2 bg-white">
                <div className="h-full flex flex-col justify-center items-center">
                    <img 
                        src={register}
                        alt="Sign up"
                        className="w-[600px] h-[600px] object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
