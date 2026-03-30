import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

import StorefrontLayout from './components/layout/StorefrontLayout';
import StorefrontHome from './pages/StorefrontHome';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import UserOrders from './pages/UserOrders';

import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductMgmt from './pages/admin/ProductMgmt';
import CategoryMgmt from './pages/admin/CategoryMgmt';
import OrderMgmt from './pages/admin/OrderMgmt';
import BannerMgmt from './pages/admin/BannerMgmt';
import AdminLogin from './pages/admin/AdminLogin';
import UserLayout from './components/layout/UserLayout';
import Placeholder from './components/ui/Placeholder';

const App = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-center" />
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<StorefrontLayout />}>
                <Route index element={<StorefrontHome />} />
                <Route path="shop" element={<ProductCatalog />} />
                <Route path="shop/:id" element={<ProductDetail />} />
                <Route path="cart" element={<ShoppingCart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="auth" element={<Auth />} />
                <Route path="deals" element={<ProductCatalog />} />
                
                {/* User Profile Routes Nested in Storefront */}
                <Route path="profile" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
                  <Route index element={<Placeholder title="Profile" />} />
                  <Route path="orders" element={<UserOrders />} />
                  <Route path="settings" element={<Placeholder title="Settings" />} />
                </Route>

                <Route path="*" element={<Placeholder />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductMgmt />} />
                <Route path="categories" element={<CategoryMgmt />} />
                <Route path="orders" element={<OrderMgmt />} />
                <Route path="orders/:id" element={<OrderMgmt />} />
                <Route path="banners" element={<BannerMgmt />} />
                <Route path="*" element={<Placeholder title="Admin Page" />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
