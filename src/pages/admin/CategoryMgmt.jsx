import React, { useState } from 'react';
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
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

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
    { type: 'add', title: 'New Category: "Sugar Free"', user: 'Admin Sarah', time: '2 hours ago', icon: <Plus size={16} />, color: 'secondary' },
    { type: 'update', title: 'Updated "Gummies" SKU Count', user: 'Admin Mike', time: '5 hours ago', icon: <Edit2 size={16} />, color: 'tertiary' },
    { type: 'delete', title: 'Deleted "Holiday Special"', user: 'Admin Sarah', time: 'Yesterday', icon: <Trash2 size={16} />, color: 'primary' }
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
          <h1 className="text-4xl font-black text-on_surface tracking-tight mb-2">Category Management</h1>
          <p className="text-on_surface_variant font-bold text-lg">Organize your sweet inventory and manage shelf taxonomy.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          variant="primary"
          className="px-8 py-4"
        >
          <Plus size={22} strokeWidth={3} /> Add Category
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Categories */}
        <Card className="bg-surface_dim p-8 hover:shadow-xl hover:shadow-secondary/10 transition-shadow">
          <p className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-6">Total Categories</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-on_surface leading-none">{categories.length}</span>
            <span className="text-success font-black text-sm flex items-center mb-1">
              <ArrowUpRight size={14} className="mr-0.5" /> +2
            </span>
          </div>
        </Card>

        {/* Most Popular */}
        <Card className="bg-secondary/10 p-8 border-secondary/20 hover:shadow-xl hover:shadow-secondary/20 transition-shadow">
          <p className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-6">Most Popular</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-secondary">Gummies</h3>
            <p className="text-[13px] font-bold text-on_surface_variant">42% of total sales</p>
          </div>
        </Card>

        {/* Storage Capacity */}
        <Card className="bg-gradient-to-br from-tertiary/80 to-tertiary p-8 text-on_tertiary relative overflow-hidden group shadow-xl shadow-tertiary/20 hover:shadow-2xl transition-all border-none">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <p className="text-[11px] font-black opacity-80 uppercase tracking-[0.2em] mb-2">Storage Capacity</p>
            <h3 className="text-3xl font-black">78% Full</h3>
          </div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-24 h-24">
             <div className="w-full h-full rounded-full border-[10px] border-white/20 relative group-hover:scale-110 transition-transform">
                <div className="absolute inset-0 rounded-full border-[10px] border-white border-t-transparent border-r-transparent -rotate-45 shadow-[0_0_20_rgba(255,255,255,0.4)]"></div>
             </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category List */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Add Form (Conditionally Rendered as Tile) */}
          {isAdding && (
             <Card className="p-8 border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col justify-center animate-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-primary uppercase tracking-widest text-[11px]">New Category</h3>
                   <Button onClick={() => setIsAdding(false)} variant="surface" size="sm" className="w-8 h-8 p-0 rounded-full"><X size={14} /></Button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                   <Input 
                      type="text" 
                      placeholder="Category name..."
                      value={newCat}
                      onChange={e => setNewCat(e.target.value)}
                      autoFocus
                   />
                   <Button type="submit" variant="primary" className="w-full py-3 text-sm">
                      Create Category
                   </Button>
                </form>
             </Card>
          )}

          {categories.map((cat) => {
            const asset = categoryAssets[cat] || {
              image: "https://images.unsplash.com/photo-1590156206657-30833325603e?auto=format&fit=crop&q=80&w=600",
              desc: "Explore our delightful collection of sweets."
            };
            const itemCount = products.filter(p => p.category === cat).length;

            return (
              <Card key={cat} className="p-0 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all">
                <div className="h-40 overflow-hidden relative">
                   <img src={asset.image} alt={cat} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-4 left-6 flex items-center gap-2">
                       <Badge variant="secondary" className="px-3 py-1 uppercase tracking-tighter">
                          {itemCount} SKUs
                       </Badge>
                   </div>
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-xl bg-white/20 backdrop-blur-md text-white border-none"><MoreVertical size={18} /></Button>
                   </div>
                </div>

                <div className="p-8 space-y-4">
                  {editingCat === cat ? (
                    <div className="flex gap-2">
                       <Input 
                         value={editValue} 
                         onChange={e => setEditValue(e.target.value)}
                         className="flex-1"
                       />
                       <Button onClick={() => saveEdit(cat)} variant="secondary" size="sm" className="w-10 h-10 p-0"><Check size={18} /></Button>
                       <Button onClick={() => setEditingCat(null)} variant="surface" size="sm" className="w-10 h-10 p-0"><X size={18} /></Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                       <h3 className="text-xl font-black text-on_surface">{cat}</h3>
                    </div>
                  )}
                  
                  <p className="text-[13px] font-bold text-on_surface_variant leading-relaxed">
                    {asset.desc}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-surface_dim">
                    <div className="flex gap-2">
                       <Button onClick={() => handleEdit(cat)} variant="surface" size="sm" className="w-9 h-9 p-0 rounded-lg text-secondary"><Edit2 size={14} /></Button>
                       <Button onClick={() => handleDelete(cat)} variant="surface" size="sm" className="w-9 h-9 p-0 rounded-lg text-primary"><Trash2 size={14} /></Button>
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 text-primary uppercase tracking-widest text-[10px] items-center gap-1">
                       Browse Items <ArrowUpRight size={12} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <Card className="p-10 space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                 <History className="text-primary" size={20} />
                 <h3 className="text-lg font-black text-on_surface">Modify Activity</h3>
              </div>
              
              <div className="space-y-8 relative z-10">
                 {recentMods.map((mod, i) => (
                    <div key={i} className="flex gap-4 group cursor-default">
                       <div className="w-1.5 h-12 bg-surface_container rounded-full overflow-hidden shrink-0 mt-2">
                          <div className={`w-full h-1/2 rounded-full bg-${mod.color}`}></div>
                       </div>
                       <div>
                          <Badge variant={mod.color} className="mb-2 py-0.5 px-2 text-[9px] uppercase tracking-wider">{mod.type}</Badge>
                          <p className="font-black text-on_surface text-[13px] leading-snug">{mod.title}</p>
                          <div className="flex items-center gap-2 mt-2 opacity-60">
                             <p className="text-[10px] font-bold text-on_surface_variant">{mod.user}</p>
                             <span className="w-1 h-1 rounded-full bg-on_surface_variant"></span>
                             <p className="text-[10px] font-bold text-on_surface_variant">{mod.time}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <Button variant="surface" className="w-full py-4 text-[12px] relative z-10">
                 View Full Revision Log
              </Button>
              
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
                 <Database size={200} />
              </div>
           </Card>

           <Card className="bg-primary p-10 text-on_primary relative overflow-hidden group border-none">
              <h3 className="text-xl font-black relative z-10 mb-2">Need a Custom Field?</h3>
              <p className="text-sm font-bold opacity-80 relative z-10 leading-relaxed">
                 You can now add extra metadata attributes to categories for better SEO.
              </p>
              <Button variant="surface" className="mt-8 bg-white border-none text-primary relative z-10">
                 Explore Field Editor
              </Button>
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryMgmt;
