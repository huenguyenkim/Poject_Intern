import React from 'react';
import { Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, ShoppingBag, Star, ShieldCheck, Heart } from 'lucide-react';
import Button from '../ui/Button';

/**
 * QuickViewModal: Redesigned for a premium, vibrant aesthetic.
 */
const QuickViewModal = ({ isOpen, onClose, product }) => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  
  if (!product) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      closeIcon={null}
      styles={{
        content: {
          padding: 0,
          borderRadius: '40px',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        body: {
          padding: 0,
        },
        mask: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(45, 42, 74, 0.4)',
        }
      }}
    >
      <div className="flex flex-col md:flex-row min-h-[600px] bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
        {/* Close Button - Floating */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-on_surface_variant hover:text-primary hover:scale-110 transition-all duration-300 shadow-lg border border-white"
        >
          <X size={24} />
        </button>

        {/* Left: Image Section */}
        <div className="md:w-1/2 relative overflow-hidden group">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-transparent animate-pulse opacity-50"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="relative h-full flex items-center justify-center p-12">
            <img
              src={product.imageUrl || product.image || '/placeholder-candy.png'}
              alt={product.productName || product.title}
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(224,64,160,0.2)] transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Discount Badge if available */}
            {product.salePrice && (
              <div className="absolute top-8 left-8 bg-error text-white font-black px-5 py-2 rounded-2xl shadow-xl rotate-[-5deg] text-sm tracking-widest">
                PROMOTION
              </div>
            )}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
            <span className="w-10 h-[2px] bg-primary/30"></span>
            {t('home.quick_preview')}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-on_surface leading-[1.05] mb-6 tracking-tighter">
            {product.productName || product.title}
          </h2>
          
          <div className="flex items-center gap-6 mb-10">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-secondary leading-none">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg font-bold text-on_surface_variant/40 line-through mt-1">
                  ${parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="h-10 w-[2px] bg-surface_container"></div>
            
            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-green-500/10">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {t('catalog.in_stock')}
                </div>
                <span className="text-xs font-bold text-on_surface_variant/60">
                  {product.stock} items ready
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error rounded-2xl text-xs font-black uppercase tracking-widest border border-error/10">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                {t('catalog.sold_out')}
              </div>
            )}
          </div>

          <p className="text-on_surface_variant leading-relaxed text-lg mb-12 font-medium opacity-80">
            {product.description || t('catalog.premium_desc', { category: product.category || 'confection' })}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="flex items-center gap-3 bg-surface_dim p-4 rounded-3xl border border-white">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-on_surface">Safe Quality</span>
            </div>
            <div className="flex items-center gap-3 bg-surface_dim p-4 rounded-3xl border border-white">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                <Star size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-on_surface">Top Rated</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              variant="primary" 
              className="w-full h-16 rounded-[24px] text-xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group transition-all"
              onClick={() => {
                onClose();
                navigate(`/${lang}/shop/${product.id}`);
              }}
            >
              <span>{t('home.go_to_detail')}</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <button 
              className="flex items-center justify-center gap-2 text-sm font-black text-on_surface_variant/60 hover:text-primary transition-colors py-2 uppercase tracking-widest"
              onClick={onClose}
            >
              Not now, keep browsing
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
