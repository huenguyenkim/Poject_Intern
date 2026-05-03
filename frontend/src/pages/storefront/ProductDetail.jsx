import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../store/cartSlice';
import { ShoppingBag, Star, Truck, ShieldCheck, ChevronRight, Heart, Share2, Minus, Plus, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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

  const product = products.find(p => String(p.id) === String(id));
  const productTitle = product?.title || product?.productName || t('catalog.untitled', 'Untitled');
  // Ensure a full URL for the image; fallback to a placeholder if missing
  const productImg = product?.image || product?.imageUrl || `${window.location.origin}/placeholder.png`;

  
  // Logic: Ưu tiên salePrice từ backend
  const numCurrentPrice = product?.salePrice ? parseFloat(product.salePrice.toString()) : (typeof product?.price === 'string' ? parseFloat(product.price.replace(/[^0-9.-]+/g, "")) : (Number(product?.price) || 0));
  const numOriginalPrice = product?.salePrice ? (typeof product?.price === 'string' ? parseFloat(product.price.replace(/[^0-9.-]+/g, "")) : Number(product?.price)) : (product?.originalPrice ? parseFloat(product.originalPrice.toString()) : null);

  const isSale = numOriginalPrice && numOriginalPrice > numCurrentPrice;
  const isOutOfStock = Number(product?.stock) <= 0;
  const isLowStock = Number(product?.stock) > 0 && Number(product?.stock) < 10;

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
    if (isOutOfStock) return;
    dispatch(addToCart({
      id: product.id,
      title: productTitle,
      price: numCurrentPrice,
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
      "price": numCurrentPrice,
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
                <img src={productImg} alt={productTitle} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}`} />
                {isOutOfStock ? (
                  <span className="absolute top-6 left-6 z-10 font-black text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-full bg-error text-white shadow-xl border-2 border-white/20 backdrop-blur-md">
                    HẾT HÀNG
                  </span>
                ) : (product.tag || isSale) && (
                  <span className="absolute top-6 left-6 z-10 font-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full bg-secondary text-on_primary shadow-xl">
                    {isSale ? 'PROMOTION' : product.tag}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-grow flex flex-col pt-4">
              <h1 className="text-5xl md:text-6xl font-black text-on_surface mb-6 leading-[1.1] tracking-tight">{productTitle}</h1>


              <div className="flex items-center gap-3 mb-8">
                <p className="text-5xl font-black text-primary leading-none">${numCurrentPrice.toFixed(2)}</p>
                {isSale && <p className="text-2xl font-bold text-on_surface_variant/40 line-through leading-none">${numOriginalPrice.toFixed(2)}</p>}
                {isSale && <Badge variant="primary" className="bg-error text-white border-none ml-2">SAVE {Math.round(((numOriginalPrice - numCurrentPrice) / numOriginalPrice) * 100)}%</Badge>}
              </div>

              {isOutOfStock ? (
                <div className="bg-error/10 border border-error/20 p-4 rounded-2xl mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                  <span className="text-sm font-black text-error uppercase tracking-widest">Sản phẩm hiện đang tạm hết hàng</span>
                </div>
              ) : isLowStock ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce"></div>
                  <span className="text-sm font-black text-yellow-600 uppercase tracking-widest">Chỉ còn {product.stock} gói trong kho!</span>
                </div>
              ) : null}

              <p className="text-lg text-on_surface_variant mb-10 leading-relaxed font-medium">
                {product.description || t('catalog.default_desc', 'A burst of citrus and berry flavors that pop in your mouth!')}
              </p>

              <div className="flex items-center gap-8 mb-12">
                <span className="font-black text-lg text-on_surface">{t('cart.quantity', 'Quantity')}</span>
                <div className={`flex items-center bg-surface_container_high rounded-full p-1 border-2 border-surface_container_high ${isOutOfStock ? 'opacity-30 pointer-events-none' : ''}`}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-on_surface text-2xl font-black transition-all">-</button>
                  <span className="w-12 text-center font-black text-xl text-on_surface">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on_primary shadow-lg text-2xl font-black transition-all">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                {isOutOfStock ? (
                  <Button variant="surface" className="flex-1 py-5 text-xl bg-on_surface/10 text-on_surface_variant cursor-not-allowed">
                    {t('catalog.out_of_stock', 'Out of Stock')}
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" onClick={handleAddToCart} className="flex-[1.2] py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl flex justify-center items-center gap-3 active:scale-95">
                      <ShoppingBag /> {t('cart.add_to_cart')}
                    </Button>
                    <Button variant="primary" onClick={() => { handleAddToCart(); navigate(`/${lang}/checkout`); }} className="flex-1 py-5 text-xl bg-primary hover:bg-primary/90 shadow-xl flex justify-center items-center gap-3 active:scale-95">
                      {t('checkout.buy_now')}
                    </Button>
                  </>
                )}
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
