import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialCategories, initialOrders, initialBanners } from '../data/initialData';

const StoreContext = createContext();

/**
 * Hook tùy chỉnh để sử dụng StoreContext.
 * @returns {Object} Giá trị của StoreContext bao gồm dữ liệu và các hàm hành động.
 */
export const useStore = () => useContext(StoreContext);

/**
 * Provider quản lý trạng thái cửa hàng (sản phẩm, danh mục, đơn hàng, banner).
 * 
 * @param {Object} props - Thuộc tính của component.
 * @param {React.ReactNode} props.children - Các component con.
 * @returns {JSX.Element} StoreContext Provider.
 */
export const StoreProvider = ({ children }) => {
  // Khởi tạo trạng thái từ localStorage hoặc dữ liệu mặc định
  const [products, setProducts] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('candy_products'));
    if (!saved) return initialProducts;

    // Logic hợp nhất: đảm bảo sản phẩm mặc định luôn cập nhật trong khi giữ lại thay đổi của người dùng
    const savedMap = new Map(saved.map(p => [p.id, p]));
    const merged = initialProducts.map(ip => {
      const s = savedMap.get(ip.id);
      return s ? { ...s, ...ip, stock: s.stock ?? ip.stock } : ip;
    });
    
    // Bao gồm các sản phẩm tùy chỉnh do người dùng tạo
    const initialIds = new Set(initialProducts.map(ip => ip.id));
    const customProducts = saved.filter(p => !initialIds.has(p.id));
    
    return [...merged, ...customProducts];
  });

  const [categories, setCategories] = useState(() => 
    JSON.parse(localStorage.getItem('candy_categories')) || initialCategories
  );

  const [orders, setOrders] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('candy_orders')) || initialOrders;
    // Đảm bảo đơn hàng Demo CS-8842 luôn tồn tại
    if (!saved.find(o => o.id === '#CS-8842')) {
       return [initialOrders[0], ...saved];
    }
    return saved;
  });

  const [banners, setBanners] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('candy_banners'));
    return saved || initialBanners;
  });

  // Đồng bộ hóa với local storage khi có thay đổi
  useEffect(() => { localStorage.setItem('candy_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('candy_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('candy_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('candy_banners', JSON.stringify(banners)); }, [banners]);

  // Các hành động (Actions)

  /**
   * Thêm một đơn hàng mới.
   * @param {Object} order - Thông tin đơn hàng.
   * @returns {string} ID của đơn hàng mới tạo.
   */
  const addOrder = (order) => {
    const newOrder = {
      ...order, 
      id: `#${Math.floor(1000 + Math.random() * 9000)}`, 
      date: new Date().toISOString(), 
      status: 'Pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  /**
   * Cập nhật trạng thái của một đơn hàng.
   * @param {string} id - ID đơn hàng.
   * @param {string} status - Trạng thái mới.
   */
  const updateOrderStatus = (id, status) => 
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  /**
   * Thêm một danh mục sản phẩm mới.
   * @param {string} cat - Tên danh mục.
   */
  const addCategory = (cat) => {
    if(!categories.includes(cat)) setCategories(prev => [...prev, cat]);
  };

  /**
   * Xóa một danh mục sản phẩm.
   * @param {string} cat - Tên danh mục cần xóa.
   */
  const deleteCategory = (cat) => 
    setCategories(prev => prev.filter(c => c !== cat));

  /**
   * Cập nhật tên danh mục và cập nhật tất cả sản phẩm thuộc danh mục đó.
   * @param {string} oldCat - Tên danh mục cũ.
   * @param {string} newCat - Tên danh mục mới.
   */
  const updateCategory = (oldCat, newCat) => {
     setCategories(prev => prev.map(c => c === oldCat ? newCat : c));
     setProducts(prev => prev.map(p => p.category === oldCat ? { ...p, category: newCat } : p));
  };

  /**
   * Thêm một sản phẩm mới vào kho.
   * @param {Object} product - Thông tin sản phẩm.
   */
  const addProduct = (product) => 
    setProducts(prev => [{ 
      ...product, 
      id: Date.now().toString(), 
      imagePlaceholder: product.imagePlaceholder || 'bg-surface_variant' 
    }, ...prev]);

  /**
   * Cập nhật thông tin sản phẩm.
   * @param {string} id - ID sản phẩm.
   * @param {Object} data - Dữ liệu cập nhật.
   */
  const updateProduct = (id, data) => 
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));

  /**
   * Xóa một sản phẩm khỏi kho.
   * @param {string} id - ID sản phẩm cần xóa.
   */
  const deleteProduct = (id) => 
    setProducts(prev => prev.filter(p => p.id !== id));

  /**
   * Thêm một banner quảng cáo mới.
   * @param {Object} banner - Thông tin banner.
   */
  const addBanner = (banner) => 
    setBanners(prev => [...prev, { ...banner, id: `b-${Date.now()}` }]);

  /**
   * Cập nhật thông tin banner.
   * @param {string} id - ID banner.
   * @param {Object} data - Dữ liệu cập nhật.
   */
  const updateBanner = (id, data) => 
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));

  /**
   * Xóa một banner.
   * @param {string} id - ID banner cần xóa.
   */
  const deleteBanner = (id) => 
    setBanners(prev => prev.filter(b => b.id !== id));

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
