import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PremiumProductCard from '../ui/PremiumProductCard';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * FeaturedProducts: Premium section matching Screenshot 2.
 */
const FeaturedProducts = ({ featured = [] }) => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 bg-surface_dim">
      <div className="container-custom px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-on_surface mb-2 md:mb-3 tracking-tight uppercase">
              {t('home.featured_title')}
            </h2>
            <p className="text-on_surface_variant/60 text-base md:text-xl font-medium">
              {t('home.featured_subtitle')}
            </p>
          </div>
          <LocalizedLink 
            to="/shop" 
            className="flex items-center gap-2 text-candy-pink font-black hover:opacity-80 transition-opacity text-sm md:text-base group"
          >
            {t('home.view_all')} <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </LocalizedLink>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {featured.slice(0, 4).map((product) => (
            <PremiumProductCard 
              key={`featured-${product.id}`} 
              {...product} 
              tag={product.productName?.toLowerCase().includes('gold') || product.title?.toLowerCase().includes('gold') ? 'BESTSELLER' : 'NEW'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
