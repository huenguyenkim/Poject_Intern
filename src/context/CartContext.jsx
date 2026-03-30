import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

/**
 * Hook tùy chỉnh để sử dụng CartContext.
 * @returns {Object} Giá trị của CartContext bao gồm giỏ hàng và các hàm thao tác.
 */
export const useCart = () => useContext(CartContext);

/**
 * Provider quản lý trạng thái giỏ hàng (thêm, xóa, cập nhật số lượng, tính tổng).
 * 
 * @param {Object} props - Thuộc tính của component.
 * @param {React.ReactNode} props.children - Các component con.
 * @returns {JSX.Element} CartContext Provider.
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    { id: '5', title: 'Neon Rainbow Gummies', price: 12.99, quantity: 2, image: '/images/neon-rainbow-gummies.png', categoryTag: 'SOUR PACK' }
  ]);

  /**
   * Thêm sản phẩm vào giỏ hàng. Nếu sản phẩm đã tồn tại, tăng số lượng thêm 1.
   * @param {Object} product - Thông tin sản phẩm cần thêm.
   */
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, image: product.image || product.imagePlaceholder }];
    });
  };

  /**
   * Xóa sản phẩm khỏi giỏ hàng theo ID.
   * @param {string} id - ID sản phẩm cần xóa.
   */
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Cập nhật số lượng của một sản phẩm trong giỏ hàng.
   * @param {string} id - ID sản phẩm.
   * @param {number} delta - Giá trị thay đổi (dương để tăng, âm để giảm).
   */
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  /** Tổng giá trị đơn hàng hiện tại */
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  /** Tổng số lượng sản phẩm trong giỏ hàng */
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  /** Làm trống giỏ hàng */
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
