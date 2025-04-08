import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Fixed undefined variable
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Something went wrong" }); // Fixed error handling
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false; // Fixed incorrect loading state
                state.checkout = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Checkout failed"; // Fixed undefined payload issue
            });
    }
});

export default checkoutSlice.reducer;
