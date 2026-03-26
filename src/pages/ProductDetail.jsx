import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on_surface_variant hover:text-primary transition-colors font-bold mb-8">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-surface_container_lowest p-8 md:p-12 rounded-[32px] shadow-sm">
        {/* Image */}
        <div className={`md:w-1/2 h-[400px] md:h-[500px] ${product.imagePlaceholder} rounded-3xl flex items-center justify-center`}>
          <span className="text-on_surface_variant opacity-50 font-bold block">No Image</span>
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <span className="inline-block mb-3 py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider w-fit">
            {product.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-on_surface mb-4">{product.title}</h1>
          <p className="text-3xl font-black text-primary mb-6">${product.price.toFixed(2)}</p>
          
          <p className="text-lg text-on_surface_variant mb-8 leading-relaxed">
            {product.description || 'A delicious treat perfect for any occasion! Treat yourself or a loved one to this sweet delight.'}
          </p>

          <div className="flex items-center gap-6 mb-8">
             <div className="flex items-center bg-surface_container rounded-full p-1 border-2 border-surface_container">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface_container_high text-on_surface text-xl font-bold transition-colors">-</button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface_container_high text-on_surface text-xl font-bold transition-colors">+</button>
             </div>
             <p className="text-on_surface_variant font-medium text-sm">In stock and ready to ship!</p>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" onClick={handleAddToCart} className="flex-1 py-4 text-lg shadow-tinted-primary flex justify-center gap-2 hover:-translate-y-1">
              <ShoppingBag /> Add to Cart
            </Button>
            <Button variant="outline" onClick={() => { handleAddToCart(); navigate('/checkout'); }} className="flex-1 py-4 text-lg border-2 border-primary text-primary hover:bg-primary/5">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
