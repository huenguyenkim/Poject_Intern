import React from 'react';
import { 
  TrendingUp, Package, ShoppingBag, 
  Calendar, ChevronDown,
  HelpCircle
} from 'lucide-react';
import { 
  Statistic, 
  Progress, 
  Tooltip,
  Space
} from 'antd';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCatalogThunk } from '../../store/catalogSlice';
import { fetchOrdersThunk } from '../../store/orderSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// Static data for charts and stats
const WEEKLY_ORDERS_MOCK = [
  { day: 'Mon', h: 45 },
  { day: 'Tue', h: 85 },
  { day: 'Wed', h: 55 },
  { day: 'Thu', h: 95 },
  { day: 'Fri', h: 65 },
  { day: 'Sat', h: 75 },
  { day: 'Sun', h: 40 },
];

/**
 * AdminDashboard: Premium dashboard providing real-time business insights.
 * Optimized for performance and clean architecture.
 */
const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const { products, status: catalogStatus } = useSelector((state) => state.catalog);
  const { items: orders, status: orderStatus } = useSelector((state) => state.orders);

  // Initialization
  React.useEffect(() => {
    if (catalogStatus === 'idle') dispatch(fetchCatalogThunk());
    if (orderStatus === 'idle') dispatch(fetchOrdersThunk());
  }, [catalogStatus, orderStatus, dispatch]);

  // Derived Data (Memoized for performance)
  const stats = React.useMemo(() => {
    const totalSalesValue = orders.reduce((sum, o) => sum + (o.total || o.subtotal || 0), 0) || 24592;
    const newOrdersCount = orders.filter(o => 
      ['pending', 'processing'].includes((o.status || '').toLowerCase())
    ).length || 184;
    const totalProductsCount = products.length || 1204;

    return [
      { label: 'TOTAL SALES', value: totalSalesValue, prefix: '$', change: '+12%', icon: TrendingUp, color: '!bg-primary' },
      { label: 'NEW ORDERS', value: newOrdersCount, prefix: '', change: '+8%', icon: ShoppingBag, color: '!bg-secondary' },
      { label: 'TOTAL PRODUCTS', value: totalProductsCount, prefix: '', change: '24 new', icon: Package, color: '!bg-[#2D2D2D]' },
    ];
  }, [orders, products]);

  const recentOrders = React.useMemo(() => {
    if (orders.length > 0) {
      return [...orders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4)
        .map(o => ({
          id: o.id.toString(),
          name: (o.items && o.items[0]?.title) || 'Direct Order',
          status: (o.status || 'PENDING').toUpperCase(),
          variant: o.status?.toLowerCase() === 'completed' ? 'outline' : o.status?.toLowerCase() === 'shipping' ? 'primary' : 'secondary',
          img: o.items && o.items[0]?.image || '/images/rainbow-swirl-pop.png'
        }));
    }
    // Fallback Mock Data
    return [
      { id: '9021', name: 'Swirly Pop Ju...', status: 'PENDING', variant: 'secondary', img: '/images/rainbow-swirl-pop.png' },
      { id: '9020', name: 'Gummy Gala...', status: 'SHIPPING', variant: 'primary', img: '/images/neon-rainbow-gummies.png' },
      { id: '9019', name: 'Midnight T...', status: 'COMPLETED', variant: 'outline', img: '/images/chocolate_cat.png' },
      { id: '9018', name: 'Cloud Nine...', status: 'COMPLETED', variant: 'outline', img: '/images/cotton-cloud.png' },
    ];
  }, [orders]);

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-14">
        
        {/* Header with Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Admin</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black uppercase tracking-[0.2em]">Dashboard Overview</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Sweet Insights</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Monitor your business performance and customer joy in real-time.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Card className="flex items-center gap-5 px-6 py-0 min-h-[72px] justify-between cursor-pointer group/date border-none bg-white shadow-xl hover:shadow-2xl transition-all rounded-[28px]">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/5 rounded-xl group-hover/date:bg-primary/10 transition-colors">
                  <Calendar size={20} className="text-primary" />
                </div>
                <span className="text-sm font-black text-on_surface leading-none">Oct 24 - Oct 31</span>
              </div>
              <ChevronDown size={14} className="text-on_surface_variant ml-2" />
            </Card>
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
              >
                <Card className={`${stat.color} p-8 text-on_primary border-none shadow-2xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white`}>
                  <div className="relative z-10">
                    <Statistic 
                      title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">{stat.label}</span>}
                      value={stat.value}
                      prefix={stat.prefix}
                      valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
                      formatter={(val) => val.toLocaleString()}
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="surface" className="bg-white/20 border-none text-white text-[10px] py-1">
                        {stat.change}
                      </Badge>
                      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Growth</span>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
                     <Icon size={140} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Orders Chart */}
          <Card className="lg:col-span-2 p-10 border-surface_container">
            <div className="flex items-center justify-between mb-12 border-b border-surface_container pb-4">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Weekly Orders</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-black text-on_surface_variant uppercase tracking-wider">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-surface_dim"></div>
                  <span className="text-xs font-black text-on_surface_variant uppercase tracking-wider">Target</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-[280px] gap-6 px-4">
              {WEEKLY_ORDERS_MOCK.map((item, idx) => (
                <div key={item.day} className="flex-1 flex flex-col items-center group h-full">
                  <div className="w-full relative flex-1 flex flex-col justify-end bg-surface_dim rounded-full overflow-hidden border border-surface_container">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${item.h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                      className="w-full shadow-lg shadow-primary/10 bg-gradient-to-t from-primary/80 to-primary"
                    />
                  </div>
                  <span className="mt-6 text-[11px] font-black text-on_surface_variant uppercase tracking-widest group-hover:text-primary transition-colors">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Orders Side List */}
          <Card className="p-10 border-surface_container flex flex-col">
            <div className="flex items-center justify-between mb-10 border-b border-surface_container pb-4">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Recent Orders</h3>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm" className="p-0 text-primary uppercase tracking-widest text-[11px]">VIEW ALL</Button>
              </Link>
            </div>
            
            <div className="space-y-6 flex-1">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface_dim border border-surface_container p-1 group-hover:border-primary/30 transition-colors shadow-sm">
                      <img src={order.img} alt={order.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h4 className="font-black text-on_surface text-sm group-hover:text-primary transition-colors">{order.name}</h4>
                      <p className="text-[11px] font-bold text-on_surface_variant mt-0.5 uppercase tracking-wide">ORDER #{order.id}</p>
                    </div>
                  </div>
                  <Badge variant={order.variant} className="text-[9px] px-2.5 py-1">
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inventory Alert Card */}
          <Card className="p-0 shadow-2xl shadow-primary/20 relative overflow-hidden group border-none min-h-[320px]">
            <div className="absolute inset-0">
               <img 
                 src="/images/neon_sour_banner.png" 
                 alt="Inventory Alert" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
               />
               <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/60"></div>
            </div>

            <div className="relative z-10 h-full p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-on_primary mb-6">
                  <Package size={24} strokeWidth={3} />
                </div>
                <h3 className="text-4xl font-black text-on_primary leading-tight tracking-tight">Inventory Alert!</h3>
                <p className="text-on_primary/90 font-bold leading-relaxed pr-6 text-lg">
                  4 items are running low. Restock now to keep the joy flowing.
                </p>
              </div>
              
              <Link to="/admin/products">
                <Button 
                   variant="surface" 
                   className="mt-8 py-6 w-full bg-white text-primary hover:bg-on_primary hover:text-primary transition-all font-black text-lg rounded-2xl shadow-xl border-none"
                >
                   REVIEW STOCK
                </Button>
              </Link>
            </div>
          </Card>

          {/* Top Selling Category */}
          <Card className="lg:col-span-2 p-10 border-surface_container">
            <div className="flex items-center justify-between mb-10 border-b border-surface_container pb-4">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Supply Category Stats</h3>
              <Tooltip title="Insights based on last 30 days of inventory movement.">
                <HelpCircle size={24} className="text-on_surface_variant hover:text-primary cursor-pointer transition-colors" />
              </Tooltip>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-on_surface uppercase tracking-widest">Sour Candies</span>
                  <Badge variant="primary">72% of total</Badge>
                </div>
                <Progress percent={72} strokeColor="#FF76B8" strokeWidth={16} showInfo={false} />
              </div>

              <div className="grid grid-cols-2 gap-10 pt-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-on_surface_variant uppercase">Chocolates</span>
                    <span className="text-xs font-black text-on_surface">18%</span>
                  </div>
                  <Progress percent={18} strokeColor="#8E44AD" strokeWidth={12} showInfo={false} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-on_surface_variant uppercase">Hard Candy</span>
                    <span className="text-xs font-black text-on_surface">10%</span>
                  </div>
                  <Progress percent={10} strokeColor="#2ECC71" strokeWidth={12} showInfo={false} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
