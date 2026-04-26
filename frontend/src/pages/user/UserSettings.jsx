import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  UserX,
  ChevronRight,
  Eye,
  Mail,
  Smartphone,
  Share2,
  Check
} from 'lucide-react';
import { showSuccessToast } from '../../utils/toastUtils';

/**
 * UserSettings: Ultra-premium version matching the design image precisely.
 * Implements advanced account configuration, security, and preference settings.
 */
const UserSettings = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [smsUpdates, setSmsUpdates] = useState(false);

  const handleToggle = (setter, label) => {
    setter(prev => {
      const newValue = !prev;
      showSuccessToast(`${label} ${newValue ? 'enabled' : 'disabled'}! ✨`);
      return newValue;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-on_surface tracking-tight mb-2">User Settings</h1>
      </div>

      <div className="space-y-8">
        
        {/* 1. Account & Security (Top Wide Card) */}
        <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-sm border border-surface_container/20">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-[#fff0f5] text-[#d81b60] flex items-center justify-center border border-pink-100">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-on_surface tracking-tight">Account & Security</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Password & 2FA */}
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Change Password</label>
                <div className="relative group">
                  <input 
                    type="text"
                    disabled
                    value="Update your security key"
                    className="w-full bg-[#fcf9fc] border border-surface_container/30 rounded-[22px] px-8 py-5 text-sm font-bold text-on_surface/40 cursor-pointer group-hover:bg-[#f5f0f6] transition-all outline-none"
                  />
                  <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="bg-[#fff0f8]/40 rounded-[35px] p-8 flex items-center justify-between border border-primary/5">
                <div>
                  <h4 className="font-black text-on_surface text-lg mb-1">Two-Factor Authentication</h4>
                  <p className="text-sm font-bold text-on_surface_variant opacity-60 leading-relaxed max-w-[280px]">Add an extra layer of candy-coated protection</p>
                </div>
                <div 
                  className={`w-16 h-9 rounded-full relative cursor-pointer transition-all duration-500 shadow-inner ${twoFactor ? 'bg-primary' : 'bg-surface_container'}`}
                  onClick={() => handleToggle(setTwoFactor, 'Two-factor auth')}
                >
                  <div className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-lg transition-all duration-500 transform ${twoFactor ? 'translate-x-8' : 'translate-x-1'}`} />
                </div>
              </div>
            </div>

            {/* Right: Social Connections */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Social Connections</label>
              <div className="space-y-4">
                <div className="bg-[#fcf9fc] border border-surface_container/30 rounded-[25px] px-8 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">
                      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <span className="font-bold text-sm text-on_surface opacity-80 tracking-tight">Google Account</span>
                  </div>
                  <div className="bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Connected</span>
                  </div>
                </div>
                <div className="bg-[#fcf9fc] border border-surface_container/30 rounded-[25px] px-8 py-5 flex items-center justify-between group cursor-pointer hover:bg-[#f5f0f6] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-[#1877F2]">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="font-bold text-sm text-on_surface opacity-80 tracking-tight">Facebook Account</span>
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:scale-105 transition-transform">Connect</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Notifications & Privacy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Notifications Card */}
          <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-sm border border-surface_container/20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-[#f0f4ff] text-[#4d79ff] flex items-center justify-center">
                <Bell size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-on_surface tracking-tight">Notifications</h2>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Email Alerts', sub: 'Weekly candy drops & offers', state: emailAlerts, setter: setEmailAlerts },
                { label: 'Push Notifications', sub: 'Order status & shipping info', state: pushNotifs, setter: setPushNotifs },
                { label: 'SMS Updates', sub: 'Flash sale alerts', state: smsUpdates, setter: setSmsUpdates },
              ].map((item) => (
                <div 
                  key={item.label}
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => handleToggle(item.setter, item.label)}
                >
                  <div className="space-y-0.5">
                    <h5 className="font-black text-on_surface text-lg leading-tight">{item.label}</h5>
                    <p className="text-[12px] font-bold text-on_surface_variant opacity-50">{item.sub}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${item.state ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface_dim border-surface_container/40 group-hover:border-primary/40'}`}>
                    {item.state && <Check size={16} className="text-white" strokeWidth={4} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-sm border border-surface_container/20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-[#e0f7fa] text-[#00acc1] flex items-center justify-center">
                <Eye size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-on_surface tracking-tight">Privacy</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Profile Visibility</label>
                <div className="relative group">
                  <select className="w-full bg-[#fcf9fc] border border-surface_container/30 rounded-[22px] px-8 py-5 text-sm font-bold text-on_surface outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-primary/5 transition-all">
                    <option>Public-Everyone can see your candy favorites</option>
                    <option>Private-Only you can see your list</option>
                    <option>Friends Only-Share with your sweet group</option>
                  </select>
                  <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-on_surface_variant/40 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-start gap-5 pt-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-xl border-2 border-surface_container/40 bg-surface_dim shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors" />
                <p className="text-[13px] font-bold text-on_surface_variant opacity-60 leading-relaxed">
                  Allow CandyShop to personalize my experience based on browsing activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Language & Region (Bottom Wide Card) */}
        <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-sm border border-surface_container/20">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
              <Globe size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-on_surface tracking-tight">Language & Region</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Display Language</label>
              <div className="relative group">
                <select className="w-full bg-[#fcf9fc] border border-surface_container/30 rounded-[22px] px-8 py-5 text-sm font-bold text-on_surface outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-primary/5 transition-all">
                  <option>English (United States)</option>
                  <option>Vietnamese (Vietnam)</option>
                  <option>French (France)</option>
                </select>
                <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-on_surface_variant/40 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Timezone</label>
              <div className="relative group">
                <select className="w-full bg-[#fcf9fc] border border-surface_container/30 rounded-[22px] px-8 py-5 text-sm font-bold text-on_surface outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-primary/5 transition-all">
                  <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                  <option>(GMT+07:00) Indochina Time (Bangkok, Hanoi)</option>
                </select>
                <ChevronRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-on_surface_variant/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Deactivate Account (Footer Card) */}
        <div className="bg-[#fff0f3]/50 border-2 border-dashed border-primary/20 rounded-[45px] p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[30px] bg-white flex items-center justify-center text-[#d32f2f] shadow-sm border border-red-50">
              <UserX size={38} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Deactivate Account</h3>
              <p className="text-sm font-bold text-on_surface_variant opacity-60 max-w-md leading-relaxed">
                Taking a break? This will temporarily hide your profile and candy reviews from other members. You can return anytime.
              </p>
            </div>
          </div>
          <button className="bg-primary text-white font-black py-5 px-12 rounded-[25px] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap text-lg transform hover:scale-105 active:scale-95">
            Deactivate Account
          </button>
        </div>

      </div>

      {/* Page Footer */}
      <div className="mt-20 text-center space-y-8">
        <p className="text-[12px] font-black text-on_surface_variant opacity-40 uppercase tracking-[0.2em]">All changes are automatically saved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">Terms of Sweetness</button>
          <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">Candy Privacy Policy</button>
          <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">Cookie Crumbs</button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
