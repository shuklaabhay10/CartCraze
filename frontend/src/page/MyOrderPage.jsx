import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice'; 

const MyOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Provide a fallback to prevent errors
    const { orders = [], loading, error } = useSelector((state) => state.orders || {});

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}...</p>;

    return (
        <div className="w-full p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
            <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                <table className="min-w-full text-left text-gray-500 border border-gray-200">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-2 px-2 sm:px-4 border">Image</th>
                            <th className="py-2 px-2 sm:px-4 border">Order ID</th>
                            <th className="py-2 px-2 sm:px-4 border">Created</th>
                            <th className="py-2 px-2 sm:px-4 border">Shipping Address</th>
                            <th className="py-2 px-2 sm:px-4 border">Items</th>
                            <th className="py-2 px-2 sm:px-4 border">Price</th>
                            <th className="py-2 px-2 sm:px-4 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} onClick={() => handleRowClick(order._id)} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-2 sm:px-4 border">
                                        <img
                                            src={order.orderItems[0]?.image || "placeholder.jpg"}
                                            alt={order.orderItems[0]?.name || "No Image"}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {order.shippingAddress
                                            ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                            : 'N/A'}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">{order.orderItems.length}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">₹{order.totalPrice}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        <span
                                            className={`${order.isPaid
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                                        >
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 text-center p-4 text-gray-500">
                                    No Orders Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrderPage;
