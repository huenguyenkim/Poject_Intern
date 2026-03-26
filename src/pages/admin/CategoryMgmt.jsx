import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Package, 
  TrendingUp, 
  Database,
  History,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryMgmt = () => {
  const { categories, products, addCategory, deleteCategory, updateCategory } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Mock data for visual completeness
  const categoryAssets = {
    'Gummies': { 
      image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=600",
      desc: "Soft, chewy fruit-flavored sweets."
    },
    'Chocolate': { 
      image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600",
      desc: "Rich cocoa delights and pralines."
    },
    'Hard Candy': { 
      image: "https://images.unsplash.com/photo-1532115114704-51e44926dedd?auto=format&fit=crop&q=80&w=600",
      desc: "Lollipops, lozenges, and rock sweets."
    },
    'Baked Goods': { 
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600",
      desc: "Freshly baked macarons and cookies."
    },
    'Licorice': {
      image: "https://images.unsplash.com/photo-1582058091152-78d122e17596?auto=format&fit=crop&q=80&w=600",
      desc: "Classic black and flavored twists."
    },
    'Mints': {
      image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600",
      desc: "Refreshing breath-freshening treats."
    }
  };

  const recentMods = [
    { type: 'add', title: 'New Category: "Sugar Free"', user: 'Admin Sarah', time: '2 hours ago', icon: <Plus size={16} />, color: 'bg-green-100 text-green-600' },
    { type: 'update', title: 'Updated "Gummies" SKU Count', user: 'Admin Mike', time: '5 hours ago', icon: <Edit2 size={16} />, color: 'bg-blue-100 text-blue-600' },
    { type: 'delete', title: 'Deleted "Holiday Special"', user: 'Admin Sarah', time: 'Yesterday', icon: <Trash2 size={16} />, color: 'bg-red-100 text-red-600' }
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (!trimmed) return toast.error('Category name cannot be empty');
    if (categories.includes(trimmed)) return toast.error('Category already exists');
    addCategory(trimmed);
    setNewCat('');
    setIsAdding(false);
    toast.success('Category added');
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setEditValue(cat);
  };

  const saveEdit = (oldCat) => {
    const trimmed = editValue.trim();
    if (!trimmed) return toast.error('Category name cannot be empty');
    if (trimmed !== oldCat && categories.includes(trimmed)) return toast.error('Category name already exists');
    updateCategory(oldCat, trimmed);
    setEditingCat(null);
    toast.success('Category updated');
  };

  const handleDelete = (cat) => {
    if (confirm(`Are you sure you want to delete "${cat}"?`)) {
      deleteCategory(cat);
      toast.success('Category deleted');
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight mb-2">Category Management</h1>
          <p className="text-[#8e8a9d] font-bold text-lg">Organize your sweet inventory and manage shelf taxonomy.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-[#d92d6a] text-white px-8 py-4 rounded-2xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-pink-100 transition-all hover:scale-[1.05] active:scale-[0.95]"
        >
          <Plus size={22} strokeWidth={3} /> Add Category
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Categories */}
        <div className="bg-[#fdfaff] p-8 rounded-[35px] border border-[#ece8f1] hover:shadow-xl hover:shadow-purple-100/30 transition-shadow">
          <p className="text-[11px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-6">Total Categories</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-[#2d2a4a] leading-none">{categories.length}</span>
            <span className="text-[#10b981] font-black text-sm flex items-center mb-1">
              <ArrowUpRight size={14} className="mr-0.5" /> +2
            </span>
          </div>
        </div>

        {/* Most Popular */}
        <div className="bg-[#f6f0ff] p-8 rounded-[35px] border border-[#eee4ff] hover:shadow-xl hover:shadow-purple-200/20 transition-shadow">
          <p className="text-[11px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-6">Most Popular</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#7c3aed]">Gummies</h3>
            <p className="text-[13px] font-bold text-[#b0a9bc]">42% of total sales</p>
          </div>
        </div>

        {/* Storage Capacity */}
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] p-8 rounded-[35px] text-white relative overflow-hidden group shadow-xl shadow-blue-100 hover:shadow-2xl transition-all">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <p className="text-[11px] font-black opacity-80 uppercase tracking-[0.2em] mb-2">Storage Capacity</p>
            <h3 className="text-3xl font-black">78% Full</h3>
          </div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-24 h-24">
             <div className="w-full h-full rounded-full border-[10px] border-white/20 relative group-hover:scale-110 transition-transform">
                <div className="absolute inset-0 rounded-full border-[10px] border-white border-t-transparent border-r-transparent -rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Form (Inline overlay if needed, or separate) */}
      {isAdding && (
         <div className="bg-white p-8 rounded-[35px] shadow-2xl shadow-pink-100 border-2 border-primary/20 animate-in zoom-in-95">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#2d2a4a]">Create New Category</h3>
              <button onClick={() => setIsAdding(false)} className="text-[#b0a9bc] hover:text-error"><X size={24} /></button>
           </div>
           <form onSubmit={handleAdd} className="flex gap-4">
              <input 
                autoFocus
                type="text" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Category Name (e.g., Sour Belts)"
                className="flex-1 bg-[#f8f7fa] py-4 px-6 rounded-2xl font-bold text-[#2d2a4a] outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all"
              />
              <button type="submit" className="bg-primary text-white px-8 rounded-2xl font-black shadow-lg shadow-pink-100">Add Category</button>
           </form>
         </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          const assets = categoryAssets[cat] || { image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600", desc: "Premium selection of sweets." };
          const skuCount = products.filter(p => p.category === cat).length;

          return (
            <div key={idx} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all border border-[#ece8f1] group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src={assets.image} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <Package size={14} className="text-primary" />
                  <span className="text-[11px] font-black text-[#2d2a4a]">{skuCount} SKUs</span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black text-[#2d2a4a] tracking-tight">{cat}</h3>
                  <div className="bg-[#fdfaff] p-2 rounded-xl text-[#b0a9bc] group-hover:text-primary transition-colors cursor-pointer">
                    <MoreVertical size={18} />
                  </div>
                </div>
                <p className="text-[#8e8a9d] font-bold text-[14px] leading-relaxed mb-8 flex-1">
                  {assets.desc}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="flex-1 bg-[#f4ebff] hover:bg-[#e9daff] text-[#7c3aed] py-3.5 rounded-2xl font-black text-[13px] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat)}
                    className="bg-[#fff0f3] hover:bg-[#ffe2e8] text-[#f13a7b] p-3.5 rounded-2xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Category Empty State Card */}
        <button 
          onClick={() => setIsAdding(true)}
          className="border-[3px] border-dashed border-[#ece8f1] rounded-[40px] flex flex-col items-center justify-center p-12 text-center group hover:border-primary/20 hover:bg-[#fffafd] transition-all min-h-[400px]"
        >
          <div className="w-16 h-16 bg-[#f8f7fa] group-hover:bg-primary group-hover:text-white rounded-full flex items-center justify-center text-[#b0a9bc] transition-all mb-6">
            <Plus size={32} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-black text-[#2d2a4a] mb-2">Add New Category</h3>
          <p className="text-[13px] font-bold text-[#b0a9bc]">Create a new shelf grouping</p>
        </button>
      </div>

      {/* Recent Modifications Section */}
      <div className="bg-white rounded-[45px] p-10 border border-[#ece8f1] shadow-sm">
        <div className="flex items-center gap-3 mb-10">
           <div className="w-10 h-10 bg-[#fef1f5] text-primary rounded-xl flex items-center justify-center">
              <History size={20} />
           </div>
           <h3 className="text-xl font-black text-[#2d2a4a]">Recent Modifications</h3>
        </div>

        <div className="divide-y divide-[#f8f7fa]">
           {recentMods.map((mod, i) => (
             <div key={i} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:px-4 transition-all rounded-2xl hover:bg-[#fdfaff]">
                <div className="flex items-center gap-5">
                   <div className={`w-12 h-12 ${mod.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      {mod.icon}
                   </div>
                   <div>
                      <p className="font-black text-[#2d2a4a] text-[15px]">{mod.title}</p>
                      <p className="text-[12px] font-bold text-[#b0a9bc] mt-1">Added by {mod.user} • {mod.time}</p>
                   </div>
                </div>
                <button className="text-[13px] font-black text-[#7c3aed] hover:underline flex items-center gap-1 self-start md:self-auto">
                   View <ArrowUpRight size={14} />
                </button>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default CategoryMgmt;
