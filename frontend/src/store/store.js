import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import catalogReducer from './catalogSlice';
import orderReducer from './orderSlice';

/**
 * Central Redux Store.
 * Automatically integrates Redux-Thunk and Redux DevTools thanks to Toolkit.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    catalog: catalogReducer,
    orders: orderReducer,
  },
});
