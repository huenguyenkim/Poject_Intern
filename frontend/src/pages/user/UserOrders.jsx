import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { Modal } from 'antd';
import { fetchMyOrdersThunk } from '../../store/orderSlice';

/**
 * Thành phần hiển thị lịch sử đơn hàng của người dùng.
 * Cho phép người dùng theo dõi các đơn hàng đang xử lý, đang vận chuyển và đã hoàn thành.
 */
const UserOrders = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { items: orders, status: orderStatus, meta, error } = useSelector((state) => state.orders);
  
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

  if (!currentUser) return <Navigate to="/auth" />;

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (orderStatus === 'failed' && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
          <XCircle size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-on_surface uppercase">Oops! Something went wrong</h2>
          <p className="text-on_surface_variant font-bold max-w-md">{error || 'We couldn\'t load your orders. Please try again.'}</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orderStatus === 'loading' && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin text-primary">
          <Clock size={48} />
        </div>
        <p className="font-black text-on_surface_variant uppercase tracking-widest">Loading your sugar history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 px-0 md:px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-on_surface tracking-tight uppercase">My Sweet Orders</h1>
          <p className="text-on_surface_variant font-bold text-sm md:text-lg">Tracking your sugar rush history</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={orderStatus === 'loading'}
          className="flex items-center gap-2 bg-surface_dim hover:bg-surface_container px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
        >
          <Clock size={16} className={orderStatus === 'loading' ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4 md:space-y-6">
        {orders.length === 0 ? (
          <div className="bg-surface_dim rounded-[40px] p-12 md:p-20 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-on_surface_variant/20">
               <PackageSearch size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-on_surface uppercase tracking-tight">No orders yet</h3>
              <p className="text-on_surface_variant font-bold max-w-xs mx-auto">Your sweet tooth is waiting! Browse our latest collection and start your journey.</p>
            </div>
            <Link to="/shop">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          orders.map((order, idx) => {
            const status = (order.status || 'pending').toLowerCase();
            return (
              <div key={idx} className="bg-white rounded-[24px] md:rounded-[40px] px-6 md:px-10 py-6 md:py-8 border border-surface_container shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[30px] flex items-center justify-center shrink-0 ${
                    status === 'completed' ? 'bg-primary/10 text-primary' :
                    status === 'shipping' ? 'bg-tertiary/10 text-tertiary' :
                    status === 'cancelled' ? 'bg-error/10 text-error' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {status === 'completed' && <CheckCircle2 size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                    {status === 'shipping' && <Truck size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                    {status === 'cancelled' && <XCircle size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                    {(status === 'confirmed' || status === 'pending') && <Clock size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-3 md:gap-4">
                      <h3 className="text-lg md:text-xl font-black text-on_surface tracking-tight uppercase">#ORD-{order.id}</h3>
                      <div className="hidden sm:block w-1 h-1 rounded-full bg-on_surface_variant/40"></div>
                      <p className="text-on_surface_variant font-bold text-[12px] md:text-[14px]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-on_surface_variant font-bold text-[12px] md:text-[14px] line-clamp-1">
                      {order.items?.length} Items: {order.items?.map(i => i.title).join(', ')}
                    </p>
                    <span className={`px-3 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase inline-block ${
                      status === 'completed' ? 'bg-primary/10 text-primary' :
                      status === 'shipping' ? 'bg-tertiary/10 text-tertiary' :
                      status === 'cancelled' ? 'bg-error/10 text-error' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-10 pt-4 lg:pt-0 border-t border-surface_dim lg:border-none">
                  <div className="text-left lg:text-right">
                     <p className="text-2xl md:text-3xl font-black text-on_surface tracking-tight">${(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleShowDetails(order)}
                    className="bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-[15px] transition-all"
                  >
                     Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination / Load More */}
      {meta && meta.page < meta.totalPages && (
        <div className="flex justify-center pt-8">
           <button 
             onClick={handleLoadMore}
             disabled={orderStatus === 'loading'}
             className="bg-white border-2 border-surface_container hover:border-primary/20 text-on_surface font-black px-12 py-5 rounded-[25px] transition-all flex items-center gap-3 group disabled:opacity-50"
           >
              {orderStatus === 'loading' ? (
                <Clock size={18} className="animate-spin text-primary" />
              ) : (
                <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform text-primary" />
              )}
              <span>Load More Sweetness</span>
           </button>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
        className="candy-modal"
      >
        {selectedOrder && (
          <div className="p-4 md:p-8 space-y-10">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-on_surface tracking-tight uppercase">Order #ORD-{selectedOrder.id}</h2>
                  <p className="text-on_surface_variant font-bold uppercase tracking-widest text-xs mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className={`px-6 py-2 rounded-2xl font-black uppercase tracking-widest text-xs ${
                  selectedOrder.status === 'completed' ? 'bg-primary/10 text-primary' :
                  selectedOrder.status === 'shipping' ? 'bg-tertiary/10 text-tertiary' :
                  'bg-warning/10 text-warning'
                }`}>
                  {selectedOrder.status}
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-on_surface uppercase tracking-tight flex items-center gap-2">
                      <MapPin size={18} className="text-primary" /> Delivery Details
                   </h3>
                   <div className="bg-surface_dim p-6 rounded-3xl space-y-3">
                      <p className="font-black text-on_surface uppercase text-sm">{selectedOrder.receiverName}</p>
                      <p className="font-bold text-on_surface_variant text-sm">{selectedOrder.phone}</p>
                      <p className="font-bold text-on_surface_variant text-sm leading-relaxed">{selectedOrder.address}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-lg font-black text-on_surface uppercase tracking-tight flex items-center gap-2">
                      <CreditCard size={18} className="text-primary" /> Payment Info
                   </h3>
                   <div className="bg-surface_dim p-6 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-50">Method</span>
                         <span className="uppercase">Credit Card / COD</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-50">Total Amount</span>
                         <span className="text-xl font-black text-primary">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-lg font-black text-on_surface uppercase tracking-tight">Order Items</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {selectedOrder.items?.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-surface_dim rounded-2xl group">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-white rounded-xl overflow-hidden p-1 border border-surface_container group-hover:border-primary/20 transition-colors shadow-sm">
                              <img src={item.image || '/images/cat-gummies.png'} alt="" className="w-full h-full object-cover rounded-lg" />
                           </div>
                           <div>
                              <p className="font-black text-on_surface uppercase text-sm">{item.title}</p>
                              <p className="font-bold text-on_surface_variant text-xs mt-0.5">Quantity: {item.quantity}</p>
                           </div>
                        </div>
                        <p className="font-black text-on_surface">${(item.price * item.quantity).toFixed(2)}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="pt-4 border-t border-surface_dim">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-on_surface text-white font-black py-5 rounded-[25px] hover:bg-on_surface/90 transition-all uppercase tracking-widest text-sm shadow-xl"
                >
                   Close Details
                </button>
             </div>
          </div>
        )}
      </Modal>

      {/* Re-order Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary rounded-[45px] p-12 shadow-xl shadow-secondary/20 relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-on_primary italic tracking-tight uppercase">Craving more?</h2>
               <p className="text-on_primary/80 font-bold text-lg">Re-order your favorites and keep the sweetness going!</p>
            </div>
            <Link to="/shop">
              <button className="bg-white text-secondary hover:bg-white/90 px-10 py-5 rounded-full font-black text-[16px] tracking-tight shadow-xl transition-all hover:scale-105 active:scale-95 uppercase">
                 Browse Shop
              </button>
            </Link>
         </div>
         
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all"></div>
      </div>

    </div>
  );
};

export default UserOrders;
