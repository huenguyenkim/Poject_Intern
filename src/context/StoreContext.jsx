import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

const initialProducts = [
  { 
    id: '1', 
    title: 'Pastel Macaron Box', 
    price: 24.00, 
    category: 'Baked Goods', 
    imagePlaceholder: '/images/macaron-featured.png', 
    tag: 'POPULAR', 
    rating: 4.8,
    reviewCount: 156,
    characteristics: ['Gluten Free', 'Handmade', 'Natural Colors'],
    description: 'Assorted box of 12 delicate French macarons. Includes Lavender, Pistachio, and Rose flavors.', 
    stock: 124 
  },
  { 
    id: '2', 
    title: 'Golden Truffle Set', 
    price: 32.50, 
    category: 'Chocolate', 
    imagePlaceholder: '/images/bestseller.png', 
    tag: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 89,
    characteristics: ['Premium', 'Edible Gold', 'Gift Box'],
    description: 'Decadent chocolate truffles wrapped in edible 24k gold leaf.', 
    stock: 85 
  },
  { 
    id: '3', 
    title: 'Cotton Cloud Swirls', 
    price: 8.99, 
    category: 'Hard Candy', 
    imagePlaceholder: '/images/cotton-cloud.png', 
    tag: 'NEW', 
    rating: 4.5,
    reviewCount: 42,
    characteristics: ['Vegan', 'Nut Free', 'No Sugar'],
    description: 'Light as air, these cotton candy bites melt instantly with a hint of nostalgic vanilla cream.', 
    stock: 240 
  },
  { 
    id: '4', 
    title: 'Magic Jelly Beans', 
    price: 19.00, 
    category: 'Gummies', 
    imagePlaceholder: '/images/magic-jelly-beans-jar.png', 
    tag: 'NEW',
    rating: 4.8,
    reviewCount: 96,
    characteristics: ['Vegan', 'Gluten Free', 'Natural Colors'],
    description: 'A mystical assortment of beans with galaxy-inspired flavors! Each bag contains a cosmic mix of jewel-toned star, moon, and heart shapes.', 
    stock: 120 
  },
  { 
    id: '5', 
    title: 'Neon Rainbow Gummies', 
    price: 12.99, 
    category: 'Gummies', 
    imagePlaceholder: '/images/neon-rainbow-gummies.png', 
    tag: 'BEST SELLER',
    rating: 5.0,
    reviewCount: 128,
    characteristics: ['Gluten Free', 'Fat Free', 'Real Fruit'],
    description: 'A burst of citrus and berry flavors that pop in your mouth! These Neon Rainbow Gummies are crafted with real fruit juice and a magical dusting of sour crystals for the ultimate sweet-and-tangy experience.', 
    stock: 420 
  },
  { 
    id: '6', 
    title: 'Zesty Sour Belts', 
    price: 10.99, 
    category: 'Gummies', 
    imagePlaceholder: '/images/sour-belts-jar.png', 
    rating: 4.6,
    reviewCount: 75,
    characteristics: ['Extra Sour', 'Halal', 'Party Pack'],
    description: 'A vibrant assortment of extra sour, extra tangy chewy belts in a classic glass jar. Perfect for tang-lovers!', 
    stock: 310 
  },
  { 
    id: '7', 
    title: 'The Glaze Galaxy', 
    price: 28.00, 
    category: 'Baked Goods', 
    imagePlaceholder: '/images/glaze-galaxy-donuts.png', 
    tag: 'FRESH RELEASE',
    rating: 4.9,
    reviewCount: 64,
    characteristics: ['Limited Edition', 'Space Sprinkles', 'Handcrafted'],
    description: 'A cosmic assortment of our finest glazed donuts with limited-edition space sprinkles. Each box features 5 donuts with unique glazes: Strawberry Pink, Dark Chocolate, Mint Frost, Golden Caramel, and Blueberry Dream.', 
    stock: 48 
  },
];

const initialCategories = ['Gummies', 'Chocolate', 'Hard Candy', 'Baked Goods'];

