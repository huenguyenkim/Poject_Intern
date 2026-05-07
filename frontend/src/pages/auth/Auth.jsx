import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Candy, Mail, Lock, User as UserIcon, Eye, EyeOff, Check, ArrowRight, ArrowLeft,
  AlertCircle, ShieldCheck, Smartphone, RefreshCw, X, CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { loginUserThunk } from '../../store/authThunks';
import { socialLogin as socialLoginAction, setCredentials } from '../../store/authSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import apiClient from '../../api/apiClient';

// --- SCHEMAS ---
const loginSchema = (t) => z.object({
  email: z.string().min(1, t('auth.email_required', 'Email is required')),
  password: z.string().min(1, t('auth.password_required', 'Password is required')),
});

const registerSchema = (t) => z.object({
  fullName: z.string().min(2, t('auth.name_min', 'Name must be at least 2 characters')),
  email: z.string().min(1, t('auth.email_required', 'Email is required')),
  password: z.string()
    .min(8, t('auth.password_min', 'Password must be at least 8 characters'))
    .regex(/[A-Z]/, t('auth.password_uppercase', 'Need 1 uppercase letter'))
    .regex(/[0-9]/, t('auth.password_number', 'Need 1 number'))
    .regex(/[!@#$%^&*(),.?":{}|<>]/, t('auth.password_special', 'Need 1 special character')),
  confirmPassword: z.string().min(1, t('auth.confirm_password_required', 'Please confirm password')),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwords_dont_match', "Passwords don't match"),
  path: ["confirmPassword"],
});

const recoveryEmailSchema = (t) => z.object({
  email: z.string().min(1, t('auth.email_required', 'Email is required')).email(t('auth.invalid_email', 'Invalid email format')),
});

const resetPasswordSchema = (t) => z.object({
  password: z.string()
    .min(8, t('auth.password_min', 'Password must be at least 8 characters'))
    .regex(/[A-Z]/, t('auth.password_uppercase', 'Need 1 uppercase letter'))
    .regex(/[0-9]/, t('auth.password_number', 'Need 1 number'))
    .regex(/[!@#$%^&*(),.?":{}|<>]/, t('auth.password_special', 'Need 1 special character')),
  confirmPassword: z.string().min(1, t('auth.confirm_password_required', 'Please confirm password')),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwords_dont_match', "Passwords don't match"),
  path: ["confirmPassword"],
});

const Auth = () => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: OTP, 3: Reset, 4: Success
  const [registerStep, setRegisterStep] = useState(1); // 1: Form, 2: OTP
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      isRecovery 
        ? (recoveryStep === 1 ? recoveryEmailSchema(t) : (recoveryStep === 3 ? resetPasswordSchema(t) : z.any()))
        : (isLogin ? loginSchema(t) : registerSchema(t))
    ),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchEmail = watch('email', '');
  const watchPassword = watch('password', '');

  // OTP Timer logic
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setIsRecovery(false);
    setRegisterStep(1);
    setRecoveryStep(1);
    reset();
  };

  const handleForgotPassword = () => {
    setIsRecovery(true);
    setRecoveryStep(1);
    reset();
  };

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLogin && !isRecovery) {
        await dispatch(loginUserThunk({ 
          email: data.email, 
          password: data.password,
          rememberMe: stayLoggedIn
        })).unwrap();
        showSuccessToast(t('auth.login_success', 'Welcome back! 🍭'));
      } else if (!isLogin && !isRecovery) {
        // Register Stage 1: Request OTP
        await apiClient.post('/auth/register/request', data);
        setRegisterStep(2);
        setOtpTimer(60);
        showSuccessToast(t('auth.register_request_success', 'OTP code sent! 🍬'));
      } else if (isRecovery && recoveryStep === 1) {
        // Forgot Password Stage 1: Request OTP
        const response = await apiClient.post('/auth/forgot-password/request', { email: data.email });
        
        // Show OTP in console for DEV testing
        if (response.data.devOtp) {
          console.log('%c [DEV ONLY] OTP Code: ' + response.data.devOtp, 'background: #e040a0; color: #fff; padding: 5px; border-radius: 5px; font-weight: bold;');
        }

        setRecoveryStep(2);
        setOtpTimer(60);
        showSuccessToast(t('admin_login.check_email', 'Check your email for the verification code.'));
      } else if (isRecovery && recoveryStep === 3) {
        // Forgot Password Stage 3: Reset & Auto Login
        const response = await apiClient.post('/auth/forgot-password/reset', {
          email: watchEmail,
          otp: otp.join(''),
          newPassword: data.password
        });
        
        const { user, accessToken } = response.data;
        
        // Persist token (using localStorage by default for recovery auto-login)
        localStorage.setItem('candy_token', accessToken);
        
        // Update Redux state
        dispatch(setCredentials({ user, accessToken }));
        
        showSuccessToast(t('auth.password_reset_success', 'Password reset successful! 🍭'));
        
        // Wait a tiny bit for the user to see the message then redirect
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);

        reset();
      }
    } catch (err) {
      console.error('Auth Error:', err);
      if (isLogin && !isRecovery) {
        showErrorToast(t('auth.failed', 'Invalid credentials'));
      } else {
        showErrorToast(err?.response?.data?.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;
    setLoading(true);

    try {
      if (!isRecovery) {
        const response = await apiClient.post('/auth/register/verify', {
          email: watchEmail,
          otp: otpValue
        });
        const { user, accessToken } = response.data;
        dispatch(setCredentials({ user, accessToken }));
        showSuccessToast(t('auth.register_success', 'Registration successful! 🍬✨'));
        navigate(from, { replace: true });
      } else {
        // Verify OTP for Recovery
        await apiClient.post('/auth/forgot-password/verify', {
          email: watchEmail,
          otp: otpValue
        });
        setRecoveryStep(3);
        showSuccessToast(t('admin_login.granted', 'Verification code correct. Please set a new password.'));
      }
    } catch (err) {
      showErrorToast(err?.response?.data?.message || t('admin_login.otp_expired', 'Invalid or expired OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
    
    if (value && index === 5) {
      const fullOtp = [...newOtp].join('');
      if (fullOtp.length === 6) {
        setTimeout(handleVerifyOtp, 100);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const isLoginActive = watchEmail && watchPassword && !loading;

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#F8F9FB]">
        <div className="max-w-6xl w-full bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
          
          {/* --- LEFT SIDE: BRANDING --- */}
          <div className="w-full md:w-5/12 bg-[#FFF0F5] p-12 lg:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 w-full">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 transform -rotate-6">
                <Candy size={40} className="text-primary" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tighter mb-4 uppercase">CANDYSHOP</h1>
              <p className="text-gray-500 font-bold text-sm lg:text-base uppercase tracking-[0.2em] mb-12">
                {isRecovery ? t('admin_login.recovery') : (isLogin ? t('auth.welcome_back') : t('auth.tagline'))}
              </p>
              
              <div className="hidden md:block w-full max-w-[280px] aspect-square mx-auto bg-white/40 backdrop-blur-md rounded-[40px] p-4 shadow-inner">
                <div className="w-full h-full bg-white/60 rounded-[30px] flex items-center justify-center text-8xl shadow-sm">
                  {isRecovery ? '🔒' : (isLogin ? '🍬' : '✨')}
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTENT --- */}
          <div className="w-full md:w-7/12 p-8 lg:p-20 flex flex-col justify-center">
            
            {((registerStep === 1 && recoveryStep === 1) || (isRecovery && recoveryStep === 3)) ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
                      {isRecovery 
                        ? (recoveryStep === 3 ? t('settings.change_password') : t('admin_login.forgot_password')) 
                        : (isLogin ? t('auth.login') : t('auth.create_account'))}
                    </h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                      {isRecovery 
                        ? (recoveryStep === 3 ? t('admin_login.recovery_tagline') : t('admin_login.tagline'))
                        : (isLogin ? t('auth.login_hint') : t('auth.signup_hint'))}
                    </p>
                  </div>

                  {!isRecovery && (
                    <div className="flex bg-gray-50 p-1.5 rounded-3xl w-full max-w-[360px] shadow-sm">
                      <button type="button" onClick={() => { if(!isLogin) handleToggleMode(); }} className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{t('auth.login')}</button>
                      <button type="button" onClick={() => { if(isLogin) handleToggleMode(); }} className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{t('auth.signup')}</button>
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
                    {(!isLogin && !isRecovery) && (
                      <Input label={t('auth.full_name')} type="text" {...register('fullName')} placeholder={t('checkout.full_name_placeholder')} icon={UserIcon} error={errors.fullName?.message} />
                    )}
                    
                    {(recoveryStep !== 3) && (
                      <Input 
                        label={t('auth.email')} 
                        type="text" 
                        {...register('email')} 
                        placeholder="example@mail.com" 
                        icon={Mail} 
                        error={errors.email?.message} 
                      />
                    )}

                    {isRecovery && recoveryStep === 3 && (
                      <div className="space-y-6">
                        <div className="relative">
                          <Input label={t('admin_login.new_password')} type={showPassword ? "text" : "password"} {...register('password')} placeholder="********" icon={Lock} error={errors.password?.message} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-gray-400 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <div className="relative">
                          <Input label={t('checkout.confirm_order')} type={showConfirmPassword ? "text" : "password"} {...register('confirmPassword')} placeholder="********" icon={Lock} error={errors.confirmPassword?.message} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[42px] text-gray-400 hover:text-primary transition-colors">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {isLogin && !isRecovery && (
                      <div className="space-y-6">
                        <div className="relative">
                          <Input label={t('auth.password')} type={showPassword ? "text" : "password"} {...register('password')} placeholder="********" icon={Lock} error={errors.password?.message} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-gray-400 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          <div className="flex justify-end mt-2">
                            <button type="button" onClick={handleForgotPassword} className="text-xs font-black text-primary hover:underline uppercase tracking-wider">
                              {t('admin_login.forgot_password')}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 py-2">
                          <input 
                            type="checkbox" 
                            id="remember" 
                            checked={stayLoggedIn}
                            onChange={(e) => setStayLoggedIn(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary transition-all cursor-pointer" 
                          />
                          <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer select-none">{t('admin_login.remember_me')}</label>
                        </div>
                      </div>
                    )}

                    {!isLogin && !isRecovery && (
                      <div className="space-y-6">
                        <div className="relative">
                          <Input label={t('auth.password')} type={showPassword ? "text" : "password"} {...register('password')} placeholder="********" icon={Lock} error={errors.password?.message} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-gray-400 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <div className="relative">
                          <Input label={t('checkout.confirm_order')} type={showConfirmPassword ? "text" : "password"} {...register('confirmPassword')} placeholder="********" icon={Lock} error={errors.confirmPassword?.message} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[42px] text-gray-400 hover:text-primary transition-colors">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 py-2">
                          <input 
                            type="checkbox" 
                            id="terms" 
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary transition-all cursor-pointer" 
                          />
                          <label htmlFor="terms" className="text-sm font-bold text-gray-500 cursor-pointer select-none">
                            {t('auth.agree_prefix')} <span className="text-primary hover:underline">{t('auth.terms')} & {t('auth.privacy')}</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-6 text-base font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                      isLoading={loading}
                      disabled={isLogin && !isRecovery && !isLoginActive}
                    >
                      {isRecovery 
                        ? (recoveryStep === 1 ? t('admin_login.send_otp') : t('admin_login.update_login')) 
                        : (isLogin ? t('auth.login_btn') : t('auth.signup_btn'))}
                      <ArrowRight size={20} className="ml-3" strokeWidth={3} />
                    </Button>
                  </form>

                  <div className="text-center">
                    {isRecovery ? (
                      <button type="button" onClick={() => setIsRecovery(false)} className="text-gray-400 font-bold text-sm hover:text-primary transition-colors flex items-center gap-2 mx-auto">
                        <ArrowLeft size={14} /> {t('admin_login.back_to_login')}
                      </button>
                    ) : (
                      <p className="text-gray-400 font-bold text-sm">
                        {isLogin ? t('auth.new_here') : t('auth.have_account')} {' '}
                        <button type="button" onClick={handleToggleMode} className="text-primary hover:underline font-black">
                          {isLogin ? t('auth.signup') : t('auth.login')}
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* --- OTP SCREEN (For Register OR Recovery) --- */
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{t('admin_login.otp_label')}</h2>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed px-10">
                      {t('admin_login.check_email')} <br/>
                      <span className="text-[#1A1A1A] font-black">{watchEmail}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpRefs.current[idx] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-16 sm:w-14 sm:h-20 bg-gray-50 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl text-center text-2xl font-black text-on_surface outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-8">
                    <Button 
                      onClick={handleVerifyOtp}
                      variant="primary" 
                      className="w-full py-6 text-base font-black uppercase tracking-[0.2em] shadow-xl"
                      disabled={otp.join('').length < 6 || loading}
                      isLoading={loading}
                    >
                      {t('admin_login.otp_label')}
                    </Button>

                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                          {t('admin_login.resend_in')} <span className="text-primary">{otpTimer}s</span>
                        </p>
                      ) : (
                        <button type="button" onClick={onFormSubmit} className="text-primary hover:underline font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto">
                          <RefreshCw size={14} strokeWidth={3} /> {t('admin_login.resend_otp')}
                        </button>
                      )}
                    </div>

                    <button type="button" onClick={() => { setRegisterStep(1); setRecoveryStep(1); }} className="w-full flex items-center justify-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">
                      <X size={14} strokeWidth={3} /> {t('common.refresh')}
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
