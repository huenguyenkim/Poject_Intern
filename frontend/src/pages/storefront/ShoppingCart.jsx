import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateQuantity, removeFromCart, clearCart, clearValidationAlerts } from '../../store/cartSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PageTransition from '../../components/layout/PageTransition';

const ShoppingCart = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();
  const { items: cartItems, hasValidationAlerts, priceChangedGlobal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (id, amount) => {
    dispatch(updateQuantity({ id, amount }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleClearCart = () => {
    if (window.confirm(t('cart.clear_confirm', 'Are you sure you want to empty your basket?'))) {
      dispatch(clearCart());
    }
  };

  const handleRemoveInvalid = () => {
    cartItems.forEach(item => {
      if (item.isUnavailable || item.isOutOfStock) {
        dispatch(removeFromCart({ id: item.id }));
      }
    });
    dispatch(clearValidationAlerts());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const hasInvalidItems = cartItems.some(item => item.isUnavailable || item.isOutOfStock);

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="bg-surface_dim min-h-screen py-20 px-4">
          <div className="max-w-[600px] mx-auto text-center bg-white p-12 rounded-[40px] shadow-sm border border-surface_container">
            <div className="w-32 h-32 bg-surface_container rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={56} className="text-on_surface_variant/40" />
            </div>
            <h1 className="text-4xl font-black text-on_surface mb-4 uppercase tracking-tight">{t('cart.empty_title', 'Your basket is empty')}</h1>
            <p className="text-on_surface_variant text-lg font-medium mb-10">
              {t('cart.empty_desc', "Looks like you haven't added any sweet treats yet!")}
            </p>
            <Link to={`/${lang}/shop`}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-12 rounded-full text-lg shadow-xl hover:-translate-y-1">
                {t('cart.start_shopping', 'Start Shopping')}
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen py-8 md:py-16 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-on_surface tracking-tight mb-2 uppercase">{t('header.cart')}</h1>
              <p className="text-on_surface_variant font-medium text-lg">{t('cart.items_count', { count: cartItems.length })}</p>
            </div>
            <button onClick={handleClearCart} className="text-error font-bold hover:bg-error/10 px-4 py-2 rounded-xl transition-colors hidden sm:block uppercase text-xs tracking-widest font-black">
              {t('cart.clear_cart', 'Empty Basket')}
            </button>
          </div>

          {hasValidationAlerts && (
            <div className="mb-8">
              <div className="bg-white rounded-[32px] p-1 border-2 border-primary/20 shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <AlertTriangle size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-on_surface uppercase tracking-tight">{t('cart.sync_title', 'Cart Synchronization')}</h3>
                      <p className="text-on_surface_variant font-bold text-sm">
                        {priceChangedGlobal ? t('cart.sync_price_msg', 'Prices or availability changed.') : t('cart.sync_stock_msg', 'Some items are unavailable.')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {hasInvalidItems && (
                      <Button variant="primary" onClick={handleRemoveInvalid} className="flex-1 md:flex-none h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest gap-2">
                        <Trash2 size={16} /> {t('cart.quick_fix', 'Remove Invalid')}
                      </Button>
                    )}
                    <button onClick={() => dispatch(clearValidationAlerts())} className="h-14 px-6 rounded-2xl bg-surface_dim text-on_surface_variant font-black uppercase text-[10px] tracking-widest">{t('common.dismiss', 'Dismiss')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="bg-white rounded-[40px] shadow-sm border border-surface_container overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-surface_container text-on_surface_variant font-black text-xs uppercase tracking-widest bg-surface_container_lowest">
                  <div className="col-span-6">{t('common.product', 'Product')}</div>
                  <div className="col-span-3 text-center">{t('cart.quantity', 'Quantity')}</div>
                  <div className="col-span-3 text-right">{t('common.total', 'Total')}</div>
                </div>

                <div className="divide-y divide-surface_container">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col md:grid md:grid-cols-12 items-center gap-6 md:gap-4 hover:bg-surface_container_lowest/50 transition-colors">
                      <div className="w-full flex justify-end md:hidden mb-[-2rem] relative z-10">
                        <button onClick={() => handleRemoveItem(item.id)} className="text-on_surface_variant/40 hover:text-error bg-white rounded-full p-2 shadow-sm"><Trash2 size={20} /></button>
                      </div>

                      <div className="col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full text-center sm:text-left">
                        <Link to={`/${lang}/shop/${item.id}`} className="shrink-0 group">
                          <div className={`w-32 h-32 sm:w-24 sm:h-24 ${!item.image ? 'bg-surface_dim' : ''} rounded-[24px] overflow-hidden bg-surface_container group-hover:scale-105 transition-transform shadow-inner`}>
                            {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                          </div>
                        </Link>
                        <div className="flex flex-col justify-center">
                          <Link to={`/${lang}/shop/${item.id}`} className={`font-black text-xl md:text-lg text-on_surface hover:text-primary transition-colors mb-1 line-clamp-2 ${item.isUnavailable || item.isOutOfStock ? 'opacity-40 grayscale' : ''}`}>{item.title}</Link>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`font-black text-lg md:text-base ${item.priceChanged ? 'text-primary' : 'text-secondary'}`}>${(Number(item.price) || 0).toFixed(2)}</span>
                            {item.priceChanged && <Badge variant="surface" className="!bg-primary/10 !text-primary !border-none !text-[9px] !font-black !px-2 !py-0.5 uppercase">{t('cart.price_updated', 'Price Updated')}</Badge>}
                            {item.isOutOfStock && <Badge variant="surface" className="!bg-error/10 !text-error !border-none !text-[9px] !font-black !px-2 !py-0.5 uppercase">{t('orders.out_of_stock', 'Out of Stock')}</Badge>}
                            {item.isUnavailable && <Badge variant="surface" className="!bg-on_surface/10 !text-on_surface_variant !border-none !text-[9px] !font-black !px-2 !py-0.5 uppercase">{t('orders.unavailable', 'Unavailable')}</Badge>}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3 w-full flex justify-center items-center">
                        <div className={`flex items-center bg-surface_container_highest rounded-full p-1 border border-surface_container ${item.isUnavailable || item.isOutOfStock ? 'opacity-30 pointer-events-none' : ''}`}>
                          <button onClick={() => handleUpdateQuantity(item.id, -1)} disabled={item.isUnavailable || item.isOutOfStock || item.quantity <= 1} className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white text-on_surface hover:text-primary transition-all disabled:opacity-50"><Minus size={16} strokeWidth={3} /></button>
                          <span className="w-12 text-center font-black text-lg md:text-base">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, 1)} disabled={item.isUnavailable || item.isOutOfStock} className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white text-on_surface hover:text-primary transition-all"><Plus size={16} strokeWidth={3} /></button>
                        </div>
                      </div>

                      <div className="col-span-3 w-full flex justify-between md:justify-end items-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-surface_container">
                        <span className="md:hidden font-black text-on_surface_variant uppercase text-xs tracking-widest">{t('common.total', 'Total')}:</span>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-2xl md:text-xl text-on_surface">${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</span>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-on_surface_variant hover:text-error transition-colors hidden md:block p-2 hover:bg-error/10 rounded-full"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-surface_container lg:sticky lg:top-28">
                <h2 className="text-2xl font-black text-on_surface mb-8 pb-4 border-b border-surface_container uppercase tracking-tight">{t('checkout.order_summary', 'Order Summary')}</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-on_surface_variant font-medium text-lg">
                    <span>{t('cart.subtotal', 'Subtotal')}</span>
                    <span className="font-bold text-on_surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on_surface_variant font-medium text-lg">
                    <span>{t('cart.tax', 'Tax')}</span>
                    <span className="font-bold text-on_surface">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on_surface_variant font-medium text-lg">
                    <span>{t('cart.shipping', 'Shipping')}</span>
                    <span className="font-bold text-on_surface">{shipping === 0 ? <span className="text-primary uppercase tracking-widest text-sm">{t('cart.free', 'Free')}</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="border-t border-surface_container pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-on_surface">{t('common.total', 'Total')}</span>
                    <span className="text-4xl font-black text-on_surface tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>

                {hasInvalidItems ? (
                  <div className="space-y-4 text-center">
                    <Button variant="surface" size="lg" disabled className="w-full h-16 rounded-[20px] text-lg opacity-50">{t('cart.fix_items', 'Fix Items to Checkout')}</Button>
                    <p className="text-[10px] text-error font-black uppercase tracking-widest">{t('cart.fix_msg', 'Remove invalid items to continue')}</p>
                  </div>
                ) : (
                  <Link to={`/${lang}/checkout`} className="block">
                    <Button variant="primary" size="lg" className="w-full h-16 rounded-[20px] text-lg shadow-xl hover:-translate-y-1 group uppercase tracking-tight font-black">
                      {t('cart.proceed', 'Proceed to Checkout')} <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ShoppingCart;
