import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart as CartIcon } from 'lucide-react';

const ProductCard = ({ id, title, price, imagePlaceholder = 'bg-surface_dim', tag, description }) => {
  const { addToCart } = useCart();
  
  const handleAdd = (e) => {
    e.preventDefault();
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
    addToCart({ id, title, price: numPrice, imagePlaceholder });
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-surface_container group flex flex-col h-full relative">
      <Link to={`/shop/${id}`} className="block relative">
        <div className={`aspect-square w-full ${imagePlaceholder.startsWith('/') ? '' : imagePlaceholder} rounded-[28px] relative flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-[1.03] shadow-inner overflow-hidden m-2 mb-0`}>
           {imagePlaceholder.startsWith('/') ? (
             <img src={imagePlaceholder} alt={title} className="w-full h-full object-cover" />
           ) : (
             <span className="text-surface_dim/20 font-black text-4xl opacity-10 select-none">CANDY</span>
           )}
           
           {/* Tag overlay */}
           {tag && (
             <span className={`absolute top-4 left-4 z-10 font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md text-white ${tag === 'NEW' ? 'bg-[#2a9cbd]' : 'bg-[#ee4c9e]'}`}>
               {tag}
             </span>
           )}

           {/* Heart overlay */}
           <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-primary hover:scale-110 transition-transform active:scale-95">
             <Heart size={20} className="fill-current" />
           </button>
        </div>
      </Link>
      
      <div className="p-6 pt-5 flex flex-col gap-2 flex-grow bg-white">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/shop/${id}`} className="flex-grow">
            <h3 className="font-bold text-xl text-on_surface leading-tight hover:text-primary transition-colors line-clamp-2">{title}</h3>
          </Link>
          <span className="text-primary font-black text-xl whitespace-nowrap">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
        </div>
        
        {description && (
          <p className="text-on_surface_variant text-sm line-clamp-2 font-medium leading-relaxed mb-2">
            {description}
          </p>
        )}
        
        <button 
          onClick={handleAdd} 
          className="mt-auto w-full py-4 rounded-full bg-primary text-white font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md active:scale-[0.98] mt-2 tracking-widest flex items-center justify-center gap-3 uppercase flex-shrink-0"
        >
          <CartIcon size={18} strokeWidth={3} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
