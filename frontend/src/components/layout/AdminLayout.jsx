import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Candy, 
  LayoutDashboard, 
  Package, 
  Grid, 
  ShoppingBag, 
  ImagePlus
} from 'lucide-react';
import TopUtilityBar from './TopUtilityBar';

const { Header, Sider, Content } = Layout;

/**
 * AdminLayout: Modernized using Ant Design Layout components.
 * Features a persistent sidebar and premium top bar.
 * Optimized with memoized callbacks and static nav items.
 */
const AdminLayout = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: `/${lang}/admin`, label: t('admin.dashboard'), icon: <LayoutDashboard size={18} /> },
    { key: `/${lang}/admin/tasks`, label: t('admin.tasks'), icon: <Grid size={18} /> },
    { key: `/${lang}/admin/products`, label: t('admin.products'), icon: <Package size={18} /> },
    { key: `/${lang}/admin/categories`, label: t('admin.categories'), icon: <Grid size={18} /> },
    { key: `/${lang}/admin/orders`, label: t('admin.orders'), icon: <ShoppingBag size={18} /> },
    { key: `/${lang}/admin/banners`, label: t('admin.banners'), icon: <ImagePlus size={18} /> },
  ];

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
          <Link to={`/${lang}/admin`} className="flex items-center gap-3 group">
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
          items={navItems.map(item => ({
            ...item,
            onClick: () => navigate(item.key)
          }))}
          className="border-none px-4 pt-6"
          style={{ fontVariant: 'normal' }}
        />

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
