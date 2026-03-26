import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { 
  Candy, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  Store,
  BarChart3,
  Package,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // If already logged in as admin, redirect to dashboard
  if (currentUser && currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Admin email required';
    if (!formData.password) newErrors.password = 'Secret key required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = login(formData.email, formData.password);
    if (result.success) {
      if (result.user?.role !== 'admin' && formData.email === 'admin@candy.com') {
         // This is a mock override for the demo if the role logic is strict
      }
      toast.success('Admin Portal Access Granted');
      navigate('/admin', { replace: true });
    } else {
      toast.error(result.message || 'Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafd] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ff0080 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-16 relative z-10">
        
        {/* Main Login Card */}
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-pink-200 flex items-center justify-center text-white mx-auto mb-6 transform hover:rotate-12 transition-transform cursor-pointer">
                <Candy size={32} strokeWidth={2.5} />
             </div>
             <h1 className="text-4xl font-black text-primary tracking-tight mb-2 uppercase">Candy Admin</h1>
             <p className="text-[#8e8a9d] font-bold tracking-widest text-sm uppercase opacity-60">Management Portal Access</p>
          </div>

          <div className="w-full bg-white rounded-[45px] shadow-2xl shadow-purple-200/40 p-10 lg:p-14 border border-white/50 backdrop-blur-sm relative animate-in zoom-in-95 duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-[#2d2a4a] ml-1 opacity-70">Admin Email</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
                    <span className="text-xl font-bold">@</span>
                  </div>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="admin@candyshop.com"
                    className="w-full bg-[#fcfaff] py-5.5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[12px] font-black text-[#2d2a4a] ml-1 opacity-70">Secret Key</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full bg-[#fcfaff] py-5.5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <button 
                  type="button"
                  onClick={() => setStayLoggedIn(!stayLoggedIn)}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${stayLoggedIn ? 'bg-primary border-primary shadow-lg shadow-pink-100' : 'bg-[#fcfaff] border-[#ece8f1]'}`}>
                    {stayLoggedIn && <Check size={16} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] font-bold text-[#8e8a9d] group-hover:text-[#2d2a4a]">Keep me signed in</span>
                </button>
                <button type="button" className="text-[13px] font-black text-secondary hover:underline underline-offset-4">Forgot Password?</button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary via-[#f13a7b] to-primary bg-[length:200%_auto] hover:bg-right text-white py-6 rounded-[25px] font-black text-lg shadow-xl shadow-pink-200/50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
              >
                Enter Portal
                <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-[#fcfaff] flex flex-col items-center gap-8">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#fcfaff]"></div></div>
                <div className="relative flex justify-center uppercase"><span className="bg-white px-6 text-[10px] font-black text-[#b0a9bc] tracking-[0.3em]">External Link</span></div>
              </div>

              <Link to="/" className="flex items-center gap-3 text-[#2d2a4a] font-black hover:text-primary transition-all group">
                <div className="w-10 h-10 bg-[#f8f7fa] rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Store size={20} />
                </div>
                Back to Store
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Previews */}
        <div className="hidden lg:flex flex-col gap-6 animate-in slide-in-from-right-10 duration-1000">
           {/* New Inventory Card */}
           <div className="bg-white p-5 rounded-[30px] shadow-2xl shadow-purple-200/30 border border-white max-w-[280px] transform hover:-rotate-3 transition-transform">
              <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-4 bg-[#1a1a2e]">
                <img 
                  src="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400" 
                  alt="Product" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">New Inventory</p>
              <p className="text-sm font-black text-[#2d2a4a]">Sweet Galaxy Mix (250g)</p>
           </div>

           {/* Sales Stat Pill */}
           <div className="bg-white px-6 py-4 rounded-full shadow-xl shadow-purple-200/30 border border-white flex items-center gap-4 self-end mr-[-40px] transform hover:scale-105 transition-all cursor-default">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <BarChart3 size={18} />
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-black text-[#b0a9bc] uppercase tracking-widest">Daily Sales</p>
                <p className="text-sm font-black text-[#2d2a4a]">+14.2% Growth</p>
              </div>
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 right-0 text-center px-6">
        <p className="text-[11px] font-bold text-[#b0a9bc] leading-loose max-w-md mx-auto opacity-70">
          © 2024 CandyShop Global. High-security administrative zone.<br />
          Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
