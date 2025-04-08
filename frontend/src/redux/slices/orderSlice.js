import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const initialState = {
  orders: [],
  totalOrder: 0,
  orderDetail: null,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
  clientSecret: null, // For Stripe payments
};

// Payment methods enum
const PaymentMethod = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
};

// Async thunks
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  "orders/fetchOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order details");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Order creation failed");
    }
  }
);

export const payWithStripe = createAsyncThunk(
  "orders/payWithStripe",
  async ({ orderId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/pay/stripe`,
        { paymentMethodId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Stripe payment failed");
    }
  }
);

export const payWithPayPal = createAsyncThunk(
  "orders/payWithPayPal",
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/pay/paypal`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "PayPal payment failed");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentLoading = false;
      state.paymentError = null;
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrder = action.payload.totalOrders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order details
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.order;
        if (action.payload.paymentMethod === PaymentMethod.STRIPE) {
          state.clientSecret = action.payload.clientSecret;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Stripe payment
      .addCase(payWithStripe.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(payWithStripe.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.orderDetail = action.payload;
      })
      .addCase(payWithStripe.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })

      // PayPal payment
      .addCase(payWithPayPal.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(payWithPayPal.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.orderDetail = action.payload;
      })
      .addCase(payWithPayPal.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });
  },
});

export const { resetOrderDetail, resetPaymentStatus, setClientSecret } = orderSlice.actions;
export default orderSlice.reducer;