import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Candy, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const StorefrontLayout = () => {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input');
    if (emailInput.value) {
      toast.success('Thanks for subscribing to our sweetness!');
      emailInput.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Promotional Banner */}
      <div className="bg-primary text-on_primary text-center py-2 text-sm font-bold tracking-wide">
        🍬 Free shipping on all orders over $50! 🍬
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
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-surface_container_high rounded-full px-4 py-2 w-72 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                <button type="submit" aria-label="Search">
                  <Search size={20} className="text-on_surface_variant mr-2" />
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
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-on_primary transform translate-x-1/3 -translate-y-1/3 bg-secondary rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to={currentUser ? '/profile' : '/auth'} className="p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover hidden sm:block" aria-label="User Profile">
                  <User size={24} />
                </Link>
                <button className="md:hidden p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover" aria-label="Open menu">
                  <Menu size={24} />
                </button>
              </div>
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
              <h4 className="font-black text-[#2d2a4a] text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/shop" className="text-on_surface_variant hover:text-secondary font-bold transition-colors">Shop All</Link></li>
              </ul>
            </div>
 
            {/* Newsletter */}
            <div>
              <h4 className="font-black text-[#2d2a4a] text-lg mb-6">Newsletter</h4>
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
                  className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
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
            <p className="text-black text-sm font-black">
              © 2024 CandyShop Storefront. Stay sweet!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
