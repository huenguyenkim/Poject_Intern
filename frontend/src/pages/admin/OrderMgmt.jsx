import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Table, 
  Tag, 
  Space, 
  Tooltip, 
  Statistic, 
  Tabs, 
  Steps, 
  Timeline, 
  Progress,
  Input as AntInput,
  Select,
  Dropdown,
  Menu
} from 'antd';
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
  MoreVertical,
  Eye,
  Package,
  XCircle
} from 'lucide-react';
import { fetchOrdersThunk, updateOrderStatusThunk, fetchOrderByIdThunk } from '../../store/orderSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const OrderMgmt = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: orders, status: orderStatus, meta, error } = useSelector((state) => state.orders);
  
  const [activeTab, setActiveTab] = useState('All Orders');
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchOrders = (page = 1, limit = 10) => {
    dispatch(fetchOrdersThunk({ page, limit }));
  };

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [dispatch, pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleRefresh = () => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

  // If ID is present, we are in Details view
  const order = useMemo(() => {
    if (!id) return null;
    return orders.find(o => String(o.id) === id);
  }, [id, orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatusThunk({ id: orderId, status: newStatus })).unwrap();
      showSuccessToast(`Order #${orderId} updated to ${newStatus}`);
      handleRefresh();
    } catch (err) {
      showErrorToast(err || 'Failed to update order status');
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (activeTab === 'Pending') result = orders.filter(o => o.status === 'pending');
    if (activeTab === 'Confirmed') result = orders.filter(o => o.status === 'confirmed');
    if (activeTab === 'Shipping') result = orders.filter(o => o.status === 'shipping');
    if (activeTab === 'Completed') result = orders.filter(o => o.status === 'completed');
    if (activeTab === 'Cancelled') result = orders.filter(o => o.status === 'cancelled');

    if (searchText) {
      result = result.filter(o => 
        String(o.id).toLowerCase().includes(searchText.toLowerCase()) ||
        o.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return result;
  }, [activeTab, orders, searchText]);

  const stats = useMemo(() => {
    return {
      total: meta?.total || 0,
      pending: orders.filter(o => o.status === 'pending').length, // This is only per page, but okay for now
      shipping: orders.filter(o => o.status === 'shipping').length,
      completed: orders.filter(o => o.status === 'completed').length
    }
  }, [orders, meta]);

  const columns = [
    {
      title: 'ORDER ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span className="font-black text-on_surface uppercase">#ORD-{text}</span>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'CUSTOMER',
      key: 'customer',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-surface_container">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.userName || 'User'}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-on_surface text-[14px] leading-tight uppercase">{record.userName || 'Guest'}</p>
            <p className="text-[11px] font-bold text-on_surface_variant/60 mt-0.5">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'DATE',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <span className="text-[14px] font-bold text-on_surface_variant">
          {date ? new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
        </span>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (total) => <span className="font-black text-on_surface text-[15px]">${(total || 0).toFixed(2)}</span>,
      sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let variant = 'outline';
        if (status === 'completed') variant = 'secondary';
        if (status === 'shipping') variant = 'tertiary';
        if (status === 'cancelled') variant = 'error';

        return (
          <Badge 
            variant={variant}
            className="px-4 py-1.5 flex items-center gap-2 w-fit tracking-widest text-[10px] font-black uppercase"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'pending' ? 'bg-warning' : 
              status === 'confirmed' ? 'bg-primary' :
              status === 'shipping' ? 'bg-tertiary' :
              status === 'completed' ? 'bg-secondary' : 'bg-error'
            }`}></div>
            {status}
          </Badge>
        );
      },
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/orders/${record.id}`}>
            <Tooltip title="View Details">
              <Button variant="surface" size="sm" className="!p-2 !w-10 !h-10 !rounded-xl">
                <Eye size={18} className="text-on_surface_variant hover:text-primary transition-colors" />
              </Button>
            </Tooltip>
          </Link>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => handleUpdateStatus(record.id, key)}>
                <Menu.Item key="confirmed" icon={<CheckCircle2 size={14} />}>Approve</Menu.Item>
                <Menu.Item key="shipping" icon={<Truck size={14} />}>Ship Order</Menu.Item>
                <Menu.Item key="completed" icon={<Package size={14} />}>Complete</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="cancelled" danger icon={<XCircle size={14} />}>Cancel</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button variant="ghost" size="sm" className="!p-2 !w-10 !h-10">
                <MoreVertical size={18} className="text-on_surface_variant" />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  if (id && order) {
    const currentStep = 
      order.status === 'pending' ? 0 : 
      order.status === 'confirmed' ? 1 : 
      order.status === 'shipping' ? 2 : 3;

    return (
      <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
        <div className="w-full max-w-[1600px] px-10 py-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
                <Link to="/admin/orders" className="hover:text-primary transition-colors">Order Management</Link>
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                <span className="text-primary font-black uppercase tracking-[0.2em]">Order Details</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Order #ORD-{order.id}</h1>
                <p className="text-on_surface_variant font-bold text-lg max-w-xl">Review transaction history and fulfillment status.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="surface" className="h-[72px] px-8 rounded-[28px] border-none bg-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group">
                  <Printer size={20} className="text-on_surface_variant group-hover:text-primary transition-colors" />
                  <span className="text-sm font-black uppercase tracking-widest text-on_surface_variant group-hover:text-primary">Print Invoice</span>
               </Button>
               <Dropdown
                overlay={
                  <Menu onClick={({ key }) => handleUpdateStatus(order.id, key)}>
                    <Menu.Item key="confirmed">Approve</Menu.Item>
                    <Menu.Item key="shipping">Ship Order</Menu.Item>
                    <Menu.Item key="completed">Mark as Completed</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="cancelled" danger>Cancel Order</Menu.Item>
                  </Menu>
                }
               >
                 <Button variant="primary" className="h-[72px] px-10 rounded-[28px] shadow-2xl shadow-primary/20 hover:shadow-primary/30 flex items-center gap-4">
                    <span className="text-base font-black uppercase tracking-widest">Update Status</span>
                    <ChevronDown size={20} />
                 </Button>
               </Dropdown>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <Card className="p-10 rounded-[32px]">
                  <Steps 
                    current={currentStep} 
                    className="order-steps"
                    items={[
                      { title: 'Pending', icon: <Clock size={20} /> },
                      { title: 'Confirmed', icon: <CheckCircle2 size={20} /> },
                      { title: 'Shipping', icon: <Truck size={20} /> },
                      { title: 'Completed', icon: <Package size={20} /> },
                    ]}
                  />
               </Card>
               
               <Card className="p-10 rounded-[32px] overflow-hidden space-y-10">
                  <div className="flex items-center justify-between border-b border-surface_container pb-6">
                     <h3 className="text-2xl font-black text-on_surface tracking-tight uppercase">Line Items</h3>
                     <Badge variant="primary" className="px-4 py-1.5 uppercase tracking-widest text-[10px]">{order.items?.length || 0} Items</Badge>
                  </div>
                  
                  <div className="space-y-8">
                     {(order.items || []).map((item, i) => (
                       <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 bg-surface_dim p-2 rounded-[24px] overflow-hidden border border-surface_container group-hover:border-primary/20 transition-colors shadow-sm">
                                <img src={item.image || '/images/cat-gummies.png'} alt="" className="w-full h-full object-cover rounded-[18px]" />
                             </div>
                             <div>
                                <h4 className="text-lg font-black text-on_surface group-hover:text-primary transition-colors uppercase">{item.title}</h4>
                                <p className="text-[12px] font-bold text-on_surface_variant mt-1 uppercase tracking-widest">Quantity: {item.quantity || 1}</p>
                             </div>
                          </div>
                          <p className="text-xl font-black text-on_surface">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                       </div>
                     ))}
                  </div>

                  <div className="pt-10 border-t border-surface_container space-y-4">
                     <div className="flex justify-between items-end pt-4">
                        <span className="text-2xl font-black text-on_surface uppercase tracking-tight">Total Amount</span>
                        <span className="text-4xl font-black text-primary">${(order.totalAmount || 0).toFixed(2)}</span>
                     </div>
                  </div>
               </Card>

               <Card className="p-10 rounded-[32px] grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                           <User size={20} />
                        </div>
                        <h3 className="text-lg font-black text-on_surface uppercase tracking-tight">Customer Profile</h3>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-surface_dim rounded-3xl">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-primary/10">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.userName || 'User'}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-black text-xl text-on_surface uppercase leading-none">{order.userName || 'Guest'}</p>
                           <p className="font-bold text-on_surface_variant text-[13px] mt-1">{order.email}</p>
                        </div>
                     </div>
                     <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-4 text-on_surface_variant">
                           <MapPin size={18} className="shrink-0" />
                           <p className="text-sm font-bold">{order.address || 'No address provided'}</p>
                        </div>
                        <div className="flex items-center gap-4 text-on_surface_variant">
                           <CreditCard size={18} className="shrink-0" />
                           <p className="text-sm font-bold">Receiver: {order.receiverName} ({order.phone})</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                           <Truck size={20} />
                        </div>
                        <h3 className="text-lg font-black text-on_surface uppercase tracking-tight">Shipping Info</h3>
                     </div>
                     <Card className="bg-surface_dim p-6 border-none rounded-3xl space-y-4">
                        <div className="flex items-center justify-between font-bold text-[13px]">
                           <span className="opacity-50 uppercase tracking-widest text-[10px]">Courier</span>
                           <span className="uppercase">Candy Express</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-[13px]">
                           <span className="opacity-50 uppercase tracking-widest text-[10px]">Tracking #</span>
                           <span className="text-primary truncate ml-4">CX-{order.id}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-[13px]">
                           <span className="opacity-50 uppercase tracking-widest text-[10px]">Est. Delivery</span>
                           <span>{new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</span>
                        </div>
                     </Card>
                  </div>
               </Card>
            </div>

            <div className="space-y-10">
               <Card className="p-10 rounded-[32px] border-none bg-surface_container relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                     <Statistic 
                        title={<span className="text-[11px] font-black opacity-50 uppercase tracking-[0.2em]">Current Status</span>}
                        value={(order.status || 'pending').toUpperCase()}
                        valueStyle={{ fontWeight: 900, color: '#FF76B8', fontSize: '28px' }}
                     />
                     
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider opacity-60">
                           <span>Fullfillment Progress</span>
                           <span>{order.status === 'completed' ? '100%' : order.status === 'shipping' ? '75%' : order.status === 'confirmed' ? '50%' : '25%'}</span>
                        </div>
                        <Progress percent={order.status === 'completed' ? 100 : order.status === 'shipping' ? 75 : order.status === 'confirmed' ? 50 : 25} showInfo={false} strokeColor="#FF76B8" strokeWidth={12} className="!m-0" />
                     </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-700">
                     <Truck size={200} />
                  </div>
               </Card>

               <Card className="p-10 rounded-[32px] space-y-8">
                  <div className="flex items-center justify-between border-b border-surface_container pb-4">
                     <h3 className="text-xl font-black text-on_surface uppercase tracking-tight">Activity Logs</h3>
                     <History size={18} className="text-on_surface_variant" />
                  </div>
                  
                  <Timeline 
                    className="custom-timeline"
                    items={[
                      {
                        color: order.status === 'completed' ? 'green' : 'pink',
                        children: (
                          <div className="pb-4">
                            <p className="text-[14px] font-black text-on_surface uppercase">{order.status}</p>
                            <p className="text-[11px] font-bold text-on_surface_variant mt-1 uppercase tracking-wider">Order Updated</p>
                          </div>
                        ),
                      },
                      {
                        children: (
                          <div className="pb-4">
                            <p className="text-[14px] font-black text-on_surface_variant uppercase">Order Placed</p>
                            <p className="text-[11px] font-bold text-on_surface_variant mt-1 uppercase tracking-wider">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        ),
                      },
                    ]}
                  />
               </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-14">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Admin Dashboard</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black uppercase tracking-[0.2em]">Order Center</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Order Center</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Review and process customer orders across all channels.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRefresh}
              variant="surface" 
              className="h-[72px] px-8 rounded-[28px] border-none bg-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              <Clock size={20} className={`text-on_surface_variant group-hover:text-primary transition-colors ${orderStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span className="text-sm font-black uppercase tracking-widest text-on_surface_variant group-hover:text-primary">Refresh</span>
            </Button>
            <Button variant="surface" className="h-[72px] px-8 rounded-[28px] border-none bg-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group">
              <Download size={20} className="text-on_surface_variant group-hover:text-primary transition-colors" />
              <span className="text-sm font-black uppercase tracking-widest text-on_surface_variant group-hover:text-primary">Export CSV</span>
            </Button>
            <Button variant="primary" className="h-[72px] px-10 rounded-[28px] shadow-2xl shadow-primary/20 hover:shadow-primary/30 flex items-center gap-3 group">
              <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-base font-black uppercase tracking-widest">Manual Order</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="!bg-primary p-8 text-on_primary border-none shadow-2xl shadow-primary/20 rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
            <Statistic 
               title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Total Orders</span>}
               value={stats.total}
               valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
               formatter={(val) => val.toLocaleString()}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <History size={140} />
            </div>
          </Card>

          <Card className="!bg-secondary p-8 text-on_primary border-none shadow-2xl shadow-secondary/20 rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
            <Statistic 
               title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Pending</span>}
               value={stats.pending}
               valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <Clock size={140} />
            </div>
          </Card>

          <Card className="!bg-[#2D2D2D] p-8 text-on_primary border-none shadow-2xl shadow-black/20 rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
            <Statistic 
               title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">In Transit</span>}
               value={stats.shipping}
               valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <Truck size={140} />
            </div>
          </Card>

          <Card className="!bg-surface_container p-8 text-on_surface border-none shadow-xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between">
            <Statistic 
               title={<span className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em]">Completed</span>}
               value={stats.completed}
               valueStyle={{ fontWeight: 900, color: '#2D2D2D', fontSize: '48px' }}
               formatter={(val) => val.toLocaleString()}
            />
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <CheckCircle2 size={140} />
            </div>
          </Card>
        </div>

       <Card className="p-10 overflow-hidden space-y-8 rounded-[32px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <Tabs 
               activeKey={activeTab} 
               onChange={setActiveTab}
               className="order-tabs"
               items={['All Orders', 'Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled'].map(tab => ({
                 key: tab,
                 label: <span className="font-black uppercase tracking-widest text-[12px] px-4">{tab}</span>
               }))}
             />
             <div className="flex items-center gap-4">
                <AntInput 
                  placeholder="Search orders..." 
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  prefix={<Search size={18} className="text-on_surface_variant/40" />}
                  className="!bg-surface_dim !py-4 !px-6 !rounded-xl !border-none !font-bold !text-[13px] !w-64"
                />
             </div>
          </div>

          <Table 
            columns={columns} 
            dataSource={filteredOrders} 
            pagination={{ 
              current: meta?.page || 1,
              pageSize: meta?.limit || 10,
              total: meta?.total || 0,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
              className: "custom-pagination" 
            }}
            rowClassName="group cursor-pointer hover:bg-surface_dim transition-colors"
            className="modern-table"
            rowKey="id"
            loading={orderStatus === 'loading'}
          />
       </Card>

      </div>
    </div>
  );
};

export default OrderMgmt;
