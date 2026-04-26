import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Candy, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { showSuccessToast } from '../../utils/toastUtils';
import Clock from '../misc/Clock';

const StorefrontLayout = () => {
  // Use Redux state for cart count
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Consume Auth from Redux
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Close menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input');
    if (emailInput.value) {
      showSuccessToast('Thanks for subscribing to our sweetness! 🍭');
      emailInput.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Promotional Banner */}
      <div className="bg-primary text-on_primary flex justify-center items-center gap-4 py-2 text-sm font-bold tracking-wide">
        <span>🍬 Free shipping on all orders over $50! 🍬</span>
        <Clock prefixLabel="🕒 Server Time: " />
      </div>
      
      {/* Header */}
      <header className="bg-surface_container_lowest border-b border-surface_container sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2 text-primary group bouncy-hover">
                <span className="font-black text-2xl tracking-tight text-primary">CandyShop</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6 items-center">
                <Link to="/" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname === '/' ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>Home</Link>
                 <Link to="/shop" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname.startsWith('/shop') ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>Shop</Link>
                 <Link to="/contact" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname === '/contact' ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>Contact</Link>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-surface_container_high rounded-full px-4 py-2 w-72 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                <button type="submit" aria-label="Search">
                  <Search size={24} className="text-on_surface_variant mr-2" />
                </button>
                <input 
                  type="text" 
                  placeholder="Search sweets..." 
                  className="bg-transparent border-none outline-none text-sm font-bold text-on_surface w-full placeholder-on_surface_variant"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="flex items-center space-x-4">
                <Link to="/cart" className="p-2 text-primary hover:text-primary/70 transition-colors relative bouncy-hover block" aria-label="Shopping Cart">
                  <ShoppingCart size={28} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-on_primary transform translate-x-1/3 -translate-y-1/3 bg-secondary rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to={currentUser ? '/profile' : '/auth'} className="p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover hidden sm:block" aria-label="User Profile">
                  <User size={28} />
                </Link>
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

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <div className={`absolute inset-0 bg-on_surface/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
           <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 border-b border-surface_dim flex justify-between items-center">
                 <span className="font-black text-2xl tracking-tight text-primary">Menu</span>
                 <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface_dim text-on_surface_variant">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
              </div>
              
              <nav className="p-8 space-y-6">
                 <Link to="/" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">Home</Link>
                  <Link to="/shop" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">Shop</Link>
                  <Link to="/contact" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">Contact</Link>
                 <Link to="/cart" className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">Cart</Link>
                 <Link to={currentUser ? '/profile' : '/auth'} className="block text-2xl font-black text-on_surface hover:text-primary transition-colors">
                    {currentUser ? 'My Profile' : 'Sign In'}
                 </Link>
              </nav>

              <div className="mt-auto p-8 border-t border-surface_dim">
                 <form onSubmit={handleSearch} className="flex items-center bg-surface_dim rounded-2xl px-5 py-4 w-full">
                    <Search size={24} className="text-on_surface_variant mr-3" />
                    <input 
                      type="text" 
                      placeholder="Search sweets..." 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {/* Branding */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="text-primary group">
                <span className="font-black text-3xl tracking-tight">CandyShop</span>
              </Link>
              <p className="text-on_surface_variant font-medium leading-relaxed max-w-xs">
                Spreading joy one gummy at a time since 2024. Your daily dose of sweetness delivered.
              </p>
            </div>
 
            {/* Quick Links */}
            <div>
              <h4 className="font-black text-on_surface text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                 <li><Link to="/shop" className="text-on_surface_variant hover:text-secondary font-bold transition-colors">Shop All</Link></li>
                 <li><Link to="/contact" className="text-on_surface_variant hover:text-secondary font-bold transition-colors">Contact Us</Link></li>
              </ul>
            </div>
 
            {/* Newsletter */}
            <div>
              <h4 className="font-black text-on_surface text-lg mb-6">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex bg-surface_container_high rounded-full p-1 border-2 border-surface_container_high focus-within:border-secondary transition-all">
                <input 
                  type="email" 
                  placeholder="Sweet emails..." 
                  className="bg-transparent border-none outline-none px-5 py-3 text-sm font-bold text-on_surface w-full placeholder-on_surface_variant/50"
                  required
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="bg-primary text-on_primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
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
