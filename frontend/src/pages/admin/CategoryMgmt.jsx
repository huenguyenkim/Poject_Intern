import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Statistic, 
  Progress, 
  Popconfirm, 
  Tooltip, 
  Input as AntInput,
  Space,
  Form
} from 'antd';
import { 
  Plus, Edit2, Trash2, Check, X,
  TrendingUp, History, Info, Image as ImageIcon
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

const CategoryMgmt = () => {
  const dispatch = useDispatch();
  const { categories, products, status } = useSelector((state) => state.catalog);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', image: '' });
  const [editingCat, setEditingCat] = useState(null);
  const [editValue, setEditValue] = useState({ name: '', description: '', image: '' });

  const isAddingCategory = status === 'loading' && !editingCat && isAdding;
  const isUpdatingCategory = status === 'loading' && editingCat;

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newCat.name.trim()) return showErrorToast('Category name cannot be empty');
    if (categories.find(c => c.name.toLowerCase() === newCat.name.trim().toLowerCase())) {
      return showErrorToast('Category already exists');
    }
    
    try {
      await dispatch(addCategoryThunk(newCat)).unwrap();
      showSuccessToast('Category created! 📁');
      setNewCat({ name: '', description: '', image: '' });
      setIsAdding(false);
    } catch (err) {
      showErrorToast(err || 'Failed to add category');
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat.id);
    setEditValue({ 
      name: cat.name, 
      description: cat.description || '', 
      image: cat.image || '' 
    });
  };

  const saveEdit = async (id) => {
    if (!editValue.name.trim()) return showErrorToast('Category name cannot be empty');
    try {
      await dispatch(updateCategoryThunk({ id, data: editValue })).unwrap();
      showSuccessToast('Category updated!');
      setEditingCat(null);
    } catch (err) {
      showErrorToast(err || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
      showSuccessToast('Category deleted');
    } catch (err) {
      showErrorToast(err || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-surface/[0.02] flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-10 py-12 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-on_surface_variant/60">
              <span>Admin Dashboard</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="text-primary font-black uppercase tracking-[0.2em]">Category Management</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-on_surface tracking-tight leading-none uppercase">Store Taxonomy</h1>
              <p className="text-on_surface_variant font-bold text-lg max-w-xl">Organize your sweet inventory and manage shelf groupings.</p>
            </div>
          </div>
          <Button 
            variant="primary"
            className="h-[72px] px-10 rounded-[28px] shadow-2xl shadow-primary/20 hover:shadow-primary/30 flex items-center gap-3 group"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-base font-black uppercase tracking-widest">Add Category</span>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            const isEditingThis = editingCat === cat.id;

            return (
              <Card key={cat.id} className="p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-[480px] rounded-[32px] group relative">
                <div className="h-48 overflow-hidden relative bg-surface_dim">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on_surface_variant/20">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {isEditingThis ? (
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on_surface_variant pl-1">Category Name</label>
                        <AntInput 
                          className="!rounded-2xl !font-bold !bg-surface_dim !border-none !h-[52px]"
                          value={editValue.name}
                          onChange={(e) => setEditValue({...editValue, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on_surface_variant pl-1">Image URL</label>
                        <AntInput 
                          className="!rounded-2xl !font-bold !bg-surface_dim !border-none !h-[52px]"
                          value={editValue.image}
                          onChange={(e) => setEditValue({...editValue, image: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button variant="primary" onClick={() => saveEdit(cat.id)} isLoading={isUpdatingCategory} className="flex-1 py-3.5 !rounded-2xl">
                          Save
                        </Button>
                        <Button variant="surface" onClick={() => setEditingCat(null)} className="!w-14 !h-14 !p-0 !rounded-2xl flex items-center justify-center"><X size={20}/></Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                         <h3 className="text-2xl font-black text-on_surface leading-tight tracking-tight pr-2 uppercase">{cat.name}</h3>
                         <Badge variant="surface" className="flex flex-col text-[10px] font-black px-3 py-1.5 rounded-xl text-center leading-[1] shrink-0 uppercase tracking-tighter">
                           <span>{cat.productCount || count}</span>
                           <span className="text-[8px] opacity-40">SKUs</span>
                         </Badge>
                      </div>
                      <p className="text-[14px] font-bold text-on_surface_variant mb-6 line-clamp-2 leading-relaxed opacity-70 italic">
                        {cat.description || "Premium assorted candies and sweets."}
                      </p>
                      
                      <div className="mt-auto flex gap-3">
                         <Button variant="surface" onClick={() => handleEdit(cat)} className="flex-1 py-4 !rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                            <Edit2 size={16} strokeWidth={3}/> Edit
                         </Button>
                         <Popconfirm
                           title="Delete category"
                           description={`Are you sure you want to remove "${cat.name}"?`}
                           onConfirm={() => handleDelete(cat.id)}
                           okText="Yes, delete"
                           cancelText="Cancel"
                         >
                            <Button variant="ghost" className="!w-14 !h-14 !min-w-0 !p-0 !bg-error/5 text-error hover:!bg-error/10 !rounded-2xl flex items-center justify-center">
                               <Trash2 size={20} strokeWidth={2.5}/>
                            </Button>
                         </Popconfirm>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
          
          {/* Add Category Card */}
          {isAdding ? (
            <Card className="p-8 border-2 border-dashed border-primary/20 bg-primary/[0.02] shadow-none flex flex-col justify-center h-[480px] rounded-[32px]">
               <form onSubmit={handleAdd} className="w-full space-y-4">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Plus size={24} strokeWidth={3} />
                    </div>
                    <h4 className="text-xl font-black text-on_surface uppercase tracking-tight">New Category</h4>
                  </div>
                  <AntInput 
                    className="!rounded-2xl !font-bold !bg-white !shadow-sm !border-none !h-[56px]"
                    placeholder="Category Name" 
                    value={newCat.name} 
                    onChange={e=>setNewCat({...newCat, name: e.target.value})} 
                    required
                  />
                  <AntInput 
                    className="!rounded-2xl !font-bold !bg-white !shadow-sm !border-none !h-[56px]"
                    placeholder="Image URL" 
                    value={newCat.image} 
                    onChange={e=>setNewCat({...newCat, image: e.target.value})} 
                  />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="primary" isLoading={isAddingCategory} className="flex-1 py-4 !rounded-2xl text-sm">
                      Create
                    </Button>
                    <Button type="button" onClick={()=>setIsAdding(false)} variant="surface" className="!w-14 !h-14 !p-0 !rounded-2xl flex items-center justify-center shadow-sm"><X size={20}/></Button>
                  </div>
               </form>
            </Card>
          ) : (
            <Card 
              className="p-0 border-2 border-dashed border-surface_container hover:border-secondary/40 bg-transparent hover:bg-secondary/[0.02] shadow-none flex flex-col items-center justify-center h-[480px] rounded-[32px] cursor-pointer transition-all group" 
              onClick={() => setIsAdding(true)}
            >
                <div className="w-16 h-16 bg-surface_container rounded-full flex items-center justify-center text-on_surface_variant mb-6 shadow-sm border border-surface_container_highest group-hover:bg-secondary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                   <Plus size={28} strokeWidth={3}/>
                </div>
                <p className="text-lg font-black text-on_surface uppercase tracking-widest text-center">Add New Shelf</p>
                <p className="text-[12px] font-bold text-on_surface_variant opacity-60 text-center px-8 mt-2">Expand your catalog with a new product group.</p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryMgmt;
