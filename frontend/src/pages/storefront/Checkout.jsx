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
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { clearCart } from '../../store/cartSlice';
import { createOrderThunk } from '../../store/orderSlice';
import {
  ShoppingBag, Truck, CreditCard, ArrowLeft, ArrowRight, Lock, Sparkles, User, Phone, Mail, MapPin, Building, Navigation
} from 'lucide-react';
import { Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { mapBackendErrors, sanitizeData } from '../../utils/validationUtils';
import PageTransition from '../../components/layout/PageTransition';

const Checkout = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { status: orderStatus } = useSelector((state) => state.orders);

  const checkoutSchema = z.object({
    fullName: z.string().min(2, t('checkout.name_required', 'Full name is required')),
    phone: z.string().min(10, t('checkout.phone_required', 'Valid phone number is required')),
    email: z.string().email(t('checkout.email_invalid', 'Invalid email address')),
    address: z.string().min(5, t('checkout.address_required', 'Street address is required')),
    city: z.string().min(2, t('checkout.city_required', 'City is required')),
    postalCode: z.string().min(3, t('checkout.postal_required', 'Postal code is required')),
  });

  const { control, handleSubmit, formState: { errors }, getValues, setError } = useForm({
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
    { title: t('checkout.shipping', 'Shipping'), icon: <Truck size={18} /> },
    { title: t('checkout.payment', 'Payment'), icon: <CreditCard size={18} /> },
    { title: t('checkout.success', 'Success'), icon: <Sparkles size={18} /> },
  ];

  if (!currentUser) {
    return <Navigate to={`/${lang}/auth`} state={{ from: { pathname: `/${lang}/checkout` } }} replace />;
  }

  if (cartItems.length === 0 && currentStep !== 2) {
    return (
      <PageTransition>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-surface_dim">
          <div className="w-40 h-40 bg-white rounded-[40px] shadow-xl flex items-center justify-center mb-10">
            <span className="text-7xl">🍭</span>
          </div>
          <h1 className="text-5xl font-black text-on_surface mb-6 uppercase tracking-tight">{t('cart.empty_title', 'Your Stash is Empty')}</h1>
          <p className="text-xl text-on_surface_variant mb-12 max-w-md font-bold">{t('cart.empty_desc', "It looks like you haven't picked any treats yet.")}</p>
          <Link to={`/${lang}/shop`}>
            <Button variant="primary" size="lg" className="px-12 rounded-2xl">{t('cart.start_shopping', 'Back to Shop')}</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const onShippingSubmit = () => setCurrentStep(1);

  const placeOrder = async () => {
    const shippingInfo = sanitizeData(getValues());
    if (cartItems.length === 0) {
      showErrorToast(t('cart.empty_toast', 'Your basket is empty!'));
      return;
    }

    const orderData = {
      userId: currentUser?.id,
      receiverName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      address: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}`,
      paymentMethod: paymentMethod, 
      cartItems: cartItems.map(item => ({ productId: Number(item.id), quantity: item.quantity }))
    };

    try {
      await dispatch(createOrderThunk(orderData)).unwrap();
      dispatch(clearCart());
      showSuccessToast(t('checkout.order_success_toast', 'Order placed successfully! 📦'));
      setCurrentStep(2);
    } catch (error) {
      if (error?.response?.status === 400) {
        mapBackendErrors(error, setError);
        const shippingFields = ['fullName', 'phone', 'email', 'address', 'city', 'postalCode'];
        const messages = error?.response?.data?.message;
        const hasShippingError = Array.isArray(messages) && messages.some(msg => 
          shippingFields.some(field => msg.toLowerCase().includes(field.toLowerCase()))
        );
        if (hasShippingError) setCurrentStep(0);
      } else {
        showErrorToast(error?.response?.data?.message || t('common.error_occurred', 'Failed to place order'));
      }
    }
  };

  const shippingInfo = getValues();

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {currentStep !== 2 && (
            <header className="mb-12">
              <h1 className="text-5xl font-black text-primary mb-4 uppercase tracking-tight">{t('header.checkout')}</h1>
              <p className="text-on_surface_variant font-bold text-lg mb-12">{t('checkout.subtitle', 'Get ready for your delicious delivery.')}</p>
              <div className="max-w-2xl">
                <Steps current={currentStep} items={steps} className="candy-steps" />
              </div>
            </header>
          )}

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-[62%] w-full space-y-10">
              {currentStep === 0 && (
                <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-surface_container">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Truck size={28} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-on_surface uppercase tracking-tight">{t('checkout.shipping_info', 'Shipping Info')}</h2>
                  </div>

                  <Form layout="vertical" onFinish={handleSubmit(onShippingSubmit)} className="space-y-2">
                    <div className="space-y-6">
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('checkout.full_name', 'Full Name')}</span>} validateStatus={errors.fullName ? 'error' : ''} help={errors.fullName?.message}>
                            <AntInput {...field} prefix={<User size={18} className="mr-2" />} placeholder="Charlie Bucket" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                          </Form.Item>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('profile.phone', 'Phone Number')}</span>} validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
                              <AntInput {...field} prefix={<Phone size={18} className="mr-2" />} placeholder="+1 (555) 000-0000" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                            </Form.Item>
                          )}
                        />
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('profile.email', 'Email Address')}</span>} validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                              <AntInput {...field} prefix={<Mail size={18} className="mr-2" />} placeholder="hello@candyshop.com" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                            </Form.Item>
                          )}
                        />
                      </div>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('checkout.address', 'Street Address')}</span>} validateStatus={errors.address ? 'error' : ''} help={errors.address?.message}>
                            <AntInput {...field} prefix={<MapPin size={18} className="mr-2" />} placeholder="123 Lollipop Lane" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                          </Form.Item>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('checkout.city', 'City')}</span>} validateStatus={errors.city ? 'error' : ''} help={errors.city?.message}>
                              <AntInput {...field} prefix={<Building size={18} className="mr-2" />} placeholder="Sweetwater" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                            </Form.Item>
                          )}
                        />
                        <Controller
                          name="postalCode"
                          control={control}
                          render={({ field }) => (
                            <Form.Item label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant">{t('checkout.postal_code', 'Postal Code')}</span>} validateStatus={errors.postalCode ? 'error' : ''} help={errors.postalCode?.message}>
                              <AntInput {...field} prefix={<Navigation size={18} className="mr-2" />} placeholder="54321" className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold" />
                            </Form.Item>
                          )}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
              )}

              {currentStep === 1 && (
                <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-surface_container">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                      <CreditCard size={28} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-on_surface uppercase tracking-tight">{t('checkout.payment_method', 'Payment Method')}</h2>
                  </div>

                  <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full flex flex-col gap-6">
                    <label className={`cursor-pointer p-8 rounded-[32px] border-[3.5px] transition-all flex items-center gap-6 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-xl' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}>
                      <Radio value="COD" className="candy-radio" />
                      <div className="flex-grow">
                        <p className="font-black text-on_surface text-lg">{t('checkout.cod', 'Cash on Delivery')}</p>
                        <p className="text-sm font-bold text-on_surface_variant">{t('checkout.cod_desc', 'Pay when your candy arrives.')}</p>
                      </div>
                      <span className="text-4xl">💵</span>
                    </label>
                    <label className={`cursor-pointer p-8 rounded-[32px] border-[3.5px] transition-all flex items-center gap-6 ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5 shadow-xl' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}>
                      <Radio value="CARD" className="candy-radio" />
                      <div className="flex-grow">
                        <p className="font-black text-on_surface text-lg">{t('checkout.card', 'Credit / Debit Card')}</p>
                        <p className="text-sm font-bold text-on_surface_variant">{t('checkout.card_desc', 'Instant, secure payment.')}</p>
                      </div>
                      <span className="text-4xl">💳</span>
                    </label>
                  </Radio.Group>

                  <div className="mt-12">
                    <Button variant="ghost" onClick={() => setCurrentStep(0)} className="!text-on_surface_variant !font-black !uppercase tracking-widest gap-2 flex items-center"><ArrowLeft size={18} /> {t('checkout.back', 'Back')}</Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-8">
                  <Result
                    status="success"
                    title={<h2 className="text-5xl font-black uppercase tracking-tight mt-4">{t('checkout.success_title', 'Order Confirmed!')}</h2>}
                    subTitle={<p className="text-lg font-bold text-on_surface_variant max-w-md mx-auto mt-4">{t('checkout.success_msg', "Packed with love. We'll notify you soon!")}</p>}
                    className="bg-white rounded-[40px] border shadow-2xl p-16"
                    extra={[
                      <div key="actions" className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link to={`/${lang}/profile/orders`} key="orders"><Button variant="primary" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest gap-3"><ShoppingBag size={20} /> {t('orders.title', 'View Orders')}</Button></Link>
                        <Link to={`/${lang}/shop`} key="shop"><Button variant="surface" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest">🍭 {t('cart.start_shopping', 'Shop More')}</Button></Link>
                      </div>
                    ]}
                  >
                    <div className="mt-12 space-y-6">
                      <Divider className="!m-0"><span className="text-[10px] font-black text-on_surface_variant/40 uppercase tracking-[0.4em]">{t('checkout.order_summary', 'Order Summary')}</span></Divider>
                      <div className="bg-surface_dim/50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-primary"><MapPin size={18} strokeWidth={3} /><span className="text-[11px] font-black uppercase tracking-widest">{t('checkout.shipping_info', 'Delivery Address')}</span></div>
                          <p className="font-bold text-on_surface leading-relaxed">{shippingInfo.fullName}<br />{shippingInfo.address}<br />{shippingInfo.city}, {shippingInfo.postalCode}</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-secondary"><CreditCard size={18} strokeWidth={3} /><span className="text-[11px] font-black uppercase tracking-widest">{t('checkout.payment_method', 'Payment Details')}</span></div>
                          <p className="font-bold text-on_surface uppercase tracking-tight">{paymentMethod === 'COD' ? t('checkout.cod', 'Cash on Delivery') : t('checkout.card', 'Credit / Debit Card')}</p>
                          <Badge variant="surface" className="!bg-emerald-500/10 !text-emerald-500 !border-none !px-3 !py-1 !text-[9px] !font-black uppercase tracking-widest">{t('checkout.secure', 'Transaction Secure')}</Badge>
                        </div>
                      </div>
                    </div>
                  </Result>
                </div>
              )}
            </div>

            {currentStep !== 2 && (
              <div className="lg:w-[38%] w-full sticky top-32 space-y-6">
                <div className="bg-white rounded-[40px] shadow-2xl border border-surface_container overflow-hidden">
                  <div className="bg-primary px-10 py-8 flex items-center justify-between text-on_primary">
                    <div className="flex items-center gap-4"><ShoppingBag size={24} strokeWidth={3} /><h3 className="text-xl font-black uppercase tracking-widest">{t('checkout.summary', 'Summary')}</h3></div>
                    <Badge variant="surface" className="!bg-white/20 !text-on_primary !border-none !px-4 !py-1.5 !rounded-full !text-xs !font-black">{t('cart.items_count', { count: cartItems.length })}</Badge>
                  </div>

                  <div className="p-10">
                    <div className="space-y-8 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-5 group">
                          <div className="w-16 h-16 bg-white rounded-[20px] overflow-hidden flex-shrink-0 border p-1 group-hover:scale-110 transition-transform">
                            {item.image && <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.title} />}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-black text-on_surface text-[15px] leading-tight mb-1">{item.title}</h4>
                            <p className="text-on_surface_variant font-bold text-[11px] uppercase tracking-wider">{t('cart.quantity', 'QTY')}: {item.quantity}</p>
                          </div>
                          <span className="font-black text-primary text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Divider className="!my-8" />
                    <div className="space-y-5 mb-10 font-bold text-sm">
                      <div className="flex justify-between items-center"><span className="text-on_surface_variant">{t('cart.subtotal', 'Subtotal')}</span><span className="text-on_surface">${cartTotal.toFixed(2)}</span></div>
                      <div className="flex justify-between items-center"><span className="text-on_surface_variant text-xs">{t('cart.tax', 'Sales Tax')} (8%)</span><span className="text-on_surface">${(cartTotal * 0.08).toFixed(2)}</span></div>
                      <div className="flex justify-between items-center"><span className="text-on_surface_variant">{t('cart.shipping', 'Shipping')}</span><span className="text-emerald-500 uppercase font-black text-[10px] tracking-widest">{t('cart.free', 'Free')}</span></div>
                    </div>
                    <div className="flex justify-between items-end mb-10 border-t-2 border-surface_dim pt-8">
                      <span className="text-xl font-black text-on_surface uppercase tracking-tight">{t('common.total', 'Total')}</span>
                      <span className="text-5xl font-black text-primary tracking-tighter leading-none">${(cartTotal + (cartTotal * 0.08)).toFixed(2)}</span>
                    </div>

                    <Button onClick={currentStep === 0 ? handleSubmit(onShippingSubmit) : placeOrder} isLoading={orderStatus === 'loading'} className="w-full h-[72px] rounded-[24px] !text-xl !font-black uppercase tracking-widest gap-4 group shadow-xl shadow-primary/20">
                      {currentStep === 0 ? t('checkout.payment_method', 'Payment Method') : t('checkout.confirm_order', 'Confirm Order')}
                      <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
                      <Lock size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('checkout.secure', 'Secure Checkout')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
