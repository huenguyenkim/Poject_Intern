import React from 'react';
import { 
  TrendingUp, Package, ShoppingBag, 
  Search, Bell, Calendar, ChevronDown,
  ArrowUp, MoreHorizontal, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const { products, orders } = useStore();

  const totalSalesValue = 24592;
  const newOrdersCount = 184;
  const totalProductsCount = 1204;

  const stats = [
    { label: 'TOTAL SALES', value: `$${totalSalesValue.toLocaleString()}`, change: '+12% vs last week', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', iconBg: 'bg-primary/5' },
    { label: 'NEW ORDERS', value: newOrdersCount.toString(), change: '+8% vs yesterday', icon: ShoppingBag, color: 'text-secondary', bg: 'bg-secondary/10', iconBg: 'bg-secondary/5' },
    { label: 'TOTAL PRODUCTS', value: totalProductsCount.toLocaleString(), change: '24 new items added', icon: Package, color: 'text-tertiary', bg: 'bg-tertiary/10', iconBg: 'bg-tertiary/5' },
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
    { id: '9021', name: 'Swirly Pop Ju...', status: 'PENDING', variant: 'secondary', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&q=80&w=200' },
    { id: '9020', name: 'Gummy Gala...', status: 'SHIPPING', variant: 'primary', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=200' },
    { id: '9019', name: 'Midnight T...', status: 'COMPLETED', variant: 'outline', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=200' },
    { id: '9018', name: 'Cloud Nine...', status: 'COMPLETED', variant: 'outline', img: 'https://images.unsplash.com/photo-1590156206657-30833325603e?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="p-8 pb-16 space-y-10 animate-in fade-in duration-700 bg-surface_dim min-h-screen">
      
      {/* Top Bar with Search & Nav */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on_surface tracking-tight">Dashboard Overview</h1>
          <p className="text-on_surface_variant font-bold mt-1">Sweet stats for a sweet business.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 sm:min-w-[320px]">
            <Input 
              icon={<Search size={20} />} 
              placeholder="Search sweets..."
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <Card className="flex items-center gap-3 px-6 py-0 min-h-[56px] justify-between cursor-pointer hover:border-primary border-surface_container bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-primary" />
              <span className="text-sm font-black text-on_surface">Oct 24 - Oct 31</span>
            </div>
            <ChevronDown size={16} className="text-on_surface_variant" />
          </Card>

          <Button variant="surface" className="w-14 h-14 p-0 flex items-center justify-center rounded-2xl bg-white border-surface_container">
            <Bell size={22} className="text-on_surface_variant" />
          </Button>
        </div>
      </div>

      {/* Stats Grid - Matching gap-8 layout */}
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
              <Card className="p-8 border-surface_container">
                <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-4">
                    <p className="text-[11px] font-black tracking-widest text-on_surface_variant uppercase">{stat.label}</p>
                    <h3 className="text-4xl font-black text-on_surface tracking-tight">{stat.value}</h3>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="bg-success/10 text-success p-0.5 rounded-full">
                        <ArrowUp size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[13px] font-black text-success">{stat.change.split(' ')[0]}</span>
                      <span className="text-[13px] font-bold text-on_surface_variant ml-1">{stat.change.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </div>
                  <div className={`${stat.iconBg} p-5 rounded-3xl group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={32} className={stat.color} />
                  </div>
                </div>
                {/* Subtle accent blob */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.bg} filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700`}></div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Tables Grid - Consistent with ProductCatalog gap-8 */}
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
            {weeklyOrders.map((item, idx) => (
              <div key={item.day} className="flex-1 flex flex-col items-center group h-full">
                <div className="w-full relative flex-1 flex flex-col justify-end bg-surface_dim rounded-full overflow-hidden border border-surface_container">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: item.h }}
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
            <Button variant="ghost" size="sm" className="p-0 text-primary uppercase tracking-widest text-[11px]">VIEW ALL</Button>
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

      {/* Bottom Widgets - Consistent gap-8 */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory Alert Card */}
        <Card className="bg-primary p-10 shadow-2xl shadow-primary/20 relative overflow-hidden group border-none">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-on_primary leading-tight">Inventory Alert!</h3>
              <p className="text-on_primary/80 font-bold leading-relaxed pr-6">
                4 items are running low. Restock now to keep the joy flowing.
              </p>
            </div>
            <Button variant="surface" className="mt-8 py-5 bg-white border-none text-primary hover:bg-white/90">
              REVIEW STOCK
            </Button>
          </div>
          <MoreHorizontal className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10" size={140} />
        </Card>

        {/* Top Selling Category - Consistent gap-8 */}
        <Card className="lg:col-span-2 p-10 border-surface_container">
          <div className="flex items-center justify-between mb-10 border-b border-surface_container pb-4">
            <h3 className="text-2xl font-black text-on_surface tracking-tight">Supply Category Stats</h3>
            <HelpCircle size={24} className="text-on_surface_variant hover:text-primary cursor-pointer transition-colors" />
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-on_surface uppercase tracking-widest">Sour Candies</span>
                <Badge variant="primary">72% of total</Badge>
              </div>
              <div className="h-4 bg-surface_dim rounded-full overflow-hidden p-1 border border-surface_container">
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-primary rounded-full shadow-inner"></motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 pt-2">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-on_surface_variant uppercase">Chocolates</span>
                  <span className="text-xs font-black text-on_surface">18%</span>
                </div>
                 <div className="h-3 bg-surface_dim rounded-full overflow-hidden border border-surface_container">
                  <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full bg-secondary rounded-full"></motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-on_surface_variant uppercase">Hard Candy</span>
                  <span className="text-xs font-black text-on_surface">10%</span>
                </div>
                 <div className="h-3 bg-surface_dim rounded-full overflow-hidden border border-surface_container">
                  <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full bg-tertiary rounded-full"></motion.div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Support Icon */}
      <div className="fixed bottom-8 right-8 cursor-pointer group z-50">
        <Button variant="primary" className="w-16 h-16 p-0 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 bg-secondary border-none">
          <HelpCircle size={28} className="text-on_primary" />
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
