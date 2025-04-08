import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import shoes from '../assets/shoes.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setError("");

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex'>
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>CartCraze!</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hello there!</h2>
          <p className='text-center mb-6'>
            Enter your username and password to login
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your email address'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className='mt-6 text-center text-sm'>
            Don't have an account?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className='hidden md:block w-1/2 bg-white'>
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={shoes}
            alt='Login to account'
            className='w-[600px] h-[500px] object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;