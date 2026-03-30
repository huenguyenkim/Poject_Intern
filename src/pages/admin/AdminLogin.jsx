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
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

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
      toast.success('Admin Portal Access Granted');
      navigate('/admin', { replace: true });
    } else {
      toast.error(result.message || 'Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-surface_dim flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(theme(colors.primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-16 relative z-10">
        
        {/* Main Login Card */}
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-on_primary mx-auto mb-6 transform hover:rotate-12 transition-transform cursor-pointer">
                <Candy size={32} strokeWidth={2.5} />
             </div>
             <h1 className="text-4xl font-black text-primary tracking-tight mb-2 uppercase">Candy Admin</h1>
             <p className="text-on_surface_variant font-bold tracking-widest text-sm uppercase opacity-60">Management Portal Access</p>
          </div>

          <Card className="w-full p-10 lg:p-14 border-white/50 backdrop-blur-sm animate-in zoom-in-95 duration-500 rounded-[45px]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input 
                label="Admin Email"
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@candyshop.com"
                icon={() => <span className="text-xl font-bold">@</span>}
                error={errors.email}
              />

              <div className="relative">
                <Input 
                  label="Secret Key"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••••••"
                  icon={Lock}
                  error={errors.password}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-[55px] -translate-y-1/2 text-on_surface_variant/60 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <button 
                  type="button"
                  onClick={() => setStayLoggedIn(!stayLoggedIn)}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${stayLoggedIn ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-surface_dim border-surface_container'}`}>
                    {stayLoggedIn && <Check size={16} className="text-on_primary" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] font-bold text-on_surface_variant group-hover:text-on_surface">Keep me signed in</span>
                </button>
                <button type="button" className="text-[13px] font-black text-secondary hover:underline underline-offset-4">Forgot Password?</button>
              </div>

              <Button 
                type="submit" 
                variant="primary"
                className="w-full py-6 text-lg rounded-[25px]"
              >
                Enter Portal
                <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform ml-4" />
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-surface_dim flex flex-col items-center gap-8">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface_dim"></div></div>
                <div className="relative flex justify-center uppercase"><span className="bg-white px-6 text-[10px] font-black text-on_surface_variant/60 tracking-[0.3em]">External Link</span></div>
              </div>

              <Link to="/" className="flex items-center gap-3 text-on_surface font-black hover:text-primary transition-all group">
                <div className="w-10 h-10 bg-surface_dim rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Store size={20} />
                </div>
                Back to Store
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Side: Floating Previews */}
        <div className="hidden lg:flex flex-col gap-6 animate-in slide-in-from-right-10 duration-1000">
           {/* New Inventory Card */}
           <div className="bg-white p-5 rounded-[30px] shadow-2xl shadow-secondary/10 border border-white max-w-[280px] transform hover:-rotate-3 transition-transform">
              <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-4 bg-on_surface/20">
                <img 
                  src="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400" 
                  alt="Product" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">New Inventory</p>
              <p className="text-sm font-black text-on_surface">Sweet Galaxy Mix (250g)</p>
           </div>

           {/* Sales Stat Pill */}
           <div className="bg-white px-6 py-4 rounded-full shadow-xl shadow-secondary/10 border border-white flex items-center gap-4 self-end mr-[-40px] transform hover:scale-105 transition-all cursor-default">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-on_secondary shadow-lg shadow-secondary/20">
                <BarChart3 size={18} />
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-black text-on_surface_variant/60 uppercase tracking-widest">Daily Sales</p>
                <p className="text-sm font-black text-on_surface">+14.2% Growth</p>
              </div>
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 right-0 text-center px-6">
        <p className="text-[11px] font-bold text-on_surface_variant/60 leading-loose max-w-md mx-auto opacity-70">
          © 2024 CandyShop Global. High-security administrative zone.<br />
          Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
