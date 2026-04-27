import React, { Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import './i18n';

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

// Pages
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

const SUPPORTED_LANGS = ['vi', 'en'];

/**
 * LanguageGuard: Handles URL language prefixing and fallback.
 */
const LanguageGuard = ({ children }) => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  React.useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    const detectedLang = i18n.language?.split('-')[0] || 'vi';
    const fallbackLang = SUPPORTED_LANGS.includes(detectedLang) ? detectedLang : 'vi';
    
    // Redirect to the same path but with language prefix
    const newPath = `/${fallbackLang}${location.pathname}${location.search}`;
    return <Navigate to={newPath} replace />;
  }

  return children;
};

const AppLoading = () => (
  <div className="min-h-screen bg-surface_dim flex flex-col items-center justify-center gap-8">
    <div className="relative">
      <div className="w-24 h-24 bg-primary/10 rounded-full animate-ping absolute inset-0"></div>
      <div className="w-24 h-24 bg-primary rounded-[30px] flex items-center justify-center text-white shadow-2xl relative">
        <span className="text-5xl animate-bounce">🍭</span>
      </div>
    </div>
    <h2 className="text-2xl font-black text-primary uppercase tracking-widest">Sweetening...</h2>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
    `}} />
  </div>
);

const AppContent = () => {
  const { message, notification, modal } = AntApp.useApp();
  
  useLayoutEffect(() => {
    setAntdInstances({ message, notification, modal });
  }, [message, notification, modal]);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<AppLoading />}>
          <Routes>
            {/* Redirect root to default language */}
            <Route path="/" element={<Navigate to="/vi" replace />} />

            {/* Localized Storefront Routes */}
            <Route path="/:lang" element={<LanguageGuard><StorefrontLayout /></LanguageGuard>}>
              <Route index element={<StorefrontHome />} />
              <Route path="shop" element={<ProductCatalog />} />
              <Route path="shop/:id" element={<ProductDetail />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="auth" element={<Auth />} />
              <Route path="contact" element={<Contact />} />

              {/* User Profile Routes */}
              <Route path="profile" element={<ProtectedRoute role="customer"><UserLayout /></ProtectedRoute>}>
                <Route index element={<UserProfile />} />
                <Route path="orders" element={<UserOrders />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>
              <Route path="*" element={<Placeholder />} />
            </Route>

            {/* Admin Routes (No localization for admin usually, keep simple) */}
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

            {/* Final fallback */}
            <Route path="*" element={<Navigate to="/vi" replace />} />
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
      await Promise.allSettled([
        dispatch(initializeAuthThunk()),
        dispatch(fetchCatalogThunk()),
      ]);
    };
    initApp();
  }, [dispatch]);

  React.useEffect(() => {
    if (catalogStatus === 'succeeded' && products.length > 0) {
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
          Button: { fontWeight: 900, controlHeight: 52 },
          Card: { borderRadiusLG: 32 },
          Modal: { borderRadiusLG: 40 },
          Message: { borderRadius: 24, contentBg: '#2d2a4a', colorText: '#ffffff' },
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
