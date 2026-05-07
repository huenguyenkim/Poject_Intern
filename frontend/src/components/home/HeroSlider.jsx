import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LocalizedLink from '../navigation/LocalizedLink';
import { trackBannerClickThunk, trackBannerImpressionThunk } from '../../store/catalogSlice';

const HeroSlider = ({ banners = [] }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = banners.length > 0 ? banners : [
    {
      id: 'default',
      title: t('home.hero_title'),
      description: t('home.hero_desc'),
      imagePc: "/images/gummy-hero.png",
      imageMobile: "/images/gummy-hero.png",
      link: "/shop"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-rotation
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered, slides.length]);

  // Impression Tracking
  useEffect(() => {
    const currentBanner = slides[currentIndex];
    if (currentBanner && currentBanner.id !== 'default') {
      dispatch(trackBannerImpressionThunk(currentBanner.id));
    }
  }, [currentIndex, slides, dispatch]);

  const handleBannerClick = (id) => {
    if (id !== 'default') {
      dispatch(trackBannerClickThunk(id));
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] rounded-[40px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Responsive Handling */}
          <picture>
            <source media="(max-width: 768px)" srcSet={currentSlide.imageMobile || currentSlide.imagePc} />
            <img 
              src={currentSlide.imagePc} 
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 py-1.5 px-4 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              {currentSlide.id === 'default' ? t('home.hero_badge_limited') : (currentSlide.tag || t('home.hero_badge_campaign'))}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter mb-6"
            >
              {currentSlide.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-10 font-medium"
            >
              {currentSlide.description || t('home.hero_desc')}
            </motion.p>

            {currentSlide.link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <LocalizedLink 
                  to={currentSlide.link} 
                  onClick={() => handleBannerClick(currentSlide.id)}
                >
                  <button className="bg-white text-primary hover:bg-primary hover:text-white font-black px-10 py-5 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl uppercase text-sm tracking-widest">
                    {t('home.hero_cta')} <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </LocalizedLink>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-10 flex justify-between px-10 items-center z-20">
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-primary' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
