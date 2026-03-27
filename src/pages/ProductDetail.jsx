import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Star, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-black mb-4">Product Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++){
       addToCart(product);
    }
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  return (
    <div className="bg-[#fffaff] min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-on_surface_variant/60 mb-8 overflow-hidden whitespace-nowrap">
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-secondary font-bold truncate">{product.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Left: Image Gallery */}
          <div className="lg:w-[550px] flex-shrink-0">
             <div className="relative group aspect-square rounded-[40px] overflow-hidden bg-white border border-surface_container_high shadow-xl shadow-primary/5 mb-6">
                <img 
                  src={product.imagePlaceholder} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.tag && (
                  <span className="absolute top-6 left-6 z-10 font-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full bg-secondary text-white shadow-xl shadow-secondary/20">
                    {product.tag}
                  </span>
                )}
             </div>
             
          </div>

          {/* Right: Product Details */}
          <div className="flex-grow flex flex-col pt-4">
            <h1 className="text-5xl md:text-6xl font-black text-[#2d2a4a] mb-6 leading-[1.1] tracking-tight">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="flex text-primary items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.round(product.rating || 5) ? "currentColor" : "none"} strokeWidth={2.5} />
                  ))}
               </div>
               <span className="text-sm font-bold text-on_surface_variant/60">({product.reviewCount || 128} Reviews)</span>
            </div>

            <p className="text-5xl font-black text-primary mb-8 leading-none">${product.price.toFixed(2)}</p>
            
            <p className="text-lg text-on_surface_variant mb-10 leading-relaxed font-medium">
              {product.description || 'A burst of citrus and berry flavors that pop in your mouth! Perfect for parties, movie nights, or a mid-day sugar rush.'}
            </p>

            {/* Characteristic Tags */}
            <div className="flex flex-wrap gap-3 mb-12">
               {['Gluten Free', 'Fat Free', 'Real Fruit'].map(tag => (
                  <span key={tag} className={`px-5 py-2 rounded-full font-black text-[11px] uppercase tracking-wider border transition-colors ${tag === 'Gluten Free' ? 'bg-[#f0f9ff] text-[#0ea5e9] border-[#bae6fd]' : tag === 'Fat Free' ? 'bg-[#f0fdf4] text-[#22c55e] border-[#bbf7d0]' : 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]'}`}>
                    {tag}
                  </span>
               ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-8 mb-12">
               <span className="font-black text-lg text-[#2d2a4a]">Quantity</span>
               <div className="flex items-center bg-surface_container_high rounded-full p-1 border-2 border-surface_container_high">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-on_surface text-2xl font-black transition-all"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-xl text-on_surface">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 text-2xl font-black transition-all"
                  >
                    +
                  </button>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <Button 
                variant="primary" 
                onClick={handleAddToCart} 
                className="flex-[1.2] py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 flex justify-center items-center gap-3 active:scale-95"
              >
                <ShoppingBag /> Add to Cart
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { handleAddToCart(); navigate('/checkout'); }} 
                className="flex-1 py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 flex justify-center items-center gap-3 active:scale-95"
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white/50 p-6 rounded-[32px] flex items-center gap-5 border border-white hover:border-secondary/20 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <Truck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#2d2a4a] leading-tight">Fast Delivery</h4>
                    <p className="text-[11px] font-bold text-on_surface_variant/60 uppercase tracking-widest mt-1">2-3 Business Days</p>
                  </div>
               </div>
               <div className="bg-white/50 p-6 rounded-[32px] flex items-center gap-5 border border-white hover:border-secondary/20 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                     <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#2d2a4a] leading-tight">Sugar High Guarantee</h4>
                    <p className="text-[11px] font-bold text-on_surface_variant/60 uppercase tracking-widest mt-1">100% Satisfaction</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
