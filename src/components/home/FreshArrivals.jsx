import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Component FreshArrivals hiển thị các sản phẩm mới nhất với bố cục lưới (grid) tùy chỉnh.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {Function} props.onAddToCart - Hàm xử lý khi người dùng nhấn nút thêm vào giỏ hàng.
 * @returns {JSX.Element} Component FreshArrivals đã được định dạng.
 */
const FreshArrivals = ({ onAddToCart }) => {
  return (
    <section className="mb-24">
      <div className="flex items-center mb-10 gap-6">
        <h2 className="text-4xl font-black text-on_surface tracking-tight whitespace-nowrap">Fresh Out the Oven</h2>
        <div className="h-[3px] bg-primary/10 flex-grow rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
        {/* Large Left Card */}
        <div className="lg:col-span-2 bg-surface_container_highest rounded-[32px] relative overflow-hidden shadow-sm min-h-[400px] group">
           {/* Background Image */}
           <img 
             src="/images/donuts-clean.png" 
             alt="Donut Tower" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-on_surface/60 via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end">
              <div>
                <h4 className="text-3xl md:text-4xl font-black text-on_primary mb-1">Rainbow Stack Donuts</h4>
                <p className="text-on_primary/80 font-medium text-lg">$15.50</p>
              </div>
              <Button 
                onClick={() => onAddToCart('8', 'Rainbow Stack Donuts', 15.50, '/images/donuts-clean.png')}
                variant="primary"
                className="w-14 h-14 p-0 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all"
              >
                <ShoppingCart size={24} strokeWidth={3} />
              </Button>
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
            <div className="absolute inset-0 bg-gradient-to-t from-on_surface/80 via-transparent to-transparent"></div>
            <div className="relative z-10 flex justify-between items-end text-on_primary">
              <div>
                <h4 className="text-2xl font-black mb-1">Salted Caramel Silk</h4>
                <p className="text-on_primary/80 font-medium text-sm">$12.99</p>
              </div>
              <Button 
                onClick={() => onAddToCart('9', 'Salted Caramel Silk', 12.99, '/images/salted-caramel.png')}
                variant="primary"
                className="w-10 h-10 p-0 rounded-full shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
              >
                <ShoppingCart size={18} strokeWidth={3} />
              </Button>
            </div>
          </div>
          
          {/* Bottom Card */}
          <div className="flex-1 bg-surface_container_highest rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-end shadow-sm min-h-[240px] group">
            <img 
              src="/images/sour-strips.png" 
              alt="Neon Sour Strips" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on_surface/80 via-transparent to-transparent"></div>
            <div className="relative z-10 flex justify-between items-end text-on_primary">
              <div>
                <h4 className="text-2xl font-black mb-1">Neon Sour Strips</h4>
                <p className="text-on_primary/80 font-medium text-sm">$9.50</p>
              </div>
              <Button 
                onClick={() => onAddToCart('10', 'Neon Sour Strips', 9.50, '/images/sour-strips.png')}
                variant="primary"
                className="w-10 h-10 p-0 rounded-full shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
              >
                <ShoppingCart size={18} strokeWidth={3} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshArrivals;
