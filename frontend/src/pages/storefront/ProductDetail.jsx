import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../store/cartSlice';
import { ShoppingBag, Star, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { showSuccessToast } from '../../utils/toastUtils';
import SEO from '../../components/seo/SEO';
import PageTransition from '../../components/layout/PageTransition';

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useParams();
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.catalog);
  const isLoading = status === 'loading';
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));
  const productTitle = product?.title || product?.productName;
  const productPrice = product?.price;
  const productImg = product?.image || product?.imageUrl;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-on_surface_variant font-bold">{t('orders.loading', 'Loading sweet details...')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-black mb-4">{t('catalog.empty', 'Product Not Found')}</h2>
        <Button variant="primary" onClick={() => navigate(`/${lang}/shop`)}>{t('common.try_again', 'Back to Shop')}</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: productTitle,
      price: productPrice,
      image: productImg,
      quantity: quantity
    }));
    showSuccessToast(t('cart.added_toast', { title: productTitle }));
  };

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productTitle,
    "image": [window.location.origin + productImg],
    "description": product.description || `Buy ${productTitle} at Candy Shop.`,
    "sku": `CANDY-${product.id}`,
    "brand": { "@type": "Brand", "name": "Candy Shop" },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": productPrice,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen pb-20">
        <SEO 
          title={`${productTitle} - ${t('catalog.seo_single_title', 'Premium Sweets')}`}
          description={product.description || t('catalog.seo_single_desc', 'Experience the best treats.')}
          image={productImg}
          type="product"
          schemaData={schemaData}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-on_surface_variant/60 mb-8 overflow-hidden whitespace-nowrap">
            <Link to={`/${lang}/shop`} className="hover:text-primary transition-colors">{t('footer.shop_all')}</Link>
            <ChevronRight size={14} />
            <span className="text-secondary font-bold truncate">{productTitle}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-16 mb-24">
            <div className="lg:w-[550px] flex-shrink-0">
              <div className="relative group aspect-square rounded-[40px] overflow-hidden bg-white border border-surface_container_high shadow-xl shadow-primary/5">
                <img src={productImg} alt={productTitle} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.tag && (
                  <span className="absolute top-6 left-6 z-10 font-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full bg-secondary text-on_primary shadow-xl">
                    {product.tag}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-grow flex flex-col pt-4">
              <h1 className="text-5xl md:text-6xl font-black text-on_surface mb-6 leading-[1.1] tracking-tight">{productTitle}</h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-primary items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.round(product.rating || 5) ? "currentColor" : "none"} strokeWidth={2.5} />
                  ))}
                </div>
                <span className="text-sm font-bold text-on_surface_variant/60">({product.reviewCount || 128} {t('catalog.reviews', 'Reviews')})</span>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <p className="text-5xl font-black text-primary leading-none">${productPrice.toFixed(2)}</p>
                {product.originalPrice && <p className="text-2xl font-bold text-on_surface_variant/40 line-through leading-none">${product.originalPrice.toFixed(2)}</p>}
              </div>

              <p className="text-lg text-on_surface_variant mb-10 leading-relaxed font-medium">
                {product.description || t('catalog.default_desc', 'A burst of citrus and berry flavors that pop in your mouth!')}
              </p>

              <div className="flex items-center gap-8 mb-12">
                <span className="font-black text-lg text-on_surface">{t('cart.quantity', 'Quantity')}</span>
                <div className="flex items-center bg-surface_container_high rounded-full p-1 border-2 border-surface_container_high">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-on_surface text-2xl font-black transition-all">-</button>
                  <span className="w-12 text-center font-black text-xl text-on_surface">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on_primary shadow-lg text-2xl font-black transition-all">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <Button variant="primary" onClick={handleAddToCart} className="flex-[1.2] py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl flex justify-center items-center gap-3 active:scale-95">
                  <ShoppingBag /> {t('cart.add_to_cart')}
                </Button>
                <Button variant="primary" onClick={() => { handleAddToCart(); navigate(`/${lang}/checkout`); }} className="flex-1 py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl flex justify-center items-center gap-3 active:scale-95">
                  {t('checkout.buy_now')}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/50 p-6 rounded-[32px] flex items-center gap-5 border border-white group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Truck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-on_surface leading-tight">{t('catalog.fast_delivery', 'Fast Delivery')}</h4>
                    <p className="text-[11px] font-bold text-on_surface_variant/60 uppercase tracking-widest mt-1">2-3 {t('catalog.business_days', 'Business Days')}</p>
                  </div>
                </div>
                <div className="bg-white/50 p-6 rounded-[32px] flex items-center gap-5 border border-white group">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-on_surface leading-tight">{t('catalog.guarantee', 'Satisfaction Guarantee')}</h4>
                    <p className="text-[11px] font-bold text-on_surface_variant/60 uppercase tracking-widest mt-1">100% {t('catalog.happy', 'Satisfaction')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
