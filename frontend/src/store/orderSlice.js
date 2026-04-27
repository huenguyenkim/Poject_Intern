import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getOrdersUseCase, 
  getMyOrdersUseCase,
  createOrderUseCase, 
  updateOrderStatusUseCase,
  getOrderByIdUseCase
} from '../core/application/use-cases/manageOrder';

/**
 * Thunks: Order Management
 */
export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetchAll',
  async ({ page, limit } = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await getOrdersUseCase.execute(page, limit);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderByIdThunk = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const result = await getOrderByIdUseCase.execute(id);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch order details');
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  'orders/fetchMy',
  async ({ page, limit } = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await getMyOrdersUseCase.execute(page, limit);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch your orders');
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const result = await createOrderUseCase.execute(orderData);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create order');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await updateOrderStatusUseCase.execute(id, status);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update order status');
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    status: 'idle',
    error: null
  },
  reducers: {
    resetOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch (All or My)
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      
      // Create
      .addCase(createOrderThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
        state.meta.total += 1;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update Status
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { resetOrderError } = orderSlice.actions;

export default orderSlice.reducer;
