import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '../navigation/LocalizedLink';
import PureBadge from '../ui/PureBadge';

/**
 * BentoProductCard: A premium card designed for bento-grid layouts.
 */
const BentoProductCard = ({ 
  id, 
  productName, 
  title,
  price, 
  imageUrl, 
  image,
  description, 
  tag, 
  isLarge = false,
  onQuickView,
  className = ''
}) => {
  const { t } = useTranslation();
  const displayTitle = productName || title;
  const displayImage = imageUrl || image;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group rounded-[32px] overflow-hidden bg-surface_dim shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col z-0 w-full ${
        isLarge ? 'h-full min-h-[400px] md:min-h-[600px]' : 'aspect-square md:aspect-auto'
      } ${className}`}
    >
      {/* Background Image */}
      <img
        src={displayImage}
        alt={displayTitle}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
      />

      {/* Full-Height Safety Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="space-y-3">
          {(tag || t('home.fresh_badge')) && (
            <PureBadge variant="tertiary" className="bg-white/20 backdrop-blur-md text-white border-transparent text-[10px] tracking-[0.15em] mb-2 font-black uppercase">
              {tag || t('home.fresh_badge')}
            </PureBadge>
          )}

          <h3 className={`font-black text-white leading-tight tracking-tight ${
            isLarge ? 'text-5xl md:text-7xl mb-4' : 'text-xl md:text-2xl'
          } line-clamp-1`}>
            {displayTitle}
          </h3>

          <p className={`text-white/80 font-medium leading-relaxed max-w-md ${
            isLarge ? 'text-lg md:text-xl' : 'text-sm'
          } line-clamp-2`}>
            {description}
          </p>

          <div className="pt-6 flex items-center justify-between gap-4">
            <span className="text-white font-black text-2xl">
              ${parseFloat(price).toFixed(2)}
            </span>

            {/* Explore Flavor Button */}
            <div className="relative z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView && onQuickView();
                }}
                className={`rounded-full font-black px-8 py-3 shadow-xl transform transition-all active:scale-95 bg-white text-candy-blue hover:bg-white/90 ${
                  isLarge ? 'text-lg h-14' : 'text-sm h-11'
                }`}
              >
                {t('home.explore_flavor')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Card Link (Total Area Navigation to Detail) */}
      <LocalizedLink 
        to={`/shop/${id}`} 
        className="absolute inset-0 z-[5]" 
        aria-label={`View details for ${displayTitle}`}
      />
    </motion.div>
  );
};

export default BentoProductCard;
