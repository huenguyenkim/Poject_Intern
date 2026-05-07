import React, { Suspense, useLayoutEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation, Outlet } from 'react-router-dom';
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
import { SocketProvider } from './context/SocketContext';

// Layouts & HOCs
import StorefrontLayout from './components/layout/StorefrontLayout';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/layout/ErrorBoundary';

// Pages
import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductCatalog from './pages/storefront/ProductCatalog';
const ProductDetail = lazy(() => import('./pages/storefront/ProductDetail'));
const BlogList = lazy(() => import('./pages/storefront/BlogList'));
const BlogDetail = lazy(() => import('./pages/storefront/BlogDetail'));
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
import CustomerSurvey from './pages/user/CustomerSurvey';
import UserSettings from './pages/user/UserSettings';
import Placeholder from './components/ui/Placeholder';
import TaskDashboard from './pages/admin/TaskDashboard';
import StaffLayout from './components/layout/StaffLayout';
import MyTasks from './pages/staff/MyTasks';
import NotificationCenter from './pages/shared/NotificationCenter';

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
    // Ensure we don't double prefix if something went wrong
    const cleanPath = location.pathname.startsWith(`/${fallbackLang}`) 
      ? location.pathname 
      : `/${fallbackLang}${location.pathname}`;
    
    return <Navigate to={`${cleanPath}${location.search}`} replace />;
  }

  return children || <Outlet />;
};

const AppLoading = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-surface_dim flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="w-24 h-24 bg-primary/10 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-24 h-24 bg-primary rounded-[30px] flex items-center justify-center text-white shadow-2xl relative">
          <span className="text-5xl animate-bounce">🍭</span>
        </div>
      </div>
      <h2 className="text-2xl font-black text-primary uppercase tracking-widest">{t('common.loading', 'Sweetening...')}</h2>
    </div>
  );
};

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

            {/* Global Language Wrapper */}
            <Route path="/:lang" element={<LanguageGuard />}>
              
              {/* Storefront Routes */}
              <Route element={<StorefrontLayout />}>
                <Route index element={<StorefrontHome />} />
                <Route path="shop" element={<ProductCatalog />} />
                <Route path="shop/:id" element={<ProductDetail />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="cart" element={<ShoppingCart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="auth" element={<Auth />} />
                <Route path="contact" element={<Contact />} />
                <Route path="notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />

                {/* User Profile Routes */}
                <Route path="profile" element={<ProtectedRoute role="customer"><UserLayout /></ProtectedRoute>}>
                  <Route index element={<UserProfile />} />
                  <Route path="orders" element={<UserOrders />} />
                  <Route path="survey" element={<CustomerSurvey />} />
                  <Route path="settings" element={<UserSettings />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="tasks" element={<TaskDashboard />} />
                  <Route path="products" element={<ProductMgmt />} />
                  <Route path="categories" element={<CategoryMgmt />} />
                  <Route path="orders" element={<OrderMgmt />} />
                  <Route path="orders/:id" element={<OrderMgmt />} />
                  <Route path="banners" element={<BannerMgmt />} />
                  <Route path="notifications" element={<NotificationCenter />} />
                  <Route path="*" element={<Placeholder title="Admin Page" />} />
                </Route>
              </Route>

              {/* Staff Routes */}
              <Route path="staff" element={<ProtectedRoute role="staff"><StaffLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="tasks" replace />} />
                <Route path="tasks" element={<MyTasks />} />
                <Route path="*" element={<Placeholder title="Staff Page" />} />
              </Route>

              <Route path="*" element={<Placeholder />} />
            </Route>

            {/* Final fallback for non-prefixed routes */}
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

  React.useEffect(() => {
    const trackVisit = async () => {
      const hasVisited = sessionStorage.getItem('hasVisitedSession');
      if (!hasVisited) {
        try {
          const sessionId = `session-${Math.random().toString(36).substring(2, 15)}`;
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/analytics/visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          sessionStorage.setItem('hasVisitedSession', 'true');
        } catch (error) {
          console.error('Failed to track visit', error);
        }
      }
    };
    trackVisit();
  }, []);

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
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AntApp>
    </ConfigProvider>
  );
}
export default App;
