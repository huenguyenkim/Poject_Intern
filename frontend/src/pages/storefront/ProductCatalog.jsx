import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/ui/ProductCard';
import Button from '../../components/ui/Button';
import { Filter, ChevronDown, Search, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PageTransition from '../../components/layout/PageTransition';

const MOCK_BRANDS = ['Sweeties', 'ChocoCo', 'CandyLand', 'SugarHigh'];

const ProductCatalog = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { products, categories: storeCategories, status } = useSelector((state) => state.catalog);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const urlCategory = searchParams.get('category');
  const [activeCategories, setActiveCategories] = useState(urlCategory ? [urlCategory] : [t('catalog.all_candies', 'All Candies')]);
  const [activeBrands, setActiveBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState(100);
  const [sortBy, setSortBy] = useState(t('catalog.sort_newest', 'Newest Arrivals'));
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

  // Data Augmentation
  const augmentedProducts = useMemo(() => {
    return products.map(p => {
      const brandIndex = p.id % MOCK_BRANDS.length;
      const rating = (p.id % 3) + 3;
      const isSale = p.id % 3 === 0;
      
      return {
        ...p,
        brand: MOCK_BRANDS[brandIndex],
        rating: rating,
        originalPrice: isSale ? p.price * 1.25 : undefined,
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
    const names = [t('catalog.all_candies', 'All Candies'), ...storeCategories.map(c => c.name || c.categoryName)];
    return [...new Set(names)];
  }, [storeCategories, t]);

  const filteredProducts = useMemo(() => {
    let result = augmentedProducts.filter(product => {
      const matchSearch = (product.title || product.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const productCatName = product.categoryName || product.category;
      const productCatId = String(product.categoryId);
      const matchCategory = activeCategories.includes(t('catalog.all_candies', 'All Candies')) || 
                            activeCategories.includes(productCatName) || 
                            activeCategories.includes(productCatId);
                            
      const matchPrice = (product.price || 0) <= price;
      const matchBrand = activeBrands.length === 0 || activeBrands.includes(product.brand);
      const matchRating = product.rating >= minRating;

      return matchSearch && matchCategory && matchPrice && matchBrand && matchRating;
    });

    if (sortBy === t('catalog.sort_low_high', 'Price: Low to High')) {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === t('catalog.sort_high_low', 'Price: High to Low')) {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [searchQuery, activeCategories, price, augmentedProducts, sortBy, activeBrands, minRating, t]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleCategory = (cat) => {
    setCurrentPage(1);
    const allLabel = t('catalog.all_candies', 'All Candies');
    if (cat === allLabel) {
      setActiveCategories([allLabel]);
    } else {
      setActiveCategories(prev => {
        const withoutAll = prev.filter(c => c !== allLabel);
        if (prev.includes(cat)) {
          const next = withoutAll.filter(c => c !== cat);
          return next.length === 0 ? [allLabel] : next;
        }
        return [...withoutAll, cat];
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery(""); 
    setSearchParams({}, { replace: true }); 
    setActiveCategories([t('catalog.all_candies', 'All Candies')]); 
    setActiveBrands([]);
    setMinRating(0);
    setPrice(100);
    setCurrentPage(1);
  };

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen">
        <SEO 
          title={t('catalog.seo_title', 'Product Catalog - Premium Candies')}
          description={t('catalog.seo_desc', 'Browse our full collection of treats at Candy Shop.')}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 md:py-8">
          <nav className="flex items-center gap-2 text-[10px] md:text-sm font-black text-on_surface_variant mb-4 md:mb-8 uppercase tracking-widest">
            <Link to={`/${lang}`} className="hover:text-primary transition-colors">{t('header.home')}</Link>
            <span className="text-on_surface_variant/40">›</span>
            <span className="text-primary font-black">{t('footer.shop_all')}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-surface_container">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                <span className="font-black text-on_surface text-sm uppercase tracking-tight">{t('catalog.refine', 'Refine Search')}</span>
              </div>
              <Button onClick={() => setShowMobileFilters(!showMobileFilters)} variant="surface" size="sm" className="px-6 py-2 rounded-xl text-xs font-black">
                {showMobileFilters ? t('common.hide', 'HIDE') : t('common.show', 'SHOW')}
              </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`w-full lg:w-[280px] flex-shrink-0 transition-all duration-500 lg:block ${showMobileFilters ? 'block opacity-100 translate-y-0' : 'hidden lg:opacity-100 lg:translate-y-0 opacity-0 -translate-y-4'}`}>
              <div className="bg-white p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-surface_container lg:sticky lg:top-28">
                <div className="hidden lg:flex justify-between items-center mb-8 border-b border-surface_container pb-4">
                  <div className="flex items-center gap-3">
                    <Filter size={18} className="text-primary" strokeWidth={2.5} />
                    <h2 className="text-xl font-black text-on_surface tracking-tight uppercase">{t('catalog.filters', 'Filters')}</h2>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">{t('catalog.categories', 'Categories')}</h3>
                    <div className="space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                          <input type="checkbox" checked={activeCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="appearance-none w-6 h-6 rounded-full border-2 border-surface_container checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                          <span className={`transition-colors font-semibold text-[15px] ${activeCategories.includes(cat) ? 'text-primary' : 'text-on_surface_variant group-hover:text-on_surface'}`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-on_surface mb-5 tracking-tight">{t('catalog.price_range', 'Price Range')}</h3>
                    <div className="space-y-4">
                      <input type="range" min="0" max="100" value={price} onChange={(e) => { setPrice(parseInt(e.target.value)); setCurrentPage(1); }} className="w-full h-2 bg-surface_container rounded-lg appearance-none cursor-pointer accent-primary" />
                      <div className="flex justify-between items-center text-sm font-bold text-on_surface_variant">
                        <span>$0</span>
                        <span>${price < 100 ? price : '100+'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={clearFilters} variant="surface" className="w-full py-4 rounded-2xl font-black text-xs">
                    {t('catalog.clear_filters', 'CLEAR ALL')}
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-6 mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-on_surface tracking-tight uppercase">
                  {t('catalog.title', 'Sweet Treats')} <span className="text-primary tracking-normal ml-1">({filteredProducts.length})</span>
                </h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
                  <div className="relative w-full sm:w-56 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant/40" size={16} />
                    <input type="text" placeholder={t('catalog.search_placeholder', 'Search treats...')} className="w-full pl-10 pr-4 py-3 bg-white border border-surface_container rounded-2xl outline-none font-bold text-sm transition-all shadow-sm" value={searchQuery} onChange={handleLocalSearchChange} />
                  </div>

                  <div className="relative">
                    <button onClick={() => setShowSort(!showSort)} className="flex items-center justify-between gap-4 px-6 py-3 w-full sm:w-auto bg-white border border-surface_container rounded-2xl font-black text-xs min-w-[180px] hover:border-primary transition-all shadow-sm">
                      <span className="uppercase tracking-tight">{sortBy}</span>
                      <ChevronDown size={16} className={`text-primary transition-transform ${showSort ? 'rotate-180' : ''}`} />
                    </button>
                    {showSort && (
                      <div className="absolute right-0 top-full mt-2 w-full bg-white border border-surface_container rounded-2xl shadow-xl z-50 overflow-hidden">
                        {[t('catalog.sort_newest', 'Newest Arrivals'), t('catalog.sort_low_high', 'Price: Low to High'), t('catalog.sort_high_low', 'Price: High to Low')].map(option => (
                          <button key={option} onClick={() => { setSortBy(option); setShowSort(false); setCurrentPage(1); }} className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors hover:bg-primary/5 ${sortBy === option ? 'text-primary' : 'text-on_surface_variant'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} {...product} title={product.title || product.productName} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-[40px] border border-surface_container shadow-sm">
                  <Search size={48} className="mx-auto text-on_surface_variant/20 mb-6" />
                  <h3 className="text-2xl font-black text-on_surface uppercase">{t('catalog.empty', 'No treats found')}</h3>
                  <button onClick={clearFilters} className="mt-8 px-10 py-4 bg-primary text-white font-black rounded-full shadow-lg hover:scale-105 transition-all">
                    {t('catalog.clear_filters', 'Clear All Filters')}
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductCatalog;
