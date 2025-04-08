import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';

const ProductMangement = () => {
    const dispatch = useDispatch()
    const {products,loading,error} = useSelector(
       (state)  => state.adminProducts
    )

    useEffect(() => {
        dispatch(fetchAdminProducts())
    },[dispatch])

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
        }
    };
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-6'>Product Management</h2>
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Product ID</th>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Price</th>
                            <th className='py-3 px-4'>SKU</th>
                            <th className='py-3 px-4 text-center'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product._id}
                                    </td>
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">Rs. {product.price}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4 text-center align-middle">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/admin/products/${product._id}/edit`}
                                                className='bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600'
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4">
                                    No products available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductMangement;
