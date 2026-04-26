import React, { useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Table, 
  Statistic, 
  Tag, 
  Popconfirm, 
  Tooltip, 
  Space, 
  Progress as AntProgress,
  Select,
  Input as AntInput,
  Form,
  InputNumber
} from 'antd';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  ListFilter,
  BarChart3,
  Package,
  TrendingDown,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { 
  addProductThunk, 
  updateProductThunk, 
  deleteProductThunk,
  fetchCatalogThunk 
} from '../../store/catalogSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const ProductMgmt = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { products, categories, status } = useSelector((state) => state.catalog);
  
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef(null);
  
  // Handle category default value when categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !editingId) {
      form.setFieldsValue({ categoryId: String(categories[0].id) });
    }
  }, [categories, editingId, form]);

  const stats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const avgPrice = products.length ? (products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / products.length).toFixed(2) : 0;
    const catCounts = {};
    products.forEach(p => {
      catCounts[p.categoryId] = (catCounts[p.categoryId] || 0) + 1;
    });
    const topCatId = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCategory = categories.find(c => String(c.id) === String(topCatId))?.name || 'N/A';
    const lowStockCount = products.filter(p => (Number(p.stock) || 0) < 50).length;

    return { totalItems, avgPrice, topCategory, lowStockCount };
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const columns = [
    {
      title: 'PRODUCT DETAILS',
      key: 'details',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border border-surface_container bg-white shadow-sm">
            {record.image ? (
              <img src={record.image} alt={record.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-on_surface_variant" />
            )}
          </div>
          <div>
            <p className="font-black text-on_surface text-[15px] leading-tight uppercase">{record.title}</p>
            <p className="text-[10px] font-bold text-on_surface_variant/60 mt-1 uppercase tracking-tight">ID: {record.id}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'CATEGORY',
      key: 'category',
      render: (_, record) => {
        const cat = categories.find(c => String(c.id) === String(record.categoryId));
        return <Badge variant="outline" className="px-3 py-1 uppercase text-[10px] tracking-widest">{cat?.name || 'Uncategorized'}</Badge>;
      }
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-black text-[15px] text-on_surface">${Number(price).toFixed(2)}</span>,
    },
    {
      title: 'STOCK',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => {
        const val = Number(stock) || 0;
        return (
          <div className="flex flex-col items-center gap-1 min-w-[70px]">
            <span className={`font-black text-[14px] ${val < 50 ? 'text-error' : 'text-primary'}`}>{val}</span>
            <AntProgress 
              percent={Math.min(100, (val / 500) * 100)} 
              showInfo={false} 
              size="small" 
              strokeColor={val < 50 ? '#FF4D4F' : '#FF76B8'} 
            />
          </div>
        );
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Product">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="!p-2.5 !w-10 !h-10 text-on_surface_variant hover:text-secondary bg-white shadow-sm !rounded-xl">
              <Edit2 size={16} />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete this sweet?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Keep it"
          >
            <Button variant="ghost" size="sm" className="!p-2.5 !w-10 !h-10 text-on_surface_variant hover:text-error bg-white shadow-sm !rounded-xl">
              <Trash2 size={16} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onFinish = async (values) => {
    const data = {
      title: values.title,
      price: parseFloat(values.price) || 0,
      categoryId: parseInt(values.categoryId),
      description: values.description,
      image: values.image,
      stock: parseInt(values.stock) || 0
    };
    
    try {
      if (editingId) {
        await dispatch(updateProductThunk({ id: editingId, data })).unwrap();
        showSuccessToast('Sweet details updated! ✨');
        setEditingId(null);
      } else {
        await dispatch(addProductThunk(data)).unwrap();
        showSuccessToast('New sweet added to shop! 🍭');
      }
      form.resetFields();
    } catch (err) {
      showErrorToast(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProductThunk(id)).unwrap();
      showSuccessToast('Sweet removed from catalog');
    } catch (err) {
      showErrorToast(err || 'Failed to delete');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    form.setFieldsValue({
      title: product.title,
      price: product.price,
      categoryId: String(product.categoryId),
      description: product.description || '',
      image: product.image || '',
      stock: product.stock || 0
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-14">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Admin Dashboard</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black uppercase tracking-[0.2em]">Product Management</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Product Catalog</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Oversee your sweet inventory and catalog details.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="!bg-primary p-8 border-none shadow-2xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
            <Statistic 
              title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Total Stock</span>}
              value={stats.totalItems}
              valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20"><Package size={140} /></div>
          </Card>
          <Card className="!bg-secondary p-8 border-none shadow-2xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
            <Statistic 
              title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Avg Price</span>}
              value={stats.avgPrice}
              prefix="$"
              valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '48px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20"><DollarSign size={140} /></div>
          </Card>
          <Card className="!bg-[#2D2D2D] p-8 border-none shadow-2xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between text-white">
             <Statistic 
              title={<span className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Top Category</span>}
              value={stats.topCategory}
              valueStyle={{ fontWeight: 900, color: '#fff', fontSize: '32px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-20"><BarChart3 size={140} /></div>
          </Card>
          <Card className="!bg-surface_container p-8 border-none shadow-xl rounded-[32px] overflow-hidden group relative min-h-[160px] flex flex-col justify-between">
            <Statistic 
              title={<span className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em]">Low Stock Alerts</span>}
              value={stats.lowStockCount}
              valueStyle={{ fontWeight: 900, color: '#FF4D4F', fontSize: '48px' }}
            />
            <div className="absolute -right-6 -bottom-6 opacity-10"><TrendingDown size={140} /></div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Form */}
          <Card ref={formRef} className="lg:col-span-1 p-10 sticky top-24 rounded-[32px]">
            <div className="flex items-center gap-3 mb-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editingId ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
              </div>
              <h2 className="text-2xl font-black text-on_surface uppercase tracking-tight">
                {editingId ? 'Update Product' : 'Add New Sweet'}
              </h2>
            </div>
            
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={onFinish} 
              className="space-y-4"
              requiredMark={false}
            >
              <Form.Item 
                name="title" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Product Title</span>}
                rules={[{ required: true, message: 'Please enter product title' }]}
              >
                <AntInput className="candy-input" placeholder="e.g. Cosmic Truffle" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item 
                  name="price" 
                  label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Price ($)</span>}
                  rules={[{ required: true }]}
                >
                  <InputNumber className="w-full candy-input" min={0} step={0.01} precision={2} />
                </Form.Item>
                <Form.Item 
                  name="stock" 
                  label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Stock</span>}
                  rules={[{ required: true }]}
                >
                  <InputNumber className="w-full candy-input" min={0} />
                </Form.Item>
              </div>

              <Form.Item 
                name="categoryId" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Category</span>}
                rules={[{ required: true }]}
              >
                <Select 
                  className="w-full candy-select"
                  options={categories.map(c => ({ label: c.name, value: String(c.id) }))}
                />
              </Form.Item>

              <Form.Item 
                name="image" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Image URL</span>}
              >
                <AntInput className="candy-input" placeholder="https://..." />
              </Form.Item>

              <Form.Item 
                name="description" 
                label={<span className="text-[11px] font-black uppercase tracking-widest text-on_surface px-1">Description</span>}
                rules={[{ required: true }]}
              >
                <AntInput.TextArea 
                  className="candy-input !min-h-[100px] !py-4" 
                  placeholder="Describe the flavor experience..."
                />
              </Form.Item>

              <div className="pt-4">
                <Button type="submit" variant={editingId ? "secondary" : "primary"} isLoading={status === 'loading'} className="w-full py-5 rounded-[22px] font-black text-base shadow-xl">
                  {editingId ? 'Save Changes' : 'Add to Collection'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => { setEditingId(null); form.resetFields(); }} 
                    className="w-full py-2 mt-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </Form>
          </Card>

          {/* Table */}
          <Card className="lg:col-span-2 p-10 rounded-[32px] space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-surface_container pb-8">
              <h3 className="text-2xl font-black text-on_surface uppercase tracking-tight">
                Live Inventory <Badge variant="surface" className="px-3 ml-2">{filteredProducts.length}</Badge>
              </h3>
              <AntInput 
                placeholder="Search catalog..." 
                prefix={<Search size={18} className="text-on_surface_variant/40" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!bg-surface_dim !border-none !rounded-2xl !py-4 !px-6 !font-bold !w-full sm:!w-64"
              />
            </div>
            <Table 
              columns={columns} 
              dataSource={filteredProducts} 
              pagination={{ pageSize: 6 }}
              rowClassName="group !bg-transparent hover:!bg-surface_dim transition-all"
              rowKey="id"
              loading={status === 'loading'}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductMgmt;
