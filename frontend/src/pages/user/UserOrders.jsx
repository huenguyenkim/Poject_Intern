import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  History, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  ArrowRight,
  PackageSearch,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  X,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { Modal } from 'antd';
import { fetchMyOrdersThunk } from '../../store/orderSlice';
import { addToCart } from '../../store/cartSlice';
import { showSuccessToast, showWarningToast } from '../../utils/toastUtils';
import PageTransition from '../../components/layout/PageTransition';

const UserOrders = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { items: orders, status: orderStatus, meta, error } = useSelector((state) => state.orders);
  const { products: catalogProducts } = useSelector((state) => state.catalog);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrdersThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMyOrdersThunk({ page: 1, limit: 10 }));
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(fetchMyOrdersThunk({ page: nextPage, limit: 10 }));
    setCurrentPage(nextPage);
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  /**
   * Logic Đặt lại (Re-order) với kiểm tra tồn kho từng phần
   */
  const handleReorder = (order) => {
    const itemsToReorder = order.orderItems || order.items || [];
    let addedCount = 0;
    let outOfStockItems = [];

    itemsToReorder.forEach(item => {
      // Find current product in catalog to check real-time stock
      const currentProduct = catalogProducts.find(p => p.id === (item.product?.id || item.productId));
      
      if (currentProduct && currentProduct.stock > 0) {
        const qtyToAdd = Math.min(item.quantity, currentProduct.stock);
        dispatch(addToCart({ ...currentProduct, quantity: qtyToAdd }));
        addedCount++;
        
        if (qtyToAdd < item.quantity) {
          outOfStockItems.push(`${currentProduct.productName} (${t('orders.partial_stock', 'Only')}: ${currentProduct.stock})`);
        }
      } else {
        outOfStockItems.push(item.product?.productName || item.title || 'Product');
      }
    });

    if (addedCount > 0) {
      showSuccessToast(t('orders.reorder_success', 'Items added to cart! 🍭'));
      if (outOfStockItems.length > 0) {
        showWarningToast(`${t('orders.some_out_of_stock', 'Some items are out of stock')}: ${outOfStockItems.join(', ')}`);
      }
      navigate(`/${lang}/cart`);
    } else {
      showWarningToast(t('orders.all_out_of_stock', 'All items in this order are currently out of stock.'));
    }
  };

  if (!currentUser) return <Navigate to={`/${lang}/auth`} />;

  const getStatusConfig = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'delivered':
      case 'completed':
        return { color: 'bg-primary/10 text-primary', icon: <CheckCircle2 size={24} />, label: t('orders.status_delivered', 'Delivered') };
      case 'shipping':
        return { color: 'bg-info/10 text-info', icon: <Truck size={24} />, label: t('orders.status_shipping', 'Shipping') };
      case 'confirmed':
        return { color: 'bg-secondary/10 text-secondary', icon: <Package size={24} />, label: t('orders.status_confirmed', 'Confirmed') };
      case 'cancelled':
        return { color: 'bg-error/10 text-error', icon: <XCircle size={24} />, label: t('orders.status_cancelled', 'Cancelled') };
      default:
        return { color: 'bg-warning/10 text-warning', icon: <Clock size={24} />, label: t('orders.status_pending', 'Pending') };
    }
  };

  if (orderStatus === 'failed' && orders.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
            <XCircle size={40} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-on_surface uppercase">{t('common.error_title', 'Oops!')}</h2>
            <p className="text-on_surface_variant font-bold max-w-md">{error || t('orders.load_error', 'We couldn\'t load your orders.')}</p>
          </div>
          <button onClick={handleRefresh} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-sm shadow-lg hover:scale-105 transition-all">
            {t('common.try_again', 'Try Again')}
          </button>
        </div>
      </PageTransition>
    );
  }

  if (orderStatus === 'loading' && orders.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin text-primary"><Clock size={48} /></div>
          <p className="font-black text-on_surface_variant uppercase tracking-widest">{t('orders.loading', 'Loading history...')}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 md:space-y-10 px-0 sm:px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-on_surface tracking-tight uppercase leading-[1.1] sm:leading-tight">{t('header.my_orders')}</h1>
            <p className="text-on_surface_variant font-bold text-[10px] sm:text-lg tracking-wide">{t('orders.subtitle', 'Tracking your sugar rush history')}</p>
          </div>
          <button onClick={handleRefresh} className="flex items-center justify-center gap-2 bg-surface_dim hover:bg-surface_container px-6 py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all w-full md:w-fit">
            <RefreshCcw size={16} className={orderStatus === 'loading' ? 'animate-spin' : ''} />
            {t('common.refresh', 'Refresh')}
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {orders.length === 0 ? (
            <div className="bg-surface_dim rounded-[32px] sm:rounded-[40px] p-10 sm:p-20 flex flex-col items-center text-center space-y-6">
              <PackageSearch size={54} className="sm:size-64 text-on_surface_variant/20" />
              <h3 className="text-xl sm:text-2xl font-black text-on_surface uppercase">{t('orders.no_orders', 'No orders yet')}</h3>
              <Link to={`/${lang}/shop`}>
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase shadow-xl hover:scale-105 transition-all">
                  {t('orders.shop_now', 'Shop Now')}
                </button>
              </Link>
            </div>
          ) : (
            orders.map((order, idx) => {
              const config = getStatusConfig(order.status);
              return (
                <div key={idx} className="bg-white rounded-[24px] md:rounded-[40px] px-5 sm:px-10 py-5 sm:py-8 border border-surface_container shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 group">
                  <div 
                    onClick={() => handleShowDetails(order)}
                    className="flex items-center gap-4 md:gap-8 cursor-pointer group/info"
                  >
                    <div className={`w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-[18px] sm:rounded-[30px] flex items-center justify-center shrink-0 ${config.color} group-hover/info:scale-110 transition-transform`}>
                      {React.cloneElement(config.icon, { size: 20, className: 'sm:size-6' })}
                    </div>

                    <div className="space-y-0.5 md:space-y-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-black text-on_surface tracking-tight uppercase group-hover/info:text-primary transition-colors">#ORD-{order.id}</h3>
                      <p className="text-[10px] sm:text-xs text-on_surface_variant font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase inline-block mt-1 ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-row items-center justify-between lg:justify-end gap-3 sm:gap-4 md:gap-10 pt-3 lg:pt-0 border-t border-surface_dim lg:border-none mt-2 lg:mt-0">
                    <p className="text-xl sm:text-2xl md:text-3xl font-black text-on_surface">${(order.totalAmount || 0).toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleReorder(order)} className="bg-primary text-white hover:bg-primary_variant px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase transition-all flex items-center gap-2">
                        <RefreshCcw size={12} className="sm:size-14" /> {t('orders.reorder', 'Re-order')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Details Modal */}
        <Modal title={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800} centered className="candy-modal p-0 overflow-hidden">
          {selectedOrder && (
            <div className="p-5 sm:p-8 space-y-6 sm:space-y-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-black text-on_surface tracking-tight uppercase">Order #ORD-{selectedOrder.id}</h2>
                <button onClick={() => handleReorder(selectedOrder)} className="bg-primary text-white hover:shadow-lg px-6 py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase transition-all flex items-center gap-2 w-full sm:w-fit justify-center">
                  <RefreshCcw size={14} /> {t('orders.reorder', 'Re-order')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-[10px] sm:text-sm font-black text-on_surface_variant uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Delivery</h3>
                  <div className="bg-surface_dim p-5 sm:p-6 rounded-[24px] sm:rounded-3xl space-y-1 sm:space-y-2">
                    <p className="font-black text-on_surface uppercase text-xs sm:text-sm">{selectedOrder.receiverName}</p>
                    <p className="font-bold text-on_surface_variant text-[11px] sm:text-sm">{selectedOrder.phone}</p>
                    <p className="font-bold text-on_surface_variant text-[11px] sm:text-sm leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-[10px] sm:text-sm font-black text-on_surface_variant uppercase tracking-widest flex items-center gap-2"><CreditCard size={16} /> Payment</h3>
                  <div className="bg-surface_dim p-5 sm:p-6 rounded-[24px] sm:rounded-3xl flex justify-between items-center">
                    <span className="font-bold text-on_surface_variant text-xs sm:text-sm">Total</span>
                    <span className="text-xl sm:text-2xl font-black text-primary">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] sm:text-sm font-black text-on_surface_variant uppercase tracking-widest">{t('orders.items', 'Items')}</h3>
                <div className="space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedOrder.orderItems || selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-surface_dim rounded-xl sm:rounded-2xl gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg overflow-hidden border border-surface_container shrink-0">
                          <img src={item.product?.image || item.image || '/images/cat-gummies.png'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-on_surface uppercase text-[10px] sm:text-sm line-clamp-1">{item.product?.productName || item.title}</p>
                          <p className="font-bold text-on_surface_variant text-[9px] sm:text-xs">{t('cart.quantity', 'Qty')}: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-on_surface text-xs sm:text-base">${(item.unitPrice || item.price || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="w-full bg-on_surface text-white font-black py-4 rounded-2xl hover:bg-on_surface/90 transition-all uppercase tracking-widest text-[10px] sm:text-sm">
                {t('common.close', 'Close')}
              </button>
            </div>
          )}
        </Modal>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border-2 border-primary/10 rounded-[45px] p-12 text-center space-y-4 relative overflow-hidden group">
          <h2 className="text-3xl md:text-4xl font-black text-primary italic uppercase">{t('orders.promo_title', 'Craving more?')}</h2>
          <p className="text-on_surface_variant font-bold text-lg">{t('orders.promo_subtitle', 'Re-order your favorites and keep the sweetness going!')}</p>
          <Link to={`/${lang}/shop`} className="inline-block pt-4">
            <button className="bg-primary text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-xl hover:scale-105 transition-all">
              {t('footer.shop_all')}
            </button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserOrders;
