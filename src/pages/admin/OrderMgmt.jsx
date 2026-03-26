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
    { type: 'status', title: 'Status Updated', desc: 'Order #ORD-88218 set to "Shipping" by James', time: '12 minutes ago', icon: <Clock size={16} />, color: 'bg-blue-100 text-blue-600' },
    { type: 'payment', title: 'Payment Received', desc: 'Payment for #ORD-88219 confirmed', time: '40 minutes ago', icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-600' },
    { type: 'manual', title: 'New Manual Order', desc: 'Admin created manual order #ORD-88220', time: '2 hours ago', icon: <Plus size={16} />, color: 'bg-pink-100 text-pink-600' }
  ];

  if (id && order) {
    // RENDER ORDER DETAILS VIEW (image_25.png)
    return (
      <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
        
        {/* Breadcrumbs & Header Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[11px] font-black text-[#b0a9bc] uppercase tracking-[0.2em]">
                <Link to="/admin/orders" className="hover:text-primary transition-colors">Orders</Link>
                <span>›</span>
                <span className="text-[#2d2a4a]">Order {order.id}</span>
             </div>
             <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight">Order Details</h1>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase ${
                  order.status === 'Processing' ? 'bg-[#fff0f3] text-[#f13a7b]' : 'bg-[#f4ebff] text-[#7c3aed]'
                }`}>
                  {order.status}
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="bg-white hover:bg-[#f8f7fa] text-[#2d2a4a] border border-[#ece8f1] px-6 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 transition-all shadow-sm">
                <Printer size={18} /> Print Invoice
             </button>
             <div className="relative group">
                <select 
                  value={order.status}
                  onChange={(e) => {
                    updateOrderStatus(order.id, e.target.value);
                    toast.success(`Order status updated to ${e.target.value}`);
                  }}
                  className="bg-primary hover:bg-[#d92d6a] text-white pl-8 pr-12 py-4 rounded-2xl font-black text-[15px] shadow-lg shadow-pink-100 transition-all hover:scale-[1.02] appearance-none cursor-pointer outline-none"
                >
                   <option value="Processing">Status: Processing</option>
                   <option value="Shipping">Status: Shipping</option>
                   <option value="Completed">Status: Completed</option>
                </select>
                <ChevronDown size={18} strokeWidth={3} className="absolute right-6 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Customer & Shipping */}
          <div className="space-y-8">
             {/* Customer Info */}
             <div className="bg-white rounded-[40px] p-10 border border-[#ece8f1] shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-shadow">
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-14 h-14 bg-[#f4ebff] text-[#7c3aed] rounded-2xl flex items-center justify-center">
                      <User size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[#2d2a4a]">Customer Info</h3>
                      <p className="text-[12px] font-bold text-[#b0a9bc]">Registered Member</p>
                   </div>
                </div>
                
                <div className="space-y-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em]">Full Name</p>
                      <p className="text-[15px] font-black text-[#2d2a4a]">{order.userName}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em]">Phone Number</p>
                      <p className="text-[15px] font-black text-[#2d2a4a]">{order.phone || '+1 (555) 123-4567'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em]">Email Address</p>
                      <p className="text-[15px] font-black text-[#2d2a4a]">{order.email}</p>
                   </div>
                </div>
             </div>

             {/* Shipping Address */}
             <div className="bg-[#fdfaff] rounded-[40px] p-10 border border-[#ece8f1] shadow-sm relative overflow-hidden group">
                <div className="flex items-center gap-5 mb-10 relative z-10">
                   <div className="w-14 h-14 bg-[#daf4ff] text-[#0c66e4] rounded-2xl flex items-center justify-center">
                      <Truck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[#2d2a4a]">Shipping Address</h3>
                      <p className="text-[12px] font-bold text-[#b0a9bc]">Standard Delivery</p>
                   </div>
                </div>
                
                <p className="text-[15px] font-black text-[#2d2a4a] leading-relaxed mb-10 max-w-[200px] relative z-10">
                   {order.address}
                </p>

                <button className="flex items-center gap-2 text-[12px] font-black text-primary hover:underline relative z-10">
                   <MapPin size={14} /> View on Map
                </button>

                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -z-10 group-hover:bg-blue-100/40 transition-colors"></div>
             </div>
          </div>

          {/* Right/Main Column: Itemized Breakdown */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-[45px] border border-[#ece8f1] p-10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-10 px-2">
                   <h3 className="text-xl font-black text-[#2d2a4a]">Itemized Breakdown</h3>
                   <span className="bg-[#fef1f5] text-primary px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight">
                      {order.items.length} Items Total
                   </span>
                </div>

                <div className="space-y-6">
                   <table className="w-full">
                      <thead>
                         <tr className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] border-b border-[#f8f7fa]">
                            <th className="pb-6 text-left pl-2">Product</th>
                            <th className="pb-6 text-center">Price</th>
                            <th className="pb-6 text-center">QTY</th>
                            <th className="pb-6 text-right pr-2">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f8f7fa]">
                         {order.items.map((item, i) => (
                           <tr key={i} className="group transition-colors">
                              <td className="py-8 pl-2">
                                 <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-[#f8f7fa] rounded-[22px] overflow-hidden p-2 flex items-center justify-center border border-[#ece8f1] shadow-inner transform group-hover:scale-110 transition-transform">
                                       <img src={item.image || 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=200'} alt={item.title} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                       <p className="font-black text-[#2d2a4a] text-[15px]">{item.title}</p>
                                       <p className="text-[10px] font-bold text-[#b0a9bc] mt-1 tracking-widest uppercase">SKU: {item.sku || 'N/A'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-8 text-center">
                                 <span className="font-black text-[#2d2a4a] text-[15px]">${item.price.toFixed(2)}</span>
                              </td>
                              <td className="py-8 text-center">
                                 <span className="bg-[#f8f7fa] px-4 py-2 rounded-xl font-black text-[13px] text-primary border border-[#ece8f1]">{item.quantity}</span>
                              </td>
                              <td className="py-8 text-right pr-2">
                                 <span className="font-black text-[#2d2a4a] text-[15px]">${(item.price * item.quantity).toFixed(2)}</span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>

                   <div className="pt-10 flex flex-col items-end space-y-4 px-4">
                      <div className="w-full max-w-[280px] space-y-3">
                         <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                            <span className="text-[13px]">Subtotal</span>
                            <span className="text-[#2d2a4a] font-black">${order.subtotal?.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                            <span className="text-[13px]">Shipping Fee</span>
                            <span className="text-secondary font-black">${order.shippingFee?.toFixed(2) || '5.00'}</span>
                         </div>
                         <div className="flex justify-between items-center text-[#8e8a9d] font-bold">
                            <span className="text-[13px]">Sales Tax (5%)</span>
                            <span className="text-[#2d2a4a] font-black">${order.salesTax?.toFixed(2) || '3.32'}</span>
                         </div>
                         <div className="pt-6 border-t border-[#ece8f1] flex justify-between items-baseline">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Amount</p>
                               <p className="text-4xl font-black text-[#2d2a4a]">${order.total?.toFixed(2)}</p>
                            </div>
                            <span className="bg-[#2d2a4a] text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase mb-1">PAID</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Timeline */}
                <div className="bg-[#fdfaff] rounded-[40px] p-10 border border-[#ece8f1] shadow-sm">
                   <div className="flex items-center gap-3 mb-10">
                      <Clock size={20} className="text-primary" />
                      <h3 className="text-lg font-black text-[#2d2a4a]">Order Timeline</h3>
                   </div>
                   
                   <div className="space-y-8 relative">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#ece8f1]"></div>
                      
                      <div className="flex gap-6 relative">
                         <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-[#2d2a4a]">Order Shipped</p>
                            <p className="text-[11px] font-bold text-[#b0a9bc] mt-1">Today, 10:45 AM - Warehouse A</p>
                         </div>
                      </div>

                      <div className="flex gap-6 relative">
                         <div className="w-6 h-6 rounded-full bg-[#ece8f1] flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-[#b0a9bc]">Payment Confirmed</p>
                            <p className="text-[11px] font-bold text-[#b0a9bc] mt-1">Yesterday, 02:30 PM</p>
                         </div>
                      </div>

                      <div className="flex gap-6 relative opacity-60">
                         <div className="w-6 h-6 rounded-full bg-[#ece8f1] flex items-center justify-center relative z-10 border-4 border-white"></div>
                         <div>
                            <p className="text-[14px] font-black text-[#b0a9bc]">Order Placed</p>
                            <p className="text-[11px] font-bold text-[#b0a9bc] mt-1">Yesterday, 02:15 PM</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="bg-white rounded-[40px] p-10 border border-[#ece8f1] shadow-sm">
                   <div className="flex items-center gap-3 mb-8">
                      <MessageSquare size={20} className="text-[#7c3aed]" />
                      <h3 className="text-lg font-black text-[#2d2a4a]">Internal Admin Notes</h3>
                   </div>
                   
                   <textarea 
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     placeholder="Add a private note about this order..."
                     className="w-full h-32 bg-[#f8f7fa] p-6 rounded-[25px] font-bold text-[#2d2a4a] text-[13px] outline-none border-2 border-transparent focus:border-primary/10 transition-all resize-none"
                   ></textarea>

                   <button 
                     onClick={handleSaveNote}
                     className="mt-6 w-full bg-[#5c547a] hover:bg-[#2d2a4a] text-white py-4 rounded-2xl font-black text-[13px] transition-all shadow-lg shadow-purple-100"
                   >
                     Save Note
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ORDER LIST VIEW (Default - image_26.png)
  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
       
       {/* Header with Search */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight">Order Management</h1>
             <p className="text-[#8e8a9d] font-bold text-lg">Review and process customer orders across all channels.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-white border border-[#ece8f1] text-[#2d2a4a] px-6 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 transition-all shadow-sm hover:shadow-md">
                <Download size={18} /> Export CSV
             </button>
             <button className="bg-primary hover:bg-[#d92d6a] text-white px-8 py-4 rounded-2xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-pink-100 transition-all hover:scale-[1.05]">
                <Plus size={22} strokeWidth={3} /> Manual Order
             </button>
          </div>
       </div>

       {/* Stats Section */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[35px] border border-[#ece8f1] flex items-center gap-6">
             <div className="w-14 h-14 bg-[#fff0f3] text-primary rounded-2xl flex items-center justify-center">
                <History size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-1">Total Orders</p>
                <h3 className="text-2xl font-black text-[#2d2a4a]">{stats.total.toLocaleString()}</h3>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[35px] border border-[#ece8f1] flex items-center gap-6">
             <div className="w-14 h-14 bg-[#f2e7ff] text-[#7c3aed] rounded-2xl flex items-center justify-center">
                <Clock size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-1">Pending</p>
                <h3 className="text-2xl font-black text-[#2d2a4a]">{stats.pending}</h3>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[35px] border border-[#ece8f1] flex items-center gap-6">
             <div className="w-14 h-14 bg-[#daf4ff] text-[#0c66e4] rounded-2xl flex items-center justify-center">
                <Truck size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-1">In Transit</p>
                <h3 className="text-2xl font-black text-[#2d2a4a]">{stats.inTransit}</h3>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[35px] border border-[#ece8f1] flex items-center gap-6">
             <div className="w-14 h-14 bg-[#e7f9f2] text-[#10b981] rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-1">Completed</p>
                <h3 className="text-2xl font-black text-[#2d2a4a]">{stats.completed.toLocaleString()}</h3>
             </div>
          </div>
       </div>

       {/* Filters & Table */}
       <div className="bg-white rounded-[45px] border border-[#ece8f1] p-10 shadow-sm overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-2 bg-[#f8f7fa] p-1.5 rounded-2xl">
                {['All Orders', 'Pending', 'Shipping', 'Completed'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[13px] transition-all ${
                      activeTab === tab ? 'bg-primary text-white shadow-lg shadow-pink-100' : 'text-[#8e8a9d] hover:text-[#2d2a4a]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <select className="bg-[#f8f7fa] py-3.5 pl-12 pr-10 rounded-xl font-bold text-[13px] text-[#2d2a4a] outline-none appearance-none border-2 border-transparent focus:border-primary/10 transition-all cursor-pointer">
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Year to Date</option>
                   </select>
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a9bc]" size={18} />
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b0a9bc] pointer-events-none" size={16} />
                </div>
                <button className="p-3.5 bg-[#f8f7fa] rounded-xl text-[#b0a9bc] hover:text-primary transition-colors border-2 border-transparent">
                   <Filter size={20} />
                </button>
             </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] border-b border-[#f8f7fa]">
                <th className="pb-6 text-left pl-2">Order ID</th>
                <th className="pb-6 text-left">Customer Name</th>
                <th className="pb-6 text-left">Date</th>
                <th className="pb-6 text-left">Total Amount</th>
                <th className="pb-6 text-left">Status</th>
                <th className="pb-6 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8f7fa]">
            {filteredOrders.map((o, i) => (
                <tr key={o.id} className="group hover:bg-[#fdfaff] transition-colors">
                  <td className="py-8 pl-2 font-black text-[#2d2a4a]">{o.id === '#CS-8842' ? '#ORD-88219' : o.id.replace('#', '#ORD-')}</td>
                  <td className="py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-[#ece8f1]">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${o.userName}`} alt="Avatar" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-[#2d2a4a] text-[14px] leading-tight">{o.userName}</p>
                          <p className="text-[11px] font-bold text-[#b0a9bc] mt-0.5">{o.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-8 text-[14px] font-bold text-[#2d2a4a]">
                    {o.id === '#CS-8842' ? 'Oct 24, 2023' : new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-8 font-black text-[#2d2a4a] text-[14px]">${o.total.toFixed(2)}</td>
                  <td className="py-8">
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 w-fit ${
                       o.status === 'Processing' ? 'bg-[#fff9e6] text-[#cc9900]' : 
                       o.status === 'Shipping' ? 'bg-[#edf4ff] text-[#0c66e4]' :
                       'bg-[#e7f9f2] text-[#10b981]'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          o.status === 'Processing' ? 'bg-[#cc9900]' : 
                          o.status === 'Shipping' ? 'bg-[#0c66e4]' :
                          'bg-[#10b981]'
                        }`}></div>
                        {o.status === 'Processing' ? 'PENDING' : o.status === 'Shipping' ? 'SHIPPING' : 'COMPLETED'}
                     </span>
                  </td>
                  <td className="py-8 text-right pr-2">
                     <Link to={`/admin/orders/${o.id.replace('#', '')}`}>
                        <MoreVertical size={18} className="text-[#b0a9bc] hover:text-primary transition-colors cursor-pointer" />
                     </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#f8f7fa]">
             <p className="text-[12px] font-bold text-[#b0a9bc]">Showing <span className="text-[#2d2a4a]">1-5</span> of <span className="text-[#2d2a4a]">1,284</span> orders</p>
             <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl border border-[#ece8f1] flex items-center justify-center text-[#b0a9bc] hover:bg-[#f8f7fa] transition-all">
                   <ChevronDown className="rotate-90" size={18} />
                </button>
                {[1, 2, 3].map(p => (
                   <button key={p} className={`w-10 h-10 rounded-xl font-black text-[13px] transition-all ${p === 1 ? 'bg-primary text-white shadow-md shadow-pink-100' : 'text-[#8e8a9d] hover:bg-[#f8f7fa]'}`}>
                      {p}
                   </button>
                ))}
                <span className="text-[#b0a9bc] px-2">...</span>
                <button className="w-10 h-10 rounded-xl font-black text-[13px] text-[#8e8a9d] hover:bg-[#f8f7fa]">257</button>
                <button className="w-10 h-10 rounded-xl border border-[#ece8f1] flex items-center justify-center text-[#b0a9bc] hover:bg-[#f8f7fa] transition-all">
                   <ChevronDown className="-rotate-90" size={18} />
                </button>
             </div>
          </div>
       </div>

       {/* Bottom Footer Cards */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-[45px] border border-[#ece8f1] p-10 relative overflow-hidden group">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <h3 className="text-2xl font-black text-[#2d2a4a] mb-3">Inventory Alert</h3>
                   <p className="text-[14px] font-bold text-[#8e8a9d] leading-relaxed max-w-sm">
                      "Sour Gummy Worms" and "Luxury Chocolate Box" are running low on stock. Restock suggested soon.
                   </p>
                </div>
                <button className="mt-8 bg-primary hover:bg-[#d92d6a] text-white px-8 py-4 rounded-2xl font-black text-[14px] w-fit shadow-lg shadow-pink-100 transition-all">
                   Restock Now
                </button>
             </div>
             <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <History size={200} />
             </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[45px] border border-[#ece8f1] p-10 shadow-sm">
             <h3 className="text-xl font-black text-[#2d2a4a] mb-8">Log Activity</h3>
             <div className="space-y-8">
                {logs.map((log, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                        log.type === 'status' ? 'bg-blue-500' : 
                        log.type === 'payment' ? 'bg-green-500' : 'bg-pink-500'
                      }`}></div>
                      <div>
                         <p className="font-black text-[#2d2a4a] text-[14px]">{log.title}</p>
                         <p className="text-[12px] font-bold text-[#b0a9bc] mt-0.5 line-clamp-1">{log.desc}</p>
                         <p className="text-[10px] font-bold text-[#b0a9bc]/60 mt-1 uppercase tracking-wider">{log.time}</p>
                      </div>
                   </div>
                ))}
             </div>
             <button className="mt-8 w-full text-[12px] font-black text-primary hover:underline uppercase tracking-widest">
                View All Logs
             </button>
          </div>
       </div>

    </div>
  );
};

export default OrderMgmt;
