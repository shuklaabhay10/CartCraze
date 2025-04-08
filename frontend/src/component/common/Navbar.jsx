import { useState } from "react";
import { Link } from "react-router-dom";
import logo2 from "../../assets/shopping.png";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "../common/SearchBar";
import CartDrawer from "../layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); 
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const {cart} = useSelector((state) => state.cart)
  const {user} = useSelector((state) => state.auth)
  
  const cartItemCount = cart?.products?.reduce((total,product) => total+product.quantity,0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen((prev) => !prev);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left Logo */}
        <div>
          <Link to="/">
            <img src={logo2} className="h-8 w-8" alt="Logo" />
          </Link>
        </div>

        {/* Center Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <Link to="/collections/all?gender=Men" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Men</Link>
          <Link to="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Women</Link>
          <Link to="/collections/all?category=Top Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Top Wear</Link>
          <Link to="/collections/all?category=Bottom Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">Bottom Wear</Link>
        </div>

        {/* Right Section: Search + Icons */}
        <div className="flex items-center space-x-6">
          <SearchBar />
         {user && user.role === "admin" && (<Link to='/admin'className="block bg-black px-2 rounded text-sm text-white">Admin</Link>)}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-5 w-5 text-gray-700" />
          </Link>

          {/* Cart Button */}
          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-5 w-5 text-gray-700" />
            {cartItemCount > 0 && (<span className="absolute -top-1 -right-3 bg-black text-white text-xs rounded-full px-2 py-0.5">{cartItemCount}</span>) }
          </button>

          {/* Mobile Menu Button */}
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div> 
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/*  Mobile Navigation Drawer */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform
        transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600"/>
          </button>
        </div>

        
        {/* Added Navigation Links */}
        <div className="flex flex-col space-y-4 px-5 p-3">
        <h2 className="text-xl front-semibold mb-4">Menu</h2>

          <Link to="/collections/all?gender=Men" className="block text-gray-700 hover:text-black text-lg font-medium uppercase" onClick={toggleNavDrawer}>Men</Link>
          <Link to="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-lg font-medium uppercase" onClick={toggleNavDrawer}>Women</Link>
          <Link to="/collections/all?category=Top Wear" className="text-gray-700 hover:text-black text-lg font-medium uppercase" onClick={toggleNavDrawer}>Top Wear</Link>
          <Link to="/collections/all?category=Bottom Wear" className="text-gray-700 hover:text-black text-lg font-medium uppercase" onClick={toggleNavDrawer}>Bottom Wear</Link>
        </div>
      </div>
      
    </>
  );
};

export default Navbar;
