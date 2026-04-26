import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumProductCard from '../ui/PremiumProductCard';

/**
 * FeaturedProducts: Premium section matching Screenshot 2.
 */
const FeaturedProducts = ({ featured = [] }) => {
  return (
    <section className="py-24 bg-surface_dim">
      <div className="container-custom px-4">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-on_surface mb-3 tracking-tight">
              Featured Favorites
            </h2>
            <p className="text-on_surface_variant/60 text-lg md:text-xl font-medium">
              Handpicked treats just for you
            </p>
          </div>
          <Link 
            to="/shop" 
            className="flex items-center gap-2 text-candy-pink font-black hover:opacity-80 transition-opacity text-sm md:text-base group"
          >
            View All <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
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
