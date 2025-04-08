import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products by filter
export const fetchProductsByFilter = createAsyncThunk(
    "products/fetchByFilter",
    async ({ collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit }) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );

        return response.data || []; // Ensure always returning an array
    }
);

// Async thunk to fetch a single product
export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        return response.data;
    }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        return response.data;
    }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
        );
        return response.data || []; // Ensure always returning an array
    }
);

// Memoized selectors to prevent unnecessary re-renders
const selectProductsState = (state) => state.products;

export const selectSimilarProducts = createSelector(
    [selectProductsState],
    (products) => products.similarProducts
);

export const selectFilteredProducts = createSelector(
    [selectProductsState],
    (products) => products.products
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        }
    },
    reducers: {
        setFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilter: (state) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching products with filter
            .addCase(fetchProductsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle fetching single product details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch Similar Products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFilter, clearFilter } = productsSlice.actions;
export default productsSlice.reducer;
