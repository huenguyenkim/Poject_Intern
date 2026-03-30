import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart as CartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

/**
 * Component ProductCard hiển thị thông tin tóm tắt của một sản phẩm.
 * Bao gồm hình ảnh, tên, giá, danh mục và các nút hành động (thêm vào giỏ, yêu thích).
 * 
 * @param {Object} props - Các thuộc tính của sản phẩm.
 * @param {string} props.id - ID duy nhất của sản phẩm.
 * @param {string} props.title - Tên sản phẩm.
 * @param {number|string} props.price - Giá sản phẩm.
 * @param {string} [props.imagePlaceholder='bg-surface_dim'] - Hình ảnh hoặc màu nền thay thế.
 * @param {string} [props.tag] - Nhãn đặc biệt (ví dụ: 'NEW', 'SALE').
 * @param {string} [props.description] - Mô tả ngắn gọn về sản phẩm.
 * @param {string} [props.category] - Danh mục của sản phẩm.
 * @returns {JSX.Element} Component ProductCard đã được định dạng.
 */
const ProductCard = ({ id, title, price, imagePlaceholder = 'bg-surface_dim', tag, description, category }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  const handleAdd = (e) => {
    e.preventDefault();
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
    addToCart({ id, title, price: numPrice, imagePlaceholder });
    toast.success(`${title} added to cart!`, {
      icon: '🧁',
      className: 'rounded-[20px] bg-on_surface text-on_primary font-bold text-[14px] px-6 py-4 shadow-xl shadow-on_surface/20',
    });
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="group flex flex-col h-full relative">
      <Link to={`/shop/${id}`} className="block relative">
        <div className={`aspect-square w-full ${imagePlaceholder.startsWith('/') ? '' : imagePlaceholder} rounded-[28px] relative flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-[1.03] shadow-inner overflow-hidden m-2 mb-0`}>
           {imagePlaceholder.startsWith('/') ? (
             <img src={imagePlaceholder} alt={title} className="w-full h-full object-cover" />
           ) : (
             <span className="text-surface_dim/20 font-black text-4xl opacity-10 select-none">CANDY</span>
           )}
           
           {/* Tag overlay */}
           {tag && (
             <Badge 
               variant={tag === 'NEW' ? 'tertiary' : 'primary'}
               className="absolute top-4 left-4 z-10 shadow-md"
             >
               {tag}
             </Badge>
           )}

           {/* Heart overlay */}
           <Button 
             onClick={toggleWishlist}
             variant={isWishlisted ? 'primary' : 'ghost'}
             size="sm"
             className={`absolute top-4 right-4 z-10 w-10 h-10 p-0 rounded-full shadow-lg transition-all ${isWishlisted ? 'scale-110' : 'bg-white/80 backdrop-blur-sm hover:scale-110'}`}
             aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
           >
             <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
           </Button>
        </div>
      </Link>
      
      <div className="p-6 pt-2 flex flex-col flex-grow bg-white relative">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1 opacity-80">
          {category || 'Candy'}
        </span>
        
        <Link to={`/shop/${id}`} className="mb-1">
          <h3 className="font-black text-xl text-on_surface leading-tight hover:text-secondary transition-colors line-clamp-1">{title}</h3>
        </Link>
        
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="text-secondary font-black text-lg">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
          
          <Button 
            onClick={handleAdd} 
            variant="primary"
            size="sm"
            className="w-10 h-10 p-0 rounded-full shadow-lg shadow-primary/20"
            aria-label="Add to cart"
          >
            <CartIcon size={18} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
