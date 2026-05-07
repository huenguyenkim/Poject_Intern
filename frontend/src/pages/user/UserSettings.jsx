import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { 
  Shield, Bell, Lock, Globe, UserX, ChevronRight, Eye, Mail, Smartphone, Share2, Check, Save
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import PageTransition from '../../components/layout/PageTransition';

const UserSettings = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  
  // State for password fields
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async () => {
    // 1. Client-side validation
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      showErrorToast(t('settings.password_missing'));
      return;
    }
    
    // Check password strength (client side)
    if (passwordInfo.newPassword.length < 8) {
      showErrorToast(t('settings.password_weak'));
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      showErrorToast(t('settings.password_mismatch'));
      return;
    }

    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
        confirmPassword: passwordInfo.confirmPassword
      });

      if (response.data.success) {
        showSuccessToast(t('settings.password_updated'));
        setPasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        // Log out immediately to enforce session invalidation
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = `/${lang || 'vi'}/auth/login`;
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || t('common.error');
      showErrorToast(`${t('common.error')}: ${message}`);
    }
  };

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on_surface tracking-tight mb-2 uppercase">{t('settings.title')}</h1>
        </div>
 
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] sm:rounded-[45px] p-6 sm:p-10 lg:p-14 shadow-sm border border-surface_container/20">
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fff0f5] text-[#d81b60] flex items-center justify-center border border-pink-100">
                <Shield size={20} className="sm:size-24" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on_surface tracking-tight uppercase">{t('settings.security_settings')}</h2>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 sm:gap-y-10">
              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('settings.current_password')}</label>
                <input 
                  type="password" 
                  value={passwordInfo.currentPassword} 
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })} 
                  className="w-full bg-[#fbf9fc] border border-surface_container/30 rounded-[18px] sm:rounded-[22px] px-6 sm:px-8 py-4 sm:py-5 text-sm text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" 
                  placeholder={t('settings.current_password_placeholder')} 
                />
              </div>
 
              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('settings.new_password')}</label>
                <input 
                  type="password" 
                  value={passwordInfo.newPassword} 
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })} 
                  className="w-full bg-[#fbf9fc] border border-surface_container/30 rounded-[18px] sm:rounded-[22px] px-6 sm:px-8 py-4 sm:py-5 text-sm text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" 
                  placeholder={t('settings.new_password_placeholder')} 
                />
              </div>
 
              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('settings.confirm_password')}</label>
                <input 
                  type="password" 
                  value={passwordInfo.confirmPassword} 
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })} 
                  className="w-full bg-[#fbf9fc] border border-surface_container/30 rounded-[18px] sm:rounded-[22px] px-6 sm:px-8 py-4 sm:py-5 text-sm text-on_surface outline-none focus:ring-4 focus:ring-primary/5 transition-all" 
                  placeholder={t('settings.confirm_password_placeholder')} 
                />
              </div>
 
              <div className="flex items-end pt-2 sm:pt-0">
                <button 
                  type="button" 
                  onClick={handleChangePassword} 
                  className="w-full bg-primary text-white font-black py-4 sm:py-5 px-8 rounded-[18px] sm:rounded-[22px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs sm:text-sm"
                >
                  {t('settings.update_password')}
                </button>
              </div>
 
              <div className="col-span-1 md:col-span-2 mt-2 sm:mt-4 p-5 sm:p-6 bg-primary/5 rounded-[20px] sm:rounded-[25px] border border-primary/10">
                <p className="text-[10px] sm:text-[12px] font-bold text-primary/70 leading-relaxed uppercase tracking-tight">
                  ⚠️ {t('settings.security_notice')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center space-y-8">
          <p className="text-[12px] font-black text-on_surface_variant opacity-40 uppercase tracking-[0.2em]">{t('settings.auto_save')}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">{t('settings.terms')}</button>
            <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">{t('settings.privacy_policy')}</button>
            <button className="text-[11px] font-black text-primary hover:text-primary/70 uppercase tracking-[0.15em] transition-colors">{t('settings.cookie_policy')}</button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserSettings;
