import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart as CartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ id, title, price, imagePlaceholder = 'bg-surface_dim', tag, description, category }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  const handleAdd = (e) => {
    e.preventDefault();
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
    addToCart({ id, title, price: numPrice, imagePlaceholder });
    toast.success(`${title} added to cart!`, {
      icon: '🧁',
      style: {
        borderRadius: '20px',
        background: '#2d2a4a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '14px',
      },
    });
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
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
           <button 
             onClick={toggleWishlist}
             className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isWishlisted ? 'bg-primary text-white scale-110' : 'bg-white text-primary hover:scale-110'}`}
             aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
           >
             <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
           </button>
        </div>
      </Link>
      
      <div className="p-6 pt-2 flex flex-col flex-grow bg-white relative">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1 opacity-80">
          {category || 'Candy'}
        </span>
        
        <Link to={`/shop/${id}`} className="mb-1">
          <h3 className="font-black text-xl text-[#2d2a4a] leading-tight hover:text-secondary transition-colors line-clamp-1">{title}</h3>
        </Link>
        
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="text-secondary font-black text-lg">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
          
          <button 
            onClick={handleAdd} 
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
            aria-label="Add to cart"
          >
            <CartIcon size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
