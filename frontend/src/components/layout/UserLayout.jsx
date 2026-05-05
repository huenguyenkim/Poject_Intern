import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/authSlice';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * UserLayout: Sidebar layout for profile, orders, and settings.
 * Refined to match the provided "After" design exactly.
 */
const UserLayout = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const navItems = [
    { name: t('header.profile'), path: '/profile', icon: User },
    { name: t('header.my_orders'), path: '/profile/orders', icon: ShoppingBag },
    { name: t('settings.title'), path: '/profile/settings', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/${lang}/auth`);
  };

  return (
    <div className="flex bg-[#fcf9fc] font-sans min-h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-white flex flex-col hidden lg:flex border-r border-surface_container/30">
        
        {/* User Profile Summary at Top (Dynamic) */}
        <div className="p-10 pb-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-black text-on_surface tracking-tight leading-tight">
            {currentUser?.name || ''}
          </h2>
        </div>
        
        {/* Navigation Section */}
        <nav className="flex-1 px-8 py-6 space-y-3">
          {navItems.map((item) => {
            // Note: LocalizedLink will handle prefixing the path for the 'to' prop, 
            // but for isActive check we still need to consider the full path.
            const localizedPath = `/${lang}${item.path}`;
            const isActive = location.pathname === localizedPath;
            const Icon = item.icon;
            return (
              <LocalizedLink 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-sm transition-all duration-300 ${
                  isActive 
                  ? 'bg-[#FFF0F8] text-primary shadow-sm' 
                  : 'text-on_surface_variant/60 hover:text-on_surface hover:bg-[#FFF0F8]/30'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                <span>{item.name}</span>
              </LocalizedLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Section */}
        <div className="p-8 pb-10 space-y-2">

          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-on_surface_variant/60 hover:text-on_surface transition-all text-sm group"
          >
            <LogOut size={20} />
            <span>{t('header.logout')}</span>
          </button>


        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0 bg-[#fcf9fc] relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/images/pattern-candy.png')] bg-[length:300px_300px]"></div>
        
        {/* Mobile Navigation Bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface_container/30 px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const localizedPath = `/${lang}${item.path}`;
            const isActive = location.pathname === localizedPath;
            const Icon = item.icon;
            
            // Short labels for mobile to prevent overflow
            const mobileName = item.path === '/profile' ? t('header.profile').replace(' của tôi', '') : 
                             item.path === '/profile/settings' ? t('settings.title').replace(' người dùng', '') : 
                             item.name;

            return (
              <LocalizedLink 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[11px] whitespace-nowrap transition-all ${
                  isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white text-on_surface_variant border border-surface_container/50'
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                <span>{mobileName}</span>
              </LocalizedLink>
            );
          })}
          
          {/* Logout button for mobile */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[11px] whitespace-nowrap transition-all bg-error/10 text-error border border-error/20"
          >
            <LogOut size={14} strokeWidth={3} />
            <span>{t('header.logout')}</span>
          </button>
        </div>

        <div className="max-w-[1100px] mx-auto p-6 pt-6 md:p-12 lg:p-16 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
