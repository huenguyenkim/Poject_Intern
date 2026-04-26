import React from 'react';
import { Modal } from 'antd';
import { ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';

/**
 * QuickViewModal: Refactored to use Ant Design Modal for accessibility and stability.
 * Uses ConfigProvider tokens for border-radius and background.
 */
const QuickViewModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      closeIcon={null} // We will use a custom close icon or let antd handle it with theme
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
          {/* Custom Close Button for premium feel */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-on_surface_variant hover:text-primary transition-colors p-2"
          >
            <span className="text-2xl font-light">✕</span>
          </button>

          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">
            Quick Preview
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
                IN STOCK: {product.stock}
              </div>
            ) : (
              <div className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-black">
                SOLD OUT
              </div>
            )}
          </div>

          <p className="text-on_surface_variant leading-relaxed text-lg mb-10 line-clamp-4">
            {product.description || 'Premium handcrafted confection for your sweet tooth.'}
          </p>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              className="w-full h-16 rounded-full text-lg font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              onClick={() => {
                window.location.href = `/shop/${product.id}`;
              }}
            >
              Go to Detail Page
            </Button>
            <p className="text-center text-xs text-on_surface_variant/60 font-medium italic">
              Experience the full premium details in our dedicated lab.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
