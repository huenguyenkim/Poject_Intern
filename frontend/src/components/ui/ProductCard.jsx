import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '../../utils/toastUtils';
import Card from './Card';
import PureBadge from './PureBadge';
import Button from './Button';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * Component ProductCard hiển thị thông tin tóm tắt của một sản phẩm.
 */
const ProductCard = ({ id, title, price, salePrice: propSalePrice, originalPrice, stock = 10, image, colorPlaceholder = 'bg-surface_dim', tag, description, category, isPurchased = false, isInCart = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  // Logic: Nếu có salePrice từ backend, đó là giá hiện tại, price là giá gốc
  const numCurrentPrice = propSalePrice ? parseFloat(propSalePrice.toString()) : (typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : (Number(price) || 0));
  const numOriginalPrice = propSalePrice ? (typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : Number(price)) : (originalPrice ? parseFloat(originalPrice.toString()) : null);

  const isSale = numOriginalPrice && numOriginalPrice > numCurrentPrice;
  const isOutOfStock = Number(stock) <= 0;
  const discountPercent = isSale ? Math.round(((numOriginalPrice - numCurrentPrice) / numOriginalPrice) * 100) : 0;
  
  const displayTag = isOutOfStock ? 'HẾT HÀNG' : (isSale ? `SALE -${discountPercent}%` : tag);
  const tagVariant = isOutOfStock ? 'error' : (isSale ? 'error' : (tag === 'NEW' ? 'tertiary' : 'primary'));

  const handleAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    dispatch(addToCart({ id, title, price: numCurrentPrice, image, colorPlaceholder, quantity: 1 }));
    showSuccessToast(t('cart.added_toast', { title }));
  };


  const displayImage = image || (typeof colorPlaceholder === 'string' && colorPlaceholder.startsWith('/') ? colorPlaceholder : null);

  return (
    <Card className={`group flex flex-col h-full relative border-2 transition-all duration-300 ${isOutOfStock ? 'opacity-75 grayscale-[0.5] border-transparent' : isInCart ? 'border-primary/20 shadow-lg shadow-primary/5' : 'border-transparent'}`}>
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

          {/* Logic Điều kiện: Tag Trạng thái */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {displayTag && (
              <PureBadge
                variant={tagVariant}
                className={`shadow-md ${isSale || isOutOfStock ? 'bg-error text-white border-error ring-error' : ''}`}
              >
                {displayTag}
              </PureBadge>
            )}
            {isPurchased && (
              <PureBadge variant="secondary" className="bg-secondary text-white border-none shadow-md text-[9px] px-2 font-black">
                BẠN ĐÃ MUA
              </PureBadge>
            )}
          </div>


          {/* Logic Điều kiện: Indicator Trong giỏ hàng */}
          {isInCart && (
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="bg-primary text-white p-3 rounded-full shadow-2xl scale-125">
                <CartIcon size={24} strokeWidth={3} />
              </div>
            </div>
          )}
        </div>
      </LocalizedLink>

      <div className="p-6 pt-2 flex flex-col flex-grow bg-white relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-80">
            {category || 'Candy'}
          </span>
          {isInCart && <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full">ĐÃ TRONG GIỎ</span>}
        </div>

        <LocalizedLink to={`/shop/${id}`} className="mb-1">
          <h3 className="font-black text-xl text-on_surface leading-tight hover:text-secondary transition-colors line-clamp-1">{title}</h3>
        </LocalizedLink>

        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={isSale ? "text-error font-black text-lg" : "text-secondary font-black text-lg"}>
                ${numCurrentPrice.toFixed(2)}
              </span>
              {isSale && (
                <span className="text-on_surface_variant/50 font-bold text-sm line-through">
                  ${numOriginalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {stock > 0 && stock < 10 && (
              <span className="text-[10px] font-black text-error/70 uppercase tracking-widest mt-1">Sắp hết hàng!</span>
            )}
          </div>

          <Button
            onClick={handleAdd}
            variant={isOutOfStock ? 'ghost' : isInCart ? 'secondary' : 'primary'}
            size="sm"
            disabled={isOutOfStock}
            className={`w-10 h-10 !p-0 rounded-full shadow-lg transition-all ${isOutOfStock ? 'cursor-not-allowed opacity-50' : isInCart ? 'bg-primary text-white border-none' : 'shadow-primary/20'}`}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            <CartIcon size={24} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
