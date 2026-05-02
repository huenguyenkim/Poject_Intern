import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popconfirm, 
  Tag, 
  Tooltip,
  Statistic,
  Space,
  Modal,
  Form,
  Input as AntInput
} from 'antd';
import { 
  Plus, 
  Link as LinkIcon, 
  Calendar, 
  Pencil, 
  Trash2, 
  TrendingUp,
  MousePointer2,
  RefreshCw,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { 
  addBannerThunk, 
  updateBannerThunk, 
  deleteBannerThunk 
} from '../../store/catalogSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const BannerMgmt = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { banners, status } = useSelector((state) => state.catalog);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const performance = {
    views: 12405,
    conversionRate: '+24%',
    topClickThru: 'Summer Sour Sale'
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      form.setFieldsValue({ 
        title: banner.title || '', 
        image: banner.image || '', 
        link: banner.link || '', 
        endDate: banner.endDate || '', 
        tag: banner.tag || 'ACTIVE' 
      });
    } else {
      setEditingBanner(null);
      form.resetFields();
      form.setFieldsValue({ tag: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
      await dispatch(updateBannerThunk({ id, data: { tag: newStatus } })).unwrap();
      showSuccessToast(`Banner set to ${newStatus}`);
    } catch (err) {
      showErrorToast(err || 'Failed to update status');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingBanner) {
        await dispatch(updateBannerThunk({ id: editingBanner.id, data: values })).unwrap();
        showSuccessToast('Promotion updated!');
      } else {
        await dispatch(addBannerThunk(values)).unwrap();
        showSuccessToast('New campaign launched!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBannerThunk(id)).unwrap();
      showSuccessToast('Campaign removed');
    } catch (err) {
      showErrorToast(err || 'Failed to delete banner');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface/[0.02] animate-in fade-in duration-700">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-14 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black text-on_surface_variant/60 uppercase tracking-[0.2em]">
              <span className="hover:text-primary transition-colors cursor-pointer">Admin Dashboard</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-secondary tracking-[0.2em]">Promotion Engine</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Banner Management</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Design and schedule pulse-pounding promotional banners.</p>
            </div>
          </div>
        </div>

        {/* Global Performance Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 p-10 flex flex-col justify-between bg-[#2D2D2D] border-none rounded-[40px] overflow-hidden relative group text-white">
              <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-4 text-primary">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <TrendingUp size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Cloud Analytics</h3>
                 </div>
                 <div className="flex gap-12">
                   <Statistic title={<span className="text-white opacity-60 uppercase text-[10px] font-black tracking-widest">Views</span>} value={performance.views} valueStyle={{ color: '#fff', fontWeight: 900, fontSize: '48px' }} />
                   <Statistic title={<span className="text-white opacity-60 uppercase text-[10px] font-black tracking-widest">Growth</span>} value={24} suffix="%" valueStyle={{ color: '#4ADE80', fontWeight: 900, fontSize: '48px' }} />
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-125 transition-transform duration-[3s]">
                 <MousePointer2 size={280} />
              </div>
           </Card>
           <Card className="p-10 border-none rounded-[40px] shadow-xl bg-white flex flex-col justify-center text-center">
              <RefreshCw size={48} className="mx-auto mb-6 text-secondary opacity-40 animate-spin-slow" />
              <h3 className="text-xl font-black uppercase tracking-tight text-on_surface">Automatic Rotations</h3>
              <p className="text-sm font-bold text-on_surface_variant mt-2">Banners shuffle every 8 seconds on the storefront by default.</p>
           </Card>
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <Card key={banner.id} className="p-0 overflow-hidden border-none shadow-xl hover:-translate-y-3 transition-all duration-500 rounded-[40px] group relative h-[420px] flex flex-col">
              <div className="relative h-64 overflow-hidden bg-surface_dim">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on_surface_variant/20"><ImageIcon size={48} /></div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h4 className="font-black text-2xl leading-tight uppercase tracking-tight truncate">{banner.title || 'Untitled Banner'}</h4>
                    <p className="text-[11px] font-bold opacity-60 mt-1 uppercase tracking-widest">{banner.endDate || 'Daily Run'}</p>
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                   <Tag 
                      color={banner.tag === 'ACTIVE' ? 'success' : 'default'} 
                      className="!rounded-full !px-4 !py-1 !font-black !uppercase !tracking-widest !text-[9px] !cursor-pointer shadow-lg"
                      onClick={() => handleUpdateStatus(banner.id, banner.tag)}
                    >
                      {banner.tag}
                   </Tag>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                 <div className="flex items-center gap-3">
                    <Badge variant="surface" className="px-3 py-1 text-[10px] uppercase tracking-widest">ID: {banner.id}</Badge>
                    {banner.link && <Tooltip title={banner.link}><LinkIcon size={14} className="text-on_surface_variant cursor-help" /></Tooltip>}
                 </div>
                 <div className="flex gap-3">
                    <Button variant="surface" className="flex-1 py-4 !rounded-2xl font-black text-xs uppercase" onClick={() => handleOpenModal(banner)}>Edit</Button>
                    <Popconfirm title="Remove banner?" onConfirm={() => handleDelete(banner.id)}>
                      <Button variant="ghost" className="!w-14 !h-14 !p-0 !bg-error/5 text-error !rounded-2xl flex items-center justify-center"><Trash2 size={20}/></Button>
                    </Popconfirm>
                 </div>
              </div>
            </Card>
          ))}
          
          <Card 
            className="border-2 border-dashed border-surface_container hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer rounded-[40px] flex flex-col items-center justify-center h-[420px] group"
            onClick={() => handleOpenModal()}
          >
            <div className="w-16 h-16 rounded-full bg-surface_dim flex items-center justify-center text-on_surface_variant group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-6">
              <Plus size={32} strokeWidth={3} />
            </div>
            <h4 className="font-black text-on_surface uppercase tracking-widest text-sm">Create New Campaign</h4>
          </Card>
        </div>

        {/* Create/Edit Modal */}
        <Modal 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          footer={null} 
          centered 
          title={<span className="text-2xl font-black uppercase tracking-tight text-on_surface">{editingBanner ? 'Edit Campaign' : 'New Campaign'}</span>}
          className="candy-modal"
          width={600}
        >
          <Form 
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="pt-6"
            requiredMark={false}
          >
            <Form.Item 
              name="title" 
              label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Campaign Title</span>}
              rules={[{ required: true }]}
            >
              <AntInput className="candy-input" placeholder="e.g. Summer Sour Sale" />
            </Form.Item>

            <Form.Item 
              name="image" 
              label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Image URL</span>}
              rules={[{ required: true }]}
            >
              <AntInput className="candy-input" placeholder="https://..." />
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item 
                name="link" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Link URL</span>}
              >
                <AntInput className="candy-input" placeholder="/shop/..." />
              </Form.Item>
              <Form.Item 
                name="endDate" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Expiry Date</span>}
              >
                <AntInput type="date" className="candy-input" />
              </Form.Item>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" className="flex-1 py-5 text-lg" isLoading={status === 'loading'}>
                {editingBanner ? 'Update Promotion' : 'Launch Campaign'}
              </Button>
              <Button type="button" variant="surface" className="px-8" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default BannerMgmt;
