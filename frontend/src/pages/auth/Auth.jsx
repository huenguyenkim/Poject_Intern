import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Candy, Mail, Lock, User as UserIcon, Eye, EyeOff, Check, ArrowRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { loginUserThunk, registerUserThunk } from '../../store/authThunks';
import { socialLogin as socialLoginAction } from '../../store/authSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { mapBackendErrors, sanitizeData } from '../../utils/validationUtils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

const loginSchema = (t) => z.object({
  email: z.string().email(t('auth.invalid_email', 'Invalid email format')),
  password: z.string().min(1, t('auth.password_required', 'Password is required')),
});

const registerSchema = (t) => z.object({
  fullName: z.string().min(2, t('auth.name_min', 'Name must be at least 2 characters')),
  email: z.string().email(t('auth.invalid_email', 'Invalid email format')),
  password: z
    .string()
    .min(8, t('auth.password_min', 'Password must be at least 8 characters'))
    .regex(/[!@#$%^&*(),.?":{}|<>]/, t('auth.password_special', 'Include at least one special character')),
});

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema(t) : registerSchema(t)),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const onFormSubmit = async (data) => {
    if (!isLogin && !agreeTerms) {
      showErrorToast(t('auth.agree_error', 'Please agree to the Terms & Privacy Policy'));
      return;
    }

    const sanitizedData = sanitizeData(data);

    try {
      if (isLogin) {
        await dispatch(loginUserThunk({ 
          email: sanitizedData.email, 
          password: sanitizedData.password 
        })).unwrap();
        showSuccessToast(t('auth.login_success', 'Successfully logged in! 🍭'));
      } else {
        await dispatch(registerUserThunk({ 
          fullName: sanitizedData.fullName, 
          email: sanitizedData.email, 
          password: sanitizedData.password 
        })).unwrap();
        showSuccessToast(t('auth.register_success', 'Sweet account created! ✨'));
      }
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.response?.status === 400) {
        mapBackendErrors(err, setError);
      } else {
        showErrorToast(err?.response?.data?.message || err || t('auth.failed', 'Authentication failed'));
      }
    }
  };

  const handleSocialLogin = (provider) => {
    const mockUser = {
      id: `social-${Date.now()}`,
      name: `${provider} User`,
      email: `${provider.toLowerCase()}@example.com`,
      role: 'user',
    };
    const mockToken = 'mock-social-token-' + Date.now();
    
    dispatch(socialLoginAction({ user: mockUser, token: mockToken }));
    showSuccessToast(t('auth.social_welcome', { provider, defaultValue: `Welcome, ${provider} Sweetie! 🚀` }));
    navigate(from, { replace: true });
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-surface_dim">
        <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-surface_container">
          {/* Left Side: Branding */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="relative z-10 w-full">
              <h1 className="text-5xl font-black text-on_surface tracking-tight mb-4 uppercase tracking-tighter">CandyShop</h1>
              <p className="text-on_surface_variant font-bold text-lg mb-12 uppercase leading-tight">
                {t('auth.tagline', 'The sweetest place on the internet.')}<br />
                {isLogin ? t('auth.login_hint', 'Login to grab your treats!') : t('auth.signup_hint', 'Join our sweet community!')}
              </p>
              <div className="w-full max-w-[320px] aspect-square mx-auto bg-white/20 backdrop-blur-sm rounded-[50px] p-6 shadow-2xl relative">
                <div className="w-full h-full bg-primary/5 rounded-[35px] overflow-hidden shadow-inner flex items-center justify-center">
                  <div className="text-9xl">🍭</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-12 lg:p-20 flex flex-col justify-center">
            {/* Top Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-surface_dim p-1.5 rounded-[22px] flex items-center w-full max-w-[340px] shadow-sm">
                <button type="button" onClick={handleToggleMode} className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all uppercase tracking-widest ${isLogin ? 'bg-white text-primary shadow-lg' : 'text-on_surface_variant/60 hover:text-on_surface'}`}>
                  {t('auth.login', 'Login')}
                </button>
                <button type="button" onClick={handleToggleMode} className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all uppercase tracking-widest ${!isLogin ? 'bg-white text-primary shadow-lg' : 'text-on_surface_variant/60 hover:text-on_surface'}`}>
                  {t('auth.signup', 'Sign Up')}
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.25em] text-center mb-6">{t('auth.quick_access', 'Quick Access')}</p>
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={() => handleSocialLogin('Google')} variant="outline" className="w-full py-4 bg-white hover:bg-surface_dim h-auto">
                    <div className="w-5 h-5 flex items-center justify-center mr-4">
                      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    {t('auth.continue_google', 'Continue with Google')}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-grow h-[2px] bg-surface_dim"></div>
                <span className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.25em] whitespace-nowrap">{t('auth.or_email', 'Or Email')}</span>
                <div className="flex-grow h-[2px] bg-surface_dim"></div>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                {!isLogin && (
                  <Input label={t('checkout.full_name')} type="text" {...register('fullName')} placeholder={t('checkout.full_name')} icon={UserIcon} error={errors.fullName?.message} />
                )}
                <Input label={t('profile.email')} type="email" {...register('email')} placeholder="sweet@candyshop.com" icon={Mail} error={errors.email?.message} />
                <div className="relative">
                  <Input label={t('auth.password', 'Password')} type={showPassword ? "text" : "password"} {...register('password')} placeholder="********" icon={Lock} error={errors.password?.message} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-[54px] -translate-y-1/2 p-2 text-on_surface_variant/60 hover:text-primary transition-colors z-10">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-3 ml-1">
                  <button type="button" onClick={() => isLogin ? setStayLoggedIn(!stayLoggedIn) : setAgreeTerms(!agreeTerms)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) ? 'bg-primary border-primary shadow-lg' : 'bg-surface_dim border-surface_container'}`}>
                    {((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) && <Check size={16} className="text-on_primary" strokeWidth={3} />}
                  </button>
                  <p className="text-[13px] font-black text-on_surface_variant uppercase tracking-tight">
                    {isLogin ? t('auth.stay_logged_in', 'Stay logged in') : (
                      <>{t('auth.agree_prefix', 'I agree to the')} <span className="text-primary hover:underline cursor-pointer">{t('auth.terms', 'Terms')}</span> & <span className="text-primary hover:underline cursor-pointer">{t('auth.privacy', 'Privacy')}</span></>
                    )}
                  </p>
                </div>

                <Button type="submit" variant="primary" className="w-full py-6 text-lg mt-4 uppercase tracking-widest" isLoading={status === 'loading'}>
                  {isLogin ? t('auth.login_btn', 'Sweeten My Day') : t('auth.signup_btn', 'CREATE SWEET ACCOUNT')}
                  <ArrowRight size={22} strokeWidth={3} className="ml-4" />
                </Button>
              </form>

              <div className="text-center space-y-8">
                <p className="text-on_surface_variant font-bold uppercase tracking-tight text-sm">
                  {isLogin ? t('auth.new_here', "New to the shop?") : t('auth.have_account', "Already have an account?")}{' '}
                  <button type="button" onClick={handleToggleMode} className="text-primary hover:underline font-black">
                    {isLogin ? t('auth.create_account', 'Create an account') : t('auth.login_action', 'Login')}
                  </button>
                </p>
                <p className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.2em] leading-loose max-w-[280px] mx-auto">
                  {t('auth.legal_hint', 'By logging in, you agree to our')}<br />
                  <span className="underline decoration-1 underline-offset-2">{t('settings.terms')}</span> & <span className="underline decoration-1 underline-offset-2">{t('settings.privacy_policy')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
