import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import cartReducer from '../../store/cartSlice';
import authReducer from '../../store/authSlice';
import ProductCard from './ProductCard';

// Mock the toast utility to avoid uninitialized AntdGlobal instance in tests
vi.mock('../../utils/toastUtils', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
  });

const mockProduct = {
  id: 1,
  title: 'Sweet Candy',
  price: 15.99,
  category: 'SWEETS',
  tag: 'NEW',
  image: '/images/test.png',
};

const renderComponent = (props = mockProduct) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ProductCard {...props} />
      </BrowserRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  it('nên hiển thị đúng thông tin sản phẩm', () => {
    renderComponent();
    expect(screen.getByText('Sweet Candy')).toBeInTheDocument();
    expect(screen.getByText(/15\.99/)).toBeInTheDocument();
  });

  it('nên gọi showSuccessToast khi nhấn nút thêm vào giỏ hàng', async () => {
    const { showSuccessToast } = await import('../../utils/toastUtils');
    renderComponent();

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(showSuccessToast).toHaveBeenCalled();
  });
});
