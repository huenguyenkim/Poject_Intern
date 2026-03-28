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
  const { login, register, currentUser, socialLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const specialCharRegex = /[!@#$%^&*(),?":{}|<>]/;
    
    if (!isLogin && (!formData.name.trim() || formData.name.trim().length < 2)) {
      newErrors.name = 'Name must be at least 2 characters';
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
    } else if (!isLogin && !specialCharRegex.test(formData.password)) {
      newErrors.password = 'Include at least one special character';
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

  const handleSocialLogin = (provider) => {
    const result = socialLogin(provider);
    if (result.success) {
      toast.success(`Successfully logged in with ${provider}!`);
      navigate(from, { replace: true });
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
               <div className="w-full h-full bg-[#fff0f5] rounded-[35px] overflow-hidden shadow-inner flex items-center justify-center relative">
                  <img 
                    src="/images/gummy-bears-hq.png" 
                    alt="Delicious Gummy Bears" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a4a]/10 to-transparent pointer-events-none"></div>
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
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full flex items-center justify-center gap-4 py-4.5 bg-white rounded-[22px] border-2 border-[#f8f7fa] hover:border-primary/20 hover:bg-[#f8f7fa] transition-all font-black text-[#2d2a4a] text-[15px] group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#4285F4"/>
                      <path d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.115 0 5.935 1.106 8.112 2.932l6.442-6.442C34.615 4.108 29.63 2 24 2c-7.532 0-14.12 3.8-17.694 9.531Z" fill="#EA4335"/>
                      <path d="M24 46c5.63 0 10.615-2.108 14.554-5.49l-6.442-6.442C29.935 35.894 27.115 37 24 37c-5.039 0-9.345-3.108-11.123-7.51l-6.571 4.819C9.88 40 16.468 46 24 46Z" fill="#34A853"/>
                      <path d="M44.5 20H24v8.5h11.766C34.717 33.9 30.1 37 24 37c-7.221 0-13-5.779-13-13s5.779-13 13-13c3.115 0 5.935 1.106 8.112 2.932l6.442-6.442C34.615 4.108 29.63 2 24 2c-1.4 0-2.75.143-4.049.408l6.571 4.819C24 12 24 12 24 12Z" fill="#FBBC05"/>
                    </svg>
                  </div>
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleSocialLogin('Apple')}
                  className="w-full flex items-center justify-center gap-4 py-4.5 bg-white rounded-[22px] border-2 border-[#f8f7fa] hover:border-primary/20 hover:bg-[#f8f7fa] transition-all font-black text-[#2d2a4a] text-[15px] group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="#000"/>
                    </svg>
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
