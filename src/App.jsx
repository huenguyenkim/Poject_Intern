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
                <Route path="*" element={<div className="p-20 text-center"><h2 className="text-3xl font-bold mb-4">Coming Soon</h2></div>} />
              </Route>

              {/* User Profile Routes */}
              <Route path="/profile" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
                <Route index element={<div className="p-20 text-center uppercase font-black text-[#2d2a4a] tracking-[0.2em] text-sm italic">Profile Coming Soon</div>} />
                <Route path="orders" element={<UserOrders />} />
                <Route path="settings" element={<div className="p-20 text-center uppercase font-black text-[#2d2a4a] tracking-[0.2em] text-sm italic">Settings Coming Soon</div>} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductMgmt />} />
                <Route path="categories" element={<CategoryMgmt />} />
                <Route path="orders" element={<OrderMgmt />} />
                <Route path="orders/:id" element={<OrderMgmt />} />
                <Route path="banners" element={<BannerMgmt />} />
                <Route path="*" element={<div className="p-20 text-center"><h2 className="text-3xl font-bold mb-4">Admin Section Coming Soon</h2></div>} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
