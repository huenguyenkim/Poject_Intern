import React from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { 
  Candy, 
  LayoutDashboard, 
  Package, 
  Grid, 
  ShoppingBag, 
  ImagePlus, 
  Bell, 
  LogOut, 
  Plus
} from 'lucide-react';
import TopUtilityBar from './TopUtilityBar';

const { Header, Sider, Content } = Layout;

// Static navigation configuration
const ADMIN_NAV_ITEMS = [
  { key: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { key: '/admin/categories', label: 'Categories', icon: <Grid size={18} /> },
  { key: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { key: '/admin/banners', label: 'Banners', icon: <ImagePlus size={18} /> },
];

/**
 * AdminLayout: Modernized using Ant Design Layout components.
 * Features a persistent sidebar and premium top bar.
 * Optimized with memoized callbacks and static nav items.
 */
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = React.useCallback(() => {
    dispatch(logout());
    navigate('/admin/login');
  }, [dispatch, navigate]);

  return (
    <Layout className="min-h-screen bg-surface_dim">
      {/* Sider Component */}
      <Sider
        width={280}
        theme="light"
        className="hidden lg:block border-r border-surface_container"
        style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div className="p-8 pb-4">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/20">
              <Candy size={24} className="text-on_primary" />
            </div>
            <div>
              <span className="font-black text-xl text-on_surface tracking-tight block leading-none">Candy Admin</span>
              <span className="text-[10px] font-bold text-on_surface_variant uppercase tracking-[0.1em] mt-1 block">MANAGE JOY</span>
            </div>
          </Link>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={ADMIN_NAV_ITEMS.map(item => ({
            ...item,
            onClick: () => navigate(item.key)
          }))}
          className="border-none px-4 pt-6"
          style={{ fontVariant: 'normal' }}
        />

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-6 border-t border-surface_container bg-white">
          <Button 
            type="primary" 
            block 
            icon={<Plus size={18} />}
            className="h-14 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 "
            onClick={() => navigate('/admin/products?action=add')}
          >
            Add Product
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`}
                className="border-2 border-primary/20 shadow-sm"
                size={40}
              />
              <div className="min-w-0">
                <p className="text-sm font-black text-on_surface leading-none truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-on_surface_variant mt-1 uppercase tracking-wider">Administrator</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-on_surface_variant hover:text-primary transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="lg:ml-[280px]">
        <Header className="bg-white p-0 h-auto leading-normal border-b border-surface_container">
          <TopUtilityBar />
        </Header>

        <Content className="p-0 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
