import React from 'react';
import { useSelector } from 'react-redux';
import HeroSlider from '../../components/home/HeroSlider';
import HomeCategories from '../../components/home/HomeCategories';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import FreshArrivals from '../../components/home/FreshArrivals';
import SEO from '../../components/seo/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../../components/layout/PageTransition';

const StorefrontHome = () => {
  const { t } = useTranslation();
  const { products, categories, banners, status } = useSelector((state) => state.catalog);
  
  if (status === 'loading' && products.length === 0) {
    return <div className="min-h-screen animate-pulse bg-surface_dim" />;
  }

  const activeBanners = [...banners]
    .filter(b => b.isActive)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  // Additional scheduling filter
  const now = new Date();
  const scheduledBanners = activeBanners.filter(b => {
    const startOk = !b.startDate || new Date(b.startDate) <= now;
    const endOk = !b.endDate || new Date(b.endDate) >= now;
    return startOk && endOk;
  });

  const parentCategories = categories;
  const featured = products.slice(0, 8);
  const newProducts = [...products].reverse().slice(0, 8);

  return (
    <PageTransition>
      <div className="pb-16 overflow-hidden max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-20">
        <SEO 
          title={t('home.seo_title', 'Candy Shop - Premium Gummy & Chocolate')}
          description={t('home.seo_desc', 'Discover our collection of handmade gummies and premium chocolates. Sweetness delivered to your door.')}
        />
        <HeroSlider banners={scheduledBanners} />
        <HomeCategories categories={parentCategories} />
        <FeaturedProducts featured={featured} />
        <FreshArrivals newProducts={newProducts} />
      </div>
    </PageTransition>
  );
};

export default StorefrontHome;
