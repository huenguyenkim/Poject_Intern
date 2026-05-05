import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, Menu, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/authSlice';
import { showSuccessToast } from '../../utils/toastUtils';
import Clock from '../misc/Clock';
import LocalizedLink from '../navigation/LocalizedLink';
import NotificationBell from '../ui/NotificationBell';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (newLang) => {
    if (newLang === i18n.language) return;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    pathParts[0] = newLang; 
    const newPath = '/' + pathParts.join('/') + (location.search || '');
    
    i18n.changeLanguage(newLang);
    navigate(newPath);
  };

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 shadow-sm transition-all hover:bg-white/20">
      <Globe size={16} className="text-primary" />
      <div className="flex gap-1">
        <button 
          onClick={() => changeLanguage('vi')}
          className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${i18n.language === 'vi' ? 'bg-primary text-white shadow-sm' : 'text-on_surface_variant hover:bg-primary/10'}`}
        >
          VI
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${i18n.language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on_surface_variant hover:bg-primary/10'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

const StorefrontLayout = () => {
  const { t } = useTranslation();
  const { lang = 'vi' } = useParams();
  
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${lang}/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Promotional Banner */}
      <div className="bg-primary text-on_primary flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-6 py-2 px-4 text-[9px] sm:text-xs font-bold tracking-tight sm:tracking-wide transition-all min-h-[40px]">
        <span className="text-center leading-tight">{t('header.free_shipping', '🍬 Free shipping on all orders over $50! 🍬')}</span>
        <div className="hidden sm:block h-4 w-[1px] bg-white/20"></div>
        <div className="flex items-center justify-center scale-90 sm:scale-100">
          <Clock prefixLabel={t('header.server_time', '🕒 Giờ hệ thống: ')} />
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-surface_container_lowest border-b border-surface_container sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-10">
              <LocalizedLink to="/" className="flex items-center gap-2 text-primary group bouncy-hover">
                <span className="font-black text-2xl tracking-tight text-primary">CandyShop</span>
              </LocalizedLink>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6 items-center">
                <LocalizedLink to="/" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname === `/${lang}` || location.pathname === `/${lang}/` ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>{t('header.home')}</LocalizedLink>
                <LocalizedLink to="/shop" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname.includes('/shop') ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>{t('header.shop')}</LocalizedLink>
                <LocalizedLink to="/contact" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname.includes('/contact') ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>{t('header.contact')}</LocalizedLink>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <LanguageSwitcher />

              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-surface_container_high rounded-full px-4 py-2 w-64 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                <Search size={20} className="text-on_surface_variant mr-2" />
                <input 
                  type="text" 
                  placeholder={t('header.search_placeholder', 'Search sweets...')} 
                  className="bg-transparent border-none outline-none text-sm font-bold text-on_surface w-full placeholder-on_surface_variant"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="flex items-center space-x-4">
                {currentUser && <NotificationBell />}

                <LocalizedLink to="/cart" className="p-2 text-primary hover:text-primary/70 transition-colors relative bouncy-hover block" aria-label="Shopping Cart">
                  <ShoppingCart size={28} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-on_primary transform translate-x-1/3 -translate-y-1/3 bg-secondary rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </LocalizedLink>
                <LocalizedLink to={currentUser ? "/profile" : "/auth"} className="p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover hidden sm:block" aria-label="User Profile">
                  <User size={28} />
                </LocalizedLink>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover" 
                  aria-label="Open menu"
                >
                  <Menu size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <div className={`absolute inset-0 bg-on_surface/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
           <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 border-b border-surface_dim flex justify-between items-center">
                 <span className="font-black text-2xl tracking-tight text-primary">Menu</span>
                 <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface_dim text-on_surface_variant">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
              </div>
              
              <nav className="p-8 space-y-6">
                 <LocalizedLink to="/" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">{t('header.home')}</LocalizedLink>
                 <LocalizedLink to="/shop" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">{t('header.shop')}</LocalizedLink>
                 <LocalizedLink to="/contact" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">{t('header.contact')}</LocalizedLink>
                 <LocalizedLink to="/cart" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">{t('cart.title', 'Cart')}</LocalizedLink>
                 <LocalizedLink to={currentUser ? "/profile" : "/auth"} className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">
                    {currentUser ? t('header.profile', 'My Profile') : t('header.login', 'Sign In')}
                 </LocalizedLink>
                 
                 {currentUser && (
                    <button 
                      onClick={() => {
                        dispatch(logout());
                        navigate(`/${lang}/auth`);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-2xl font-black text-error hover:opacity-70 transition-all mt-4"
                    >
                      <LogOut size={28} />
                      <span>{t('header.logout')}</span>
                    </button>
                  )}
              </nav>

              <div className="mt-auto p-8 border-t border-surface_dim space-y-6">
                 <LanguageSwitcher />
                 <form onSubmit={handleSearch} className="flex items-center bg-surface_dim rounded-2xl px-5 py-4 w-full">
                    <Search size={24} className="text-on_surface_variant mr-3" />
                    <input 
                      type="text" 
                      placeholder={t('header.search_placeholder', 'Search sweets...')} 
                      className="bg-transparent border-none outline-none text-base font-bold text-on_surface w-full placeholder-on_surface_variant"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </form>
              </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface_container_lowest mt-auto border-t border-surface_container pt-20 pb-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Branding */}
            <div className="flex flex-col gap-6">
              <LocalizedLink to="/" className="text-primary group">
                <span className="font-black text-3xl tracking-tight">CandyShop</span>
              </LocalizedLink>
              <p className="text-on_surface_variant font-medium leading-relaxed max-w-xs">
                {t('footer.tagline', 'Spreading joy one gummy at a time since 2024. Your daily dose of sweetness delivered.')}
              </p>
            </div>
 
            {/* Quick Links */}
            <div>
              <h4 className="font-black text-on_surface text-lg mb-6">{t('footer.links_title', 'Quick Links')}</h4>
              <ul className="space-y-4">
                 <li><LocalizedLink to="/shop" className="text-on_surface_variant hover:text-secondary font-bold transition-colors">{t('footer.shop_all', 'Shop All')}</LocalizedLink></li>
                 <li><LocalizedLink to="/contact" className="text-on_surface_variant hover:text-secondary font-bold transition-colors">{t('footer.contact_us', 'Contact Us')}</LocalizedLink></li>
              </ul>
            </div>
 

          </div>
          
          <div className="border-t border-surface_container_high pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-on_surface text-sm font-black">
              © 2024 CandyShop Storefront. Stay sweet!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
