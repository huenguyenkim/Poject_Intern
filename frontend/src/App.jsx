import React, { Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd';

// Core Thunks
import { initializeAuthThunk } from './store/authThunks';
import { fetchCatalogThunk } from './store/catalogSlice';
import { validateCartItems } from './store/cartSlice';

// Global Instances Store (Ant Design APIs)
import { setAntdInstances } from './utils/AntdGlobal';

// Layouts & HOCs
import StorefrontLayout from './components/layout/StorefrontLayout';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/layout/ErrorBoundary';

// Pages (Direct imports for stable routing, considering the current project state)
import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductCatalog from './pages/storefront/ProductCatalog';
import ProductDetail from './pages/storefront/ProductDetail';
import ShoppingCart from './pages/storefront/ShoppingCart';
import Checkout from './pages/storefront/Checkout';
import Auth from './pages/auth/Auth';
import Contact from './pages/storefront/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductMgmt from './pages/admin/ProductMgmt';
import CategoryMgmt from './pages/admin/CategoryMgmt';
import OrderMgmt from './pages/admin/OrderMgmt';
import BannerMgmt from './pages/admin/BannerMgmt';

import UserProfile from './pages/user/UserProfile';
import UserOrders from './pages/user/UserOrders';
import UserSettings from './pages/user/UserSettings';
import Placeholder from './components/ui/Placeholder';

/**
 * AppLoading: Premium "Candy" styled loading state.
 */
const AppLoading = () => (
  <div className="min-h-screen bg-surface_dim flex flex-col items-center justify-center gap-8 animate-in fade-in duration-700">
    <div className="relative">
      <div className="w-24 h-24 bg-primary/10 rounded-full animate-ping absolute inset-0"></div>
      <div className="w-24 h-24 bg-primary rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 relative">
        <span className="text-5xl animate-bounce">🍭</span>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-black text-primary uppercase tracking-widest mb-2">Sweetening up...</h2>
      <div className="w-48 h-1.5 bg-surface_container rounded-full overflow-hidden">
        <div className="h-full bg-primary w-1/2 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
      </div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
    `}} />
  </div>
);

/**
 * AppContent: Inner component to access antd's context-dependent hooks.
 */
const AppContent = () => {
  const { message, notification, modal } = AntApp.useApp();
  
  // Use useLayoutEffect for immediate initialization of static instances
  useLayoutEffect(() => {
    setAntdInstances({ message, notification, modal });
    console.log('[App] Ant Design instances initialized in AntdGlobal.');
  }, [message, notification, modal]);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<AppLoading />}>
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
              <Route path="contact" element={<Contact />} />

              {/* User Profile Routes Nested in Storefront */}
              <Route path="profile" element={<ProtectedRoute role="customer"><UserLayout /></ProtectedRoute>}>
                <Route index element={<UserProfile />} />
                <Route path="orders" element={<UserOrders />} />
                <Route path="settings" element={<UserSettings />} />
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
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { products, status: catalogStatus } = useSelector((state) => state.catalog);
  const { initializing } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const initApp = async () => {
      console.log('[App] Initializing Catalog and Auth...');
      await Promise.allSettled([
        dispatch(initializeAuthThunk()),
        dispatch(fetchCatalogThunk()),
      ]);
      console.log('[App] Initialization complete.');
    };
    initApp();
  }, [dispatch]);

  // Performance optimized sync trigger
  React.useEffect(() => {
    if (catalogStatus === 'succeeded' && products.length > 0) {
      console.log('[App] Synchronizing Cart with Catalog...');
      dispatch(validateCartItems(products));
    }
  }, [catalogStatus, products, dispatch]);

  if (initializing) return <AppLoading />;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e040a0',
          colorInfo: '#0ea5e9',
          colorSuccess: '#10b981',
          colorError: '#e53e3e',
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: 16,
          colorBgContainer: '#ffffff',
          colorTextBase: '#2d2a4a',
        },
        components: {
          Button: {
            fontWeight: 900,
            controlHeight: 52,
            paddingContentHorizontal: 24,
          },
          Card: {
            borderRadiusLG: 32,
          },
          Modal: {
            borderRadiusLG: 40,
          },
          Message: {
            borderRadius: 24,
            contentBg: '#2d2a4a',
            colorText: '#ffffff',
          },
        },
      }}
    >
      <AntApp>
        <AppContent />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
