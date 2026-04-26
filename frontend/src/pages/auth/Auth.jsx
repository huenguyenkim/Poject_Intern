import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Candy,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginUserThunk, registerUserThunk } from '../../store/authThunks';
import { socialLogin as socialLoginAction } from '../../store/authSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Include at least one special character'),
});

const Auth = () => {
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
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      name: '',
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
      showErrorToast('Please agree to the Terms & Privacy Policy');
      return;
    }

    try {
      if (isLogin) {
        await dispatch(loginUserThunk({ email: data.email, password: data.password })).unwrap();
        showSuccessToast('Successfully logged in! 🍭');
      } else {
        await dispatch(registerUserThunk({ name: data.name, email: data.email, password: data.password })).unwrap();
        showSuccessToast('Sweet account created! ✨');
      }
      navigate(from, { replace: true });
    } catch (err) {
      showErrorToast(err);
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
    showSuccessToast(`Welcome, ${provider} Sweetie! 🚀`);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-surface_dim">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl shadow-secondary/10 overflow-hidden flex flex-col md:flex-row border border-surface_container">

        {/* Left Side: Branding/Carousel */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10 w-full">
            <h1 className="text-5xl font-black text-on_surface tracking-tight mb-4 tracking-tighter uppercase">CandyShop</h1>
            <p className="text-on_surface_variant font-bold text-lg mb-12">
              The sweetest place on the internet.<br />
              {isLogin ? 'Login to grab your treats!' : 'Join our sweet community!'}
            </p>

            <div className="w-full max-w-[320px] aspect-square mx-auto bg-white/20 backdrop-blur-sm rounded-[50px] p-6 shadow-2xl relative">
              <div className="w-full h-full bg-primary/5 rounded-[35px] overflow-hidden shadow-inner flex items-center justify-center relative">
                <div className="text-9xl group-hover:scale-110 transition-transform duration-700">🍭</div>
                <div className="absolute inset-0 bg-gradient-to-t from-on_surface/10 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="w-8 h-2.5 bg-primary rounded-full"></div>
              <div className="w-5 h-2.5 bg-on_surface_variant/30 rounded-full"></div>
              <div className="w-3 h-2.5 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-12 lg:p-20 flex flex-col justify-center">

          {/* Top Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-surface_dim p-1.5 rounded-[22px] flex items-center w-full max-w-[340px] shadow-sm">
              <button
                type="button"
                onClick={handleToggleMode}
                className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all ${isLogin ? 'bg-white text-primary shadow-lg shadow-primary/10' : 'text-on_surface_variant/60 hover:text-on_surface_variant'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleToggleMode}
                className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all ${!isLogin ? 'bg-white text-primary shadow-lg shadow-primary/10' : 'text-on_surface_variant/60 hover:text-on_surface_variant'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* Quick Access Section */}
            <div>
              <p className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.25em] text-center mb-6">Quick Access</p>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={() => handleSocialLogin('Google')}
                  variant="outline"
                  className="w-full py-4 bg-white hover:bg-surface_dim h-auto"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-4">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  Continue with Google
                </Button>
                <Button
                  onClick={() => handleSocialLogin('Apple')}
                  variant="outline"
                  className="w-full py-4 bg-white hover:bg-surface_dim h-auto"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-4">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.078-2.04 0-3.905 1.162-4.966 3.004-2.132 3.712-.544 9.204 1.535 12.204 1.018 1.465 2.21 3.11 3.793 3.05 1.523-.06 2.098-1.012 3.935-1.012s2.35.986 3.957 1.012c1.64.03 2.66-1.49 3.67-2.96 1.163-1.7 1.643-3.344 1.67-3.428-.036-.014-3.213-1.233-3.243-4.86-.03-3.03 2.47-4.48 2.583-4.545-1.424-2.086-3.615-2.315-4.387-2.368-2.035-.16-3.992 1.012-5.013 1.012zM15.22.42c-.93 1.127-1.554 2.7-1.383 4.26 1.343.104 2.96-.68 3.913-1.81.95-1.134 1.614-2.73 1.4-4.26-1.474.06-3.003.682-3.93 1.81z" fill="currentColor"/>
                    </svg>
                  </div>
                  Continue with Apple
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-grow h-[2px] bg-surface_dim"></div>
              <span className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.25em] whitespace-nowrap">Or Email</span>
              <div className="flex-grow h-[2px] bg-surface_dim"></div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onFormSubmit)} noValidate>
              {!isLogin && (
                <Input
                  label="Full Name"
                  type="text"
                  {...register('name')}
                  placeholder="Enter your name"
                  icon={UserIcon}
                  error={errors.name?.message}
                />
              )}

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                placeholder="sweet@candyshop.com"
                icon={Mail}
                error={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="********"
                  icon={Lock}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-[54px] -translate-y-1/2 p-2 text-on_surface_variant/60 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {!isLogin && <p className="text-[11px] font-bold text-on_surface_variant/60 leading-relaxed ml-1 mt-2">Must be at least 8 characters with one special character.</p>}
              </div>

              <div className="flex items-center gap-3 ml-1">
                <button
                  type="button"
                  onClick={() => isLogin ? setStayLoggedIn(!stayLoggedIn) : setAgreeTerms(!agreeTerms)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) ? 'bg-primary border-primary shadow-lg shadow-primary/10' : 'bg-surface_dim border-surface_container'}`}
                >
                  {((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) && <Check size={16} className="text-on_primary" strokeWidth={3} />}
                </button>
                <p className="text-[13px] font-black text-on_surface_variant">
                  {isLogin ? 'Stay logged in' : (
                    <>I agree to the <span className="text-primary hover:underline cursor-pointer">Terms</span> & <span className="text-primary hover:underline cursor-pointer">Privacy</span></>
                  )}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-6 text-lg mt-4"
                isLoading={status === 'loading'}
              >
                {isLogin ? 'Sweeten My Day' : 'CREATE SWEET ACCOUNT'}
                <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform ml-4" />
              </Button>
            </form>

            <div className="text-center space-y-8">
              <p className="text-on_surface_variant font-bold">
                {isLogin ? "New to the shop?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-primary hover:underline font-black"
                >
                  {isLogin ? 'Create an account' : 'Login'}
                </button>
              </p>

              <p className="text-[10px] font-black text-on_surface_variant/60 uppercase tracking-[0.2em] leading-loose max-w-[280px] mx-auto">
                By logging in, you agree to our<br />
                <span className="underline decoration-1 underline-offset-2">Candy Terms</span> & <span className="underline decoration-1 underline-offset-2">Sugar Privacy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
