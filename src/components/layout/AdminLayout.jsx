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
          <div className="bg-[#f13a7b] p-2 rounded-2xl shadow-lg shadow-pink-200">
            <Candy size={24} className="text-white" />
          </div>
          <div>
            <span className="font-black text-xl text-[#2d2a4a] tracking-tight block leading-none">Candy Admin</span>
            <span className="text-[10px] font-bold text-[#b0a9bc] uppercase tracking-[0.1em] mt-1 block">MANAGE JOY</span>
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
                ? 'bg-[#f4ebff] text-[#7c3aed]' 
                : 'text-[#8e8a9d] hover:bg-[#fdfaff] hover:text-[#2d2a4a]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#7c3aed]' : 'text-[#b0a9bc]'} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 space-y-4 border-t border-[#ece8f1]">
        <button className="w-full bg-[#f13a7b] hover:bg-[#d92d6a] text-white py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-pink-100 transition-all bouncy-hover">
          <span className="text-xl">+</span> Add Product
        </button>

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d2a4a] flex items-center justify-center overflow-hidden border-2 border-[#ece8f1]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-[#2d2a4a] leading-none">Alex Sweet</p>
              <p className="text-[11px] font-bold text-[#b0a9bc] mt-1">Senior Curator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-[#b0a9bc] hover:text-[#f13a7b] transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#fdfaff] font-sans overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-500 ease-candy lg:relative lg:translate-x-0 lg:z-0 lg:flex lg:flex-col lg:border-r lg:border-[#ece8f1] ${isMobileMenuOpen ? 'translate-x-0 overflow-y-auto flex flex-col' : '-translate-x-full lg:flex'}`}>
        <NavContent />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-[#ece8f1] flex items-center justify-between px-6 shrink-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-[#fdfaff] rounded-xl text-[#2d2a4a] hover:bg-[#f13a7b]/10 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="bg-[#f13a7b] p-1.5 rounded-xl shadow-md">
                <Candy size={20} className="text-white" />
             </div>
             <span className="font-black text-[#2d2a4a] tracking-tight">Candy Admin</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#fdfaff] border border-[#ece8f1] flex items-center justify-center">
             <Bell size={18} className="text-[#b0a9bc]" />
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
