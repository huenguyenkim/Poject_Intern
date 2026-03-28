import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'My Orders', path: '/profile/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/profile/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="flex bg-[#fdfaff] font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-[#ece8f1] flex flex-col hidden lg:flex">
        {/* User Profile Summary */}
        <div className="p-10 flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#2d2a4a] border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=SweetTooth"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10b981] border-2 border-white rounded-full"></div>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#2d2a4a] tracking-tight">Sweet Tooth</h2>
            <p className="text-[10px] font-black text-[#cc9900] bg-[#fff9e6] px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              GOLD MEMBER
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all group ${
                  isActive 
                  ? 'bg-[#ffeef4] text-[#f13a7b]' 
                  : 'text-[#8e8a9d] hover:bg-[#fdfaff] hover:text-[#2d2a4a]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? 'text-[#f13a7b]' : 'text-[#b0a9bc] group-hover:text-[#2d2a4a]'} />
                  <span className="text-[15px]">{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#f13a7b]"></div>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-[#ece8f1]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[#8e8a9d] hover:bg-[#fff0f3] hover:text-[#f13a7b] transition-all group"
          >
            <LogOut size={20} className="text-[#b0a9bc] group-hover:text-[#f13a7b]" />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0 bg-[#fdfaff]">
        <div className="max-w-[1200px] mx-auto p-10 lg:p-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
