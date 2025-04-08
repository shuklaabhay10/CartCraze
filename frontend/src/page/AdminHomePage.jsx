import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrder } from '../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
    const dispatch = useDispatch();

    const {
        products,
        loading: productsLoading,
        error: productsError,
    } = useSelector((state) => state.adminProducts);

    const {
        orders,
        totalOrders,
        totalSales,
        loading: ordersLoading,
        error: ordersError,
    } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrder());
    }, [dispatch]); 

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {productsLoading || ordersLoading ? (
                <p>Loading...</p>
            ) : productsError ? (
                <p className="text-red-500">Error fetching products: {productsError}</p>
            ) : ordersError ? (
                <p className="text-red-500">Error fetching orders: {ordersError}</p>
            ) : (
                <>
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 shadow-md rounded-lg bg-white">
                            <h2 className="text-xl font-semibold">Revenue</h2>
                            <p className="text-2xl font-bold">Rs.{totalSales.toFixed(2)}</p>
                        </div>

                        <div className="p-4 shadow-md rounded-lg bg-white">
                            <h2 className="text-xl font-semibold">Total Orders</h2>
                            <p className="text-2xl font-bold">{totalOrders || 0}</p>
                            <Link to="/admin/orders" className="text-blue-500 hover:underline">
                                Manage Orders
                            </Link>
                        </div>

                        <div className="p-4 shadow-md rounded-lg bg-white">
                            <h2 className="text-xl font-semibold">Total Products</h2>
                            <p className="text-2xl font-bold">{products.length || 0}</p>
                            <Link to="/admin/products" className="text-blue-500 hover:underline">
                                Manage Products
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/* Recent Orders Table */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-500 border border-gray-300">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4 border border-gray-300">Order Id</th>
                                <th className="py-3 px-4 border border-gray-300">User</th>
                                <th className="py-3 px-4 border border-gray-300">Total Price</th>
                                <th className="py-3 px-4 border border-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-4 border border-gray-300">{order._id}</td>
                                        <td className="py-3 px-4 border border-gray-300">{order.user?.name || 'N/A'}</td>
                                        <td className="py-3 px-4 border border-gray-300">Rs.{order.totalPrice.toFixed(2)}</td>
                                        <td className="py-3 px-4 border border-gray-300">{order.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
