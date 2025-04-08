import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AdminSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }
  return (
    <div className='p-6 bg-black h-screen text-white w-64'>
      <div className='mb-6 text-center'>
        <Link to='/admin' className='text-2xl font-bold'>CartCraze</Link>
      </div>
      <h2 className='text-xl font-medium mb-6 text-center'>Admin Dashboard</h2>
      <nav className='flex flex-col space-y-2'>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            isActive 
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-3" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-3"
          }
        >
          <FaUser className="text-lg" />
          <span className="text-sm">User</span>
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => 
            isActive 
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-3" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-3"
          }
        >
          <FaBoxOpen className="text-lg" />
          <span className="text-sm">Product</span>
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => 
            isActive 
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-3" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-3"
          }
        >
          <FaClipboardList className="text-lg" />
          <span className="text-sm">Orders</span>
        </NavLink>

        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive 
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-3" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-3"
          }
        >
          <FaStore className="text-lg" />
          <span className="text-sm">Shop</span>
        </NavLink>
      </nav>
      <div className='mt-6'>
        <button
        onClick={handleLogout}
        className='w-full bg-white hover:bg-gray-100 text-black py-2 px-4 rounded flex items-center justify-center space-x-2'
        >
        <FaSignOutAlt/>
        <span>Logout</span>
        </button>

      </div>
    </div>
  )
}

export default AdminSidebar;
