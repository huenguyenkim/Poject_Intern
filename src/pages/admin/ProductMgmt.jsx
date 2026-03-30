import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Filter, 
  ListFilter,
  BarChart3,
  Package,
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const ProductMgmt = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '', price: '', category: categories[0] || '', description: '', imagePlaceholder: ''
  });

  const stats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const avgPrice = products.length ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2) : 0;
    
    const catCounts = {};
    products.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const lowStockCount = products.filter(p => (p.stock || 0) < 50).length;

    return { totalItems, avgPrice, topCategory, lowStockCount };
  }, [products]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Product name is required');
    if (!formData.category) return toast.error('Please select a category');
    if (!formData.description.trim()) return toast.error('Product description is required');
    
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) return toast.error('Price must be a positive number');
    
    if (editingId) {
      updateProduct(editingId, { ...formData, price: priceNum });
      toast.success('Product updated');
      setEditingId(null);
    } else {
      addProduct({ ...formData, price: priceNum, stock: Math.floor(Math.random() * 500) });
      toast.success('Product added to catalog');
    }
    setFormData({ title: '', price: '', category: categories[0] || '', description: '', imagePlaceholder: '' });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      imagePlaceholder: product.imagePlaceholder || ''
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', price: '', category: categories[0] || '', description: '', imagePlaceholder: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product removed');
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
      
      {/* Top Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-on_surface tracking-tight mb-2">Product Management</h1>
          <p className="text-on_surface_variant font-bold text-lg">Oversee your sweet inventory and catalog details.</p>
        </div>
        <div className="flex items-center gap-4">
          <Input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="w-full md:w-80"
          />
          <Button 
            variant="primary"
            className="px-8 py-4"
          >
            <Plus size={22} strokeWidth={3} /> Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/10 p-8 relative overflow-hidden group border-none">
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Total Items</p>
          <h1 className="text-4xl font-black text-on_surface">{stats.totalItems.toLocaleString()}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <Package size={120} />
          </div>
        </Card>

        <Card className="bg-secondary/10 p-8 relative overflow-hidden group border-secondary/20">
          <p className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] mb-4">Top Category</p>
          <h1 className="text-3xl font-black text-on_surface">{stats.topCategory}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500 text-secondary">
             <TrendingDown className="rotate-12" size={120} />
          </div>
        </Card>

        <Card className="bg-tertiary/10 p-8 relative overflow-hidden group border-tertiary/20">
          <p className="text-[11px] font-black text-tertiary uppercase tracking-[0.2em] mb-4">Avg Price</p>
          <h1 className="text-4xl font-black text-on_surface">${stats.avgPrice}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500 text-tertiary">
             <DollarSign size={120} />
          </div>
        </Card>

        <Card className="bg-surface_dim p-8 relative overflow-hidden group border-surface_container">
          <p className="text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] mb-4">Low Stock</p>
          <h1 className="text-4xl font-black text-on_surface">{stats.lowStockCount}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <BarChart3 size={120} />
          </div>
        </Card>
      </div>

      {/* Main Grid: List + Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Inventory List */}
        <Card className="lg:col-span-2 p-10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-on_surface">Inventory List</h3>
            <div className="flex gap-3">
               <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-xl"><ListFilter size={20} /></Button>
               <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-xl"><Filter size={20} /></Button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-10 px-10 pb-4">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-[10px] font-black text-on_surface_variant uppercase tracking-[0.2em] border-b border-surface_dim">
                  <th className="pb-6 text-left pl-2">Product</th>
                  <th className="pb-6 text-left">Category</th>
                  <th className="pb-6 text-left">Price</th>
                  <th className="pb-6 text-left">Stock</th>
                  <th className="pb-6 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface_dim">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="group hover:bg-surface_dim transition-colors">
                    <td className="py-6 pl-2">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-surface_dim rounded-[18px] overflow-hidden p-2 flex items-center justify-center shadow-inner border border-surface_container">
                          {p.imagePlaceholder?.startsWith('bg-') ? (
                            <div className={`w-full h-full rounded-xl ${p.imagePlaceholder}`}></div>
                          ) : (
                            <img src={p.imagePlaceholder} alt={p.title} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-on_surface leading-tight text-[15px]">{p.title}</p>
                          <p className="text-[11px] font-bold text-on_surface_variant mt-1 max-w-[150px] truncate">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <Badge variant={p.category === 'Gummies' ? 'secondary' : p.category === 'Chocolate' ? 'primary' : 'outline'}>
                        {p.category}
                      </Badge>
                    </td>
                    <td className="py-6 font-black text-primary text-[15px]">${p.price.toFixed(2)}</td>
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-2 bg-surface_dim rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              (p.stock || 0) < 50 ? 'bg-primary' : (p.stock || 0) < 150 ? 'bg-secondary' : 'bg-secondary/80'
                            }`}
                            style={{ width: `${Math.min(100, (p.stock || 0) / 5)}%` }}
                          ></div>
                        </div>
                        <span className="text-[13px] font-black text-on_surface w-8">{p.stock || 0}</span>
                      </div>
                    </td>
                    <td className="py-6 text-right pr-2">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleEdit(p)} variant="surface" size="sm" className="w-9 h-9 p-0 rounded-lg text-secondary"><Edit2 size={16} /></Button>
                        <Button onClick={() => handleDelete(p.id)} variant="surface" size="sm" className="w-9 h-9 p-0 rounded-lg text-primary"><Trash2 size={16} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="ghost" size="sm" className="mt-10 mx-auto text-[13px] font-black text-primary flex items-center gap-2">
            View All {products.length} Products <ArrowUpRight size={16} />
          </Button>
        </Card>

        {/* Quick Add Sidebar */}
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
          <Card className="p-0 overflow-hidden animate-in slide-in-from-right-10 duration-700">
            <div className={`${editingId ? 'bg-secondary' : 'bg-primary'} p-8 text-on_primary relative flex items-center gap-4 group`}>
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {editingId ? <Edit2 size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
               </div>
               <div>
                  <h3 className="text-xl font-black">{editingId ? 'Editing Product' : 'Quick Add'}</h3>
                  <p className="text-[11px] font-bold opacity-70">{editingId ? 'Modify and save changes' : 'Instantly update your shelf'}</p>
               </div>
               <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
               <Input 
                 label="Product Name"
                 type="text" 
                 value={formData.title} 
                 onChange={e => setFormData({...formData, title: e.target.value})}
                 placeholder="e.g. Fizzy Cola Bottles"
               />

               <div className="grid grid-cols-2 gap-4">
                 <Input 
                   label="Price ($)"
                   type="number" 
                   step="0.01"
                   value={formData.price} 
                   onChange={e => setFormData({...formData, price: e.target.value})}
                   placeholder="0.00"
                 />
                 
                 <div className="space-y-2">
                   <label className="text-[11px] font-black text-on_surface_variant/60 uppercase tracking-widest ml-1">Category</label>
                   <select 
                     value={formData.category} 
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-surface_dim py-4 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-on_surface cursor-pointer appearance-none"
                   >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-black text-on_surface_variant/60 uppercase tracking-widest ml-1">Description</label>
                 <textarea 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Tell us about the flavor profile..."
                   rows="3"
                   className="w-full bg-surface_dim py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-on_surface resize-none placeholder-on_surface_variant/40" 
                 />
               </div>

               <Input 
                 label="Image URL"
                 type="text" 
                 value={formData.imagePlaceholder} 
                 onChange={e => setFormData({...formData, imagePlaceholder: e.target.value})}
                 placeholder="https://..."
                 icon={ImageIcon}
               />

               <Button 
                  type="submit"
                  variant="primary"
                  className="w-full py-6 text-lg"
               >
                  {editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
               </Button>

               {editingId && (
                 <Button 
                   type="button" 
                   onClick={handleCancelEdit} 
                   variant="surface"
                   className="w-full py-4 text-sm"
                 >
                   Cancel Edit
                 </Button>
               )}

               <p className="text-[9px] font-black text-on_surface_variant/60 uppercase tracking-[0.15em] text-center">
                  Changes will be live instantly<br />on the main store
               </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductMgmt;
