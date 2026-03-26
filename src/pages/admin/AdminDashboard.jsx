import React from 'react';
import { 
  TrendingUp, Package, ShoppingBag, 
  Search, Bell, Calendar, ChevronDown,
  ArrowUp, MoreHorizontal, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

const AdminDashboard = () => {
  const { products, orders } = useStore();

  const totalSalesValue = 24592;
  const newOrdersCount = 184;
  const totalProductsCount = 1204;

  const stats = [
    { label: 'TOTAL SALES', value: `$${totalSalesValue.toLocaleString()}`, change: '+12% vs last week', icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-100', iconBg: 'bg-pink-50' },
    { label: 'NEW ORDERS', value: newOrdersCount.toString(), change: '+8% vs yesterday', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-100', iconBg: 'bg-purple-50' },
    { label: 'TOTAL PRODUCTS', value: totalProductsCount.toLocaleString(), change: '24 new items added', icon: Package, color: 'text-blue-500', bg: 'bg-blue-100', iconBg: 'bg-blue-50' },
  ];

  const weeklyOrders = [
    { day: 'Mon', h: '45%' },
    { day: 'Tue', h: '85%' },
    { day: 'Wed', h: '55%' },
    { day: 'Thu', h: '95%' },
    { day: 'Fri', h: '65%' },
    { day: 'Sat', h: '75%' },
    { day: 'Sun', h: '40%' },
  ];

  const recentOrders = [
    { id: '9021', name: 'Swirly Pop Ju...', status: 'PENDING', statusColor: 'bg-orange-100 text-orange-500', img: '/images/rainbow-swirl-pop.png' },
    { id: '9020', name: 'Gummy Gala...', status: 'SHIPPING', statusColor: 'bg-blue-100 text-blue-500', img: '/images/neon-gummies.png' },
    { id: '9019', name: 'Midnight T...', status: 'COMPLETED', statusColor: 'bg-green-100 text-green-500', img: '/images/midnight-cocoa.png' },
    { id: '9018', name: 'Cloud Nine...', status: 'COMPLETED', statusColor: 'bg-green-100 text-green-500', img: '/images/cotton-candy-waffle.png' },
  ];

  return (
    <div className="p-8 pb-16 space-y-10 animate-in fade-in duration-700">
      {/* Top Bar with Search & Nav */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#2d2a4a] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#8e8a9d] font-bold mt-1 text-[13px] md:text-[15px]">Sweet stats for a sweet business.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a9bc] group-hover:text-[#7c3aed] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search sweets..." 
              className="w-full bg-white border border-[#ece8f1] rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-[#2d2a4a] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all sm:min-w-[280px] shadow-sm"
            />
          </div>
          
          <div className="flex items-center justify-between sm:justify-start bg-white border border-[#ece8f1] rounded-2xl px-5 py-3 gap-3 shadow-sm cursor-pointer hover:border-[#7c3aed] transition-all group">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#b0a9bc] group-hover:text-[#7c3aed]" />
              <span className="text-sm font-black text-[#2d2a4a]">Oct 24 - Oct 31</span>
            </div>
            <ChevronDown size={16} className="text-[#b0a9bc]" />
          </div>

          <button className="hidden sm:flex bg-white border border-[#ece8f1] p-3.5 rounded-2xl text-[#b0a9bc] hover:text-[#7c3aed] hover:border-[#7c3aed] transition-all shadow-sm">
            <Bell size={22} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-[#ece8f1] shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500 relative overflow-hidden group"
            >
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-4">
                  <p className="text-[11px] font-black tracking-widest text-[#b0a9bc] uppercase">{stat.label}</p>
                  <h3 className="text-4xl font-black text-[#2d2a4a] tracking-tight">{stat.value}</h3>
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="bg-[#e7f9f3] text-[#00c853] p-0.5 rounded-full">
                      <ArrowUp size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[13px] font-black text-[#00c853]">{stat.change.split(' ')[0]}</span>
                    <span className="text-[13px] font-bold text-[#b0a9bc] ml-1">{stat.change.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
                <div className={`${stat.iconBg} p-5 rounded-3xl group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={32} className={stat.color} />
                </div>
              </div>
              {/* Subtle accent blob */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.bg} mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-[#ece8f1] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-[#2d2a4a] tracking-tight">Weekly Orders</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f13a7b]"></div>
                <span className="text-xs font-black text-[#b0a9bc] uppercase tracking-wider">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#fce7f3]"></div>
                <span className="text-xs font-black text-[#b0a9bc] uppercase tracking-wider">Target</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-[280px] gap-6 px-4">
            {weeklyOrders.map((item, idx) => (
              <div key={item.day} className="flex-1 flex flex-col items-center group h-full">
                <div className="w-full relative flex-1 flex flex-col justify-end bg-[#f8f7fa] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: item.h }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full shadow-lg shadow-pink-100/50 flex items-center justify-center overflow-hidden"
                  >
                    <div className="w-full h-full bg-gradient-to-t from-[#d92d6a] via-[#f13a7b] to-[#ff669d]"></div>
                  </motion.div>
                </div>
                <span className="mt-6 text-[11px] font-black text-[#b0a9bc] uppercase tracking-widest group-hover:text-[#2d2a4a] transition-colors">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Side List */}
        <div className="bg-white rounded-[40px] border border-[#ece8f1] p-10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#2d2a4a] tracking-tight">Recent Orders</h3>
            <button className="text-[11px] font-black text-[#7c3aed] uppercase tracking-widest hover:underline transition-all">VIEW ALL</button>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#faf9fc] border border-[#ece8f1] p-1 group-hover:border-[#7c3aed]/30 transition-colors shadow-sm">
                    <img src={order.img} alt={order.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#2d2a4a] text-sm group-hover:text-[#7c3aed] transition-colors">{order.name}</h4>
                    <p className="text-xs font-bold text-[#b0a9bc] mt-0.5 uppercase tracking-wide">ORDER #{order.id}</p>
                  </div>
                </div>
                <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory Alert Card */}
        <div className="bg-[#f13a7b] rounded-[40px] p-10 shadow-2xl shadow-pink-200/40 relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white leading-tight">Inventory Alert!</h3>
              <p className="text-pink-100 font-bold leading-relaxed pr-6">
                4 items are running low. Restock now to keep the joy flowing.
              </p>
            </div>
            <button className="bg-white text-[#f13a7b] font-black py-4 rounded-2xl text-sm transition-all hover:scale-[1.02] hover:shadow-xl shadow-lg mt-8">
              REVIEW STOCK
            </button>
          </div>
          {/* Decorative element */}
          <MoreHorizontal className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10" size={140} />
        </div>

        {/* Top Selling Category */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-[#ece8f1] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#2d2a4a] tracking-tight">Top Selling Category</h3>
            <HelpCircle size={24} className="text-[#b0a9bc] hover:text-[#7c3aed] cursor-pointer transition-colors" />
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-[#2d2a4a]">Sour Candies</span>
                <span className="text-xs font-black text-[#b0a9bc]">72% of total</span>
              </div>
              <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-[#0ea5e9] rounded-full shadow-inner"></motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 pt-2">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-[#2d2a4a]">Chocolates</span>
                  <span className="text-xs font-black text-[#b0a9bc]">18% of total</span>
                </div>
                <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full bg-[#38bdf8] rounded-full shadow-inner"></motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-[#2d2a4a]">Hard Candy</span>
                  <span className="text-xs font-black text-[#b0a9bc]">10% of total</span>
                </div>
                <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full bg-[#bae6fd] rounded-full shadow-inner"></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floatin Action Button Placeholder for Mobile (if needed) */}
      <button className="fixed bottom-10 right-10 bg-[#7c3aed] text-white p-5 rounded-full shadow-2xl shadow-purple-400 hover:scale-110 transition-all z-50 group md:hidden">
        <MoreHorizontal size={28} />
      </button>

      {/* Footer Support Icon */}
      <div className="fixed bottom-8 right-8 cursor-pointer group z-50 hidden md:block">
        <div className="bg-[#7c3aed] p-4 rounded-3xl shadow-xl shadow-purple-200 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
          <HelpCircle size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
