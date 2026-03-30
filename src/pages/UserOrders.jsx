import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  History, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  ArrowRight,
  PackageSearch
} from 'lucide-react';

/**
 * Thành phần hiển thị lịch sử đơn hàng của người dùng.
 * Cho phép người dùng theo dõi các đơn hàng đang xử lý, đang vận chuyển và đã hoàn thành.
 * 
 * @returns {JSX.Element} Giao diện danh sách đơn hàng người dùng.
 */
const UserOrders = () => {
  const { currentUser } = useAuth();
  const { orders } = useStore();
  const [loading, setLoading] = useState(false);

  if (!currentUser) return <Navigate to="/auth" />;

  const userOrders = orders.filter(o => o.userId === currentUser.id);

  // Mocking more orders for the historical view
  const displayOrders = [
    ...userOrders,
    { 
      id: '#ORD-88294', 
      date: 'Nov 14, 2023', 
      status: 'Completed', 
      items: [{title: 'Neon Sour Strips'}, {title: 'Galaxy Gummy Bears'}, {title: 'Fizzy Peaches'}], 
      total: 45.00 
    },
    { 
      id: '#ORD-89102', 
      date: 'Yesterday', 
      status: 'Shipping', 
      items: [{title: 'Rainbow Taffy'}, {title: 'Dark Chocolate Sea Salt Caramels'}], 
      total: 62.50 
    },
    {
      id: '#ORD-89441',
      date: 'Today, 10:24 AM',
      status: 'Processing',
      items: [{title: 'Mystery Sour Box'}, {title: 'Cotton Candy Fluff'}],
      total: 28.15
    }
  ];

  return (
    <div className="space-y-6 md:space-y-10 px-0 md:px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-on_surface tracking-tight">My Sweet Orders</h1>
          <p className="text-on_surface_variant font-bold text-sm md:text-lg">Tracking your sugar rush history</p>
        </div>
        <button className="flex items-center justify-center gap-3 px-6 py-3 border-2 border-surface_container rounded-2xl text-[12px] md:text-[14px] font-black text-on_surface_variant hover:bg-white transition-all shadow-sm">
          Last 30 Days <ChevronDown size={16} />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4 md:space-y-6">
        {displayOrders.map((order, idx) => {
          const status = order.status.toLowerCase();
          return (
            <div key={idx} className="bg-white rounded-[24px] md:rounded-[40px] px-6 md:px-10 py-6 md:py-8 border border-surface_container shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                {/* Icon based on status */}
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[30px] flex items-center justify-center shrink-0 ${
                  status === 'completed' ? 'bg-primary/10 text-primary' :
                  status === 'shipping' ? 'bg-tertiary/10 text-tertiary' :
                  'bg-warning/10 text-warning'
                }`}>
                  {status === 'completed' && <CheckCircle2 size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                  {status === 'shipping' && <Truck size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                  {status === 'processing' && <Clock size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />}
                </div>

                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    <h3 className="text-lg md:text-xl font-black text-on_surface tracking-tight">{order.id}</h3>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-on_surface_variant/40"></div>
                    <p className="text-on_surface_variant font-bold text-[12px] md:text-[14px]">{order.date}</p>
                  </div>
                  <p className="text-on_surface_variant font-bold text-[12px] md:text-[14px] line-clamp-1">
                    {order.items?.length} Items: {order.items?.map(i => i.title).join(', ')}...
                  </p>
                  <span className={`px-3 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase inline-block ${
                    status === 'completed' ? 'bg-primary/10 text-primary' :
                    status === 'shipping' ? 'bg-tertiary/10 text-tertiary' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-10 pt-4 lg:pt-0 border-t border-surface_dim lg:border-none">
                <div className="text-left lg:text-right">
                   <p className="text-2xl md:text-3xl font-black text-on_surface tracking-tight">${order.total?.toFixed(2)}</p>
                </div>
                {status === 'shipping' ? (
                  <button className="bg-tertiary/80 hover:bg-tertiary text-on_tertiary px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-[15px] shadow-lg shadow-tertiary/20 transition-all flex items-center gap-2">
                     Track
                  </button>
                ) : (
                  <button className="bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-[15px] transition-all">
                     Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Re-order Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary rounded-[45px] p-12 shadow-xl shadow-secondary/20 relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-on_primary italic tracking-tight">Craving more?</h2>
               <p className="text-on_primary/80 font-bold text-lg">Re-order your favorites from last month and get 15% off!</p>
            </div>
            <button className="bg-white text-secondary hover:bg-white/90 px-10 py-5 rounded-full font-black text-[16px] tracking-tight shadow-xl transition-all hover:scale-105 active:scale-95">
               BROWSE FAVORITES
            </button>
         </div>
         
         {/* Decoration */}
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all"></div>
         <div className="absolute bottom-[-30px] left-[20%] w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

    </div>
  );
};

export default UserOrders;
