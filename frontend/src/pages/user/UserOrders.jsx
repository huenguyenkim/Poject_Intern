import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Copy, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  PackageSearch,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  RefreshCcw,
  AlertCircle,
  Timer,
  ShoppingBag,
  Info,
  X,
  ArrowLeft
} from 'lucide-react';
import { Modal, Steps, Tooltip } from 'antd';
import { fetchMyOrdersThunk } from '../../store/orderSlice';
import { addToCart } from '../../store/cartSlice';
import { showSuccessToast, showWarningToast, showInfoToast, showErrorToast } from '../../utils/toastUtils';
import PageTransition from '../../components/layout/PageTransition';

const UserOrders = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { items: orders = [], status: orderStatus, error } = useSelector((state) => state.orders || {});
  const { products: catalogProducts = [] } = useSelector((state) => state.catalog || {});
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    dispatch(fetchMyOrdersThunk({ page: 1, limit: 50 }));
  }, [dispatch]);

  const tabs = [
    { id: 'ALL', label: t('orders.tab_all') },
    { id: 'PENDING', label: t('orders.tab_pending') },
    { id: 'PROCESSING', label: t('orders.tab_processing') },
    { id: 'SHIPPING', label: t('orders.tab_shipping') },
    { id: 'DELIVERED', label: t('orders.tab_delivered') },
    { id: 'CANCELLED', label: t('orders.tab_cancelled') },
  ];

  const getStatusInfo = (status = 'PENDING') => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'DELIVERED': return { color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCircle2 size={14} />, label: t('orders.status_delivered') };
      case 'SHIPPING': return { color: 'text-blue-500', bg: 'bg-blue-50', icon: <Truck size={14} />, label: t('orders.status_shipping') };
      case 'PROCESSING': return { color: 'text-orange-500', bg: 'bg-orange-50', icon: <Package size={14} />, label: t('orders.status_confirmed') };
      case 'CANCELLED': return { color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={14} />, label: t('orders.status_cancelled') };
      default: return { color: 'text-amber-500', bg: 'bg-amber-50', icon: <Clock size={14} />, label: t('orders.status_pending') };
    }
  };

  const filteredOrders = useMemo(() => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    return ordersArray.filter(order => {
      if (!order) return false;
      const status = (order.status || 'PENDING').toUpperCase();
      const matchTab = activeTab === 'ALL' || status === activeTab;
      
      const orderId = order.id ? order.id.toString() : '';
      const orderItems = Array.isArray(order.orderItems) ? order.orderItems : Array.isArray(order.items) ? order.items : [];
      const matchSearch = orderId.includes(searchQuery) || 
                          orderItems.some(item => 
                            (item.title || item.product?.productName || '').toLowerCase().includes(searchQuery.toLowerCase())
                          );
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(`ORD-${id}`);
    showInfoToast(t('orders.copy_id_success'));
  };

  const handleShowDetails = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReorder = (order) => {
    const itemsToReorder = Array.isArray(order?.orderItems) ? order.orderItems : Array.isArray(order?.items) ? order.items : [];
    if (itemsToReorder.length === 0) return;

    itemsToReorder.forEach(item => {
      const prod = catalogProducts.find(p => p.id === item.productId);
      if (prod && prod.stock > 0) {
        dispatch(addToCart({ ...prod, quantity: Math.min(item.quantity || 1, prod.stock) }));
      }
    });
    showSuccessToast(t('orders.reorder_success'));
    navigate(`/${lang}/cart`);
  };

  if (!currentUser) return <Navigate to={`/${lang}/auth`} />;

  // --- LOADING STATE ---
  if (orderStatus === 'loading' && (!orders || orders.length === 0)) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-black text-on_surface_variant uppercase tracking-widest animate-pulse">{t('common.loading')}</p>
        </div>
      </PageTransition>
    );
  }

  // --- ERROR STATE ---
  if (orderStatus === 'failed' && (!orders || orders.length === 0)) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-40 space-y-6 text-center px-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-on_surface uppercase">{t('common.error')}</h2>
            <p className="text-on_surface_variant font-bold max-w-xs mx-auto opacity-60">{error || t('orders.load_error')}</p>
          </div>
          <button 
            onClick={() => dispatch(fetchMyOrdersThunk({ page: 1, limit: 50 }))}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            {t('common.try_again')}
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 sm:px-0">
        
        {/* --- HEADER & SEARCH --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-on_surface tracking-tight uppercase">{t('orders.title')}</h1>
            <p className="text-on_surface_variant font-bold text-sm opacity-60">{t('orders.subtitle')} 🍭</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant opacity-40" size={18} />
            <input 
              type="text"
              placeholder={t('orders.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-surface_container rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* --- STATUS TABS --- */}
        <div className="bg-white border-b border-surface_container sticky top-0 z-10 overflow-x-auto no-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-8 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-on_surface_variant opacity-40 hover:opacity-100'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(var(--primary-rgb),0.4)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- ORDERS LIST --- */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 flex flex-col items-center text-center space-y-6 border border-surface_container/50 shadow-sm">
              <PackageSearch size={80} className="text-on_surface_variant/10" />
              <div className="space-y-2">
                <h3 className="text-xl font-black text-on_surface uppercase">{t('orders.empty_search_title')}</h3>
                <p className="text-on_surface_variant font-bold text-sm max-w-xs mx-auto opacity-60">
                  {t('orders.empty_search_desc')}
                </p>
              </div>
              <Link to={`/${lang}/shop`}>
                <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  <ShoppingBag size={18} /> {t('orders.shop_now')}
                </button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              if (!order) return null;
              const status = getStatusInfo(order.status);
              const orderItemsList = Array.isArray(order.orderItems) ? order.orderItems : Array.isArray(order.items) ? order.items : [];
              const firstItem = orderItemsList.length > 0 ? orderItemsList[0] : null;
              
              return (
                <div key={order.id} className="bg-white rounded-[32px] border border-surface_container overflow-hidden hover:shadow-2xl hover:border-primary/10 transition-all group">
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-surface_dim/30 border-b border-surface_container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest">{t('orders.order_id_label')}:</span>
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-surface_container">
                        <span className="text-xs font-black text-on_surface">ORD-{order.id}</span>
                        <button onClick={() => handleCopyId(order.id)} className="text-primary hover:scale-125 transition-transform">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-on_surface_variant opacity-50 uppercase">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US') : '--'}
                      </span>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
                        {status.icon} {status.label}
                      </div>
                    </div>
                  </div>

                  {/* Card Body (First Item Preview) */}
                  <div 
                    onClick={() => handleShowDetails(order)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-surface_container shrink-0 bg-[#F9F9F9]">
                      <img 
                        src={firstItem?.image || firstItem?.product?.image || '/images/placeholder.png'} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="font-black text-on_surface uppercase text-sm line-clamp-1">
                        {firstItem?.title || firstItem?.product?.productName || t('common.error')}
                      </h4>
                      <p className="text-[11px] font-bold text-on_surface_variant opacity-50">
                        {t('catalog.categories')}: {firstItem?.category || firstItem?.product?.category?.categoryName || t('common.error')}
                      </p>
                      <p className="text-xs font-black text-on_surface">
                        {t('cart.quantity')}: x{firstItem?.quantity || 0}
                      </p>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <p className="text-xs font-bold text-on_surface_variant opacity-40 line-through">
                        ${((firstItem?.price || firstItem?.unitPrice || 0) * 1.2).toFixed(2)}
                      </p>
                      <p className="text-lg font-black text-primary">
                        ${(firstItem?.price || firstItem?.unitPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-5 bg-[#FAFAFA] border-t border-surface_container flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-on_surface_variant opacity-30" />
                        <span className="text-xs font-bold text-on_surface_variant uppercase">{t('orders.payment_total')}:</span>
                        <span className="text-2xl font-black text-primary">${(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        {order.status === 'PENDING' && (
                          <>
                            <button className="flex-1 sm:flex-none bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">{t('orders.pay_now')}</button>
                            <button className="flex-1 sm:flex-none bg-white text-red-500 border border-red-100 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">{t('orders.cancel_order')}</button>
                          </>
                        )}
                        {order.status === 'DELIVERED' && (
                          <>
                            <button className="flex-1 sm:flex-none bg-white text-on_surface border-2 border-surface_container px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-surface_dim transition-all">{t('orders.review')}</button>
                            <button onClick={() => handleReorder(order)} className="flex-1 sm:flex-none bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">{t('orders.reorder_btn')}</button>
                          </>
                        )}
                        {(order.status === 'CANCELLED' || order.status === 'SHIPPING' || order.status === 'PROCESSING') && (
                          <button 
                            onClick={order.status === 'SHIPPING' ? () => handleShowDetails(order) : () => handleReorder(order)} 
                            className={`w-full sm:w-auto ${order.status === 'SHIPPING' ? 'bg-blue-500' : 'bg-primary'} text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all`}
                          >
                            {order.status === 'SHIPPING' ? t('orders.track_order') : t('orders.reorder_btn')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- ORDER DETAIL MODAL --- */}
        <Modal 
          title={null} 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          footer={null} 
          width={1000} 
          centered 
          className="order-detail-modal"
          closeIcon={null}
          getContainer={() => document.getElementById('root')}
        >
          {selectedOrder && (
            <div className="bg-[#FAF9F9] -mx-6 -mt-6 -mb-6 p-6 sm:p-10 rounded-3xl text-on_surface space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="space-y-6">
                <button onClick={() => setIsModalOpen(false)} className="flex items-center gap-2 text-sm font-bold text-on_surface_variant hover:text-primary transition-colors">
                  <ArrowLeft size={16} /> {t('orders.back_to_orders')}
                </button>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('orders.order_id_label')} #{selectedOrder.id ? `SR-${selectedOrder.id}` : '--'}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-[#F3E8FF] text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                      {t('admin.status')}: {getStatusInfo(selectedOrder.status).label}
                    </span>
                    <span className="text-sm font-bold text-on_surface_variant">
                      {t('profile.member_since')} {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Order Timeline */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px]">
                <h3 className="text-xl font-black mb-8 text-on_surface">{t('orders.visual_timeline')}</h3>
                <Steps
                  size="small"
                  current={
                    selectedOrder.status === 'PENDING' ? 0 :
                    selectedOrder.status === 'PROCESSING' ? 1 :
                    selectedOrder.status === 'SHIPPING' ? 2 :
                    selectedOrder.status === 'DELIVERED' ? 3 : 0
                  }
                  items={[
                    { title: <span className="text-xs font-black uppercase tracking-widest text-on_surface">{t('orders.timeline_ordered')}</span> },
                    { title: <span className="text-xs font-black uppercase tracking-widest text-on_surface">{t('orders.timeline_paid')}</span> },
                    { title: <span className="text-xs font-black uppercase tracking-widest text-on_surface">{t('orders.timeline_fulfillment')}</span> },
                    { title: <span className="text-xs font-black uppercase tracking-widest text-on_surface">{t('orders.timeline_shipped')}</span> },
                  ]}
                  className="px-2 sm:px-8"
                />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Order Items */}
                  <div className="bg-white p-6 sm:p-8 rounded-[32px]">
                    <h3 className="text-xl font-black mb-6 text-on_surface">{t('orders.items')}</h3>
                    <div className="space-y-6">
                      {(Array.isArray(selectedOrder.orderItems) ? selectedOrder.orderItems : Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-6 sm:items-center">
                          <div className="w-24 h-24 bg-surface_dim rounded-2xl overflow-hidden shrink-0 border border-surface_container">
                            <img 
                              src={item.image || item.product?.image || '/images/placeholder.png'} 
                              className="w-full h-full object-cover" 
                              alt="" 
                              onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-base text-on_surface">{item.title || item.product?.productName || t('common.error')}</h4>
                            <p className="text-xs font-bold text-on_surface_variant mt-1.5 mb-2.5 line-clamp-2 leading-relaxed">
                              {item.product?.description || t('catalog.default_desc')}
                            </p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                              {t('catalog.categories')}: {item.category || item.product?.category?.categoryName || t('common.error')}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-black text-xl text-on_surface">${((item.price || item.unitPrice || 0)).toFixed(2)}</p>
                            <p className="text-xs font-bold text-on_surface_variant mt-1">{t('cart.quantity')}: {item.quantity || 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Left Grid (Address & Support) */}
                  <div className="grid grid-cols-1 gap-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-8 rounded-[32px]">
                      <div className="flex items-center gap-3 mb-6">
                        <MapPin size={20} className="text-primary" />
                        <h3 className="text-lg font-black text-on_surface">{t('orders.shipping_info')}</h3>
                      </div>
                      <div className="space-y-1.5 text-sm font-bold text-on_surface_variant leading-relaxed">
                        <p className="font-black text-on_surface">{selectedOrder.receiverName || currentUser?.fullName}</p>
                        <p>{selectedOrder.address || t('profile.not_updated')}</p>
                        <p className="italic text-xs mt-4 opacity-70">{t('checkout.phone')}: {selectedOrder.phone || currentUser?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                  {/* Order Summary */}
                  <div className="bg-white p-8 rounded-[32px]">
                    <h3 className="text-lg font-black mb-6 text-on_surface">{t('checkout.order_summary')}</h3>
                    <div className="space-y-4 text-sm font-bold text-on_surface_variant">
                      <div className="flex justify-between items-center">
                        <span>{t('cart.subtotal')}</span>
                        <span className="text-on_surface">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 mt-2 border-t border-surface_container">
                        <span className="text-xl font-black text-on_surface">{t('cart.total')}</span>
                        <span className="text-2xl font-black text-primary">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-[#F4F4F5] p-6 rounded-[24px] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                      <CreditCard size={18} className="text-[#9333EA]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-on_surface">{t('orders.payment_method_label')}</h4>
                      <p className="text-xs font-bold text-on_surface_variant mt-1.5">{selectedOrder.paymentMethod === 'COD' ? t('checkout.payment_cod') : t('checkout.payment_card')}</p>
                    </div>
                  </div>

                  {/* Gift Note */}
                  <div className="bg-[#F4F4F5] p-6 rounded-[24px] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#9333EA]">
                      <Info size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-on_surface">{t('orders.gift_note')}</h4>
                      <p className="text-xs font-bold text-on_surface_variant mt-1.5 leading-relaxed">{t('cart.empty_desc')}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
};

export default UserOrders;
