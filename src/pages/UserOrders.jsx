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
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-[#2d2a4a] tracking-tight">My Sweet Orders</h1>
          <p className="text-[#8e8a9d] font-bold text-lg">Tracking your sugar rush history</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 border-2 border-[#ece8f1] rounded-2xl text-[14px] font-black text-[#8e8a9d] hover:bg-white transition-all shadow-sm">
          Last 30 Days <ChevronDown size={18} />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {displayOrders.map((order, idx) => {
          const status = order.status.toLowerCase();
          return (
            <div key={idx} className="bg-white rounded-[40px] px-10 py-8 border border-[#ece8f1] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
              <div className="flex items-center gap-8">
                {/* Icon based on status */}
                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center shrink-0 ${
                  status === 'completed' ? 'bg-[#ffeef4] text-[#f13a7b]' :
                  status === 'shipping' ? 'bg-[#edf4ff] text-[#0c66e4]' :
                  'bg-[#fff9e6] text-[#cc9900]'
                }`}>
                  {status === 'completed' && <CheckCircle2 size={32} strokeWidth={2.5} />}
                  {status === 'shipping' && <Truck size={32} strokeWidth={2.5} />}
                  {status === 'processing' && <Clock size={32} strokeWidth={2.5} />}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black text-[#2d2a4a] tracking-tight">{order.id}</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b0a9bc]"></div>
                    <p className="text-[#8e8a9d] font-bold text-[14px]">{order.date}</p>
                  </div>
                  <p className="text-[#8e8a9d] font-bold text-[14px] line-clamp-1">
                    {order.items?.length} Items: {order.items?.map(i => i.title).join(', ')}...
                  </p>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${
                    status === 'completed' ? 'bg-[#ffeef4] text-[#f13a7b]' :
                    status === 'shipping' ? 'bg-[#edf4ff] text-[#0c66e4]' :
                    'bg-[#fff9e6] text-[#cc9900]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10">
                <div className="text-right">
                  <p className="text-3xl font-black text-[#2d2a4a] tracking-tight">${order.total?.toFixed(2)}</p>
                </div>
                {status === 'shipping' ? (
                  <button className="bg-[#0b5c75] hover:bg-[#084a5e] text-white px-8 py-4 rounded-2xl font-black text-[15px] shadow-lg shadow-teal-100/50 transition-all flex items-center gap-2">
                     Track Package
                  </button>
                ) : (
                  <button className="bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 px-8 py-4 rounded-2xl font-black text-[15px] transition-all">
                     View Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Re-order Banner */}
      <div className="bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-[45px] p-12 shadow-xl shadow-purple-100/50 relative overflow-hidden group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-white italic tracking-tight">Craving more?</h2>
               <p className="text-white/80 font-bold text-lg">Re-order your favorites from last month and get 15% off!</p>
            </div>
            <button className="bg-white text-[#7c3aed] hover:bg-white/90 px-10 py-5 rounded-full font-black text-[16px] tracking-tight shadow-xl transition-all hover:scale-105 active:scale-95">
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
