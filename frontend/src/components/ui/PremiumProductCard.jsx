import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { showSuccessToast } from '../../utils/toastUtils';
import Button from './Button';
import PureBadge from './PureBadge';

/**
 * PremiumProductCard: High-aesthetic card matching Screenshot 2.
 * Features a white background, pink pricing, and lavender call-to-action.
 */
const PremiumProductCard = ({ 
  id, 
  title, 
  productName, // Support both naming schemes
  price, 
  image, 
  imageUrl, 
  tag, 
  description, 
  category 
}) => {
  const dispatch = useDispatch();
  const displayTitle = productName || title;
  const displayImage = imageUrl || image;

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({ id, title: displayTitle, price, image: displayImage, quantity: 1 }));
    showSuccessToast(`Sweet! ${displayTitle} added to cart. 🍬`);
  };

  const tagColor = tag === 'NEW' ? 'bg-candy-pink' : 'bg-candy-blue';

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-[40px] p-2 flex flex-col h-full shadow-lg shadow-on_surface/5 border border-surface_container"
    >
      <Link to={`/shop/${id}`} className="block relative group">
        <div className="aspect-square w-full rounded-[32px] overflow-hidden bg-surface_container_low relative">
          <img 
            src={displayImage} 
            alt={displayTitle} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {tag && (
            <div className={`absolute top-4 left-4 ${tagColor} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg`}>
              {tag}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 pt-5 flex flex-col flex-grow">
        <h3 className="font-black text-xl text-on_surface mb-1 line-clamp-1 hover:text-primary transition-colors cursor-pointer">
          <Link to={`/shop/${id}`}>{displayTitle}</Link>
        </h3>
        
        <div className="text-candy-pink font-black text-xl mb-2">
          ${parseFloat(price).toFixed(2)}
        </div>
        
        <p className="text-on_surface_variant/60 text-sm font-medium line-clamp-2 mb-6">
          {description || `Premium handcrafted ${category || 'confection'} for your sweet tooth.`}
        </p>

        <div className="mt-auto">
          <Button
            onClick={handleAdd}
            className="w-full rounded-full bg-lavender-mist hover:bg-lavender-mist/80 text-lavender-deep font-black h-12 transition-all active:scale-95 shadow-sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumProductCard;
