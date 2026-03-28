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
          <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight mb-2">Product Management</h1>
          <p className="text-[#8e8a9d] font-bold text-lg">Oversee your sweet inventory and catalog details.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a9bc] group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white py-4 pl-12 pr-6 rounded-2xl w-full md:w-80 shadow-sm border border-[#ece8f1] outline-none focus:border-primary/20 transition-all font-bold text-[#2d2a4a]"
            />
          </div>
          <button className="bg-primary hover:bg-[#d92d6a] text-white px-8 py-4 rounded-2xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-pink-100 transition-all hover:scale-[1.05] active:scale-[0.95]">
            <Plus size={22} strokeWidth={3} /> Add New Product
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#ffdfe8] p-8 rounded-[35px] relative overflow-hidden group hover:shadow-xl transition-all">
          <p className="text-[11px] font-black text-[#f13a7b] uppercase tracking-[0.2em] mb-4">Total Items</p>
          <h1 className="text-4xl font-black text-[#2d2a4a]">{stats.totalItems.toLocaleString()}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <Package size={120} />
          </div>
        </div>

        <div className="bg-[#f2e7ff] p-8 rounded-[35px] relative overflow-hidden group hover:shadow-xl transition-all border border-purple-100">
          <p className="text-[11px] font-black text-[#7c3aed] uppercase tracking-[0.2em] mb-4">Top Category</p>
          <h1 className="text-3xl font-black text-[#2d2a4a]">{stats.topCategory}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500 text-[#7c3aed]">
             <TrendingDown className="rotate-12" size={120} />
          </div>
        </div>

        <div className="bg-[#daf4ff] p-8 rounded-[35px] relative overflow-hidden group hover:shadow-xl transition-all border border-blue-100">
          <p className="text-[11px] font-black text-[#0c66e4] uppercase tracking-[0.2em] mb-4">Avg Price</p>
          <h1 className="text-4xl font-black text-[#2d2a4a]">${stats.avgPrice}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500 text-[#0c66e4]">
             <DollarSign size={120} />
          </div>
        </div>

        <div className="bg-[#f7f0ff] p-8 rounded-[35px] relative overflow-hidden group hover:shadow-xl transition-all border border-purple-50">
          <p className="text-[11px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] mb-4">Low Stock</p>
          <h1 className="text-4xl font-black text-[#2d2a4a]">{stats.lowStockCount}</h1>
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <BarChart3 size={120} />
          </div>
        </div>
      </div>

      {/* Main Grid: List + Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-[45px] shadow-sm border border-[#ece8f1] p-10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-[#2d2a4a]">Inventory List</h3>
            <div className="flex gap-3">
               <button className="p-3 bg-[#f8f7fa] rounded-xl text-[#b0a9bc] hover:text-primary transition-colors"><ListFilter size={20} /></button>
               <button className="p-3 bg-[#f8f7fa] rounded-xl text-[#b0a9bc] hover:text-primary transition-colors"><Filter size={20} /></button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] border-b border-[#f8f7fa]">
                <th className="pb-6 text-left pl-2">Product</th>
                <th className="pb-6 text-left">Category</th>
                <th className="pb-6 text-left">Price</th>
                <th className="pb-6 text-left">Stock</th>
                <th className="pb-6 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8f7fa]">
              {filteredProducts.map(p => (
                <tr key={p.id} className="group hover:bg-[#fdfaff] transition-colors">
                  <td className="py-6 pl-2">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#f8f7fa] rounded-[18px] overflow-hidden p-2 flex items-center justify-center shadow-inner border border-[#ece8f1]">
                        {p.imagePlaceholder?.startsWith('bg-') ? (
                          <div className={`w-full h-full rounded-xl ${p.imagePlaceholder}`}></div>
                        ) : (
                          <img src={p.imagePlaceholder} alt={p.title} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-[#2d2a4a] leading-tight text-[15px]">{p.title}</p>
                        <p className="text-[11px] font-bold text-[#b0a9bc] mt-1 max-w-[150px] truncate">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-tight ${
                      p.category === 'Gummies' ? 'bg-[#f4ebff] text-[#7c3aed]' : 
                      p.category === 'Chocolate' ? 'bg-[#fff0f3] text-[#f13a7b]' : 
                      'bg-[#f8f7fa] text-[#2d2a4a]'
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="py-6 font-black text-primary text-[15px]">${p.price.toFixed(2)}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-[#f8f7fa] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            (p.stock || 0) < 50 ? 'bg-[#f13a7b]' : (p.stock || 0) < 150 ? 'bg-secondary' : 'bg-[#7c3aed]'
                          }`}
                          style={{ width: `${Math.min(100, (p.stock || 0) / 5)}%` }}
                        ></div>
                      </div>
                      <span className="text-[13px] font-black text-[#2d2a4a] w-8">{p.stock || 0}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right pr-2">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-2.5 bg-[#f4ebff] text-[#7c3aed] rounded-xl hover:bg-[#e9daff] transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-[#fff0f3] text-[#f13a7b] rounded-xl hover:bg-[#ffe2e8] transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-10 mx-auto text-[13px] font-black text-primary flex items-center gap-2 hover:underline">
            View All {products.length} Products <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Quick Add Sidebar */}
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
          <div className="bg-white rounded-[45px] shadow-sm border border-[#ece8f1] overflow-hidden animate-in slide-in-from-right-10 duration-700">
            <div className={`${editingId ? 'bg-[#7c3aed]' : 'bg-[#b31454]'} p-8 text-white relative flex items-center gap-4 group`}>
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
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] ml-1">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Fizzy Cola Bottles"
                    className="w-full bg-[#f8f7fa] py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-[#2d2a4a]" 
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] ml-1">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-[#f8f7fa] py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-[#2d2a4a]" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] ml-1">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#f8f7fa] py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-[#2d2a4a] cursor-pointer appearance-none"
                    >
                       {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] ml-1">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about the flavor profile..."
                    rows="3"
                    className="w-full bg-[#f8f7fa] py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-[#2d2a4a] resize-none" 
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#b0a9bc] uppercase tracking-[0.2em] ml-1">Image URL</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.imagePlaceholder} 
                      onChange={e => setFormData({...formData, imagePlaceholder: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-[#f8f7fa] py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-[#2d2a4a]" 
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm border border-[#ece8f1] group-hover:text-primary transition-colors cursor-pointer">
                       <ImageIcon size={18} className="text-[#b0a9bc]" />
                    </div>
                  </div>
               </div>

               <button 
                  type="submit"
                  className="w-full bg-[#b31454] hover:bg-[#d92d6a] text-white py-6 rounded-[22px] font-black text-lg shadow-xl shadow-pink-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
               >
                  {editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
               </button>

               {editingId && (
                 <button type="button" onClick={handleCancelEdit} className="w-full bg-[#f8f7fa] text-[#8e8a9d] hover:text-[#2d2a4a] py-4 rounded-[22px] font-black text-sm transition-all">
                   Cancel Edit
                 </button>
               )}

               <p className="text-[9px] font-black text-[#b0a9bc] uppercase tracking-[0.15em] text-center">
                  Changes will be live instantly<br />on the main store
               </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMgmt;
