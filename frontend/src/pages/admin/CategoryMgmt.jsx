import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Table,
  Input as AntInput,
  Space,
  Popconfirm,
  Tooltip,
  Select,
  InputNumber,
  Switch,
  Modal
} from 'antd';
import { 
  Plus, Edit2, Trash2, Check, X,
  Search, Grid, List, ChevronRight, ChevronDown,
  Folders, Image as ImageIcon, Link as LinkIcon,
  ArrowUpDown, ExternalLink
} from 'lucide-react';
import { 
  addCategoryThunk, 
  updateCategoryThunk, 
  deleteCategoryThunk 
} from '../../store/catalogSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useTranslation } from 'react-i18next';

const CategoryMgmt = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.catalog);
  
  const [viewType, setViewType] = useState('tree'); // 'grid', 'table', 'tree'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sortOrder: 0,
    parentId: null
  });

  const loading = status === 'loading';

  // Logic: Auto-slug generation
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(prev.name) || !prev.slug ? generateSlug(name) : prev.slug
    }));
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        sortOrder: cat.sortOrder || 0,
        parentId: cat.parentId || null
      });
    } else {
      setEditingCat(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        sortOrder: 0,
        parentId: null
      });
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) return showErrorToast('Name is required');
    
    try {
      if (editingCat) {
        await dispatch(updateCategoryThunk({ id: editingCat.id, data: formData })).unwrap();
        showSuccessToast('Category updated!');
      } else {
        await dispatch(addCategoryThunk(formData)).unwrap();
        showSuccessToast('Category created!');
      }
      setIsModalVisible(false);
    } catch (err) {
      showErrorToast(err || 'Failed to save category');
    }
  };

  const handleDelete = async (id, force = false) => {
    try {
      await dispatch(deleteCategoryThunk({ id, force })).unwrap();
      showSuccessToast('Category removed');
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err?.message || 'Failed to delete category');
      
      if (typeof errorMsg === 'string' && (errorMsg.includes('containing products') || errorMsg.includes('with children'))) {
        Modal.confirm({
          title: 'Constraints Detected',
          content: `${errorMsg}. Do you want to force delete? This will unassign all products and children.`,
          okText: 'Force Delete',
          okType: 'danger',
          onOk: () => handleDelete(id, true)
        });
      } else {
        showErrorToast(errorMsg);
      }
    }
  };

  const [expandedKeys, setExpandedKeys] = useState([]);

  // Logic: Build Tree structure with search support
  const treeData = useMemo(() => {
    const build = (parentId = null, source = categories) => {
      return source
        .filter(c => c.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(c => ({
          ...c,
          key: c.id.toString(),
          children: build(c.id, source).length > 0 ? build(c.id, source) : null
        }));
    };

    if (!searchTerm) {
      return build(null, categories);
    }

    // Filter logic for Tree: Include matching nodes AND all their ancestors
    const searchLower = searchTerm.toLowerCase();
    const matches = new Set();
    const toExpand = [];

    categories.forEach(cat => {
      const isMatch = (cat.name || '').toLowerCase().includes(searchLower) || 
                      (cat.slug || '').toLowerCase().includes(searchLower);
      
      if (isMatch) {
        let current = cat;
        while (current) {
          matches.add(current.id);
          if (current.parentId) toExpand.push(current.parentId.toString());
          current = categories.find(c => c.id === current.parentId);
        }
      }
    });

    // Update expanded keys when searching
    if (searchTerm) {
      setExpandedKeys([...new Set(toExpand)]);
    }

    const filteredSource = categories.filter(c => matches.has(c.id));
    return build(null, filteredSource);
  }, [categories, searchTerm]);

  // Logic: Filter categories for list/grid (flat view)
  const filteredCategories = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return categories.filter(c => 
      (c.name || '').toLowerCase().includes(searchLower) ||
      (c.slug || '').toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  const columns = [
    {
      title: 'CATEGORY NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface_dim overflow-hidden shrink-0 border border-surface_container/20">
            {record.image ? (
              <img src={record.image} alt={text} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on_surface_variant/20">
                <ImageIcon size={18} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-on_surface uppercase tracking-tight">{text}</span>
            <span className="text-[10px] font-bold text-on_surface_variant opacity-40 uppercase tracking-widest">{record.slug}</span>
          </div>
        </div>
      )
    },
    {
      title: 'PRODUCTS',
      dataIndex: 'productsCount',
      key: 'productsCount',
      render: (count) => (
        <Badge variant="surface" className="font-black text-xs px-3 py-1 rounded-lg uppercase">
          {count} items
        </Badge>
      )
    },
    {
      title: 'SORT',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      render: (val) => <span className="font-bold text-on_surface_variant">#{val}</span>
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button variant="surface" onClick={() => openModal(record)} className="!w-10 !h-10 !p-0 !rounded-xl flex items-center justify-center">
            <Edit2 size={16} />
          </Button>
          <Popconfirm
            title="Delete Category"
            description={`Are you sure you want to remove "${record.name}"?`}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button variant="ghost" className="!w-10 !h-10 !p-0 !rounded-xl !bg-error/5 text-error hover:!bg-error/10 flex items-center justify-center">
              <Trash2 size={16} />
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Inventory</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black">Categories</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-on_surface tracking-tight leading-none uppercase">Store Taxonomy</h1>
              <p className="text-on_surface_variant font-bold text-lg opacity-60">Organize your sweet catalog with recursive hierarchy.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:min-w-[300px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on_surface_variant/40" size={20} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border-none rounded-[24px] pl-14 pr-8 py-4 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
            
            <div className="flex bg-white rounded-[24px] p-1.5 shadow-sm">
              <button 
                onClick={() => setViewType('tree')}
                className={`p-3 rounded-[18px] transition-all ${viewType === 'tree' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on_surface_variant hover:bg-surface_dim'}`}
              >
                <Folders size={20} />
              </button>
              <button 
                onClick={() => setViewType('grid')}
                className={`p-3 rounded-[18px] transition-all ${viewType === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on_surface_variant hover:bg-surface_dim'}`}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewType('table')}
                className={`p-3 rounded-[18px] transition-all ${viewType === 'table' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on_surface_variant hover:bg-surface_dim'}`}
              >
                <List size={20} />
              </button>
            </div>

            <Button 
              variant="primary"
              className="h-[64px] px-8 rounded-[24px] shadow-xl shadow-primary/20 flex items-center gap-3"
              onClick={() => openModal()}
            >
              <Plus size={20} strokeWidth={3} />
              <span className="font-black uppercase tracking-widest text-sm">Add New</span>
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map(cat => (
                <Card key={cat.id} className="p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[32px] group h-[320px]">
                  <div className="h-40 relative bg-surface_dim">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on_surface_variant/10">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                       <Badge variant="primary" className="bg-white/90 backdrop-blur-md text-primary font-black py-1 px-2.5 rounded-lg text-[10px] shadow-sm">
                         {cat.productsCount} SKUS
                       </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-on_surface uppercase tracking-tight mb-1">{cat.name}</h3>
                    <p className="text-[11px] font-black text-primary/60 uppercase tracking-widest mb-4">/{cat.slug}</p>
                    <div className="mt-auto flex gap-2">
                      <Button variant="surface" onClick={() => openModal(cat)} className="flex-1 !rounded-xl !h-12 font-black uppercase text-[10px] tracking-widest">Edit</Button>
                      <Popconfirm title="Delete?" onConfirm={() => handleDelete(cat.id)}>
                        <Button variant="ghost" className="!w-12 !h-12 !p-0 !rounded-xl !bg-error/5 text-error flex items-center justify-center"><Trash2 size={18}/></Button>
                      </Popconfirm>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface_container/20">
              <Table 
                columns={columns} 
                dataSource={viewType === 'tree' ? treeData : filteredCategories.map(c => ({...c, key: c.id.toString()}))} 
                pagination={viewType === 'tree' ? false : { pageSize: 10, position: ['bottomCenter'] }}
                loading={loading}
                className="category-table"
                expandedRowKeys={viewType === 'tree' ? expandedKeys : undefined}
                onExpand={(expanded, record) => {
                  const key = record.id.toString();
                  if (expanded) setExpandedKeys([...expandedKeys, key]);
                  else setExpandedKeys(expandedKeys.filter(k => k !== key));
                }}
                expandable={viewType === 'tree' ? {
                  expandIcon: ({ expanded, onExpand, record }) =>
                    record.children ? (
                      expanded ? (
                        <ChevronDown className="cursor-pointer text-primary mr-2" size={16} onClick={e => onExpand(record, e)} />
                      ) : (
                        <ChevronRight className="cursor-pointer text-on_surface_variant/40 mr-2 hover:text-primary" size={16} onClick={e => onExpand(record, e)} />
                      )
                    ) : <div className="w-6" />
                } : undefined}
              />
            </div>
          )}
        </div>

        {/* Upsert Modal */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={650}
          centered
          className="admin-modal"
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-10 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-on_surface uppercase tracking-tight">
                  {editingCat ? 'Edit Category' : 'New Category'}
                </h2>
                <p className="text-on_surface_variant font-bold text-sm opacity-60">Configure your store taxonomy node.</p>
              </div>
              <div className="w-16 h-16 rounded-[22px] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                {editingCat ? <Edit2 size={28} /> : <Plus size={28} />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Preview / Upload placeholder */}
              <div className="col-span-1 md:col-span-2">
                 <div className="w-full h-48 rounded-[28px] bg-surface_dim border-2 border-dashed border-surface_container_highest relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:border-primary/40 transition-all">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon size={32} className="text-primary" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-3">
                        <ImageIcon size={40} className="text-on_surface_variant/20 mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-on_surface_variant/40">Category Hero Image</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Name</label>
                <AntInput 
                  value={formData.name} 
                  onChange={handleNameChange}
                  className="!h-[60px] !rounded-[20px] !bg-surface_dim !border-none !font-bold px-6" 
                  placeholder="e.g. Dark Chocolates"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Slug</label>
                <AntInput 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="!h-[60px] !rounded-[20px] !bg-surface_dim !border-none !font-bold px-6" 
                  placeholder="dark-chocolates"
                  prefix={<LinkIcon size={14} className="text-on_surface_variant/30 mr-2" />}
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Description</label>
                <AntInput.TextArea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="!rounded-[24px] !bg-surface_dim !border-none !font-bold p-6 !min-h-[120px]" 
                  placeholder="Briefly describe what sweets belong here..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Parent Category</label>
                <Select
                  value={formData.parentId}
                  onChange={val => setFormData({...formData, parentId: val})}
                  className="w-full !h-[60px] custom-select"
                  placeholder="Root (No Parent)"
                  allowClear
                  dropdownStyle={{ borderRadius: '20px' }}
                >
                  {categories.filter(c => c.id !== editingCat?.id).map(c => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Sort Order</label>
                <InputNumber 
                  min={0} 
                  value={formData.sortOrder} 
                  onChange={val => setFormData({...formData, sortOrder: val})}
                  className="w-full !h-[60px] !rounded-[20px] !bg-surface_dim !border-none !flex !items-center px-4 !font-black" 
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">Image URL</label>
                <AntInput 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="!h-[60px] !rounded-[20px] !bg-surface_dim !border-none !font-bold px-6" 
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <Button 
                variant="primary" 
                onClick={handleSubmit} 
                isLoading={loading}
                className="flex-1 !h-[68px] !rounded-[24px] shadow-xl shadow-primary/20 uppercase font-black tracking-widest"
               >
                 {editingCat ? 'Save Changes' : 'Create Category'}
               </Button>
               <Button 
                variant="surface" 
                onClick={() => setIsModalVisible(false)}
                className="!h-[68px] px-10 !rounded-[24px] uppercase font-black tracking-widest opacity-60 hover:opacity-100"
               >
                 Cancel
               </Button>
            </div>
          </div>
        </Modal>

        {/* Custom CSS for Antd overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
          .category-table .ant-table {
            background: transparent !important;
          }
          .category-table .ant-table-thead > tr > th {
            background: #fbf9fc !important;
            color: rgba(var(--color-on-surface-variant), 0.4) !important;
            font-size: 10px !important;
            font-weight: 900 !important;
            letter-spacing: 0.15em !important;
            padding: 24px !important;
            border-bottom: 2px solid #f0f0f0 !important;
          }
          .category-table .ant-table-tbody > tr > td {
            padding: 24px !important;
            border-bottom: 1px solid #f9f9f9 !important;
          }
          .category-table .ant-table-row:hover > td {
            background: #fbf9fc !important;
          }
          .custom-select .ant-select-selector {
            border-radius: 20px !important;
            background: #fbf9fc !important;
            border: none !important;
            height: 60px !important;
            display: flex !important;
            align-items: center !important;
            font-weight: 700 !important;
          }
          .admin-modal .ant-modal-content {
            border-radius: 45px !important;
            overflow: hidden !important;
            border: 8px solid white !important;
            box-shadow: 0 40px 100px -20px rgba(0,0,0,0.2) !important;
          }
        `}} />
      </div>
    </div>
  );
};

export default CategoryMgmt;
