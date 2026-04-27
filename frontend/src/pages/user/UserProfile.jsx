import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Camera, Save, Info, Gift
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

const UserProfile = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    dob: currentUser?.dob || '',
    address: currentUser?.address || ''
  });

  React.useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        dob: currentUser.dob || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    showSuccessToast(t('profile.save_success', 'Sweet! Your changes have been saved. 🍬'));
  };

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-primary tracking-tight mb-2 uppercase">{t('profile.title', 'My Profile')}</h1>
            <p className="text-on_surface_variant font-bold text-lg opacity-60">{t('profile.subtitle', 'Manage your account details and candy preferences.')}</p>
          </div>
          <button onClick={handleSave} className="bg-primary text-white font-black py-4 px-10 rounded-[22px] flex items-center gap-3 shadow-xl hover:scale-105 transition-all w-fit uppercase text-sm tracking-widest">
            <Save size={20} strokeWidth={3} /> {t('common.save', 'Save Changes')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-4 h-full">
            <div className="bg-[#FFF0F8] rounded-[45px] p-10 flex flex-col items-center text-center h-full shadow-sm border border-primary/5">
              <div className="relative mb-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'User'}`} alt="Profile Large" className="w-full h-full object-cover bg-white" />
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl hover:scale-110 transition-transform">
                  <Camera size={20} strokeWidth={2.5} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-on_surface mb-1 uppercase tracking-tight">{currentUser?.name || 'User'}</h3>
              <p className="text-sm font-bold text-on_surface_variant opacity-60 tracking-widest mb-10 uppercase">{t('profile.rank', 'Pro Caramel Taster')}</p>
              <button className="text-sm font-black text-primary hover:underline underline-offset-8 mt-auto uppercase tracking-widest">{t('profile.remove_photo', 'Remove Photo')}</button>
            </div>
          </div>

          <div className="lg:col-span-8 h-full">
            <div className="bg-white rounded-[45px] p-10 lg:p-14 h-full shadow-sm border border-surface_container/20">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f0fa] text-[#8e44ad] flex items-center justify-center">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-on_surface tracking-tight uppercase">{t('profile.basic_info', 'Basic Information')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('checkout.full_name', 'Full Name')}</label>
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('checkout.full_name')} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.email', 'Email Address')}</label>
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('profile.email')} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.phone', 'Phone Number')}</label>
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-sm border border-surface_container/20 h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center">
                  <Info size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-on_surface tracking-tight uppercase">{t('profile.additional_info', 'Additional Information')}</h2>
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.bio', 'Bio')}</label>
                  <textarea value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[30px] px-8 py-6 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all h-32 resize-none leading-relaxed" placeholder={t('profile.bio_placeholder', 'Tell us about your sweet tooth...')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 relative">
                    <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.dob', 'Date of Birth')}</label>
                    <input type="text" value={profileData.dob} onChange={(e) => setProfileData({...profileData, dob: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="DD/MM/YYYY" />
                    <Calendar size={18} className="absolute right-6 bottom-5 text-on_surface_variant/40" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.address', 'Shipping Address')}</label>
                    <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('profile.address_placeholder', 'Where should we send your treats?')} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-primary via-[#d81b60] to-[#8e24aa] rounded-[45px] p-10 flex flex-col h-full text-white shadow-xl overflow-hidden relative group">
              <Gift size={160} className="absolute -bottom-10 -right-10 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10 h-full flex flex-col">
                <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight uppercase">{t('profile.rewards', 'Member Rewards')}</h2>
                <p className="text-lg font-bold text-white/80 mb-12">{t('profile.points_msg', 'You have')} <span className="text-white text-2xl">2,450</span> {t('profile.points', 'points')}</p>
                <div className="mt-auto space-y-4">
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full"></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{t('profile.next_reward', 'Next Reward: Free Taffy Box')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfile;
;
