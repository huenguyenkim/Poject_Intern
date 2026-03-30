import React from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { showSuccessToast } from '../utils/toastUtils';

import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FreshArrivals from '../components/home/FreshArrivals';

const StorefrontHome = () => {
  const { products } = useStore();
  const { addToCart } = useCart();
  
  // Just grab first 4 products for featured
  const featured = products.slice(0, 4);

  const handleAddToCart = (id, title, price, imagePlaceholder) => {
    addToCart({ id, title, price, imagePlaceholder });
    showSuccessToast(`${title} added to cart!`);
  };

  return (
    <div className="pb-16 overflow-hidden max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8">
      <Hero />
      <FeaturedProducts featured={featured} />
      <FreshArrivals onAddToCart={handleAddToCart} />
    </div>
  );
};
export default StorefrontHome;
