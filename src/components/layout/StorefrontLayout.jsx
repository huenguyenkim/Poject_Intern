import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Candy, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const StorefrontLayout = () => {
  const { cartCount } = useCart();
  const location = useLocation();

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
                <Link to="/deals" className={`font-bold transition-colors pb-1 border-b-2 ${location.pathname === '/deals' ? 'text-primary border-primary' : 'text-on_surface border-transparent hover:text-primary'}`}>Deals</Link>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center bg-surface_container_high rounded-full px-4 py-2 w-72 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                <Search size={20} className="text-on_surface_variant mr-2" />
                <input 
                  type="text" 
                  placeholder="Search sweets..." 
                  className="bg-transparent border-none outline-none text-sm font-bold text-on_surface w-full placeholder-on_surface_variant"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Link to="/cart" className="p-2 text-primary hover:text-primary/70 transition-colors relative bouncy-hover block">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-on_primary transform translate-x-1/3 -translate-y-1/3 bg-secondary rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/auth" className="p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover hidden sm:block">
                  <User size={24} />
                </Link>
                <button className="md:hidden p-2 text-primary hover:text-primary/70 transition-colors bouncy-hover">
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
      <footer className="bg-surface_container_lowest mt-auto border-t border-surface_container pt-12">
        <div className="max-w-[1280px] mx-auto px-4 pb-12">
          
          {/* Newsletter Box */}
          <div className="border-[3px] border-dashed border-primary/30 rounded-[40px] p-12 md:p-16 relative overflow-hidden bg-white max-w-5xl mx-auto text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-tl-full translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6">
                {/* SVG for Gift icon to match image slightly better */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e040a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <polyline points="20 12 20 22 4 22 4 12"></polyline>
                  <rect x="2" y="7" width="20" height="5"></rect>
                  <line x1="12" y1="22" x2="12" y2="7"></line>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
              </div>
              <h2 className="text-4xl font-black text-on_surface mb-4 tracking-tight">Don't miss a sweet beat!</h2>
              <p className="text-on_surface_variant mb-8 max-w-lg text-base">
                Join our Candy Club and get a 15% discount on your first order plus exclusive access to secret flavors.
              </p>
              
              <div className="flex flex-col sm:flex-row max-w-xl mx-auto items-center gap-4 w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-6 py-4 rounded-full bg-surface_container_high text-sm font-bold text-on_surface focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-auto"
                />
                <button className="bg-primary text-white rounded-full px-8 py-4 font-bold text-sm tracking-wide hover:shadow-tinted-primary hover:-translate-y-0.5 transition-all w-full sm:w-auto whitespace-nowrap">
                  JOIN THE CLUB
                </button>
              </div>
            </div>
          </div>
          
          <p className="mt-12 text-center text-sm text-on_surface_variant font-medium">
            © 2024 CandyShop Storefront. Stay sweet!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
