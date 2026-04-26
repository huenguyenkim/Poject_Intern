import React from 'react';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Component HomeCategories hiển thị danh sách các danh mục nổi bật trên trang chủ.
 * Do backend chưa hỗ trợ hình ảnh/icon cho danh mục, component sẽ sử dụng icon mặc định.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {Array<Object>} props.categories - Danh sách các danh mục cần hiển thị.
 * @returns {JSX.Element} Component HomeCategories đã được định dạng.
 */
const HomeCategories = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mb-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-on_surface mb-2 tracking-tight">Shop by Category</h2>
          <p className="text-on_surface_variant text-lg font-medium">Explore our delicious collections</p>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/70 focus:outline-none transition-colors group text-sm">
          All Categories <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0, 5).map((cat) => (
          <Link 
            key={cat.id} 
            to={`/shop?category=${cat.id}`}
            className="bg-white border border-surface_container hover:border-primary/50 rounded-[32px] p-2 flex flex-col items-center gap-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-[220px] overflow-hidden"
          >
            <div className="w-full h-32 rounded-[24px] overflow-hidden bg-surface_dim relative">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <PackageOpen size={32} />
                </div>
              )}
            </div>
            <h3 className="font-black text-center text-xs uppercase tracking-[0.2em] text-on_surface group-hover:text-primary transition-colors line-clamp-2 px-2">
              {cat.name}
            </h3>
          </Link>
        ))}

        {/* The 6th empty slot filler: View All card matching the aesthetic */}
        <Link 
          to="/shop"
          className="bg-primary border border-primary/20 hover:border-primary/50 rounded-[32px] p-2 flex flex-col items-center gap-4 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 h-[220px] overflow-hidden"
        >
          <div className="w-full h-32 rounded-[24px] overflow-hidden bg-white/10 flex items-center justify-center text-white relative">
            <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform duration-500" strokeWidth={3} />
          </div>
          <h3 className="font-black text-center text-xs uppercase tracking-[0.2em] text-white transition-colors px-2">
            View All
          </h3>
        </Link>
      </div>
    </section>
  );
};

export default HomeCategories;
