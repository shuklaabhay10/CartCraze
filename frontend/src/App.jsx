import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./component/layout/UserLayout";
import Home1 from "./page/Home1"; 
import { Toaster } from "sonner";
import Login from "./page/Login";
import Register from "./page/Register";
import Profile from "./page/Profile";
import CollectionPages from "./page/CollectionPages";
import ProductDetail from "./component/product/ProductDetail";
import Checkout from "./component/cart/Checkout";
import OrderConfirmation from "./page/OrderConfirmation";
import OrderDetailsPage from "./page/OrderDetailsPage";
import MyOrderPage from "./page/MyOrderPage";
import AdminLayout from "./component/admin/AdminLayout";
import AdminHomePage from "./page/AdminHomePage";
import UserManagement from "./component/admin/UserManagement";
import ProductMangement from "./component/admin/ProductMangement";
import EditProductPage from "./component/admin/EditProductPage";
import OrderManagement from "./component/admin/OrderManagement";

import { Provider } from "react-redux";
import store from './redux/store'
import ProtectedRoute from "./component/common/ProtectedRoute";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Sucess from "./component/cart/Sucess";
import Cancel from "./component/cart/Cancel";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home1 />} />
            <Route path="login" element={<Login />} /> 
            <Route path="register" element={<Register />} /> 
            <Route path="profile" element={<Profile />} /> 
            <Route path="collections/:collection" element={<CollectionPages />} /> 
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="checkout" element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            } />
            <Route path="order-confirmation" element={<OrderConfirmation />} /> 
            <Route path="order/:id" element={<OrderDetailsPage />} /> 
            <Route path="my-orders" element={<MyOrderPage />} /> 
            <Route path="/sucess" element={<Sucess />} /> 
            <Route path="/cancel" element={<Cancel />} /> 


          </Route> 
          
          {/* Admin Layout with Nested Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role='admin'>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement/>}/>
            <Route path="products" element={<ProductMangement/>}/>
            <Route path="products/:id/edit" element={<EditProductPage/>}/>
            <Route path="orders" element={<OrderManagement/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
