export const initialProducts = [
  { 
    id: '1', 
    title: 'Pastel Macaron Box', 
    price: 24.00, 
    category: 'Baked Goods', 
    image: '/images/macaron-featured.png', 
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
    image: '/images/chocolate_cat.png', 
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
    image: '/images/cotton-cloud.png', 
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
    image: '/images/jellybeans-featured.png', 
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
    image: '/images/neon-rainbow-gummies.png', 
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
    image: '/images/sour-belts-jar.png', 
    rating: 4.6,
    reviewCount: 75,
    characteristics: ['Extra Sour', 'Halal', 'Party Pack'],
    description: 'A vibrant assortment of extra sour, extra tangy chewy belts in a classic glass jar. Perfect for tang-lovers!', 
    stock: 310 
  },
  { 
    id: '8', 
    title: 'Rainbow Stack Donuts', 
    price: 15.50, 
    category: 'Baked Goods', 
    image: '/images/glaze-galaxy-donuts.png', 
    tag: 'FRESH', 
    rating: 4.7,
    reviewCount: 32,
    characteristics: ['Handmade', 'Limited Edition', 'Freshly Baked'],
    description: 'A towering stack of our finest glazed donuts with limited-edition sprinkles. Perfect for sharing or indulgent solo treats.', 
    stock: 120 
  },
  { 
    id: '9', 
    title: 'Salted Caramel Silk', 
    price: 12.99, 
    category: 'Chocolate', 
    image: '/images/salted-caramel.png', 
    tag: 'NEW',
    rating: 4.9,
    reviewCount: 58,
    characteristics: ['Premium', 'Silky Smooth', 'Handcrafted'],
    description: 'Decadent chocolate with smooth, flowing salted caramel center. A luxurious treat for chocolate lovers.', 
    stock: 95 
  },
  { 
    id: '10', 
    title: 'Neon Sour Strips', 
    price: 9.50, 
    category: 'Gummies', 
    image: '/images/sour-strips.png', 
    tag: 'POPULAR',
    rating: 4.8,
    reviewCount: 74,
    characteristics: ['Extra Tangy', 'Fat Free', 'Real Fruit Juice'],
    description: 'Tangy and colorful sour strips that pop with flavor. A vibrant burst of citrus and berry goodness.', 
    stock: 210 
  },
];

export const initialCategories = ['Gummies', 'Chocolate', 'Hard Candy', 'Baked Goods', 'Sour Bites'];

export const initialOrders = [
  { 
    id: '#CS-8842', 
    userId: 101, 
    userName: 'Eleanor P. Sweetman', 
    email: 'eleanor@candyluv.com', 
    phone: '+1 (555) 123-4567',
    address: '742 Evergreen Terrace, Springfield, IL 62704, United States',
    items: [
      { id: '10', title: 'Rainbow Gummy Bears', sku: 'GB-RNW-500', quantity: 2, price: 12.99, image: '/images/neon-rainbow-gummies.png' },
      { id: '11', title: 'Giant Swirl Lollipop', sku: 'LP-SWL-ORG', quantity: 5, price: 4.50, image: '/images/rainbow-swirl-pop.png' },
      { id: '12', title: 'Artisan Choco Truffles', sku: 'CH-TRF-BOX', quantity: 1, price: 18.00, image: '/images/chocolate_cat.png' },
    ],
    subtotal: 66.48,
    shippingFee: 5.00,
    salesTax: 3.32,
    total: 74.80,
    status: 'Processing',
    date: new Date().toISOString()
  },
  { id: '#8821', userId: 2, userName: 'Jane Doe', email: 'jane@example.com', address: '123 Sweet Lane, Candyville 12345', items: [{id: '1', title: 'Neon Rainbow Gummies', quantity: 2, price: 8, image: '/images/neon-rainbow-gummies.png'}], subtotal: 16.00, shippingFee: 5.00, total: 21.00, status: 'Processing', date: new Date().toISOString() },
];

export const initialBanners = [
  { id: 'b1', title: 'Sweet Summer Carnival 2024', tag: 'ACTIVE', link: '/shop', endDate: 'Aug 31, 2024', image: '/images/summer_carnival_banner.png' },
  { id: 'b2', title: 'Neon Sour Sprinkles', tag: 'ACTIVE', link: '/products/neon-sour', image: '/images/neon_sour_banner.png' },
  { id: 'b3', title: 'Gourmet Gift Sets', tag: 'DRAFT', link: '/pages/gift-guide', image: '/images/gourmet_gift_banner.png' },
  { id: 'b4', title: 'Bulk Party Favors', tag: 'ACTIVE', link: '/bulk-orders', image: '/images/bulk_party_banner.png' },
];

