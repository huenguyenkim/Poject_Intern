import React from 'react';
import { useSelector } from 'react-redux';

import Hero from '../../components/home/Hero';
import HomeCategories from '../../components/home/HomeCategories';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import FreshArrivals from '../../components/home/FreshArrivals';

const StorefrontHome = () => {
  const { products, categories, banners, status } = useSelector((state) => state.catalog);
  
  if (status === 'loading' && products.length === 0) {
    return <div className="min-h-screen animate-pulse bg-surface_dim" />;
  }

  // 1. Process Banners
  const activeBanners = [...banners]
    .filter(b => b.tag === 'ACTIVE' || b.isActive)
    .sort((a, b) => (b.priority || b.id || 0) - (a.priority || a.id || 0));

  // 2. Process Categories
  const parentCategories = categories;

  // 3. Process Products
  const featured = products.slice(0, 8);
  const newProducts = [...products].reverse().slice(0, 8);

  return (
    <div className="pb-16 overflow-hidden max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8">
      <Hero activeBanners={activeBanners} />
      <HomeCategories categories={parentCategories} />
      <FeaturedProducts featured={featured} />
      <FreshArrivals newProducts={newProducts} />
    </div>
  );
};

export default StorefrontHome;
