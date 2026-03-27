import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ui/ProductCard';
import { Filter, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCatalog = () => {
  const { products, categories: storeCategories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState(['All Candies']);
  const [price, setPrice] = useState(35);
  const [sortBy, setSortBy] = useState('Newest Arrivals');

  const categories = ['All Candies', 'Chocolate', 'Gummies', 'Hard Candy', 'Sour Bites'];
  const specialTags = ['Vegan', 'Sugar Free', 'Gift Box'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategories.includes('All Candies') || activeCategories.includes(product.category);
      const matchPrice = product.price <= price;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [searchQuery, activeCategories, price, products]);

  const toggleCategory = (cat) => {
    if (cat === 'All Candies') {
      setActiveCategories(['All Candies']);
    } else {
      setActiveCategories(prev => {
        const withoutAll = prev.filter(c => c !== 'All Candies');
        if (prev.includes(cat)) {
          const next = withoutAll.filter(c => c !== cat);
          return next.length === 0 ? ['All Candies'] : next;
        }
        return [...withoutAll, cat];
      });
    }
  };

  return (
    <div className="bg-[#fffaff] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-on_surface_variant mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-on_surface_variant/40">›</span>
          <span className="text-primary font-bold">All Sweets</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-surface_container sticky top-28">
              <div className="flex justify-between items-center mb-8 border-b border-surface_container pb-4">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-primary" strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-on_surface tracking-tight uppercase">Filters</h2>
                </div>
              </div>
              
              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Categories</h3>
                  <div className="space-y-4">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={activeCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="peer appearance-none w-6 h-6 rounded-full border-2 border-surface_container checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                          />
                          <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className={`transition-colors font-semibold text-[15px] ${activeCategories.includes(cat) ? 'text-primary' : 'text-on_surface_variant group-hover:text-on_surface'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Price Range</h3>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-surface_container rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <div className="flex justify-between items-center text-sm font-bold text-on_surface_variant">
                      <span>$0</span>
                      <span>${price < 100 ? price : '100+'}</span>
                    </div>
                  </div>
                </div>

                {/* Special Tags */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Special</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialTags.map(tag => (
                      <button 
                        key={tag}
                        className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all bg-[#fff0f7] text-[#ee4c9e] hover:bg-primary hover:text-white"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <h1 className="text-4xl font-black text-on_surface tracking-tight">
                Sweet Treats <span className="text-primary tracking-normal ml-1">({filteredProducts.length})</span>
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-on_surface_variant whitespace-nowrap">Sort by:</span>
                <div className="relative group">
                  <button className="flex items-center justify-between gap-4 px-6 py-3 bg-white border border-surface_container rounded-2xl font-bold text-sm min-w-[200px] hover:border-primary transition-colors">
                    <span>{sortBy}</span>
                    <ChevronDown size={18} className="text-primary" />
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-surface_container shadow-sm">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface_container mb-6">
                  <Search size={40} className="text-on_surface_variant/40" />
                </div>
                <h3 className="text-3xl font-black text-on_surface mb-3">No treats found</h3>
                <p className="text-on_surface_variant font-semibold text-lg max-w-sm mx-auto">
                  We couldn't find any sweets matching your current filters.
                </p>
                <button 
                  onClick={() => { setActiveCategories(['All Candies']); setPrice(100); }}
                  className="mt-8 px-10 py-4 bg-primary text-white font-black rounded-full shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
