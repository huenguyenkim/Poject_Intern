import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Radio,
  Divider,
  Input as AntInput,
  Result,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { clearCart } from '../../store/cartSlice';
import { createOrderThunk } from '../../store/orderSlice';
import {
  ShoppingBag, Truck, CreditCard, ArrowLeft, Lock, User, Phone, MapPin, 
  Wallet, Landmark, Receipt, Ticket, CheckCircle2, AlertCircle, Loader2,
  ChevronRight, ArrowRight, X
} from 'lucide-react';
import { Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { mapBackendErrors, sanitizeData } from '../../utils/validationUtils';
import PageTransition from '../../components/layout/PageTransition';
import apiClient from '../../api/apiClient';

const Checkout = () => {
  const { t } = useTranslation();
  const { lang = 'vi' } = useParams();
  const cartItems = useSelector((state) => state.cart.items);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { status: orderStatus } = useSelector((state) => state.orders);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for logic
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  
  // Voucher state
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Schema validation
  const checkoutSchema = z.object({
    fullName: z.string().min(2, t('checkout.full_name_error', 'Họ tên không được để trống')),
    phone: z.string().min(10, t('checkout.phone_error', 'Số điện thoại không hợp lệ')),
    address: z.string().min(5, t('checkout.address_error', 'Địa chỉ giao hàng không được để trống')),
  });

  const { control, handleSubmit, formState: { errors }, setError, setValue } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: currentUser?.fullName || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
    }
  });

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = shippingMethod === 'EXPRESS' ? 15 : (subtotal > 50 ? 0 : 5);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAmount = subtotal + shippingFee - discountAmount;

  // Sync user info if changed
  useEffect(() => {
    if (currentUser) {
      setValue('fullName', currentUser.fullName || '');
      setValue('phone', currentUser.phone || '');
      setValue('address', currentUser.address || '');
    }
  }, [currentUser, setValue]);

  if (!currentUser) {
    return <Navigate to={`/${lang}/auth`} state={{ from: { pathname: `/${lang}/checkout` } }} replace />;
  }

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <PageTransition>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 text-center bg-surface_dim">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[32px] md:rounded-[40px] shadow-xl flex items-center justify-center mb-8 md:mb-10">
            <span className="text-5xl md:text-7xl">🍭</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-on_surface mb-4 md:mb-6 uppercase tracking-tight">{t('checkout.empty_title')}</h1>
          <p className="text-lg md:text-xl text-on_surface_variant mb-8 md:12 max-w-md font-bold px-4">{t('checkout.empty_desc')}</p>
          <Link to={`/${lang}/shop`}>
            <Button variant="primary" size="lg" className="px-10 md:px-12 rounded-2xl w-full sm:w-auto">{t('header.back_to_shop')}</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    setCouponError('');
    
    try {
      const response = await apiClient.post('/orders/validate-coupon', {
        code: couponCode,
        subtotal
      });
      setAppliedCoupon(response.data);
      showSuccessToast(t('checkout.coupon_applied'));
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err?.response?.data?.message || t('checkout.invalid_coupon'));
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Payment error state
  const [paymentError, setPaymentError] = useState('');

  const paymentErrorMapping = {
    'insufficient_funds': t('checkout.insufficient_funds'),
    'expired_card': t('checkout.expired_card'),
    'incorrect_cvc': t('checkout.incorrect_cvc'),
    'card_declined': t('checkout.card_declined'),
    'processing_error': t('checkout.processing_error'),
  };

  const handlePlaceOrder = async (data) => {
    const sanitizedData = sanitizeData(data);
    setPaymentError(''); // Clear previous errors
    
    const orderData = {
      userId: currentUser.id,
      receiverName: sanitizedData.fullName,
      phone: sanitizedData.phone,
      address: sanitizedData.address,
      paymentMethod: paymentMethod,
      shippingMethod: shippingMethod,
      couponCode: appliedCoupon ? couponCode : undefined,
      cartItems: cartItems.map(item => ({ productId: Number(item.id), quantity: item.quantity }))
    };

    try {
      const result = await dispatch(createOrderThunk(orderData)).unwrap();
      setLastOrderId(result.id);
      dispatch(clearCart());
      setIsSuccess(true);
      showSuccessToast(t('checkout.success_title'));
    } catch (error) {
      console.error('Checkout Error:', error);
      
      const errorCode = error?.response?.data?.code || error?.code;
      const mappedMessage = paymentErrorMapping[errorCode];

      if (mappedMessage) {
        setPaymentError(mappedMessage);
        // Scroll to error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        mapBackendErrors(error, setError);
        const serverMessage = error?.response?.data?.message;
        const displayMessage = Array.isArray(serverMessage) ? serverMessage[0] : serverMessage;
        showErrorToast(displayMessage || t('checkout.order_error'));
      }
    }
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="bg-surface_dim min-h-screen py-10 md:py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="success"
              title={<h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mt-6">{t('checkout.success_title')}</h2>}
              subTitle={<p className="text-base md:text-lg font-bold text-on_surface_variant mt-4 px-4">{t('checkout.success_desc', { orderId: lastOrderId })}</p>}
              className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl p-8 sm:p-20"
              extra={[
                <div key="actions" className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-10">
                  <Link to={`/${lang}/profile/orders`} className="w-full sm:w-auto">
                    <Button variant="primary" className="h-14 md:h-16 w-full sm:px-10 rounded-2xl font-black uppercase tracking-widest gap-3 text-sm md:text-base">
                      <Receipt size={20} /> {t('checkout.view_order')}
                    </Button>
                  </Link>
                  <Link to={`/${lang}/shop`} className="w-full sm:w-auto">
                    <Button variant="surface" className="h-14 md:h-16 w-full sm:px-10 rounded-2xl font-black uppercase tracking-widest text-sm md:text-base">
                      🍭 {t('checkout.continue_shopping')}
                    </Button>
                  </Link>
                </div>
              ]}
            />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-12">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* CỘT 1: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
            <div className="lg:w-[65%] w-full space-y-6 md:space-y-8">
              
              {/* Thông tin người nhận */}
              <section className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-surface_container">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                      <User size={24} md:size={28} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-on_surface uppercase tracking-tight">{t('checkout.receiver_info')}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant ml-1">{t('checkout.full_name')}</label>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <AntInput 
                            {...field} 
                            placeholder={t('checkout.full_name_placeholder')} 
                            className={`!bg-surface_dim !border-none !rounded-xl md:!rounded-2xl !py-3 md:!py-4 !px-6 !font-bold ${errors.fullName ? '!ring-2 !ring-error' : ''}`} 
                          />
                        )}
                      />
                      {errors.fullName && <p className="text-error text-[10px] font-black ml-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant ml-1">{t('checkout.phone')}</label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <AntInput 
                            {...field} 
                            placeholder={t('checkout.phone_placeholder')} 
                            className={`!bg-surface_dim !border-none !rounded-xl md:!rounded-2xl !py-3 md:!py-4 !px-6 !font-bold ${errors.phone ? '!ring-2 !ring-error' : ''}`} 
                          />
                        )}
                      />
                      {errors.phone && <p className="text-error text-[10px] font-black ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-on_surface_variant ml-1">{t('checkout.address')}</label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <AntInput.TextArea 
                          {...field} 
                          rows={3}
                          placeholder={t('checkout.address_placeholder')} 
                          className={`!bg-surface_dim !border-none !rounded-xl md:!rounded-2xl !py-3 md:!py-4 !px-6 !font-bold ${errors.address ? '!ring-2 !ring-error' : ''}`} 
                        />
                      )}
                    />
                    {errors.address && <p className="text-error text-[10px] font-black ml-1">{errors.address.message}</p>}
                  </div>
                </div>
              </section>

              {/* Đơn vị vận chuyển */}
              <section className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-surface_container">
                <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-info/10 rounded-xl md:rounded-2xl flex items-center justify-center text-info">
                    <Truck size={24} md:size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-on_surface uppercase tracking-tight">{t('checkout.shipping_method')}</h2>
                </div>

                <Radio.Group 
                  value={shippingMethod} 
                  onChange={(e) => setShippingMethod(e.target.value)} 
                  className="w-full flex flex-col gap-4 md:gap-5"
                >
                  <label className={`cursor-pointer p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-[3.5px] transition-all flex items-center gap-4 md:gap-6 ${shippingMethod === 'STANDARD' ? 'border-primary bg-primary/5 shadow-lg' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}>
                    <Radio value="STANDARD" className="candy-radio" />
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <p className="font-black text-on_surface text-base md:text-lg">{t('checkout.shipping_standard')}</p>
                        <Badge variant="surface" className="!bg-emerald-500/10 !text-emerald-500 !border-none text-[10px]">{subtotal > 50 ? t('cart.free') : '$5.00'}</Badge>
                      </div>
                      <p className="text-[12px] md:text-sm font-bold text-on_surface_variant">{t('checkout.shipping_standard_desc')}</p>
                    </div>
                    <span className="text-3xl md:text-4xl shrink-0">📦</span>
                  </label>

                  <label className={`cursor-pointer p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-[3.5px] transition-all flex items-center gap-4 md:gap-6 ${shippingMethod === 'EXPRESS' ? 'border-primary bg-primary/5 shadow-lg' : 'border-surface_container bg-surface_dim hover:border-primary/30'}`}>
                    <Radio value="EXPRESS" className="candy-radio" />
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <p className="font-black text-on_surface text-base md:text-lg">{t('checkout.shipping_express')}</p>
                        <Badge variant="secondary" className="text-[10px]">$15.00</Badge>
                      </div>
                      <p className="text-[12px] md:text-sm font-bold text-on_surface_variant">{t('checkout.shipping_express_desc')}</p>
                    </div>
                    <span className="text-3xl md:text-4xl shrink-0">🚀</span>
                  </label>
                </Radio.Group>
              </section>

              {/* Phương thức thanh toán */}
              <section className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-surface_container">
                <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary">
                    <CreditCard size={24} md:size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-on_surface uppercase tracking-tight">{t('checkout.payment_method')}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'COD', label: t('checkout.payment_cod'), icon: <Wallet size={18} />, emoji: '💵' },
                    { id: 'MOMO', label: t('checkout.payment_momo'), icon: <Ticket size={18} />, emoji: '📱' },
                    { id: 'CARD', label: t('checkout.payment_card'), icon: <CreditCard size={18} />, emoji: '💳' },
                    { id: 'BANK', label: t('checkout.payment_bank'), icon: <Landmark size={18} />, emoji: '🏦' },
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`cursor-pointer p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all flex items-center gap-3 md:gap-4 ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-surface_container bg-surface_dim hover:border-primary/20'}`}
                    >
                      <Radio 
                        value={method.id} 
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="candy-radio" 
                      />
                      <div className="flex-grow flex items-center gap-2 md:gap-3">
                        <span className="text-on_surface_variant scale-90 md:scale-100">{method.icon}</span>
                        <span className="font-black text-on_surface text-[12px] md:text-sm uppercase tracking-tight">{method.label}</span>
                      </div>
                      <span className="text-xl md:text-2xl">{method.emoji}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* CỘT 2: TÓM TẮT ĐƠN HÀNG */}
            <div className="lg:w-[35%] w-full lg:sticky lg:top-32 space-y-6">
              
              {/* Thông báo lỗi thanh toán */}
              {paymentError && (
                <div className="bg-error/10 border-2 border-error rounded-[24px] md:rounded-[32px] p-5 md:p-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-4 text-error">
                    <AlertCircle size={24} className="shrink-0 mt-1" />
                    <div className="space-y-3">
                      <p className="font-black text-sm uppercase tracking-tight">Thanh toán thất bại</p>
                      <p className="text-[11px] md:text-xs font-bold leading-relaxed">{paymentError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-surface_container overflow-hidden">
                <div className="bg-primary px-6 md:px-8 py-6 md:py-8 flex items-center justify-between text-on_primary">
                  <div className="flex items-center gap-3 md:gap-4">
                    <ShoppingBag size={20} md:size={24} strokeWidth={3} />
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-widest">{t('checkout.order_summary')}</h3>
                  </div>
                  <Badge variant="surface" className="!bg-white/20 !text-on_primary !border-none !px-3 md:!px-4 !py-1.5 !rounded-full !font-black text-[10px] md:text-xs">
                    {cartItems.length} {t('checkout.items_count')}
                  </Badge>
                </div>

                <div className="p-6 md:p-8">
                  {/* Danh sách sản phẩm thu gọn */}
                  <div className="space-y-5 mb-6 md:mb-8 max-h-[220px] md:max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 md:gap-4 group">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-surface_dim rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border p-1 group-hover:scale-105 transition-transform">
                          <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.title} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-black text-on_surface text-xs md:text-sm leading-tight mb-1 line-clamp-1">{item.title}</h4>
                          <p className="text-on_surface_variant font-bold text-[9px] md:text-[10px] uppercase tracking-wider">x{item.quantity}</p>
                        </div>
                        <span className="font-black text-primary text-xs md:text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon section */}
                  {!appliedCoupon ? (
                    <div className="space-y-4 mb-8">
                      <div className="flex gap-2">
                        <AntInput 
                          placeholder={t('checkout.coupon_placeholder')} 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="!bg-surface_dim !border-none !rounded-xl !py-3 !px-4 !font-bold flex-grow uppercase"
                          onPressEnter={handleApplyCoupon}
                        />
                        <Button 
                          variant="surface" 
                          onClick={handleApplyCoupon}
                          isLoading={isValidatingCoupon}
                          className="!rounded-xl !px-6 !font-black uppercase text-xs"
                        >
                          {t('checkout.coupon_apply')}
                        </Button>
                      </div>
                      {couponError && <p className="text-error text-[10px] font-black ml-1 uppercase">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-4 mb-8 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                          <Ticket size={20} />
                        </div>
                        <div>
                          <p className="font-black text-emerald-700 text-xs uppercase tracking-tight">{appliedCoupon.code}</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">{t('checkout.coupon_applied')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                        className="text-emerald-500 hover:text-emerald-700 p-2 transition-colors"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  )}

                  <Divider className="!my-6 md:!my-8" />

                  {/* Bảng tính tiền chi tiết */}
                  <div className="space-y-3 mb-8 md:mb-10 font-bold text-xs md:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-on_surface_variant">{t('checkout.subtotal')}</span>
                      <span className="text-on_surface">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on_surface_variant">{t('checkout.shipping_fee')}</span>
                      <span className={`${shippingFee === 0 ? 'text-emerald-500 uppercase font-black text-[10px]' : 'text-on_surface'}`}>
                        {shippingFee === 0 ? t('cart.free') : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-emerald-600">
                        <span>{t('checkout.discount')}</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mb-8 md:mb-10 border-t-2 border-surface_dim pt-6 md:pt-8">
                    <span className="text-lg md:text-xl font-black text-on_surface uppercase tracking-tight mb-1 md:mb-2">{t('checkout.total')}</span>
                    <span className="text-3xl md:text-5xl font-black text-primary tracking-tighter leading-none">${totalAmount.toFixed(2)}</span>
                  </div>

                  <Button 
                    onClick={handleSubmit(handlePlaceOrder)} 
                    isLoading={orderStatus === 'loading'} 
                    className="w-full h-[64px] md:h-[80px] rounded-[24px] md:rounded-[28px] text-lg md:text-xl font-black uppercase tracking-widest gap-3 md:gap-4 group shadow-xl shadow-primary/30 flex items-center justify-center px-4"
                  >
                    {orderStatus === 'loading' ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={20} md:size={24} />
                        <span>{t('checkout.processing')}</span>
                      </div>
                    ) : (
                      <>
                        <span>{t('checkout.place_order')}</span>
                        <ArrowRight size={20} md:size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform hidden sm:inline" />
                      </>
                    )}
                  </Button>

                  <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 opacity-50">
                    <Lock size={12} md:size={14} strokeWidth={3} className="text-emerald-500" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('checkout.secure_checkout')}</span>
                  </div>
                </div>
              </div>

              {/* Secure badges */}
              <div className="bg-white rounded-[24px] md:rounded-3xl p-4 md:p-6 flex justify-around items-center border border-surface_container shadow-sm gap-4 md:gap-8 overflow-hidden">
                <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" className="h-3 md:h-4 object-contain" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 md:h-8 object-contain" alt="Mastercard" />
                <img src="https://static.mservice.io/img/logo-momo.png" className="h-6 md:h-8 object-contain rounded-lg" alt="MoMo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 md:h-5 object-contain" alt="PayPal" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
