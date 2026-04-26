import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

/**
 * TopUtilityBar - Persistent navigation bar for the Admin Dashboard.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.placeholder - Search bar placeholder text.
 */
const TopUtilityBar = ({ placeholder = "Search everything..." }) => {
  return (
    <div className="w-full bg-white/40 backdrop-blur-md border-b border-surface_container sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
        {/* Left: Search Section */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant/40" size={18} />
            <input 
              type="text" 
              placeholder={placeholder}
              className="w-full bg-surface_dim/50 py-2.5 pl-12 pr-4 rounded-2xl outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-sm"
            />
          </div>
        </div>
        
        {/* Middle: Spacer/Logo Option */}
        <div className="flex items-center justify-center gap-10 w-1/3">
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-6 w-1/3">
          <button className="p-3 bg-surface_dim rounded-2xl hover:bg-primary/5 transition-colors relative group">
            <Bell size={20} className="text-on_surface_variant group-hover:text-primary transition-colors" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
          <button className="p-3 bg-surface_dim rounded-2xl hover:bg-primary/5 transition-colors group">
            <Settings size={20} className="text-on_surface_variant group-hover:rotate-45 transition-transform duration-500" />
          </button>
          <div className="w-px h-8 bg-surface_container"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-sm font-black text-on_surface uppercase leading-none">Alex Sweet</p>
              <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest mt-1">Senior Curator</p>
            </div>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 p-0.5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexSweet" className="w-full h-full object-cover rounded-[14px]" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
