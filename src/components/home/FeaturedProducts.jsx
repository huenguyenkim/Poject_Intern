import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';

/**
 * Component FeaturedProducts hiển thị danh sách các sản phẩm nổi bật trên trang chủ.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {Array<Object>} props.featured - Danh sách các sản phẩm nổi bật cần hiển thị.
 * @returns {JSX.Element} Component FeaturedProducts đã được định dạng.
 */
const FeaturedProducts = ({ featured }) => {
  return (
    <section className="mb-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-on_surface mb-2 tracking-tight">Featured Favorites</h2>
          <p className="text-on_surface_variant text-lg font-medium">Handpicked treats just for you</p>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/70 focus:outline-none transition-colors group text-sm">
          View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product, idx) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            tag={
              idx === 1 ? 'BESTSELLER' : 
              idx === 3 ? undefined : // Already in the image
              undefined
            } 
            imagePlaceholder={
              idx === 0 ? '/images/macaron-featured.png' : 
              idx === 1 ? '/images/bestseller.png' : 
              idx === 2 ? '/images/rainbow-swirl-pop.png' :
              idx === 3 ? '/images/magic-jelly-beans-jar.png' :
              product.imagePlaceholder
            }
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
