import React from 'react';
import { 
  TrendingUp, Package, ShoppingBag, 
  Calendar, ChevronDown, HelpCircle, Activity
} from 'lucide-react';
import { 
  Statistic, 
  Progress, 
  Tooltip,
  Spin,
  Select
} from 'antd';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LockedFeature from '../../components/ui/LockedFeature';
import { useAnalytics } from '../../hooks/useAnalytics';

/**
 * AdminDashboard: Premium dashboard providing real-time business insights.
 * Powered by React Query and Recharts.
 */
const AdminDashboard = () => {
  const [days, setDays] = React.useState(180);
  const { kpis, chart, topProducts, bundles = [], isLoading } = useAnalytics(days);

  const exportToCSV = () => {
    if (!chart) return;
    const header = "Date,Revenue\n";
    const csv = chart.map(row => `${row.date},${row.revenue}`).join("\n");
    const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `revenue_report_${days}d.csv`);
  };

  // Derived Data for Top KPIs
  const stats = React.useMemo(() => {
    return [
      { label: 'TOTAL REVENUE', value: kpis?.totalRevenue || 0, prefix: '$', suffix: '', change: '+12%', icon: TrendingUp, color: '!bg-primary' },
      { label: 'CONVERSION RATE', value: kpis?.conversionRate || 0, prefix: '', suffix: '%', change: '+8%', icon: ShoppingBag, color: '!bg-secondary' },
      { label: 'TOTAL VISITS', value: kpis?.totalVisits || 0, prefix: '', suffix: '', change: '+24%', icon: Activity, color: '!bg-[#2D2D2D]' },
    ];
  }, [kpis]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface/[0.02]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-14">
        
        {/* Header with Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Admin</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black uppercase tracking-[0.2em]">Analytics Dashboard</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Sweet Insights</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Monitor your business performance and customer joy in real-time.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select 
              value={days} 
              onChange={setDays}
              className="min-w-[160px] h-[72px]"
              variant="borderless"
              popupClassName="rounded-2xl"
              style={{ background: 'white', borderRadius: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <Select.Option value={7}>Last 7 Days</Select.Option>
              <Select.Option value={30}>Last 30 Days</Select.Option>
              <Select.Option value={90}>Last 3 Months</Select.Option>
              <Select.Option value={180}>Last 6 Months</Select.Option>
            </Select>
            <Button 
              onClick={exportToCSV}
              variant="primary" 
              className="h-[72px] px-8 rounded-[28px] font-black uppercase tracking-widest text-[11px]"
            >
              EXPORT DATA
            </Button>
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
                      suffix={stat.suffix}
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
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-10 border-surface_container flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-surface_container pb-4">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Revenue Trends</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-black text-on_surface_variant uppercase tracking-wider">Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[280px]">
              {chart && chart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF76B8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF76B8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }}
                      tickFormatter={(value) => `$${value}`}
                      dx={-10}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF76B8" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-on_surface_variant font-bold">
                  Chưa đủ dữ liệu biểu đồ
                </div>
              )}
            </div>
          </Card>

          {/* Top Products */}
          <Card className="p-10 border-surface_container flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-surface_container pb-4">
              <h3 className="text-2xl font-black text-on_surface tracking-tight">Top Products</h3>
              <Link to="/admin/products">
                <Button variant="ghost" size="sm" className="p-0 text-primary uppercase tracking-widest text-[11px]">VIEW ALL</Button>
              </Link>
            </div>
            
            <div className="space-y-6 flex-1">
              {topProducts?.map((product, idx) => (
                <div key={product.id} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface_dim border border-surface_container p-1 group-hover:border-primary/30 transition-colors shadow-sm relative">
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black z-10 border-2 border-white">
                        #{idx + 1}
                      </div>
                      <img src={product.imageUrl || '/images/rainbow-swirl-pop.png'} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h4 className="font-black text-on_surface text-sm group-hover:text-primary transition-colors max-w-[140px] truncate" title={product.name}>
                        {product.name}
                      </h4>
                      <p className="text-[11px] font-bold text-on_surface_variant mt-0.5 uppercase tracking-wide">ID: {product.id.toString().slice(0, 8)}</p>
                    </div>
                  </div>
                  <Badge variant="primary" className="text-[10px] px-2.5 py-1 font-black">
                    {product.totalSold} sold
                  </Badge>
                </div>
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <div className="text-center text-on_surface_variant text-sm font-bold mt-10">
                  Chưa có dữ liệu sản phẩm
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Smart AI Forecast */}
          <LockedFeature requiredTier="PREMIUM" featureName="Dự báo doanh thu AI">
            <Card className="p-0 shadow-2xl shadow-secondary/20 relative overflow-hidden group border-none min-h-[320px]">
              <div className="absolute inset-0">
                <img 
                  src="/images/candy_machine_banner.png" 
                  alt="AI Forecast" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/85 to-secondary/60"></div>
              </div>

              <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-on_primary mb-6">
                    <Activity size={24} strokeWidth={3} className="text-white" />
                  </div>
                  <h3 className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em]">Smart AI Forecast</h3>
                  <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                    Next Month: ${kpis?.predictedRevenue?.toLocaleString() || '---'}
                  </h2>
                  <p className="text-white/90 font-bold leading-relaxed pr-6 text-sm">
                    Based on your growing trend, we predict a steady surge in sales.
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <div className={`w-3 h-3 rounded-full bg-yellow-400 animate-pulse`}></div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    Confidence: 94%
                  </span>
                </div>
              </div>
            </Card>
          </LockedFeature>

          {/* Behavior Analysis - Frequently Bought Together */}
          <LockedFeature requiredTier="PREMIUM" featureName="Phân tích giỏ hàng (Market Basket)">
            <Card className="lg:col-span-2 p-10 border-surface_container relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8 border-b border-surface_container pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-xl">
                    <Package size={20} className="text-secondary" />
                  </div>
                  <h3 className="text-2xl font-black text-on_surface tracking-tight">Frequently Bought Together</h3>
                </div>
                <Badge variant="surface" className="bg-secondary/5 text-secondary border-none px-3 py-1 font-black">MARKETING INSIGHTS</Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                {bundles?.map((bundle, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-surface_dim p-6 rounded-[24px] border border-surface_container hover:border-secondary/30 transition-all group/bundle"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest mb-3 opacity-60">TOP BUNDLE #{idx + 1}</div>
                        <h4 className="font-bold text-on_surface text-sm leading-relaxed mb-4 group-hover/bundle:text-secondary transition-colors">
                          {bundle.bundle}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-on_surface_variant">Found in {bundle.count} orders</span>
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Activity size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!bundles || bundles.length === 0) && (
                  <div className="col-span-3 text-center py-10 text-on_surface_variant font-bold">
                    Dữ liệu đang được phân tích... Hãy tạo thêm đơn hàng đa sản phẩm để xem gợi ý.
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl flex items-center justify-between">
                <p className="text-xs font-bold text-on_surface_variant leading-relaxed max-w-md">
                  💡 <strong>Gợi ý:</strong> Tạo combo giảm giá cho các cặp sản phẩm trên để tăng giá trị trung bình đơn hàng (AOV).
                </p>
                <Link to="/admin/banners">
                  <Button variant="ghost" size="sm" className="text-primary font-black text-[10px] uppercase tracking-widest">TẠO CHIẾN DỊCH</Button>
                </Link>
              </div>
            </Card>
          </LockedFeature>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
