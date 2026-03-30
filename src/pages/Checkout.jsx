import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Navigation
} from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { addOrder } = useStore();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', phone: '', email: currentUser?.email || '', address: '', city: '', postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: { pathname: '/checkout' } }} replace />;
  }

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-surface_dim">
        <div className="w-40 h-40 bg-white rounded-[40px] shadow-xl shadow-secondary/10 flex items-center justify-center mb-10 animate-pulse">
          <span className="text-7xl">🍭</span>
        </div>
        <h1 className="text-5xl font-black text-on_surface mb-6 tracking-tight">Your Stash is Empty</h1>
        <p className="text-xl text-on_surface_variant mb-12 max-w-md font-bold leading-relaxed">
          It looks like you haven't picked any treats yet. Let's find something sweet for you!
        </p>
        <Link to="/shop">
          <button className="bg-primary text-on_primary text-xl font-black px-12 py-5 rounded-[22px] shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 transition-all">
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { fullName, phone, email, address, city, postalCode } = shippingInfo;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      toast.error('Please fill in all shipping details!');
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address!');
      return;
    }
    setStep(2);
  };

  const placeOrder = () => {
    const orderData = {
       userId: currentUser.id,
       userName: shippingInfo.fullName,
       email: shippingInfo.email,
       phone: shippingInfo.phone,
       address: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}`,
       items: [...cartItems],
       subtotal: cartTotal,
       defaultShipping: 0,
       total: cartTotal + (cartTotal * 0.08),
       paymentMethod: paymentMethod
    };
    
    addOrder(orderData);
    clearCart();
    toast.success('Order placed successfully!');
    setStep(3);
  };

  const steps = [
    { id: 1, title: 'Shipping' },
    { id: 2, title: 'Payment' }
  ];

  return (
    <div className="bg-surface_dim min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {step !== 3 && (
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-primary mb-3 tracking-tight">Secure Checkout</h1>
            <p className="text-sm md:text-lg text-on_surface_variant font-bold">Complete your order details below to get your sweet treats!</p>

            {/* Stepper */}
            <div className="flex items-center gap-4 md:gap-8 mt-8 md:mt-12 max-w-lg">
              {steps.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all ${step >= s.id ? 'bg-primary text-on_primary shadow-lg shadow-primary/20' : 'bg-surface_container text-on_surface_variant'}`}>
                      {s.id}
                    </div>
                    <span className={`font-black uppercase tracking-widest text-[10px] md:text-xs ${step >= s.id ? 'text-on_surface' : 'text-on_surface_variant'}`}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-grow h-[2px] bg-surface_container min-w-[40px] md:min-w-[80px]">
                      <div className={`h-full bg-primary transition-all duration-500`} style={{ width: step > 1 ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </header>
        )}

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-[62%] space-y-10">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/10 border border-surface_container animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Truck size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-on_surface tracking-tight">Shipping Information</h2>
                </div>

                <form className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="e.g. Charlie Bucket" 
                        value={shippingInfo.fullName}
                        onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          value={shippingInfo.phone}
                          onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email" 
                          placeholder="hello@candyshop.com" 
                          value={shippingInfo.email}
                          onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">Street Address</label>
                    <div className="relative group">
                      <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="123 Lollipop Lane" 
                        value={shippingInfo.address}
                        onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">City</label>
                      <div className="relative group">
                        <Building size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Sweetwater" 
                          value={shippingInfo.city}
                          onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-on_surface uppercase tracking-widest ml-1">Postal Code</label>
                      <div className="relative group">
                        <Navigation size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="54321" 
                          value={shippingInfo.postalCode}
                          onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                          className="w-full bg-surface_dim py-5 pl-16 pr-6 rounded-[22px] font-bold text-on_surface outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-on_surface_variant/60"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {(step === 1 || step === 2) && (
              <div className={`bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/10 border border-surface_container transition-all duration-700 ${step === 1 ? 'pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <CreditCard size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-on_surface tracking-tight">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label 
                    className={`cursor-pointer p-6 rounded-[32px] border-[3.5px] transition-all flex items-center gap-5 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className={`w-8 h-8 rounded-full border-[3.5px] flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-on_surface_variant/30'}`}>
                      {paymentMethod === 'COD' && <div className="w-4 h-4 rounded-full bg-primary animate-in zoom-in-50 duration-300"></div>}
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-on_surface">Cash on Delivery</p>
                      <p className="text-sm font-bold text-on_surface_variant">Pay when your candy arrives</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label 
                    className={`cursor-pointer p-6 rounded-[32px] border-[3.5px] transition-all flex items-center gap-5 ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <div className={`w-8 h-8 rounded-full border-[3.5px] flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-primary' : 'border-on_surface_variant/30'}`}>
                      {paymentMethod === 'CARD' && <div className="w-4 h-4 rounded-full bg-primary animate-in zoom-in-50 duration-300"></div>}
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-on_surface">Credit / Debit Card</p>
                      <p className="text-sm font-bold text-on_surface_variant">Secure online payment</p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation – Premium Full-Width */}
            {step === 3 && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Hero Confirmation Banner */}
                <div className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5 rounded-[32px] md:rounded-[40px] p-8 md:p-16 text-center overflow-hidden border border-surface_container shadow-2xl shadow-primary/10 mb-8 md:mb-10">
                  {/* Background blobs */}
                  <div className="absolute top-0 right-0 w-32 md:w-72 h-32 md:h-72 bg-primary/10 rounded-full blur-[40px] md:blur-[80px] -mr-10 md:-mr-20 -mt-10 md:-mt-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 md:w-72 h-32 md:h-72 bg-secondary/10 rounded-full blur-[40px] md:blur-[80px] -ml-10 md:-ml-20 -mb-10 md:-mb-20 pointer-events-none" />

                  {/* Floating candy decorations - Hidden on small mobile */}
                  <div className="hidden sm:block absolute top-8 left-12 text-4xl select-none animate-bounce" style={{ animationDelay: '0.1s' }}>🍭</div>
                  <div className="hidden sm:block absolute top-6 right-16 text-3xl select-none animate-bounce" style={{ animationDelay: '0.4s' }}>🎉</div>
                  <div className="hidden sm:block absolute bottom-8 left-20 text-3xl select-none animate-bounce" style={{ animationDelay: '0.6s' }}>🍬</div>
                  <div className="hidden sm:block absolute bottom-10 right-12 text-4xl select-none animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>

                  {/* Success Icon */}
                  <div className="relative z-10 inline-flex items-center justify-center w-20 md:w-32 h-20 md:h-32 bg-white rounded-full shadow-2xl shadow-emerald-100 mb-6 md:mb-8 ring-4 md:ring-8 ring-emerald-50">
                    <CheckCircle2 size={40} className="text-emerald-500 md:w-16 md:h-16" strokeWidth={2} />
                  </div>

                  <div className="relative z-10">
                    <p className="text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-2 md:mb-3">🎊 Sweet success!</p>
                    <h2 className="text-4xl md:text-6xl font-black text-on_surface mb-4 md:mb-5 tracking-tight leading-tight md:leading-none">Order Confirmed!</h2>
                    <p className="text-on_surface_variant font-bold text-sm md:text-lg max-w-md mx-auto leading-relaxed mb-4">
                      Your sweet treats are being packed with love. Get ready for a sugary surprise!
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 md:px-5 py-2 rounded-full text-[10px] md:text-xs font-black text-on_surface shadow-md mt-2 md:mt-4">
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 animate-ping" />
                      Estimated delivery: 3–5 business days
                    </div>
                  </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-[32px] border border-surface_container shadow-xl shadow-secondary/10 overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-primary to-primary/90 px-10 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-on_primary">
                      <ShoppingBag size={22} strokeWidth={3} />
                      <span className="font-black text-lg tracking-tight">Your Order</span>
                    </div>
                    <span className="text-on_primary/80 font-black text-sm uppercase tracking-widest">#{Math.floor(Math.random() * 90000) + 10000}</span>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4 p-5 bg-surface_dim rounded-[20px]">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-primary" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest mb-1">Shipping To</p>
                        <p className="font-black text-on_surface text-sm">{shippingInfo.fullName}</p>
                        <p className="font-bold text-on_surface_variant text-xs">{shippingInfo.address}, {shippingInfo.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-surface_dim rounded-[20px]">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                        <CreditCard size={18} className="text-secondary" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest mb-1">Payment</p>
                        <p className="font-black text-on_surface text-sm">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit Card'}</p>
                        <p className="font-bold text-on_surface_variant text-xs">{paymentMethod === 'COD' ? 'Pay when it arrives' : 'Encrypted & secure'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-surface_dim rounded-[20px]">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles size={18} className="text-emerald-500" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest mb-1">Candy Points</p>
                        <p className="font-black text-on_surface text-sm">+37 Points Earned</p>
                        <p className="font-bold text-on_surface_variant text-xs">Added to your account</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email hint */}
                <div className="bg-sky-50 border border-sky-100 rounded-[20px] px-8 py-5 flex items-center gap-4 mb-8">
                  <Mail size={20} className="text-sky-500 shrink-0" strokeWidth={2.5} />
                  <p className="text-sm font-bold text-sky-600">
                    A confirmation email has been sent to <span className="font-black underline decoration-2">{shippingInfo.email}</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/profile/orders" className="flex-1">
                    <button className="w-full bg-gradient-to-r from-primary to-primary/90 text-on_primary py-5 rounded-[22px] font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      <ShoppingBag size={20} strokeWidth={3} />
                      View My Orders
                    </button>
                  </Link>
                  <Link to="/shop" className="flex-1">
                    <button className="w-full bg-white text-on_surface border-2 border-surface_container py-5 rounded-[22px] font-black text-lg hover:bg-surface_dim hover:border-primary/20 transition-all flex items-center justify-center gap-3">
                      🍬 Keep Shopping
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          {step !== 3 && (
            <div className="lg:w-[38%] w-full sticky top-32 space-y-6">
              <div className="bg-white rounded-[40px] shadow-2xl shadow-secondary/10 border border-surface_container overflow-hidden">
                {/* Purple Header */}
                <div className="bg-primary px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-on_primary">
                    <ShoppingBag size={24} strokeWidth={3} />
                    <h3 className="text-xl font-black uppercase tracking-widest">Your Order</h3>
                  </div>
                  <span className="bg-white/20 text-on_primary px-4 py-1.5 rounded-full text-xs font-black">
                    {cartItems.length} ITEMS
                  </span>
                </div>

                <div className="p-10">
                  {/* Item List */}
                  <div className="space-y-6 mb-10">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-5 group">
                        <div className="w-16 h-16 bg-surface_dim rounded-[18px] overflow-hidden flex-shrink-0 border border-surface_container group-hover:scale-110 transition-transform">
                          <img src={item.image || item.imagePlaceholder} className="w-full h-full object-cover p-1" alt={item.title} onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-black text-on_surface text-[15px] leading-tight mb-1">{item.title}</h4>
                          <p className="text-on_surface_variant font-bold text-[11px] uppercase tracking-wider">
                            {item.quantity} Units
                          </p>
                        </div>
                        <span className="font-black text-primary text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-5 mb-10 pt-8 border-t-2 border-surface_dim">
                    <div className="flex justify-between items-center text-on_surface font-bold text-sm">
                      <span>Subtotal</span>
                      <span className="text-on_surface">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-on_surface font-bold text-sm">
                      <span>Shipping Fee</span>
                      <span className="text-emerald-500 uppercase font-black text-[10px] tracking-widest">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-on_surface font-bold text-sm">
                      <span>Sales Tax</span>
                      <span className="text-on_surface">${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-10">
                    <span className="text-xl font-black text-on_surface tracking-tight">Total</span>
                    <span className="text-4xl font-black text-primary tracking-tighter leading-none">
                      ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={step === 1 ? handleShippingSubmit : placeOrder}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 text-on_primary py-6 rounded-[22px] font-black text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    {step === 1 ? 'Continue to Payment' : 'Confirm Order'}
                    <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-2 text-on_surface">
                    <Lock size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Secure encrypted checkout</span>
                  </div>
                </div>
              </div>

              {/* Candy Points Pill */}
              <div className="bg-sky-50 border border-sky-100 rounded-full p-6 flex items-center justify-center gap-4 shadow-sm animate-pulse-slow">
                <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <p className="text-sky-600 font-bold text-sm">
                  You're earning <span className="font-black text-[16px] underline decoration-2">37 Candy Points</span> with this order!
                </p>
              </div>

              {step === 2 && (
                <button onClick={() => setStep(1)} className="w-full text-on_surface hover:text-primary font-black text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mt-4">
                  <ArrowLeft size={14} strokeWidth={3} /> Back to Shipping
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
