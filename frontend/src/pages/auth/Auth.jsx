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
import { loginUserThunk, registerUserThunk, requestPasswordResetThunk, verifyResetTokenThunk, resetPasswordThunk } from '../../store/authThunks';
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
  confirmPassword: z.string().min(1, t('auth.confirm_password_required', 'Please confirm your password')),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwords_dont_match', "Passwords don't match"),
  path: ["confirmPassword"],
});

const recoveryEmailSchema = (t) => z.object({
  email: z.string().email(t('auth.invalid_email', 'Invalid email format')),
});

const recoveryTokenSchema = (t) => z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const resetPasswordSchema = (t) => z.object({
  newPassword: z.string().min(8, t('auth.password_min', 'Password must be at least 8 characters')),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: Token, 3: New Password
  const [recoveryToken, setRecoveryToken] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token in URL (Step 2/3)
  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const step = query.get('step');
    if (token) {
      setRecoveryToken(token);
      setIsRecovery(true);
      setRecoveryStep(step === '3' ? 3 : 2);
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(
      isRecovery 
        ? (recoveryStep === 1 ? recoveryEmailSchema(t) : recoveryStep === 2 ? recoveryTokenSchema(t) : resetPasswordSchema(t))
        : (isLogin ? loginSchema(t) : registerSchema(t))
    ),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setIsRecovery(false);
    setRecoveryStep(1);
    reset();
  };

  const handleRecoveryMode = () => {
    setIsRecovery(true);
    setRecoveryStep(1);
    reset();
  };

  const onFormSubmit = async (data) => {
    const sanitizedData = sanitizeData(data);

    try {
      if (isRecovery) {
        if (recoveryStep === 1) {
          const result = await dispatch(requestPasswordResetThunk(sanitizedData.email)).unwrap();
          showSuccessToast('Reset link sent! Check your email 📧');
          if (result.devToken) {
            setRecoveryToken(result.devToken);
            showSuccessToast('Development Mode: Token captured automatically! 🛠️');
          }
          setRecoveryStep(2);
        } else if (recoveryStep === 2) {
          const token = sanitizedData.token || recoveryToken;
          await dispatch(verifyResetTokenThunk(token)).unwrap();
          setRecoveryToken(token);
          setRecoveryStep(3);
        } else if (recoveryStep === 3) {
          await dispatch(resetPasswordThunk({ token: recoveryToken, newPassword: sanitizedData.newPassword })).unwrap();
          showSuccessToast('Password reset successful! Please login 🍭');
          setIsRecovery(false);
          setIsLogin(true);
          setRecoveryStep(1);
        }
        return;
      }

      if (isLogin) {
        await dispatch(loginUserThunk({ 
          email: sanitizedData.email, 
          password: sanitizedData.password 
        })).unwrap();
        showSuccessToast(t('auth.login_success', 'Successfully logged in! 🍭'));
      } else {
        if (!agreeTerms) {
          showErrorToast(t('auth.agree_error', 'Please agree to the Terms & Privacy Policy'));
          return;
        }
        await dispatch(registerUserThunk({ 
          fullName: sanitizedData.fullName, 
          email: sanitizedData.email, 
          password: sanitizedData.password 
        })).unwrap();
        showSuccessToast('Sweet account created! You are now logged in 🍭✨');
      }
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.response?.status === 400) {
        mapBackendErrors(err, setError);
      } else {
        showErrorToast(err || t('auth.failed', 'Authentication failed'));
      }
    }
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
                {isRecovery ? 'Security Center' : t('auth.tagline', 'The sweetest place on the internet.')}<br />
                {isRecovery ? `Step ${recoveryStep}: ${recoveryStep === 1 ? 'Identify Account' : recoveryStep === 2 ? 'Verify Identity' : 'Reset Password'}` : (isLogin ? t('auth.login_hint', 'Login to grab your treats!') : t('auth.signup_hint', 'Join our sweet community!'))}
              </p>
              <div className="w-full max-w-[320px] aspect-square mx-auto bg-white/20 backdrop-blur-sm rounded-[50px] p-6 shadow-2xl relative">
                <div className="w-full h-full bg-primary/5 rounded-[35px] overflow-hidden shadow-inner flex items-center justify-center">
                  <div className="text-9xl">{isRecovery ? '🔐' : '🍭'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-12 lg:p-20 flex flex-col justify-center">
            {/* Top Toggle */}
            {!isRecovery && (
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
            )}

            <div className="space-y-10">
              <form className="space-y-8" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                {isRecovery ? (
                  <>
                    {recoveryStep === 1 && (
                      <Input label={t('profile.email')} type="email" {...register('email')} placeholder="Enter your registered email" icon={Mail} error={errors.email?.message} />
                    )}
                    {recoveryStep === 2 && (
                      <div className="space-y-4">
                        <Input label="Verification Token" type="text" {...register('token')} placeholder="Paste token from email" icon={Check} error={errors.token?.message} />
                        {recoveryToken && (
                          <div className="bg-primary/5 p-5 rounded-3xl border border-primary/20 animate-pulse">
                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.1em] leading-relaxed">
                              🛠️ Development Helper:<br/>
                              <span className="text-[10px] opacity-70">Email service is inactive. We've captured the token for you! Just click the button below to continue.</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {recoveryStep === 3 && (
                      <>
                        <Input label="New Password" type={showPassword ? "text" : "password"} {...register('newPassword')} placeholder="Min 8 characters" icon={Lock} error={errors.newPassword?.message} />
                        <Input label="Confirm New Password" type="password" {...register('confirmPassword')} placeholder="Repeat new password" icon={Lock} error={errors.confirmPassword?.message} />
                      </>
                    )}
                  </>
                ) : (
                  <>
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
                    {!isLogin && (
                      <Input label={t('auth.confirm_password', 'Confirm Password')} type="password" {...register('confirmPassword')} placeholder="********" icon={Lock} error={errors.confirmPassword?.message} />
                    )}
                  </>
                )}

                {isLogin && !isRecovery && (
                  <div className="flex justify-end -mt-4">
                    <button type="button" onClick={handleRecoveryMode} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                      {t('auth.forgot_password', 'Forgot Password?')}
                    </button>
                  </div>
                )}

                {!isRecovery && (
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
                )}

                <Button type="submit" variant="primary" className="w-full py-6 text-lg mt-4 uppercase tracking-widest" isLoading={status === 'loading'}>
                  {isRecovery 
                    ? (recoveryStep === 1 ? 'SEND RESET LINK' : recoveryStep === 2 ? 'VERIFY TOKEN' : 'UPDATE PASSWORD')
                    : (isLogin ? t('auth.login_btn', 'Sweeten My Day') : t('auth.signup_btn', 'CREATE SWEET ACCOUNT'))
                  }
                  <ArrowRight size={22} strokeWidth={3} className="ml-4" />
                </Button>
                
                {isRecovery && (
                  <button type="button" onClick={handleToggleMode} className="w-full text-center text-xs font-black text-on_surface_variant/60 uppercase tracking-widest hover:text-primary transition-colors">
                    Back to Login
                  </button>
                )}
              </form>

              {!isRecovery && (
                <div className="text-center space-y-8">
                  <p className="text-on_surface_variant font-bold uppercase tracking-tight text-sm">
                    {isLogin ? t('auth.new_here', "New to the shop?") : t('auth.have_account', "Already have an account?")}{' '}
                    <button type="button" onClick={handleToggleMode} className="text-primary hover:underline font-black">
                      {isLogin ? t('auth.create_account', 'Create an account') : t('auth.login_action', 'Login')}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
