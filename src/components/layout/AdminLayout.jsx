import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Candy, LayoutDashboard, Package, Grid, ShoppingBag, ImagePlus, Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Grid },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Banners', path: '/admin/banners', icon: ImagePlus },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const NavContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-8">
        <Link to="/admin" className="flex items-center gap-3 group" onClick={closeMenu}>
          <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/20">
            <Candy size={24} className="text-on_primary" />
          </div>
          <div>
            <span className="font-black text-xl text-on_surface tracking-tight block leading-none">Candy Admin</span>
            <span className="text-[10px] font-bold text-on_surface_variant uppercase tracking-[0.1em] mt-1 block">MANAGE JOY</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-secondary/10 text-secondary' 
                : 'text-on_surface_variant hover:bg-surface_dim hover:text-on_surface'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-secondary' : 'text-on_surface_variant'} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 space-y-4 border-t border-surface_container">
        <button className="w-full bg-primary hover:opacity-90 text-on_primary py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all bouncy-hover">
          <span className="text-xl">+</span> Add Product
        </button>

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-on_surface flex items-center justify-center overflow-hidden border-2 border-surface_container">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-on_surface leading-none">Alex Sweet</p>
              <p className="text-[11px] font-bold text-on_surface_variant mt-1">Senior Curator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-on_surface_variant hover:text-primary transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-surface_dim font-sans overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-500 ease-candy lg:relative lg:translate-x-0 lg:z-0 lg:flex lg:flex-col lg:border-r lg:border-surface_container ${isMobileMenuOpen ? 'translate-x-0 overflow-y-auto flex flex-col' : '-translate-x-full lg:flex'}`}>
        <NavContent />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-surface_container flex items-center justify-between px-6 shrink-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-surface_dim rounded-xl text-on_surface hover:bg-primary/10 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="bg-primary p-1.5 rounded-xl shadow-md">
                <Candy size={20} className="text-on_primary" />
             </div>
             <span className="font-black text-on_surface tracking-tight">Candy Admin</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-surface_dim border border-surface_container flex items-center justify-center">
             <Bell size={18} className="text-on_surface_variant" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
