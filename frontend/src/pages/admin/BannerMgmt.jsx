import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popconfirm, 
  Tag, 
  Tooltip,
  Statistic,
  Space,
  Modal,
  Form,
  Input as AntInput,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Table
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
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Eye,
  BarChart3,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import dayjs from 'dayjs';
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

  // Global Stats Calculation
  const stats = useMemo(() => {
    const totalImpressions = banners.reduce((acc, b) => acc + (b.impressions || 0), 0);
    const totalClicks = banners.reduce((acc, b) => acc + (b.clicks || 0), 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    return { totalImpressions, totalClicks, avgCtr };
  }, [banners]);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      form.setFieldsValue({ 
        ...banner,
        dates: [
          banner.startDate ? dayjs(banner.startDate) : null,
          banner.endDate ? dayjs(banner.endDate) : null
        ]
      });
    } else {
      setEditingBanner(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true, position: 'home', priority: 0 });
    }
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.dates?.[0] ? values.dates[0].toDate() : null,
        endDate: values.dates?.[1] ? values.dates[1].toDate() : null,
      };
      delete payload.dates;

      if (editingBanner) {
        await dispatch(updateBannerThunk({ id: editingBanner.id, data: payload })).unwrap();
        showSuccessToast('Banner configurations updated!');
      } else {
        await dispatch(addBannerThunk(payload)).unwrap();
        showSuccessToast('New banner campaign deployed!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBannerThunk(id)).unwrap();
      showSuccessToast('Banner removed from storage');
    } catch (err) {
      showErrorToast(err || 'Failed to delete banner');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await dispatch(updateBannerThunk({ 
        id: banner.id, 
        data: { isActive: !banner.isActive } 
      })).unwrap();
      showSuccessToast(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      showErrorToast(err || 'Failed to toggle status');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface/[0.02] animate-in fade-in duration-700">
      <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-12 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-black text-on_surface_variant/60 uppercase tracking-[0.2em]">
              <span>Marketing</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-secondary">Banner Engine v2</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Promotions</h1>
              <p className="text-on_surface_variant font-bold text-base sm:text-lg opacity-60">Control your storefront's visual marketing strategy.</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            className="w-full md:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} strokeWidth={3} />
            <span className="font-black uppercase tracking-widest text-xs sm:text-sm">Add New Banner</span>
          </Button>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
           <Card className="p-6 sm:p-8 border-none rounded-[24px] sm:rounded-[32px] bg-[#2D2D2D] text-white flex flex-col justify-between h-40 sm:h-48 overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 sm:mb-2">Total Impressions</p>
                <h2 className="text-4xl sm:text-5xl font-black">{stats.totalImpressions.toLocaleString()}</h2>
              </div>
              <Eye className="absolute -right-4 -bottom-4 text-white opacity-5 group-hover:scale-125 transition-transform duration-700" size={100} />
           </Card>
           <Card className="p-6 sm:p-8 border-none rounded-[24px] sm:rounded-[32px] bg-white shadow-sm flex flex-col justify-between h-40 sm:h-48 overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-on_surface_variant/40 mb-1 sm:mb-2">Total Clicks</p>
                <h2 className="text-4xl sm:text-5xl font-black text-on_surface">{stats.totalClicks.toLocaleString()}</h2>
              </div>
              <MousePointer2 className="absolute -right-4 -bottom-4 text-primary opacity-5 group-hover:scale-125 transition-transform duration-700" size={100} />
           </Card>
           <Card className="p-6 sm:p-8 border-none rounded-[24px] sm:rounded-[32px] bg-primary text-white flex flex-col justify-between h-40 sm:h-48 overflow-hidden relative group sm:col-span-2 md:col-span-1">
              <div className="relative z-10">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 sm:mb-2">Average CTR</p>
                <h2 className="text-4xl sm:text-5xl font-black">{stats.avgCtr}%</h2>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 text-white opacity-10 group-hover:scale-125 transition-transform duration-700" size={100} />
           </Card>
        </div>

        {/* Banner List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {banners.map((banner) => (
            <Card key={banner.id} className="p-0 border-none shadow-xl rounded-[24px] sm:rounded-[40px] overflow-hidden group flex flex-col lg:flex-row bg-white">
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto min-h-[200px] relative bg-surface_dim overflow-hidden">
                <img src={banner.imagePc} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={banner.isActive ? 'primary' : 'surface'} className="font-black px-2 sm:px-3 py-1 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-widest">
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="surface" className="bg-white/90 backdrop-blur-md font-black px-2 sm:px-3 py-1 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-widest">
                    {banner.position}
                  </Badge>
                </div>
                {banner.imageMobile && (
                  <div className="absolute bottom-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-lg">
                    <Smartphone size={14} />
                  </div>
                )}
              </div>
              <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-on_surface uppercase tracking-tight mb-1 truncate">{banner.title}</h3>
                    <div className="flex items-center gap-2 text-on_surface_variant/60 font-bold text-[10px] sm:text-xs">
                      <Calendar size={12} />
                      <span>{banner.startDate ? dayjs(banner.startDate).format('MMM D') : 'No Start'} - {banner.endDate ? dayjs(banner.endDate).format('MMM D') : 'No End'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-surface_container">
                    <div className="text-center">
                      <p className="text-[8px] sm:text-[9px] font-black text-on_surface_variant/40 uppercase tracking-widest mb-1">Views</p>
                      <p className="font-black text-on_surface text-sm sm:text-base">{banner.impressions}</p>
                    </div>
                    <div className="text-center border-x border-surface_container">
                      <p className="text-[8px] sm:text-[9px] font-black text-on_surface_variant/40 uppercase tracking-widest mb-1">Clicks</p>
                      <p className="font-black text-on_surface text-sm sm:text-base">{banner.clicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] sm:text-[9px] font-black text-on_surface_variant/40 uppercase tracking-widest mb-1">CTR</p>
                      <p className="font-black text-primary text-sm sm:text-base">{banner.ctr}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 mt-6">
                  <Button variant="surface" className="flex-1 !rounded-xl sm:!rounded-2xl h-10 sm:h-12 font-black text-[9px] sm:text-[10px] uppercase tracking-widest" onClick={() => handleOpenModal(banner)}>Configure</Button>
                  <Tooltip title={banner.isActive ? "Deactivate" : "Activate"}>
                    <Button 
                      variant="ghost" 
                      className={`!w-10 sm:!w-12 !h-10 sm:!h-12 !p-0 !rounded-xl sm:!rounded-2xl flex items-center justify-center ${banner.isActive ? 'text-primary bg-primary/5 hover:bg-primary/10' : 'text-on_surface_variant bg-surface_dim'}`}
                      onClick={() => handleToggleActive(banner)}
                    >
                      {banner.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </Button>
                  </Tooltip>
                  <Popconfirm title="Delete campaign permanently?" onConfirm={() => handleDelete(banner.id)}>
                    <Button variant="ghost" className="!w-10 sm:!w-12 !h-10 sm:!h-12 !p-0 !rounded-xl sm:!rounded-2xl bg-error/5 text-error flex items-center justify-center"><Trash2 size={18}/></Button>
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={800}
          centered
          className="admin-modal"
          title={null}
        >
          <div className="p-6 sm:p-10 space-y-8 sm:space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-on_surface uppercase tracking-tight">{editingBanner ? 'Edit Campaign' : 'Create Campaign'}</h2>
                <p className="text-on_surface_variant font-bold text-xs sm:text-sm opacity-60">Design and schedule your marketing blast.</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <ImageIcon size={editingBanner ? 24 : 32} />
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Form.Item name="title" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Banner Title</span>} rules={[{ required: true }]}>
                  <AntInput className="!h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none !font-bold px-4 sm:px-6" placeholder="Summer Extravaganza" />
                </Form.Item>
                <Form.Item name="link" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Redirect URL</span>}>
                  <AntInput className="!h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none !font-bold px-4 sm:px-6" placeholder="/shop/category/sweets" prefix={<LinkIcon size={14} className="mr-2 opacity-30" />} />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Form.Item name="imagePc" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">PC Image URL (Desktop)</span>} rules={[{ required: true }]}>
                  <AntInput className="!h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none !font-bold px-4 sm:px-6" placeholder="https://..." prefix={<Monitor size={14} className="mr-2 opacity-30" />} />
                </Form.Item>
                <Form.Item name="imageMobile" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Mobile Image URL (Optional)</span>}>
                  <AntInput className="!h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none !font-bold px-4 sm:px-6" placeholder="https://..." prefix={<Smartphone size={14} className="mr-2 opacity-30" />} />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Form.Item name="position" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Position</span>} className="sm:col-span-1">
                  <Select className="h-12 sm:h-14 custom-select" options={[
                    { label: 'Home Carousel', value: 'home' },
                    { label: 'Shop Header', value: 'shop' },
                    { label: 'Checkout Page', value: 'checkout' },
                    { label: 'Popup Alert', value: 'popup' }
                  ]} />
                </Form.Item>
                <Form.Item name="dates" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Schedule Period</span>} className="sm:col-span-2">
                  <DatePicker.RangePicker className="w-full !h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none !font-bold px-4 sm:px-6" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Form.Item name="priority" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Priority / Sort Order</span>}>
                  <InputNumber className="w-full !h-12 sm:!h-14 !rounded-xl sm:!rounded-2xl !bg-surface_dim !border-none flex items-center px-4 !font-black" min={0} />
                </Form.Item>
                <Form.Item name="isActive" label={<span className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-widest">Status</span>} valuePropName="checked">
                  <div className="flex items-center gap-3 h-12 sm:h-14 bg-surface_dim rounded-xl sm:rounded-2xl px-4 sm:px-6">
                    <Switch />
                    <span className="font-bold text-xs sm:text-sm text-on_surface_variant">Activate Campaign</span>
                  </div>
                </Form.Item>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Button type="submit" variant="primary" className="w-full sm:flex-1 !h-14 sm:!h-16 !rounded-xl sm:!rounded-[24px] shadow-xl shadow-primary/20 uppercase font-black tracking-widest text-xs sm:text-sm" isLoading={status === 'loading'}>
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </Button>
                <Button variant="surface" onClick={() => setIsModalOpen(false)} className="w-full sm:px-10 !h-14 sm:!h-16 !rounded-xl sm:!rounded-[24px] uppercase font-black tracking-widest opacity-60 text-xs sm:text-sm">Cancel</Button>
              </div>
            </Form>
          </div>
        </Modal>

        <style dangerouslySetInnerHTML={{ __html: `
          .custom-select .ant-select-selector {
            border-radius: 12px !important;
            background: #fbf9fc !important;
            border: none !important;
            height: 48px !important;
            display: flex !important;
            align-items: center !important;
            font-weight: 700 !important;
          }
          @media (min-width: 640px) {
            .custom-select .ant-select-selector {
              border-radius: 16px !important;
              height: 56px !important;
            }
          }
          .admin-modal .ant-modal-content {
            border-radius: 24px !important;
            overflow: hidden !important;
          }
          @media (min-width: 640px) {
            .admin-modal .ant-modal-content {
              border-radius: 40px !important;
            }
          }
        `}} />
      </div>
    </div>
  );
};

export default BannerMgmt;
