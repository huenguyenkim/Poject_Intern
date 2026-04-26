import React, { useState } from 'react';
import BentoProductCard from './BentoProductCard';
import QuickViewModal from './QuickViewModal';
import apiClient from '../../api/apiClient';

/**
 * FreshArrivals: Premium Bento Grid section for latest products.
 * Implements high-aesthetics layout with forensic logging support.
 */
const FreshArrivals = ({ newProducts = [] }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Take the latest 3 products for the Bento layout
  const bentoProducts = newProducts.slice(0, 3);
  
  const handleQuickView = async (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    
    // Forensic Analytics: Log "VIEW_QUICK_DETAIL"
    try {
      await apiClient.post('/audit/log', {
        actionType: 'VIEW_QUICK_DETAIL',
        recordId: product.id,
        tableName: 'products',
        userId: 0 // Anonymous or Guest
      });
      console.log(`[Analytics] Logged Quick View for product: ${product.id}`);
    } catch (err) {
      console.warn('[Analytics] Failed to log Quick View:', err.message);
    }
  };

  return (
    <section className="py-24 bg-surface_container_lowest overflow-hidden">
      <div className="container-custom">
        {/* Section Header with Premium Gradient Line */}
        <div className="flex items-center gap-6 mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-black text-on_surface tracking-tight whitespace-nowrap">
            Fresh Out the Oven
          </h2>
          <div className="flex-1 h-[6px] bg-candy-pink rounded-full opacity-100 mt-2"></div>
        </div>

        {/* Bento Grid Layout (1 Large, 2 Small) */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-4">
          <div className="md:w-[60%] flex text-left">
            {bentoProducts[0] && (
              <BentoProductCard
                {...bentoProducts[0]}
                isLarge={true}
                onQuickView={() => handleQuickView(bentoProducts[0])}
              />
            )}
          </div>
          <div className="md:w-[40%] flex flex-col gap-6 md:gap-8 justify-between text-left h-full">
            {bentoProducts[1] && (
              <BentoProductCard
                {...bentoProducts[1]}
                isLarge={false}
                onQuickView={() => handleQuickView(bentoProducts[1])}
                className="flex-1 min-h-[300px]"
              />
            )}
            {bentoProducts[2] && (
              <BentoProductCard
                {...bentoProducts[2]}
                isLarge={false}
                onQuickView={() => handleQuickView(bentoProducts[2])}
                className="flex-1 min-h-[300px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Global Quick View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
};

export default FreshArrivals;
