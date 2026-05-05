import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Camera, Save, Info, Gift
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '../../utils/toastUtils';
import PageTransition from '../../components/layout/PageTransition';

const UserProfile = () => {
  const { t } = useTranslation();
  const { lang = 'vi' } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    dob: currentUser?.dob || '',
    address: currentUser?.address || '',
    avatarUrl: currentUser?.avatarUrl || ''
  });

  React.useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        dob: currentUser.dob || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || ''
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    // TODO: Persist profileData to backend (e.g., via API)
    showSuccessToast(t('profile.save_success', 'Sweet! Your changes have been saved. 🍬'));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  // Avatar handlers
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatarUrl: url }));
    }
  };

  const handleRemoveAvatar = () => {
    setProfileData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[45px] border border-surface_container/20 shadow-sm relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 w-full">
            <h2 className="text-secondary font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-xs mb-2 sm:mb-3">{getGreeting()}, {currentUser?.name || 'Bạn'}!</h2>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-on_surface tracking-tight mb-6 md:mb-4 leading-[1.1] sm:leading-tight break-words">
              {currentUser?.role === 'admin' ? 'Hệ thống Quản trị' : currentUser?.role === 'staff' ? 'Bàn làm việc Staff' : 'Trang cá nhân'}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-0">
              <Badge variant="surface" className="bg-primary/10 text-primary border-none font-black px-3 sm:px-4 py-1 sm:py-1.5 uppercase text-[8px] sm:text-[10px] whitespace-nowrap">
                ROLE: {currentUser?.role?.toUpperCase() || 'CUSTOMER'}
              </Badge>
              {currentUser?.role === 'admin' && (
                <Link to="/admin">
                  <Badge variant="primary" className="bg-on_surface text-white border-none font-black px-3 sm:px-4 py-1 sm:py-1.5 uppercase text-[8px] sm:text-[10px] hover:bg-primary transition-colors cursor-pointer whitespace-nowrap">
                    Mở Admin Panel
                  </Badge>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button onClick={handleSave} className="bg-primary text-white font-black py-2.5 sm:py-3 px-6 sm:px-8 rounded-[18px] sm:rounded-[20px] flex items-center justify-center gap-2.5 shadow-lg hover:scale-105 transition-all w-fit mx-auto sm:mx-0 uppercase text-[10px] sm:text-xs tracking-widest active:scale-95">
              <Save size={16} className="sm:size-18" strokeWidth={3} /> {t('common.save', 'Save Changes')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
          <div className="lg:col-span-4 h-full">
            <div className="bg-[#FFF0F8] rounded-[32px] sm:rounded-[45px] p-8 sm:p-10 flex flex-col items-center text-center h-full shadow-sm border border-primary/5">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img src={profileData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'User'}`}
                       alt="Profile Large"
                       className="w-full h-full object-cover bg-white" />
                </div>
                <input type="file"
                       accept="image/*"
                       id="avatarInput"
                       className="hidden"
                       onChange={handleAvatarChange} />
                <button type="button"
                        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl hover:scale-110 transition-transform"
                        onClick={() => document.getElementById('avatarInput').click()}>
                  <Camera size={18} strokeWidth={2.5} />
                </button>
                {profileData.avatarUrl && (
                  <button type="button"
                          className="mt-3 text-xs font-black text-primary hover:underline underline-offset-8 uppercase tracking-widest"
                          onClick={handleRemoveAvatar}>
                    {t('profile.remove_photo', 'Remove Photo')}
                  </button>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-on_surface mb-1 uppercase tracking-tight">{currentUser?.name || 'User'}</h3>
              <p className="text-[10px] sm:text-sm font-bold text-on_surface_variant opacity-60 tracking-widest mb-6 sm:mb-10 uppercase">{t('profile.rank', 'Pro Caramel Taster')}</p>
            </div>
          </div>

          <div className="lg:col-span-8 h-full">
            <div className="bg-white rounded-[32px] sm:rounded-[45px] p-6 sm:p-10 lg:p-14 h-full shadow-sm border border-surface_container/20">
              <div className="flex items-center gap-4 mb-8 sm:mb-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#f5f0fa] text-[#8e44ad] flex items-center justify-center">
                  <User size={20} className="sm:size-24" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-on_surface tracking-tight uppercase">{t('profile.basic_info', 'Basic Information')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('checkout.full_name', 'Full Name')}</label>
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('checkout.full_name')} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.email', 'Email Address')}</label>
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('profile.email')} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.phone', 'Phone Number')}</label>
                  <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.dob', 'Date of Birth')}</label>
                  <input type="text" value={profileData.dob} onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="DD/MM/YYYY" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.address', 'Shipping Address')}</label>
                  <input type="text" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} className="w-full bg-[#fbf9fc] border-none rounded-[20px] px-8 py-5 text-sm font-bold text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder={t('profile.address_placeholder', 'Where should we send your treats?')} />
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
