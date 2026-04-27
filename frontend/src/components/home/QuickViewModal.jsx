import React from 'react';
import { Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

/**
 * QuickViewModal: Refactored to use Ant Design Modal for accessibility and stability.
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
      width={1000}
      centered
      closeIcon={null}
      styles={{
        content: {
          padding: 0,
          overflow: 'hidden',
        },
        body: {
          padding: 0,
        }
      }}
    >
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Image Section */}
        <div className="md:w-1/2 aspect-square md:aspect-auto bg-surface_container_low p-8 flex items-center justify-center">
          <img
            src={product.imageUrl || product.image || '/placeholder-candy.png'}
            alt={product.productName || product.title}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-on_surface_variant hover:text-primary transition-colors p-2"
          >
            <span className="text-2xl font-light">✕</span>
          </button>

          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">
            {t('home.quick_preview')}
          </span>
          
          <h2 className="text-4xl md:text-5xl font-black text-on_surface leading-[1.1] mb-6 tracking-tight">
            {product.productName || product.title}
          </h2>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black text-secondary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black">
                {t('catalog.in_stock')}: {product.stock}
              </div>
            ) : (
              <div className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-black">
                {t('catalog.sold_out')}
              </div>
            )}
          </div>

          <p className="text-on_surface_variant leading-relaxed text-lg mb-10 line-clamp-4">
            {product.description || t('catalog.premium_desc', { category: product.category || 'confection' })}
          </p>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              className="w-full h-16 rounded-full text-lg font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              onClick={() => {
                onClose();
                navigate(`/${lang}/shop/${product.id}`);
              }}
            >
              {t('home.go_to_detail')}
            </Button>
            <p className="text-center text-xs text-on_surface_variant/60 font-medium italic">
              {t('home.modal_experience_tip')}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
