import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/ui/ProductCard';
import Button from '../../components/ui/Button';
import { Filter, ChevronDown, Search, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const MOCK_BRANDS = ['Sweeties', 'ChocoCo', 'CandyLand', 'SugarHigh'];

const ProductCatalog = () => {
  const { products, categories: storeCategories, status } = useSelector((state) => state.catalog);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const urlCategory = searchParams.get('category');
  const [activeCategories, setActiveCategories] = useState(urlCategory ? [urlCategory] : ['All Candies']);
  const [activeBrands, setActiveBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState(100);
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync URL query
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat) setActiveCategories([cat]);
  }, [searchParams]);

  // Data Augmentation (Mock fields not in DB)
  const augmentedProducts = useMemo(() => {
    return products.map(p => {
      // Generate pseudo-random deterministic mock data based on ID
      const brandIndex = p.id % MOCK_BRANDS.length;
      const rating = (p.id % 3) + 3; // 3 to 5 stars
      const isSale = p.id % 3 === 0; // Every 3rd item is on sale
      
      return {
        ...p,
        brand: MOCK_BRANDS[brandIndex],
        rating: rating,
        originalPrice: isSale ? p.price * 1.25 : undefined, // 20% discount mock
      };
    });
  }, [products]);

  const handleLocalSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    if (value) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      const { q, ...rest } = Object.fromEntries(searchParams);
      setSearchParams(rest, { replace: true });
    }
  };

  const categories = useMemo(() => {
    const names = ['All Candies', ...storeCategories.map(c => c.name || c.categoryName)];
    return [...new Set(names)];
  }, [storeCategories]);

  const filteredProducts = useMemo(() => {
    let result = augmentedProducts.filter(product => {
      const matchSearch = (product.title || product.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category Match check both Name and ID
      const productCatName = product.categoryName || product.category;
      const productCatId = String(product.categoryId);
      const matchCategory = activeCategories.includes('All Candies') || 
                            activeCategories.includes(productCatName) || 
                            activeCategories.includes(productCatId);
                            
      const matchPrice = (product.price || 0) <= price;
      const matchBrand = activeBrands.length === 0 || activeBrands.includes(product.brand);
      const matchRating = product.rating >= minRating;

      return matchSearch && matchCategory && matchPrice && matchBrand && matchRating;
    });

    // Sorting Logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'Newest Arrivals') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [searchQuery, activeCategories, price, augmentedProducts, sortBy, activeBrands, minRating]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleCategory = (cat) => {
    setCurrentPage(1);
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

  const toggleBrand = (brand) => {
    setCurrentPage(1);
    setActiveBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setCurrentPage(1);
    setMinRating(rating === minRating ? 0 : rating);
  };

  const clearFilters = () => {
    setSearchQuery(""); 
    setSearchParams({}, { replace: true }); 
    setActiveCategories(['All Candies']); 
    setActiveBrands([]);
    setMinRating(0);
    setPrice(100);
    setCurrentPage(1);
  };

  return (
    <div className="bg-surface_dim min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] md:text-sm font-black text-on_surface_variant mb-4 md:mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-on_surface_variant/40">›</span>
          <span className="text-primary font-black">All Sweets</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-surface_container">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span className="font-black text-on_surface text-sm uppercase tracking-tight">Refine Search</span>
            </div>
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="surface"
              size="sm"
              className="px-6 py-2 rounded-xl text-xs font-black"
            >
              {showMobileFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-[280px] flex-shrink-0 transition-all duration-500 lg:block ${showMobileFilters ? 'block opacity-100 translate-y-0' : 'hidden lg:opacity-100 lg:translate-y-0 opacity-0 -translate-y-4'}`}>
            <div className="bg-white p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-surface_container lg:sticky lg:top-28">
              <div className="hidden lg:flex justify-between items-center mb-8 border-b border-surface_container pb-4">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-primary" strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-on_surface tracking-tight uppercase">Filters</h2>
                </div>
              </div>

              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Categories</h3>
                  <div className="space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
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

                {/* Brands (Mock) */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Brands</h3>
                  <div className="space-y-4">
                    {MOCK_BRANDS.map(brand => (
                      <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={activeBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="peer appearance-none w-5 h-5 rounded border-2 border-surface_container checked:bg-primary checked:border-primary transition-all cursor-pointer"
                          />
                          <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className={`transition-colors font-semibold text-[14px] ${activeBrands.includes(brand) ? 'text-primary' : 'text-on_surface_variant group-hover:text-on_surface'}`}>
                          {brand}
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
                      onChange={(e) => { setPrice(parseInt(e.target.value)); setCurrentPage(1); }}
                      className="w-full h-2 bg-surface_container rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center text-sm font-bold text-on_surface_variant">
                      <span>$0</span>
                      <span>${price < 100 ? price : '100+'}</span>
                    </div>
                  </div>
                </div>

                {/* Ratings (Mock) */}
                <div>
                  <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">Customer Rating</h3>
                  <div className="space-y-3">
                    {[5, 4, 3].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all w-full ${minRating === rating ? 'bg-primary/10' : 'hover:bg-surface_container'}`}
                      >
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < rating ? 'fill-current' : 'text-on_surface_variant/20 fill-on_surface_variant/10'} />
                          ))}
                        </div>
                        <span className={`text-[13px] font-bold ${minRating === rating ? 'text-primary' : 'text-on_surface_variant'}`}>
                          & Up
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-6 mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-black text-on_surface tracking-tight">
                Sweet Treats <span className="text-primary tracking-normal ml-1">({filteredProducts.length})</span>
              </h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
                <div className="relative w-full sm:w-56 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant/40" size={16} />
                  <input
                    type="text"
                    placeholder="Search treats..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-surface_container rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-sm transition-all"
                    value={searchQuery}
                    onChange={handleLocalSearchChange}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-on_surface_variant whitespace-nowrap uppercase tracking-widest hidden sm:block">Sort by:</span>
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setShowSort(!showSort)}
                      className="flex items-center justify-between gap-4 px-6 py-3 w-full sm:w-auto bg-white border border-surface_container rounded-2xl font-black text-xs min-w-[180px] hover:border-primary transition-all shadow-sm"
                    >
                      <span className="uppercase tracking-tight">{sortBy}</span>
                      <ChevronDown size={16} className={`text-primary transition-transform ${showSort ? 'rotate-180' : ''}`} />
                    </button>

                    {showSort && (
                      <div className="absolute right-0 top-full mt-2 w-full bg-white border border-surface_container rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {['Newest Arrivals', 'Price: Low to High', 'Price: High to Low'].map(option => (
                          <button
                            key={option}
                            onClick={() => { setSortBy(option); setShowSort(false); setCurrentPage(1); }}
                            className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors hover:bg-primary/5 ${sortBy === option ? 'text-primary' : 'text-on_surface_variant'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} {...product} title={product.title || product.productName} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mb-8">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-surface_container hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-surface_container disabled:hover:text-on_surface transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center transition-all ${
                            currentPage === i + 1 
                              ? 'bg-primary text-on_primary shadow-md' 
                              : 'text-on_surface_variant hover:bg-surface_container_highest'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-surface_container hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-surface_container disabled:hover:text-on_surface transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
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
                  onClick={clearFilters}
                  className="mt-8 px-10 py-4 bg-primary text-on_primary font-black rounded-full shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
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
