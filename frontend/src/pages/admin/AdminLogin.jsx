import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
} from 'lucide-react';
import { loginUserThunk, logoutUserThunk, requestPasswordResetThunk, resetPasswordThunk } from '../../store/authThunks';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid admin email'),
  password: z.string().min(1, 'Secret key is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * AdminLogin: Redesigned premium split-screen login page.
 * Optimized with react-hook-form and zod validation.
 */
const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    const token = new URLSearchParams(location.search).get('resetToken');
    if (token) {
      setResetToken(token);
      setRecoveryMode('reset');
    }
  }, [location.search]);

  // Redirect if already logged in as admin
  if (currentUser && currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUserThunk({ 
        email: data.email, 
        password: data.password,
        rememberMe: data.rememberMe,
      })).unwrap();
      
      // Role filtering: Only allow admin or staff roles
      if (result.user.role !== 'admin' && result.user.role !== 'staff') {
        // Log out immediately if role is not allowed
        await dispatch(logoutUserThunk());
        showErrorToast('Unauthorized: Only administrators can enter this portal.');
        return;
      }

      showSuccessToast('Admin Portal Access Granted 🔑');
      navigate('/admin', { replace: true });
    } catch (err) {
      showErrorToast(err || 'Invalid Admin Credentials');
    }
  };

  const requestPasswordReset = async () => {
    try {
      const result = await dispatch(requestPasswordResetThunk(resetEmail)).unwrap();
      setRecoveryMessage(result.resetLink ? `Dev reset link: ${result.resetLink}` : result.message);
      if (result.token) {
        setResetToken(result.token);
        setRecoveryMode('reset');
      }
      showSuccessToast('Password reset request sent');
    } catch (err) {
      showErrorToast(err || 'Password reset request failed');
    }
  };

  const resetPassword = async () => {
    try {
      const result = await dispatch(resetPasswordThunk({ token: resetToken, newPassword })).unwrap();
      setRecoveryMessage(result.message);
      setRecoveryMode(null);
      setNewPassword('');
      showSuccessToast('Password reset successfully');
    } catch (err) {
      showErrorToast(err || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-10 md:px-20 lg:px-24 relative bg-[#fcf9fc]">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
        
        <div className="max-w-md w-full mx-auto space-y-12">
          
          {/* Logo & Header */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform">
                <Candy size={26} strokeWidth={3} />
              </div>
              <span className="text-2xl font-black text-on_surface tracking-tight uppercase italic">CandyAdmin</span>
            </Link>
            
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-on_surface tracking-tighter leading-tight">
                Welcome to the <span className="text-primary">Sweet Admin</span>
              </h1>
              <p className="text-on_surface_variant font-bold text-lg opacity-60">Unlock the candy kingdom portal.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="Admin Email"
              type="email" 
              {...register('email')}
              placeholder="admin@candyshop.com"
              icon={Mail}
              error={errors.email?.message}
            />

            <div className="relative">
              <Input 
                label="Secret Key"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="••••••••••••"
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
                <span className="text-sm font-bold text-on_surface_variant group-hover:text-on_surface transition-colors">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setRecoveryMode(recoveryMode === 'forgot' ? null : 'forgot');
                  setRecoveryMessage('');
                }}
                className="text-sm font-black text-primary hover:underline underline-offset-4"
              >
                Forgot Password?
              </button>
            </div>

            {recoveryMode && (
              <div className="space-y-4 rounded-[20px] border border-surface_container bg-white/70 p-5 shadow-sm">
                {recoveryMode === 'forgot' ? (
                  <>
                    <Input
                      label="Recovery Email"
                      type="email"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      placeholder="admin@candy.com"
                      icon={Mail}
                    />
                    <Button type="button" variant="outline" className="w-full" onClick={requestPasswordReset}>
                      Send Reset Link
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      label="Reset Token"
                      value={resetToken}
                      onChange={(event) => setResetToken(event.target.value)}
                      placeholder="Paste reset token"
                      icon={ShieldCheck}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      icon={Lock}
                    />
                    <Button type="button" variant="outline" className="w-full" onClick={resetPassword}>
                      Reset Password
                    </Button>
                  </>
                )}
                {recoveryMessage && (
                  <p className="break-words text-xs font-bold text-on_surface_variant">{recoveryMessage}</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary"
              className="w-full py-6 text-lg rounded-[25px] shadow-2xl shadow-primary/20 mt-4 group"
              isLoading={status === 'loading'}
            >
              Sign In to Dashboard
              <ArrowRight size={22} strokeWidth={3} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Footer Links */}
          <div className="pt-10 border-t border-surface_container/30 flex items-center justify-between text-xs font-black text-on_surface_variant/40 uppercase tracking-widest">
            <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Store size={14} />
              Return to Storefront
            </Link>
            <span>Auth v2.4.0</span>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Hero */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-on_surface">
        <img 
          src="/images/admin_login_hero.png" 
          alt="Candy Kingdom" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-on_surface/80"></div>
        
        {/* Floating Glassmorphism Content */}
        <div className="absolute bottom-20 left-20 right-20 space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-xl">
                <Zap size={24} fill="white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-white tracking-tight">Real-time Management</h3>
                <p className="text-white/60 font-bold text-sm">Control every gummy and truffle with ease.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-on_surface bg-surface_dim overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Admin" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-black text-white uppercase tracking-widest">Join 12+ Active Admins</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-green-400 uppercase">Live System Status</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={16} />
                High Security Zone
             </div>
             <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-[80px]"></div>
      </div>

    </div>
  );
};

export default AdminLogin;
