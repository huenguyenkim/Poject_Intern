import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  User, 
  Truck, 
  MapPin, 
  Printer, 
  ChevronDown, 
  Search, 
  Calendar,
  CreditCard,
  MessageSquare,
  Clock,
  ArrowRight,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  History,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const OrderMgmt = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useStore();
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('All Orders');

  // If ID is present, we are in Details view
  const order = useMemo(() => {
    if (!id) return null;
    return orders.find(o => o.id === (id.startsWith('#') ? id : `#${id}`)) || orders[0];
  }, [id, orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All Orders') return orders;
    if (activeTab === 'Pending') return orders.filter(o => o.status === 'Processing');
    if (activeTab === 'Shipping') return orders.filter(o => o.status === 'Shipping');
    if (activeTab === 'Completed') return orders.filter(o => o.status === 'Completed');
    return orders;
  }, [activeTab, orders]);

  const stats = useMemo(() => {
    return {
      total: orders.length + 1282, 
      pending: orders.filter(o => o.status === 'Processing').length + 42,
      inTransit: orders.filter(o => o.status === 'Shipping').length + 156,
      completed: orders.filter(o => o.status === 'Completed').length + 1086
    }
  }, [orders]);

  const handleSaveNote = () => {
    if(!note.trim()) return;
    toast.success('Internal note saved');
    setNote('');
  };

  const logs = [
    { type: 'status', title: 'Status Updated', desc: 'Order #ORD-88218 set to "Shipping" by James', time: '12 minutes ago', icon: <Clock size={16} />, color: 'bg-tertiary/10 text-tertiary' },
    { type: 'payment', title: 'Payment Received', desc: 'Payment for #ORD-88219 confirmed', time: '40 minutes ago', icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700' },
    { type: 'manual', title: 'New Manual Order', desc: 'Admin created manual order #ORD-88220', time: '2 hours ago', icon: <Plus size={16} />, color: 'bg-primary/10 text-primary' }
  ];

  if (id && order) {
    // RENDER ORDER DETAILS VIEW
    return (
      <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
        
        {/* Breadcrumbs & Header Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em]">
                <Link to="/admin/orders" className="hover:text-primary transition-colors">Orders</Link>
                <span>›</span>
                <span className="text-on_surface">Order {order.id}</span>
             </div>
             <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-on_surface tracking-tight">Order Details</h1>
                <Badge variant={order.status === 'Processing' ? 'primary' : 'secondary'} className="px-4 py-1.5 uppercase tracking-widest">
                   {order.status}
                </Badge>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="surface" className="px-6 py-4 flex items-center gap-3">
                <Printer size={18} /> Print Invoice
             </Button>
             <div className="relative group">
                <select 
                  value={order.status}
                  onChange={(e) => {
                    updateOrderStatus(order.id, e.target.value);
                    toast.success(`Order status updated to ${e.target.value}`);
                  }}
                  className="bg-primary hover:bg-primary/90 text-on_primary pl-8 pr-12 py-4 rounded-2xl font-black text-[15px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] appearance-none cursor-pointer outline-none placeholder-inherit"
                >
                   <option value="Processing">Status: Processing</option>
                   <option value="Shipping">Status: Shipping</option>
                   <option value="Completed">Status: Completed</option>
                </select>
                <ChevronDown size={18} strokeWidth={3} className="absolute right-6 top-1/2 -translate-y-1/2 text-on_primary pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Customer & Shipping */}
          <div className="space-y-8">
             {/* Customer Info */}
             <Card className="p-10 hover:shadow-xl hover:shadow-secondary/5 transition-shadow">
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                      <User size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-on_surface">Customer Info</h3>
                      <p className="text-[12px] font-bold text-on_surface_variant">Registered Member</p>
                   </div>
                </div>
                
                <div className="space-y-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em]">Full Name</p>
                      <p className="text-[15px] font-black text-on_surface">{order.userName}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em]">Phone Number</p>
                      <p className="text-[15px] font-black text-on_surface">{order.phone || '+1 (555) 123-4567'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em]">Email Address</p>
                      <p className="text-[15px] font-black text-on_surface">{order.email}</p>
                   </div>
                </div>
             </Card>

             {/* Shipping Address */}
             <Card className="bg-surface_dim p-10 relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10 relative z-10">
                   <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
                      <Truck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-on_surface">Shipping Address</h3>
                      <p className="text-[12px] font-bold text-on_surface_variant">Standard Delivery</p>
                   </div>
                </div>
                
                <p className="text-[15px] font-black text-on_surface leading-relaxed mb-10 max-w-[200px] relative z-10">
                   {order.address}
                </p>

                <Button variant="ghost" size="sm" className="p-0 text-primary items-center gap-2 relative z-10">
                   <MapPin size={14} /> View on Map
                </Button>

                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -z-10 group-hover:bg-blue-100/40 transition-colors"></div>
             </Card>
          </div>

          {/* Right/Main Column: Itemized Breakdown */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="p-10 overflow-hidden">
                <div className="flex items-center justify-between mb-10 px-2">
                   <h3 className="text-xl font-black text-on_surface">Itemized Breakdown</h3>
                   <Badge variant="primary" className="px-4 py-1.5 uppercase tracking-tight">
                      {order.items.length} Items Total
                   </Badge>
                </div>

                <div className="space-y-6">
                 <div className="overflow-x-auto -mx-10 px-10 pb-4">
                    <table className="w-full min-w-[600px]">
                       <thead>
                          <tr className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] border-b border-surface_dim">
                             <th className="pb-6 text-left pl-2">Product</th>
                             <th className="pb-6 text-center">Price</th>
                             <th className="pb-6 text-center">QTY</th>
                             <th className="pb-6 text-right pr-2">Total</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-surface_dim">
                          {order.items.map((item, i) => (
                            <tr key={i} className="group transition-colors">
                               <td className="py-8 pl-2">
                                  <div className="flex items-center gap-5">
                                     <div className="w-16 h-16 bg-surface_dim rounded-[22px] overflow-hidden p-2 flex items-center justify-center border border-surface_container shadow-inner transform group-hover:scale-110 transition-transform">
                                        <img src={item.image || 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=200'} alt={item.title} className="w-full h-full object-contain" />
                                     </div>
                                     <div>
                                        <p className="font-black text-on_surface text-[15px]">{item.title}</p>
                                        <p className="text-[10px] font-bold text-on_surface_variant mt-1 tracking-widest uppercase">SKU: {item.sku || 'N/A'}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="py-8 text-center">
                                  <span className="font-black text-on_surface text-[15px]">${item.price.toFixed(2)}</span>
                               </td>
                               <td className="py-8 text-center">
                                  <span className="bg-surface_dim px-4 py-2 rounded-xl font-black text-[13px] text-primary border border-surface_container">{item.quantity}</span>
                               </td>
                               <td className="py-8 text-right pr-2">
                                  <span className="font-black text-on_surface text-[15px]">${(item.price * item.quantity).toFixed(2)}</span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                   <div className="pt-10 flex flex-col items-end space-y-4 px-4">
                      <div className="w-full max-w-[280px] space-y-3">
                         <div className="flex justify-between items-center text-on_surface_variant font-bold">
                            <span className="text-[13px]">Subtotal</span>
                            <span className="text-on_surface font-black">${order.subtotal?.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-on_surface_variant font-bold">
                            <span className="text-[13px]">Shipping Fee</span>
                            <span className="text-secondary font-black">${order.shippingFee?.toFixed(2) || '5.00'}</span>
                         </div>
                         <div className="flex justify-between items-center text-on_surface_variant font-bold">
                            <span className="text-[13px]">Sales Tax (5%)</span>
                            <span className="text-on_surface font-black">${order.salesTax?.toFixed(2) || '3.32'}</span>
                         </div>
                         <div className="pt-6 border-t border-surface_container flex justify-between items-baseline">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Amount</p>
                               <p className="text-4xl font-black text-on_surface">${order.total?.toFixed(2)}</p>
                            </div>
                            <Badge variant="primary" className="px-3 py-1 text-[10px] font-black tracking-widest uppercase mb-1">PAID</Badge>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Timeline */}
                <Card className="bg-surface_dim p-10">
                   <div className="flex items-center gap-3 mb-10">
                      <Clock size={20} className="text-primary" />
                      <h3 className="text-lg font-black text-on_surface">Order Timeline</h3>
                   </div>
                   
                   <div className="space-y-8 relative">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-surface_container"></div>
                      
                      <div className="flex gap-6 relative">
                         <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-on_surface">Order Shipped</p>
                            <p className="text-[11px] font-bold text-on_surface_variant mt-1">Today, 10:45 AM - Warehouse A</p>
                         </div>
                      </div>

                      <div className="flex gap-6 relative">
                         <div className="w-6 h-6 rounded-full bg-surface_container flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-on_surface_variant">Payment Confirmed</p>
                            <p className="text-[11px] font-bold text-on_surface_variant mt-1">Yesterday, 02:30 PM</p>
                         </div>
                      </div>

                      <div className="flex gap-6 relative opacity-60">
                         <div className="w-6 h-6 rounded-full bg-surface_container flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-on_surface_variant">Order Placed</p>
                            <p className="text-[11px] font-bold text-on_surface_variant mt-1">Yesterday, 02:15 PM</p>
                         </div>
                      </div>
                   </div>
                </Card>

                {/* Internal Admin Notes */}
                <Card className="p-10">
                   <div className="flex items-center gap-3 mb-8">
                      <MessageSquare size={20} className="text-secondary" />
                      <h3 className="text-lg font-black text-on_surface">Internal Admin Notes</h3>
                   </div>
                   
                   <textarea 
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     placeholder="Add a private note about this order..."
                     className="w-full h-32 bg-surface_dim p-6 rounded-[25px] font-bold text-on_surface text-[13px] outline-none border-2 border-transparent focus:border-primary/10 transition-all resize-none placeholder-on_surface_variant/40"
                   ></textarea>

                   <Button 
                     onClick={handleSaveNote}
                     variant="secondary"
                     className="mt-6 w-full py-4 text-[13px] opacity-90 hover:opacity-100"
                   >
                     Save Note
                   </Button>
                </Card>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ORDER LIST VIEW
  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
       
       {/* Header with Search */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-on_surface tracking-tight">Order Management</h1>
             <p className="text-on_surface_variant font-bold text-lg">Review and process customer orders across all channels.</p>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="surface" className="px-6 py-4 flex items-center gap-3">
                <Download size={18} /> Export CSV
             </Button>
             <Button variant="primary" className="px-8 py-4 flex items-center gap-3">
                <Plus size={22} strokeWidth={3} /> Manual Order
             </Button>
          </div>
       </div>

       {/* Stats Section */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <History size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-1">Total Orders</p>
                <h3 className="text-2xl font-black text-on_surface">{stats.total.toLocaleString()}</h3>
             </div>
          </Card>
          <Card className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                <Clock size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-1">Pending</p>
                <h3 className="text-2xl font-black text-on_surface">{stats.pending}</h3>
             </div>
          </Card>
          <Card className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
                <Truck size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-1">In Transit</p>
                <h3 className="text-2xl font-black text-on_surface">{stats.inTransit}</h3>
             </div>
          </Card>
          <Card className="p-8 flex items-center gap-6">
             <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-1">Completed</p>
                <h3 className="text-2xl font-black text-on_surface">{stats.completed.toLocaleString()}</h3>
             </div>
          </Card>
       </div>

       {/* Filters & Table */}
       <Card className="p-10 overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-2 bg-surface_dim p-1.5 rounded-2xl">
                {['All Orders', 'Pending', 'Shipping', 'Completed'].map(tab => (
                  <Button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    variant={activeTab === tab ? 'primary' : 'ghost'}
                    size="sm"
                    className={`px-6 py-2.5 rounded-xl font-black text-[13px] ${activeTab === tab ? 'shadow-lg shadow-primary/20' : ''}`}
                  >
                    {tab}
                  </Button>
                ))}
             </div>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <select className="bg-surface_dim py-3.5 pl-12 pr-10 rounded-xl font-bold text-[13px] text-on_surface outline-none appearance-none border-2 border-transparent focus:border-primary/10 transition-all cursor-pointer">
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Year to Date</option>
                   </select>
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant" size={18} />
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on_surface_variant pointer-events-none" size={16} />
                </div>
                <Button variant="surface" size="sm" className="p-3.5 w-12 h-12 flex items-center justify-center">
                   <Filter size={20} />
                </Button>
             </div>
          </div>

          <div className="overflow-x-auto -mx-10 px-10 pb-4">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] border-b border-surface_dim">
                  <th className="pb-6 text-left pl-2">Order ID</th>
                  <th className="pb-6 text-left">Customer Name</th>
                  <th className="pb-6 text-left">Date</th>
                  <th className="pb-6 text-left">Total Amount</th>
                  <th className="pb-6 text-left">Status</th>
                  <th className="pb-6 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface_dim">
              {filteredOrders.map((o) => (
                  <tr key={o.id} className="group hover:bg-surface_dim transition-colors">
                    <td className="py-8 pl-2 font-black text-on_surface">{o.id === '#CS-8842' ? '#ORD-88219' : o.id.replace('#', '#ORD-')}</td>
                    <td className="py-8">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-surface_container">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${o.userName}`} alt="Avatar" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="font-black text-on_surface text-[14px] leading-tight">{o.userName}</p>
                            <p className="text-[11px] font-bold text-on_surface_variant/60 mt-0.5">{o.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="py-8 text-[14px] font-bold text-on_surface">
                      {o.id === '#CS-8842' ? 'Oct 24, 2023' : new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-8 font-black text-on_surface text-[14px]">${o.total.toFixed(2)}</td>
                    <td className="py-8">
                        <Badge 
                          variant={o.status === 'Processing' ? 'outline' : o.status === 'Shipping' ? 'tertiary' : 'secondary'}
                          className="px-4 py-1.5 flex items-center gap-2 w-fit tracking-widest"
                        >
                           <div className={`w-1.5 h-1.5 rounded-full ${
                             o.status === 'Processing' ? 'bg-warning' : 
                             o.status === 'Shipping' ? 'bg-tertiary' :
                             'bg-success'
                           }`}></div>
                           {o.status === 'Processing' ? 'PENDING' : o.status === 'Shipping' ? 'SHIPPING' : 'COMPLETED'}
                        </Badge>
                     </td>
                    <td className="py-8 text-right pr-2">
                       <Link to={`/admin/orders/${o.id.replace('#', '')}`}>
                          <MoreVertical size={18} className="text-on_surface_variant hover:text-primary transition-colors cursor-pointer" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-surface_dim">
             <p className="text-[12px] font-bold text-on_surface_variant">Showing <span className="text-on_surface">1-5</span> of <span className="text-on_surface">1,284</span> orders</p>
             <div className="flex items-center gap-2">
                <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-xl">
                   <ChevronDown className="rotate-90" size={18} />
                </Button>
                {[1, 2, 3].map(p => (
                   <Button 
                     key={p} 
                     variant={p === 1 ? 'primary' : 'ghost'}
                     size="sm"
                     className={`w-10 h-10 p-0 rounded-xl font-black text-[13px] ${p === 1 ? 'shadow-md shadow-primary/20' : ''}`}
                   >
                      {p}
                   </Button>
                ))}
                <span className="text-on_surface_variant px-2">...</span>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl font-black text-[13px]">257</Button>
                <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-xl">
                   <ChevronDown className="-rotate-90" size={18} />
                </Button>
             </div>
          </div>
       </Card>

       {/* Bottom Footer Cards */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 p-10 relative overflow-hidden group">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <h3 className="text-2xl font-black text-on_surface mb-3">Inventory Alert</h3>
                   <p className="text-[14px] font-bold text-on_surface_variant leading-relaxed max-w-sm">
                      "Sour Gummy Worms" and "Luxury Chocolate Box" are running low on stock. Restock suggested soon.
                   </p>
                </div>
                <Button variant="primary" className="mt-8 px-8 py-4 w-fit">
                   Restock Now
                </Button>
             </div>
             <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <History size={200} />
             </div>
          </Card>

          <Card className="lg:col-span-2 p-10">
             <h3 className="text-xl font-black text-on_surface mb-8">Log Activity</h3>
             <div className="space-y-8">
                {logs.map((log, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                        log.type === 'status' ? 'bg-info' : 
                        log.type === 'payment' ? 'bg-success' : 'bg-primary'
                      }`}></div>
                      <div>
                         <p className="font-black text-on_surface text-[14px]">{log.title}</p>
                         <p className="text-[12px] font-bold text-on_surface_variant mt-0.5 line-clamp-1">{log.desc}</p>
                         <p className="text-[10px] font-bold text-on_surface_variant/60 mt-1 uppercase tracking-wider">{log.time}</p>
                      </div>
                   </div>
                ))}
             </div>
             <Button variant="ghost" size="sm" className="mt-8 w-full uppercase tracking-widest text-primary">
                View All Logs
             </Button>
          </Card>
       </div>

    </div>
  );
};

export default OrderMgmt;
