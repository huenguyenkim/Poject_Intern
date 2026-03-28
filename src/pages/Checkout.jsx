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
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#fdfaff]">
        <div className="w-40 h-40 bg-white rounded-[40px] shadow-xl shadow-purple-100/50 flex items-center justify-center mb-10 animate-pulse">
          <span className="text-7xl">🍭</span>
        </div>
        <h1 className="text-5xl font-black text-[#2d2a4a] mb-6 tracking-tight">Your Stash is Empty</h1>
        <p className="text-xl text-[#8e8a9d] mb-12 max-w-md font-bold leading-relaxed">
          It looks like you haven't picked any treats yet. Let's find something sweet for you!
        </p>
        <Link to="/shop">
          <button className="bg-primary text-white text-xl font-black px-12 py-5 rounded-[22px] shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-105 transition-all">
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
    <div className="bg-[#fdfaff] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {step !== 3 && (
          <header className="mb-12">
            <h1 className="text-5xl font-black text-[#f13a7b] mb-3 tracking-tight">Secure Checkout</h1>
            <p className="text-lg text-[#8e8a9d] font-bold">Complete your order details below to get your sweet treats!</p>

            {/* Stepper */}
            <div className="flex items-center gap-8 mt-12 max-w-lg">
              {steps.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${step >= s.id ? 'bg-[#f13a7b] text-white shadow-lg shadow-pink-100' : 'bg-[#ece8f1] text-[#8e8a9d]'}`}>
                      {s.id}
                    </div>
                    <span className={`font-black uppercase tracking-widest text-xs ${step >= s.id ? 'text-[#2d2a4a]' : 'text-[#8e8a9d]'}`}>
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-grow h-[2px] bg-[#ece8f1] min-w-[80px]">
                      <div className={`h-full bg-[#f13a7b] transition-all duration-500`} style={{ width: step > 1 ? '100%' : '0%' }}></div>
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
              <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-purple-100/30 border border-[#ece8f1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Truck size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-[#2d2a4a] tracking-tight">Shipping Information</h2>
                </div>

                <form className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                      <input 
                        type="text" 
                        placeholder="e.g. Charlie Bucket" 
                        value={shippingInfo.fullName}
                        onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          value={shippingInfo.phone}
                          onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                        <input 
                          type="email" 
                          placeholder="hello@candyshop.com" 
                          value={shippingInfo.email}
                          onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">Street Address</label>
                    <div className="relative group">
                      <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                      <input 
                        type="text" 
                        placeholder="123 Lollipop Lane" 
                        value={shippingInfo.address}
                        onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">City</label>
                      <div className="relative group">
                        <Building size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                        <input 
                          type="text" 
                          placeholder="Sweetwater" 
                          value={shippingInfo.city}
                          onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#2d2a4a] uppercase tracking-widest ml-1">Postal Code</label>
                      <div className="relative group">
                        <Navigation size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0a9bc] transition-colors group-focus-within:text-primary" />
                        <input 
                          type="text" 
                          placeholder="54321" 
                          value={shippingInfo.postalCode}
                          onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                          className="w-full bg-[#f8f7fa] py-5 pl-16 pr-6 rounded-[22px] font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder-[#b0a9bc]"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {(step === 1 || step === 2) && (
              <div className={`bg-white rounded-[40px] p-12 shadow-2xl shadow-purple-100/30 border border-[#ece8f1] transition-all duration-700 ${step === 1 ? 'pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                    <CreditCard size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-[#2d2a4a] tracking-tight">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label 
                    className={`cursor-pointer p-6 rounded-[32px] border-[3.5px] transition-all flex items-center gap-5 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-xl shadow-pink-100/50' : 'border-[#ece8f1] bg-[#f8f7fa] hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className={`w-8 h-8 rounded-full border-[3.5px] flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-[#b0a9bc]'}`}>
                      {paymentMethod === 'COD' && <div className="w-4 h-4 rounded-full bg-primary animate-in zoom-in-50 duration-300"></div>}
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-[#2d2a4a]">Cash on Delivery</p>
                      <p className="text-sm font-bold text-[#8e8a9d]">Pay when your candy arrives</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label 
                    className={`cursor-pointer p-6 rounded-[32px] border-[3.5px] transition-all flex items-center gap-5 ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5 shadow-xl shadow-pink-100/50' : 'border-[#ece8f1] bg-[#f8f7fa] hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <div className={`w-8 h-8 rounded-full border-[3.5px] flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-primary' : 'border-[#b0a9bc]'}`}>
                      {paymentMethod === 'CARD' && <div className="w-4 h-4 rounded-full bg-primary animate-in zoom-in-50 duration-300"></div>}
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-[#2d2a4a]">Credit / Debit Card</p>
                      <p className="text-sm font-bold text-[#8e8a9d]">Secure online payment</p>
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
                <div className="relative bg-gradient-to-br from-[#fff0f9] via-[#fdf4ff] to-[#f0f4ff] rounded-[40px] p-16 text-center overflow-hidden border border-[#f0e6f7] shadow-2xl shadow-pink-100/50 mb-10">
                  {/* Background blobs */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                  {/* Floating candy decorations */}
                  <div className="absolute top-8 left-12 text-4xl select-none animate-bounce" style={{ animationDelay: '0.1s' }}>🍭</div>
                  <div className="absolute top-6 right-16 text-3xl select-none animate-bounce" style={{ animationDelay: '0.4s' }}>🎉</div>
                  <div className="absolute bottom-8 left-20 text-3xl select-none animate-bounce" style={{ animationDelay: '0.6s' }}>🍬</div>
                  <div className="absolute bottom-10 right-12 text-4xl select-none animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>

                  {/* Success Icon */}
                  <div className="relative z-10 inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-2xl shadow-green-100/80 mb-8 ring-8 ring-green-50">
                    <CheckCircle2 size={64} className="text-[#10b981]" strokeWidth={2} />
                  </div>

                  <div className="relative z-10">
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-3">🎊 Sweet success!</p>
                    <h2 className="text-6xl font-black text-[#2d2a4a] mb-5 tracking-tight leading-none">Order Confirmed!</h2>
                    <p className="text-[#8e8a9d] font-bold text-lg max-w-md mx-auto leading-relaxed mb-2">
                      Your sweet treats are being packed with love. Get ready for a sugary surprise!
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full text-xs font-black text-[#2d2a4a] shadow-md mt-4">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                      Estimated delivery: 3–5 business days
                    </div>
                  </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-[32px] border border-[#ece8f1] shadow-xl shadow-purple-100/30 overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-primary to-[#f13a7b] px-10 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <ShoppingBag size={22} strokeWidth={3} />
                      <span className="font-black text-lg tracking-tight">Your Order</span>
                    </div>
                    <span className="text-white/80 font-black text-sm uppercase tracking-widest">#{Math.floor(Math.random() * 90000) + 10000}</span>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4 p-5 bg-[#fdfaff] rounded-[20px]">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-primary" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-widest mb-1">Shipping To</p>
                        <p className="font-black text-[#2d2a4a] text-sm">{shippingInfo.fullName}</p>
                        <p className="font-bold text-[#8e8a9d] text-xs">{shippingInfo.address}, {shippingInfo.city}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-[#fdfaff] rounded-[20px]">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                        <CreditCard size={18} className="text-secondary" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-widest mb-1">Payment</p>
                        <p className="font-black text-[#2d2a4a] text-sm">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit Card'}</p>
                        <p className="font-bold text-[#8e8a9d] text-xs">{paymentMethod === 'COD' ? 'Pay when it arrives' : 'Encrypted & secure'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-[#fdfaff] rounded-[20px]">
                      <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles size={18} className="text-[#10b981]" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-widest mb-1">Candy Points</p>
                        <p className="font-black text-[#2d2a4a] text-sm">+37 Points Earned</p>
                        <p className="font-bold text-[#8e8a9d] text-xs">Added to your account</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email hint */}
                <div className="bg-[#e8f5ff] border border-[#c8e6ff] rounded-[20px] px-8 py-5 flex items-center gap-4 mb-8">
                  <Mail size={20} className="text-[#0095ff] shrink-0" strokeWidth={2.5} />
                  <p className="text-sm font-bold text-[#0070cc]">
                    A confirmation email has been sent to <span className="font-black underline decoration-2">{shippingInfo.email}</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/profile/orders" className="flex-1">
                    <button className="w-full bg-gradient-to-r from-primary to-[#f13a7b] text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      <ShoppingBag size={20} strokeWidth={3} />
                      View My Orders
                    </button>
                  </Link>
                  <Link to="/shop" className="flex-1">
                    <button className="w-full bg-white text-[#2d2a4a] border-2 border-[#ece8f1] py-5 rounded-[22px] font-black text-lg hover:bg-[#fdfaff] hover:border-primary/20 transition-all flex items-center justify-center gap-3">
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
              <div className="bg-white rounded-[40px] shadow-2xl shadow-purple-100/50 border border-[#ece8f1] overflow-hidden">
                {/* Purple Header */}
                <div className="bg-primary px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white">
                    <ShoppingBag size={24} strokeWidth={3} />
                    <h3 className="text-xl font-black uppercase tracking-widest">Your Order</h3>
                  </div>
                  <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black">
                    {cartItems.length} ITEMS
                  </span>
                </div>

                <div className="p-10">
                  {/* Item List */}
                  <div className="space-y-6 mb-10">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-5 group">
                        <div className="w-16 h-16 bg-[#f8f7fa] rounded-[18px] overflow-hidden flex-shrink-0 border border-[#ece8f1] group-hover:scale-110 transition-transform">
                          <img src={item.image || item.imagePlaceholder} className="w-full h-full object-cover p-1" alt={item.title} onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-black text-[#2d2a4a] text-[15px] leading-tight mb-1">{item.title}</h4>
                          <p className="text-[#b0a9bc] font-bold text-[11px] uppercase tracking-wider">
                            {item.quantity} Units
                          </p>
                        </div>
                        <span className="font-black text-[#f13a7b] text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-5 mb-10 pt-8 border-t-2 border-[#f8f7fa]">
                    <div className="flex justify-between items-center text-[#2d2a4a] font-bold text-sm">
                      <span>Subtotal</span>
                      <span className="text-[#2d2a4a]">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#2d2a4a] font-bold text-sm">
                      <span>Shipping Fee</span>
                      <span className="text-[#00c896] uppercase font-black text-[10px] tracking-widest">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-[#2d2a4a] font-bold text-sm">
                      <span>Sales Tax</span>
                      <span className="text-[#2d2a4a]">${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-10">
                    <span className="text-xl font-black text-[#2d2a4a] tracking-tight">Total</span>
                    <span className="text-4xl font-black text-[#f13a7b] tracking-tighter leading-none">
                      ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={step === 1 ? handleShippingSubmit : placeOrder}
                    className="w-full bg-gradient-to-r from-primary to-[#f13a7b] text-white py-6 rounded-[22px] font-black text-xl shadow-xl shadow-pink-100 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    {step === 1 ? 'Continue to Payment' : 'Confirm Order'}
                    <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-2 text-[#2d2a4a]">
                    <Lock size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure encrypted checkout</span>
                  </div>
                </div>
              </div>

              {/* Candy Points Pill */}
              <div className="bg-[#e7f5ff] border border-[#d0e9ff] rounded-full p-6 flex items-center justify-center gap-4 shadow-sm animate-pulse-slow">
                <div className="w-10 h-10 bg-[#0095ff]/10 rounded-full flex items-center justify-center text-[#0095ff]">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <p className="text-[#0095ff] font-bold text-sm">
                  You're earning <span className="font-black text-[16px] underline decoration-2">37 Candy Points</span> with this order!
                </p>
              </div>

              {step === 2 && (
                <button onClick={() => setStep(1)} className="w-full text-[#2d2a4a] hover:text-[#f13a7b] font-black text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mt-4">
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
