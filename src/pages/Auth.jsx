import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Candy, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Default to Login as per new request
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email) {
      newErrors.email = 'Please enter your email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin && !agreeTerms) {
      toast.error('Please agree to the Terms & Privacy Policy');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let result;
    if (isLogin) {
      result = login(formData.email, formData.password);
    } else {
      result = register(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      toast.success(isLogin ? 'Successfully logged in!' : 'Successfully created account!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#fdfaff]">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl shadow-purple-200/30 overflow-hidden flex flex-col md:flex-row border border-[#ece8f1]">
        
        {/* Left Side: Branding/Carousel */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#fff0f5] via-[#f7f0ff] to-[#e6e1ff] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 w-full">
            <h1 className="text-5xl font-black text-[#2d2a4a] tracking-tight mb-4">CandyShop</h1>
            <p className="text-[#8e8a9d] font-bold text-lg mb-12">
              The sweetest place on the internet.<br />
              {isLogin ? 'Login to grab your treats!' : 'Join our sweet community!'}
            </p>

            <div className="w-full max-w-[320px] aspect-square mx-auto bg-white/20 backdrop-blur-sm rounded-[50px] p-6 shadow-2xl relative">
               <div className="w-full h-full bg-[#f14d4d] rounded-[35px] overflow-hidden shadow-inner flex items-center justify-center">
                  <img 
                    src={isLogin ? "/images/gummy-bears-hq.png" : "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600"} 
                    alt="Candies" 
                    className="w-full h-full object-cover mix-blend-overlay opacity-90 scale-110 active:scale-100 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Candy className="text-white opacity-20" size={120} strokeWidth={1} />
                  </div>
               </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="w-8 h-2.5 bg-primary rounded-full"></div>
              <div className="w-5 h-2.5 bg-[#8e8a9d]/30 rounded-full"></div>
              <div className="w-3 h-2.5 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-12 lg:p-20 flex flex-col justify-center">
          
          {/* Top Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#f8f7fa] p-1.5 rounded-[22px] flex items-center w-full max-w-[340px] shadow-sm">
              <button 
                onClick={() => {setIsLogin(true); setErrors({});}}
                className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all ${isLogin ? 'bg-white text-primary shadow-lg shadow-pink-100' : 'text-[#b0a9bc] hover:text-[#8e8a9d]'}`}
              >
                Login
              </button>
              <button 
                onClick={() => {setIsLogin(false); setErrors({});}}
                className={`flex-1 py-3.5 px-6 rounded-[18px] font-black text-[15px] transition-all ${!isLogin ? 'bg-white text-primary shadow-lg shadow-pink-100' : 'text-[#b0a9bc] hover:text-[#8e8a9d]'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* Quick Access Section */}
            <div>
              <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.25em] text-center mb-6">Quick Access</p>
              <div className="grid grid-cols-1 gap-4">
                <button className="w-full flex items-center justify-center gap-4 py-4.5 bg-white rounded-[22px] border-2 border-[#f8f7fa] hover:border-primary/20 hover:bg-[#f8f7fa] transition-all font-black text-[#2d2a4a] text-[15px] group">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                  </div>
                  Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-4 py-4.5 bg-white rounded-[22px] border-2 border-[#f8f7fa] hover:border-primary/20 hover:bg-[#f8f7fa] transition-all font-black text-[#2d2a4a] text-[15px] group">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.96.95-2.21 1.72-3.66 1.72-2.11 0-3.63-1.36-5.32-1.36-1.68 0-3.32 1.32-5.18 1.32-1.25 0-2.48-.61-3.35-1.58-1.59-1.78-1.59-4.86-.03-6.62.79-.89 1.88-1.44 3.03-1.44 1.25 0 2.22.75 3.39.75 1.15 0 1.95-.75 3.46-.75.76 0 1.54.21 2.21.61-2.03 2.15-1.7 5.56.59 7.35l.86-.01zm-3.05-13.43c.01 1.76-1.46 3.3-3.21 3.29-.01-1.72 1.53-3.32 3.21-3.29z" fill="#000"/></svg>
                  </div>
                  Continue with Apple
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-grow h-[2px] bg-[#f8f7fa]"></div>
              <span className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.25em] whitespace-nowrap">Or Email</span>
              <div className="flex-grow h-[2px] bg-[#f8f7fa]"></div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#2d2a4a] uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group">
                    <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-[#f8f7fa] py-5.5 pl-16 pr-6 rounded-[22px] font-black text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all placeholder-[#b0a9bc]"
                    />
                    {errors.name && <p className="text-xs font-black text-error pl-1 mt-2">{errors.name}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#2d2a4a] uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sweet@candyshop.com"
                    className="w-full bg-[#f8f7fa] py-5.5 pl-16 pr-6 rounded-[22px] font-black text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all placeholder-[#b0a9bc]"
                  />
                  {errors.email && <p className="text-xs font-black text-error pl-1 mt-2">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-black text-[#2d2a4a] uppercase tracking-[0.2em]">Password</label>
                  {isLogin && <button type="button" className="text-[11px] font-black text-primary hover:underline">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full bg-[#f8f7fa] py-5.5 pl-16 pr-6 rounded-[22px] font-black text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all placeholder-[#b0a9bc]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {!isLogin && <p className="text-[11px] font-bold text-[#b0a9bc] leading-relaxed ml-1">Must be at least 8 characters with one special character.</p>}
                {errors.password && <p className="text-xs font-black text-error pl-1 mt-2">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-3 ml-1">
                <button 
                  type="button"
                  onClick={() => isLogin ? setStayLoggedIn(!stayLoggedIn) : setAgreeTerms(!agreeTerms)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) ? 'bg-primary border-primary shadow-lg shadow-pink-100' : 'bg-[#f8f7fa] border-[#ece8f1]'}`}
                >
                  {((isLogin && stayLoggedIn) || (!isLogin && agreeTerms)) && <Check size={16} className="text-white" strokeWidth={3} />}
                </button>
                <p className="text-[13px] font-black text-[#8e8a9d]">
                  {isLogin ? 'Stay logged in' : (
                    <>I agree to the <span className="text-primary hover:underline cursor-pointer">Terms</span> & <span className="text-primary hover:underline cursor-pointer">Privacy</span></>
                  )}
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-[#f13a7b] text-white py-6 rounded-[22px] font-black text-lg shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group mt-4"
              >
                {isLogin ? 'Sweeten My Day' : 'CREATE SWEET ACCOUNT'}
                <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center space-y-8">
              <p className="text-[#8e8a9d] font-bold">
                {isLogin ? "New to the shop?" : "Already have an account?"}{' '}
                <button 
                  onClick={() => {setIsLogin(!isLogin); setErrors({});}}
                  className="text-primary hover:underline font-black"
                >
                  {isLogin ? 'Create an account' : 'Login'}
                </button>
              </p>

              <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] leading-loose max-w-[280px] mx-auto">
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
