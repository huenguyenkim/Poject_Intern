import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Steps,
  Form,
  Radio,
  Divider,
  Result,
  Input as AntInput,
  ConfigProvider
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart } from '../../store/cartSlice';
import { createOrderThunk } from '../../store/orderSlice';
import {
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
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Use Redux for cart
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const { products } = useSelector((state) => state.catalog);
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: currentUser?.email || '',
      address: '',
      city: '',
      postalCode: '',
    }
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const steps = [
    { title: 'Shipping', icon: <Truck size={18} /> },
    { title: 'Payment', icon: <CreditCard size={18} /> },
    { title: 'Success', icon: <Sparkles size={18} /> },
  ];

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: { pathname: '/checkout' } }} replace />;
  }

  if (cartItems.length === 0 && currentStep !== 2) {
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

  const onShippingSubmit = () => {
    setCurrentStep(1);
  };

  const placeOrder = async () => {
    const shippingInfo = getValues();
    
    // Safety check: Ensure cart isn't empty
    if (cartItems.length === 0) {
      showErrorToast('Your basket is empty!');
      return;
    }

    const orderData = {
      userId: currentUser?.id,
      receiverName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      address: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}`,
      paymentMethod: paymentMethod, 
      cartItems: cartItems.map(item => ({
        productId: Number(item.id),
        quantity: item.quantity
      }))
    };

    try {
      await dispatch(createOrderThunk(orderData)).unwrap();
      dispatch(clearCart());
      showSuccessToast('Order placed successfully! 📦');
      setCurrentStep(2);
    } catch (error) {
      console.error('[Checkout] Order Error:', error);
      
      // Advanced Error Parsing for NestJS Validation Errors
      let displayMessage = 'Failed to place order. Please try again.';
      
      if (typeof error === 'object' && error?.message) {
        if (Array.isArray(error.message)) {
          // NestJS returns an array of validation errors
          displayMessage = error.message[0];
        } else {
          displayMessage = error.message;
        }
      } else if (typeof error === 'string') {
        displayMessage = error;
      }

      showErrorToast(displayMessage);
    }
  };

  const shippingInfo = getValues();

  return (
    <div className="bg-surface_dim min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">

        {currentStep !== 2 && (
          <header className="mb-12">
            <h1 className="text-5xl font-black text-primary mb-4 tracking-tight uppercase leading-none">Checkout</h1>
            <p className="text-on_surface_variant font-bold text-lg mb-12">Get ready for your delicious delivery.</p>

            <div className="max-w-2xl">
              <Steps
                current={currentStep}
                items={steps}
                className="candy-steps"
              />
            </div>
          </header>
        )}

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-[62%] w-full space-y-10">
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/10 border border-surface_container animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Truck size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-on_surface tracking-tight uppercase">Shipping Info</h2>
                </div>

                <Form layout="vertical" onFinish={handleSubmit(onShippingSubmit)} className="space-y-2">
                  <div className="space-y-6">
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">Full Name</span>}
                          validateStatus={errors.fullName ? 'error' : ''}
                          help={errors.fullName?.message}
                        >
                          <AntInput
                            {...field}
                            prefix={<User size={18} className="text-on_surface_variant/40 mr-2" />}
                            placeholder="e.g. Charlie Bucket"
                            className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                          />
                        </Form.Item>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Form.Item
                            label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">Phone Number</span>}
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone?.message}
                          >
                            <AntInput
                              {...field}
                              prefix={<Phone size={18} className="text-on_surface_variant/40 mr-2" />}
                              placeholder="+1 (555) 000-0000"
                              className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                            />
                          </Form.Item>
                        )}
                      />
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Form.Item
                            label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">Email Address</span>}
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email?.message}
                          >
                            <AntInput
                              {...field}
                              prefix={<Mail size={18} className="text-on_surface_variant/40 mr-2" />}
                              placeholder="hello@candyshop.com"
                              className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                            />
                          </Form.Item>
                        )}
                      />
                    </div>

                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">Street Address</span>}
                          validateStatus={errors.address ? 'error' : ''}
                          help={errors.address?.message}
                        >
                          <AntInput
                            {...field}
                            prefix={<MapPin size={18} className="text-on_surface_variant/40 mr-2" />}
                            placeholder="123 Lollipop Lane"
                            className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                          />
                        </Form.Item>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Form.Item
                            label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">City</span>}
                            validateStatus={errors.city ? 'error' : ''}
                            help={errors.city?.message}
                          >
                            <AntInput
                              {...field}
                              prefix={<Building size={18} className="text-on_surface_variant/40 mr-2" />}
                              placeholder="Sweetwater"
                              className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                            />
                          </Form.Item>
                        )}
                      />
                      <Controller
                        name="postalCode"
                        control={control}
                        render={({ field }) => (
                          <Form.Item
                            label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">Postal Code</span>}
                            validateStatus={errors.postalCode ? 'error' : ''}
                            help={errors.postalCode?.message}
                          >
                            <AntInput
                              {...field}
                              prefix={<Navigation size={18} className="text-on_surface_variant/40 mr-2" />}
                              placeholder="54321"
                              className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !text-sm focus:!ring-2 focus:!ring-primary/20"
                            />
                          </Form.Item>
                        )}
                      />
                    </div>
                  </div>
                  <button type="submit" className="hidden" />
                </Form>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/10 border border-surface_container animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <CreditCard size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-black text-on_surface tracking-tight uppercase">Payment Method</h2>
                </div>

                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full flex flex-col gap-6"
                >
                  <label
                    className={`cursor-pointer p-8 rounded-[32px] border-[3.5px] transition-all flex items-center gap-6 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}
                  >
                    <Radio value="COD" className="candy-radio" />
                    <div className="flex-grow">
                      <p className="font-black text-on_surface text-lg">Cash on Delivery</p>
                      <p className="text-sm font-bold text-on_surface_variant">Pay when your candy arrives at your door.</p>
                    </div>
                    <span className="text-4xl">💵</span>
                  </label>

                  <label
                    className={`cursor-pointer p-8 rounded-[32px] border-[3.5px] transition-all flex items-center gap-6 ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}
                  >
                    <Radio value="CARD" className="candy-radio" />
                    <div className="flex-grow">
                      <p className="font-black text-on_surface text-lg">Credit / Debit Card</p>
                      <p className="text-sm font-bold text-on_surface_variant">Instant, secure, and encrypted payment.</p>
                    </div>
                    <span className="text-4xl">💳</span>
                  </label>
                </Radio.Group>

                <div className="mt-12 flex justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(0)} className="!text-on_surface_variant !font-black !uppercase !tracking-widest flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Shipping
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Result
                  status="success"
                  title={<h2 className="text-5xl font-black text-on_surface tracking-tight uppercase leading-none mt-4">Order Confirmed!</h2>}
                  subTitle={<p className="text-lg font-bold text-on_surface_variant max-w-md mx-auto mt-4">Your sweet treats are being packed with love. We'll notify you as soon as they ship!</p>}
                  className="bg-white rounded-[40px] border border-surface_container shadow-2xl p-16"
                  extra={[
                    <div key="actions" className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Link to="/profile/orders" key="orders">
                        <Button variant="primary" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3">
                          <ShoppingBag size={20} strokeWidth={3} /> View Orders
                        </Button>
                      </Link>
                      <Link to="/shop" key="shop">
                        <Button variant="surface" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3">
                          🍭 Shop More
                        </Button>
                      </Link>
                    </div>
                  ]}
                >
                  <div className="mt-12 space-y-6">
                    <Divider className="!m-0">
                      <span className="text-[10px] font-black text-on_surface_variant/40 uppercase tracking-[0.4em]">Order Summary</span>
                    </Divider>
                    <div className="bg-surface_dim/50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                          <MapPin size={18} strokeWidth={3} />
                          <span className="text-[11px] font-black uppercase tracking-widest">Delivery Address</span>
                        </div>
                        <p className="font-bold text-on_surface leading-relaxed">
                          {shippingInfo.fullName}<br />
                          {shippingInfo.address}<br />
                          {shippingInfo.city}, {shippingInfo.postalCode}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-secondary">
                          <CreditCard size={18} strokeWidth={3} />
                          <span className="text-[11px] font-black uppercase tracking-widest">Payment Details</span>
                        </div>
                        <p className="font-bold text-on_surface uppercase tracking-tight">
                          {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit / Debit Card'}
                        </p>
                        <Badge variant="surface" className="!bg-emerald-500/10 !text-emerald-500 !border-none !px-3 !py-1 !text-[9px] !font-black">TRANSACTION SECURE</Badge>
                      </div>
                    </div>
                  </div>
                </Result>
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          {currentStep !== 2 && (
            <div className="lg:w-[38%] w-full sticky top-32 space-y-6">
              <div className="bg-white rounded-[40px] shadow-2xl shadow-secondary/10 border border-surface_container overflow-hidden">
                <div className="bg-primary px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-on_primary">
                    <ShoppingBag size={24} strokeWidth={3} />
                    <h3 className="text-xl font-black uppercase tracking-widest">Summary</h3>
                  </div>
                  <Badge variant="surface" className="!bg-white/20 !text-on_primary !border-none !px-4 !py-1.5 !rounded-full !text-xs !font-black">
                    {cartItems.length} ITEMS
                  </Badge>
                </div>

                <div className="p-10">
                  <div className="space-y-8 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-5 group">
                        <div className="w-16 h-16 bg-surface_dim rounded-[20px] overflow-hidden flex-shrink-0 border border-surface_container group-hover:scale-110 transition-transform p-1 bg-white">
                          <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.title} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-black text-on_surface text-[15px] leading-tight mb-1">{item.title}</h4>
                          <p className="text-on_surface_variant font-bold text-[11px] uppercase tracking-wider">
                            QTY: {item.quantity}
                          </p>
                        </div>
                        <span className="font-black text-primary text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Divider className="!my-8" />

                  <div className="space-y-5 mb-10 font-bold text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-on_surface_variant">Subtotal</span>
                      <span className="text-on_surface">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on_surface_variant text-xs">Sales Tax (8%)</span>
                      <span className="text-on_surface">${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on_surface_variant">Shipping</span>
                      <span className="text-emerald-500 uppercase font-black text-[10px] tracking-[0.2em]">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-10 border-t-2 border-surface_dim pt-8">
                    <span className="text-xl font-black text-on_surface uppercase tracking-tight">Total</span>
                    <span className="text-5xl font-black text-primary tracking-tighter leading-none">
                      ${(cartTotal + (cartTotal * 0.08)).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={currentStep === 0 ? handleSubmit(onShippingSubmit) : placeOrder}
                    className="w-full h-[72px] rounded-[24px] !text-xl !font-black !uppercase !tracking-widest flex items-center justify-center gap-4 group shadow-xl shadow-primary/20 hover:shadow-primary/40"
                  >
                    {currentStep === 0 ? 'Payment Method' : 'Confirm Order'}
                    <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
                    <Lock size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <p className="text-sky-600 font-bold text-xs leading-relaxed">
                  You're earning <span className="font-black text-[14px]">37 Points</span> with this order!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
