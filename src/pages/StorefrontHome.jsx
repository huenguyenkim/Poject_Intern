import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';

const StorefrontHome = () => {
  const { products, banners } = useStore();
  
  // Just grab first 4 products for featured
  const featured = products.slice(0, 4);

  return (
    <div className="pb-16 overflow-hidden max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <section className="mt-4 md:mt-8 mb-12 md:mb-20 bg-gradient-to-r from-[#f8a2d1] to-[#e6e0f8] rounded-[32px] md:rounded-[40px] relative overflow-hidden flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-8 md:p-20 z-10 text-center md:text-left">
          <span className="inline-block mb-4 md:mb-6 py-1.5 px-4 rounded-full bg-white/30 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
            LIMITED OFFER
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight md:leading-[1.05] tracking-tight mb-6 md:mb-8 drop-shadow-sm">
            SWEET<br className="hidden md:block"/> SUMMER<br className="hidden md:block"/> SAVINGS
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-sm mx-auto md:mx-0 leading-relaxed mb-8 md:mb-10 font-medium">
            Indulge in our new artisanal gummy collection. Get up to 40% off on all fruity delights this week!
          </p>
          <Link to="/shop" className="inline-block">
            <button className="bg-white text-primary font-bold text-sm tracking-wide px-8 py-4 rounded-full flex items-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all mx-auto md:mx-0">
              SHOP COLLECTION <ArrowRight size={18} />
            </button>
          </Link>
        </div>
        
        {/* Hero Right Image */}
        <div className="md:w-1/2 flex justify-center items-center p-8 md:p-0 relative z-10 w-full">
           <div className="w-full max-w-[320px] md:max-w-[450px] aspect-square bg-[#fbcfe8] rounded-[28px] md:rounded-[32px] overflow-hidden shadow-xl border-4 border-white/20 relative flex items-center justify-center group">
             <img src="/images/gummy-hero.png" alt="Candy Assortment" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
           </div>
        </div>
      </section>

      {/* Featured Favorites */}
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
                idx === 3 ? '/images/jellybeans-featured.png' :
                undefined
              }
            />
          ))}
        </div>
      </section>

      {/* Fresh Out the Oven */}
      <section className="mb-24">
        <div className="flex items-center mb-10 gap-6">
          <h2 className="text-4xl font-black text-on_surface tracking-tight whitespace-nowrap">Fresh Out the Oven</h2>
          <div className="h-[3px] bg-primary/10 flex-grow rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
          {/* Large Left Card */}
          <div className="lg:col-span-2 bg-surface_container_highest rounded-[32px] relative overflow-hidden flex flex-col justify-end text-white shadow-sm min-h-[400px] group">
             {/* Background Image */}
             <img 
               src="/images/donuts-clean.png" 
               alt="Donut Tower" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             {/* Gradient Overlay for Text Readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
             
             <div className="relative z-10 p-10 w-full md:w-3/4">
               <span className="inline-block mb-4 py-1 px-3 rounded-full bg-white text-primary font-bold text-[10px] uppercase tracking-wider shadow-sm">
                 FRESH RELEASE
               </span>
               <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">The Glaze Galaxy</h3>
               <p className="text-lg text-white/90 mb-8 max-w-md font-medium leading-relaxed">
                 A cosmic assortment of our finest glazed donuts with limited-edition space sprinkles.
               </p>
               <button className="bg-white text-primary px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:-translate-y-1 transition-all w-fit">
                 Explore Flavor
               </button>
             </div>
          </div>

          {/* Right Smaller Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Top Card */}
            <div className="flex-1 bg-surface_container_highest rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-end shadow-sm min-h-[240px] group">
              <img 
                src="/images/salted-caramel.png" 
                alt="Salted Caramel Silk" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="relative z-10 text-white">
                <h4 className="text-2xl font-black mb-1">Salted Caramel Silk</h4>
                <p className="text-white/80 font-medium text-sm">$12.99</p>
              </div>
            </div>
            
            {/* Bottom Card */}
            <div className="flex-1 bg-surface_container_highest rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-end shadow-sm min-h-[240px] group">
              <img 
                src="/images/sour-strips.png" 
                alt="Neon Sour Strips" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="relative z-10 text-white">
                <h4 className="text-2xl font-black mb-1">Neon Sour Strips</h4>
                <p className="text-white/80 font-medium text-sm">$9.50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StorefrontHome;