const initialOrders = [
  { 
    id: '#CS-8842', 
    userId: 101, 
    userName: 'Eleanor P. Sweetman', 
    email: 'eleanor@candyluv.com', 
    phone: '+1 (555) 123-4567',
    address: '742 Evergreen Terrace, Springfield, IL 62704, United States',
    items: [
      { id: '10', title: 'Rainbow Gummy Bears', sku: 'GB-RNW-500', quantity: 2, price: 12.99, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=200' },
      { id: '11', title: 'Giant Swirl Lollipop', sku: 'LP-SWL-ORG', quantity: 5, price: 4.50, image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&q=80&w=200' },
      { id: '12', title: 'Artisan Choco Truffles', sku: 'CH-TRF-BOX', quantity: 1, price: 18.00, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=200' },
    ],
    subtotal: 66.48,
    shippingFee: 5.00,
    salesTax: 3.32,
    total: 74.80,
    status: 'Processing',
    date: new Date().toISOString()
  },
  { id: '#8821', userId: 2, userName: 'Jane Doe', email: 'jane@example.com', address: '123 Sweet Lane, Candyville 12345', items: [{id: '1', title: 'Neon Rainbow Gummies', quantity: 2, price: 8}], subtotal: 16.00, shippingFee: 5.00, total: 21.00, status: 'Processing', date: new Date().toISOString() },
];

const initialBanners = [
  { id: 'b1', title: 'Sweet Summer Carnival 2024', tag: 'ACTIVE', link: '/collections/summer-carnival', endDate: 'Aug 31, 2024', image: 'https://images.unsplash.com/photo-1533923156502-be31530547c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'b2', title: 'Neon Sour Sprinkles', tag: 'ACTIVE', link: '/products/neon-sour', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=400' },
  { id: 'b3', title: 'Gourmet Gift Sets', tag: 'DRAFT', link: '/pages/gift-guide', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400' },
  { id: 'b4', title: 'Bulk Party Favors', tag: 'ACTIVE', link: '/bulk-orders', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400' },
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    let saved = JSON.parse(localStorage.getItem('candy_products'));
    if (saved) {
      // Ensure we don't have the Midnight Cocoa bar if it was removed from initialProducts
      saved = saved.filter(p => p.title !== 'Midnight Sea Salt Cocoa');
      
      return saved.map(p => {
        const initial = initialProducts.find(ip => ip.id === p.id);
        if (initial) {
          return { 
            ...p, 
            title: initial.title,
            description: initial.description,
            category: initial.category,
            imagePlaceholder: initial.imagePlaceholder, 
            tag: initial.tag, 
            price: initial.price,
            stock: initial.stock 
          };
        }
        return p;
      });
    }
    return initialProducts;
  });
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('candy_categories')) || initialCategories);
  const [orders, setOrders] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('candy_orders')) || initialOrders;
    // Ensure CS-8842 is always there for the demo
    if (!saved.find(o => o.id === '#CS-8842')) {
       return [initialOrders[0], ...saved];
    }
    return saved;
  });
  const [banners, setBanners] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('candy_banners'));
    // Ensure the new banner content is visible for the demo
    if (saved && saved.length > 0 && !saved[0].title.includes('Summer Carnival')) {
       return initialBanners;
    }
    return saved || initialBanners;
  });

  // Sync to local storage on change
  useEffect(() => { localStorage.setItem('candy_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('candy_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('candy_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('candy_banners', JSON.stringify(banners)); }, [banners]);

  // Actions
  const addOrder = (order) => {
    const newOrder = {...order, id: `#${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString(), status: 'Pending'};
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const addCategory = (cat) => {
    if(!categories.includes(cat)) setCategories(prev => [...prev, cat]);
  };
  const deleteCategory = (cat) => setCategories(prev => prev.filter(c => c !== cat));
  const updateCategory = (oldCat, newCat) => {
     setCategories(prev => prev.map(c => c === oldCat ? newCat : c));
     setProducts(prev => prev.map(p => p.category === oldCat ? { ...p, category: newCat } : p));
  };

  const addProduct = (product) => setProducts(prev => [{ ...product, id: Date.now().toString(), imagePlaceholder: product.imagePlaceholder || 'bg-surface_variant' }, ...prev]);
  const updateProduct = (id, data) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const addBanner = (banner) => setBanners(prev => [...prev, { ...banner, id: `b-${Date.now()}` }]);
  const updateBanner = (id, data) => setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  const deleteBanner = (id) => setBanners(prev => prev.filter(b => b.id !== id));

  return (
    <StoreContext.Provider value={{ 
      products, categories, orders, banners, 
      addOrder, updateOrderStatus,
      addCategory, deleteCategory, updateCategory,
      addProduct, updateProduct, deleteProduct,
      addBanner, updateBanner, deleteBanner
    }}>
      {children}
    </StoreContext.Provider>
  );
};
