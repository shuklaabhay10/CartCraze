import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// fetch all order (admin only)
export const fetchAllOrder = createAsyncThunk(
    "adminOrder/fetchAllOrder",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// update order status
export const updateOrderStatus = createAsyncThunk(
    "adminOrder/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// delete order
export const deleteOrder = createAsyncThunk(
    "adminOrder/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return id; // Return the id of the deleted order
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch all orders
            .addCase(fetchAllOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
                // calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // delete order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
                state.totalOrders = state.orders.length;
                // Recalculate total sales after deletion
                const totalSales = state.orders.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            });
    }
});

export default adminOrderSlice.reducer;