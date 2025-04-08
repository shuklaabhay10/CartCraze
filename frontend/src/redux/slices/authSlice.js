import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Retrieve user info from localStorage
const userFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

// Initial state
const initialState = {
    user: userFromStorage,
    loading: false,
    error: null,
};

//  Async thunk for user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An error occurred" });
        }
    }
);

// Async thunk for user registration (Only define it once)
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An error occurred" });
        }
    }
);

// Create authSlice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Registration failed";
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

