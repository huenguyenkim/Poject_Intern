import React from 'react';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * Component HomeCategories hiển thị danh sách các danh mục nổi bật trên trang chủ.
 */
const HomeCategories = ({ categories = [] }) => {
  const { t } = useTranslation();
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mb-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-on_surface mb-2 tracking-tight">{t('home.categories_title')}</h2>
          <p className="text-on_surface_variant text-lg font-medium">{t('home.categories_subtitle')}</p>
        </div>
        <LocalizedLink to="/shop" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/70 focus:outline-none transition-colors group text-sm">
          {t('home.all_categories')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0, 5).map((cat) => (
          <LocalizedLink 
            key={cat.id} 
            to={`/shop?category=${cat.id}`}
            className="bg-white border border-surface_container hover:border-primary/50 rounded-[32px] p-2 flex flex-col items-center gap-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-[220px] overflow-hidden"
          >
            <div className="w-full h-32 rounded-[24px] overflow-hidden bg-surface_dim relative">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <PackageOpen size={32} />
                </div>
              )}
            </div>
            <h3 className="font-black text-center text-xs uppercase tracking-[0.2em] text-on_surface group-hover:text-primary transition-colors line-clamp-2 px-2">
              {cat.name}
            </h3>
          </LocalizedLink>
        ))}

        {/* View All card */}
        <LocalizedLink 
          to="/shop"
          className="bg-primary border border-primary/20 hover:border-primary/50 rounded-[32px] p-2 flex flex-col items-center gap-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 h-[220px] overflow-hidden"
        >
          <div className="w-full h-32 rounded-[24px] overflow-hidden bg-white/10 flex items-center justify-center text-white relative">
            <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform duration-500" strokeWidth={3} />
          </div>
          <h3 className="font-black text-center text-xs uppercase tracking-[0.2em] text-white transition-colors px-2">
            {t('home.view_all')}
          </h3>
        </LocalizedLink>
      </div>
    </section>
  );
};

export default HomeCategories;
