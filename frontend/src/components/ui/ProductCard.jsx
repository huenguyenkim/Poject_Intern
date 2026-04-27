import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { Heart, ShoppingCart as CartIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '../../utils/toastUtils';
import Card from './Card';
import PureBadge from './PureBadge';
import Button from './Button';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * Component ProductCard hiển thị thông tin tóm tắt của một sản phẩm.
 */
const ProductCard = ({ id, title, price, originalPrice, image, colorPlaceholder = 'bg-surface_dim', tag, description, category }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : typeof price === 'number' ? price : 0;
  const numOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.-]+/g, "")) : typeof originalPrice === 'number' ? originalPrice : null;

  const isSale = numOriginalPrice && numOriginalPrice > numPrice;
  const discountPercent = isSale ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : 0;
  
  const displayTag = isSale ? `SALE -${discountPercent}%` : tag;
  const tagVariant = isSale ? 'error' : (tag === 'NEW' ? 'tertiary' : 'primary');

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({ id, title, price: numPrice, image, colorPlaceholder, quantity: 1 }));
    showSuccessToast(t('cart.added_toast', { title }));
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const displayImage = image || (typeof colorPlaceholder === 'string' && colorPlaceholder.startsWith('/') ? colorPlaceholder : null);

  return (
    <Card className="group flex flex-col h-full relative">
      <LocalizedLink to={`/shop/${id}`} className="block relative" aria-label={`View details for ${title}`}>
        <div
          className={`aspect-square w-full ${!displayImage ? colorPlaceholder : ''} rounded-[28px] relative flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-[1.03] shadow-inner overflow-hidden m-2 mb-0`}
          role="img"
          aria-label={title}
        >
          {displayImage ? (
            <img src={displayImage} alt={title} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <span className="text-surface_dim/20 font-black text-4xl opacity-10 select-none" aria-hidden="true">CANDY</span>
          )}

          {/* Tag overlay */}
          {displayTag && (
            <PureBadge
              variant={tagVariant}
              className={`absolute top-4 left-4 z-10 shadow-md ${isSale ? 'bg-error text-white border-error ring-error' : ''}`}
            >
              {displayTag}
            </PureBadge>
          )}

          {/* Heart overlay */}
          <Button
            onClick={toggleWishlist}
            variant={isWishlisted ? 'primary' : 'ghost'}
            size="sm"
            className={`absolute top-4 right-4 z-10 w-10 h-10 !p-0 rounded-full shadow-lg transition-all ${isWishlisted ? 'scale-110' : 'bg-white/80 backdrop-blur-sm hover:scale-110'}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={24} className={isWishlisted ? "fill-current" : ""} />
          </Button>
        </div>
      </LocalizedLink>

      <div className="p-6 pt-2 flex flex-col flex-grow bg-white relative">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1 opacity-80">
          {category || 'Candy'}
        </span>

        <LocalizedLink to={`/shop/${id}`} className="mb-1">
          <h3 className="font-black text-xl text-on_surface leading-tight hover:text-secondary transition-colors line-clamp-1">{title}</h3>
        </LocalizedLink>

        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span className={isSale ? "text-error font-black text-lg" : "text-secondary font-black text-lg"}>
              ${numPrice.toFixed(2)}
            </span>
            {isSale && (
              <span className="text-on_surface_variant/50 font-bold text-sm line-through">
                ${numOriginalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAdd}
            variant="primary"
            size="sm"
            className="w-10 h-10 !p-0 rounded-full shadow-lg shadow-primary/20"
            aria-label="Add to cart"
          >
            <CartIcon size={24} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
