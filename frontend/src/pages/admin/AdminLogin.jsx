import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate, Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { 
  Candy, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  Store,
  ShieldCheck,
  Zap,
  RefreshCw,
  X,
  Timer,
  Globe
} from 'lucide-react';
import { loginUserThunk, logoutUserThunk, requestPasswordResetThunk, resetPasswordThunk } from '../../store/authThunks';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Validation Schema
const loginSchema = (t) => z.object({
  email: z.string().email(t('admin_login.invalid_email', 'Please enter a valid admin email')),
  password: z.string().min(1, t('admin_login.password_required', 'Secret key is required')),
  rememberMe: z.boolean().optional(),
});

import LanguageSwitcher from '../../components/navigation/LanguageSwitcher';

const AdminLogin = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [expiryTimer, setExpiryTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  
  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUserThunk({ 
        email: data.email, 
        password: data.password,
        rememberMe: data.rememberMe,
      })).unwrap();
      
      if (result.user.role !== 'admin' && result.user.role !== 'staff') {
        await dispatch(logoutUserThunk());
        showErrorToast(t('admin_login.unauthorized'));
        return;
      }

      showSuccessToast(t('admin_login.granted'));
      navigate(`/${lang}/admin`, { replace: true });
    } catch (err) {
      showErrorToast(err || t('admin_login.invalid'));
    }
  };

  // Dual Timer Effect
  useEffect(() => {
    let interval;
    if (expiryTimer > 0 || resendTimer > 0) {
      interval = setInterval(() => {
        setExpiryTimer(prev => (prev > 0 ? prev - 1 : 0));
        setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer, resendTimer]);

  const resetToken = otpArray.join('');

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpArray];
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    const newOtp = [...otpArray];
    pasteData.forEach((char, i) => {
      if (!isNaN(char)) newOtp[i] = char;
    });
    setOtpArray(newOtp);
    if (pasteData.length > 0) {
      const nextIndex = Math.min(pasteData.length, 5);
      otpRefs.current[nextIndex].focus();
    }
  };

  const requestPasswordReset = async () => {
    try {
      const result = await dispatch(requestPasswordResetThunk(resetEmail)).unwrap();
      setRecoveryMode('reset');
      setOtpArray(['', '', '', '', '', '']); // Clear OTP for security
      setExpiryTimer(180); // 3 minutes total life
      setResendTimer(60);   // 60 seconds cooldown for resend button
      showSuccessToast(t('admin_login.check_email'));
    } catch (err) {
      showErrorToast(err || t('common.error'));
    }
  };

  const resetPassword = async () => {
    if (resetToken.length < 6) {
      showErrorToast(t('admin_login.otp_label'));
      return;
    }
    if (expiryTimer === 0) {
      showErrorToast(t('admin_login.otp_expired'));
      return;
    }
    try {
      await dispatch(resetPasswordThunk({ 
        email: resetEmail, 
        otp: resetToken, 
        newPassword 
      })).unwrap();
      
      showSuccessToast(t('profile.save_success'));
      setRecoveryMode(null);
      setNewPassword('');
      navigate(`/${lang}/admin`, { replace: true });
    } catch (err) {
      showErrorToast(err || t('common.error'));
    }
  };

  if (currentUser && currentUser.role === 'admin') {
    return <Navigate to={`/${lang}/admin`} replace />;
  }

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-10 md:px-20 lg:px-24 relative bg-[#fcf9fc]">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
        
        <div className="max-w-md w-full mx-auto space-y-12">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link to={`/${lang}`} className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform">
                  <Candy size={26} strokeWidth={3} />
                </div>
                <span className="text-2xl font-black text-on_surface tracking-tight uppercase italic">CandyAdmin</span>
              </Link>
              <div className="lg:hidden">
                <LanguageSwitcher />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-on_surface tracking-tighter leading-tight">
                {recoveryMode ? t('admin_login.recovery') : t('admin_login.welcome')} <span className="text-primary">{recoveryMode ? '' : t('admin_login.sweet_admin')}</span>
              </h1>
              <p className="text-on_surface_variant font-bold text-lg opacity-60">
                {recoveryMode ? t('admin_login.recovery_tagline') : t('admin_login.tagline')}
              </p>
            </div>
          </div>

          {!recoveryMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input 
                label={t('admin_login.email_label')}
                type="email" 
                {...register('email')}
                placeholder={t('admin_login.email_placeholder')}
                icon={Mail}
                error={errors.email?.message}
              />

              <div className="relative">
                <Input 
                  label={t('admin_login.password_label')}
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder={t('admin_login.password_placeholder')}
                  icon={Lock}
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-[55px] -translate-y-1/2 text-on_surface_variant/40 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="relative grid h-6 w-6 place-items-center rounded-lg border-2 border-surface_container bg-white transition-colors group-hover:border-primary">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="peer absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Check size={14} strokeWidth={4} className="text-primary opacity-0 transition-opacity peer-checked:opacity-100" />
                  </span>
                  <span className="text-sm font-bold text-on_surface_variant group-hover:text-on_surface transition-colors">{t('admin_login.remember_me')}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setRecoveryMode('forgot')}
                  className="text-sm font-black text-primary hover:underline underline-offset-4"
                >
                  {t('admin_login.forgot_password')}
                </button>
              </div>

              <Button 
                type="submit" 
                variant="primary"
                className="w-full py-6 text-lg rounded-[25px] shadow-2xl shadow-primary/20 mt-4 group"
                isLoading={status === 'loading'}
              >
                {t('admin_login.signin_btn')}
                <ArrowRight size={22} strokeWidth={3} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {recoveryMode === 'forgot' ? (
                <div className="space-y-4">
                  <Input
                    label={t('admin_login.recovery_email')}
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    placeholder={t('admin_login.email_placeholder')}
                    icon={Mail}
                  />
                  <Button type="button" variant="primary" className="w-full py-4 rounded-2xl" onClick={requestPasswordReset}>
                    {t('admin_login.send_otp')}
                  </Button>
                  <button 
                    onClick={() => setRecoveryMode(null)}
                    className="w-full text-center text-sm font-bold text-on_surface_variant hover:text-primary transition-colors"
                  >
                    {t('admin_login.back_to_login')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-xs font-bold text-primary flex items-center gap-2">
                      <Zap size={14} fill="currentColor" />
                      {t('admin_login.check_email')}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on_surface_variant uppercase tracking-widest ml-1 opacity-70">{t('admin_login.otp_label')}</label>
                    <div className="flex justify-between gap-2" onPaste={handlePaste}>
                      {otpArray.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => otpRefs.current[idx] = el}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={`w-full aspect-square bg-white border-2 ${expiryTimer === 0 ? 'border-error/20' : 'border-surface_container'} focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-center text-2xl font-black text-on_surface outline-none transition-all shadow-sm`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-on_surface_variant/60 font-bold text-sm bg-surface_container/30 px-3 py-1.5 rounded-full">
                      <Timer size={14} className={expiryTimer > 0 ? "animate-pulse text-primary" : "text-error"} />
                      <span className={expiryTimer === 0 ? "text-error" : ""}>
                        {expiryTimer > 0 ? formatTime(expiryTimer) : "Expired"}
                      </span>
                    </div>
                    {resendTimer === 0 ? (
                      <button 
                        onClick={requestPasswordReset}
                        className="text-sm font-black text-primary hover:text-primary_container transition-colors flex items-center gap-2 underline underline-offset-4"
                      >
                        <RefreshCw size={14} /> {t('admin_login.resend_otp')}
                      </button>
                    ) : (
                      <div className="text-xs font-bold text-on_surface_variant/40 flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin-slow" />
                        {t('admin_login.resend_in')} {resendTimer}s
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 relative">
                    <Input
                      label={t('admin_login.new_password')}
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Min. 8 characters"
                      icon={Lock}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-6 top-[58px] -translate-y-1/2 text-on_surface_variant/40 hover:text-primary transition-colors z-10"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Button 
                      type="button" 
                      variant="primary" 
                      className="w-full py-6 text-lg rounded-[25px] shadow-2xl shadow-primary/20 group" 
                      onClick={resetPassword}
                      disabled={expiryTimer === 0}
                    >
                      {t('admin_login.update_login')}
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <button 
                      onClick={() => setRecoveryMode(null)}
                      className="w-full text-center text-sm font-bold text-on_surface_variant hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={16} /> {t('admin_login.cancel_recovery')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-10 border-t border-surface_container/30 flex items-center justify-between text-xs font-black text-on_surface_variant/40 uppercase tracking-widest">
            <Link to={`/${lang}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Store size={14} />
              {t('admin_login.return_store')}
            </Link>
            <span>v2.5.2-ULTIMATE</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-on_surface">
        <img 
          src="/images/admin_login_hero.png" 
          alt="Candy Kingdom" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-on_surface/80"></div>
        
        {/* Language Switcher for Desktop */}
        <div className="absolute top-10 right-10 z-20">
          <LanguageSwitcher />
        </div>

        <div className="absolute bottom-20 left-20 right-20 space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-xl">
                <Zap size={24} fill="white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-white tracking-tight">Ultimate Security</h3>
                <p className="text-white/60 font-bold text-sm">Protected by independent dual-timer OTP logic.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
