import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * toPlain: Strips class methods/prototypes by round-tripping through JSON.
 * This guarantees Redux-serializable plain objects regardless of what
 * the repositories or use-cases return.
 */
const toPlain = (value) => JSON.parse(JSON.stringify(value));
import { getProductsUseCase } from '../core/application/use-cases/getProducts';
import { 
  createProductUseCase, 
  updateProductUseCase, 
  deleteProductUseCase 
} from '../core/application/use-cases/manageProduct';
import { 
  getCategoriesUseCase, 
  createCategoryUseCase, 
  updateCategoryUseCase, 
  deleteCategoryUseCase 
} from '../core/application/use-cases/manageCategory';
import { 
  getBannersUseCase, 
  createBannerUseCase, 
  updateBannerUseCase, 
  deleteBannerUseCase 
} from '../core/application/use-cases/manageBanner';

/**
 * Thunks: Fetch Data
 */
export const fetchCatalogThunk = createAsyncThunk(
  'catalog/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [products, categories, banners] = await Promise.all([
        getProductsUseCase.execute(),
        getCategoriesUseCase.execute(),
        getBannersUseCase.execute()
      ]);

      // Normalize products: productName -> title, imageUrl -> image
      const normalizedProducts = products.map(p => ({
        ...p,
        title: p.title || p.productName,
        image: p.image || p.imageUrl,
        category: p.category || (categories.find(c => c.id === p.categoryId)?.categoryName || 'Candy')
      }));

      // Normalize categories: categoryName -> name
      const normalizedCategories = categories.map(c => ({
        ...c,
        name: c.name || c.categoryName
      }));

      return toPlain({ 
        products: normalizedProducts, 
        categories: normalizedCategories, 
        banners 
      });
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch catalog');
    }
  }
);

/**
 * Thunks: Product Management
 */
export const addProductThunk = createAsyncThunk(
  'catalog/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const result = await createProductUseCase.execute(productData);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add product');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'catalog/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateProductUseCase.execute(id, data);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update product');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'catalog/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductUseCase.execute(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete product');
    }
  }
);

/**
 * Thunks: Category Management
 */
export const addCategoryThunk = createAsyncThunk(
  'catalog/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const result = await createCategoryUseCase.execute(categoryData);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add category');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'catalog/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateCategoryUseCase.execute(id, data);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update category');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'catalog/deleteCategory',
  async ({ id, force = false }, { rejectWithValue }) => {
    try {
      await deleteCategoryUseCase.execute(id, force);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete category');
    }
  }
);

/**
 * Thunks: Banner Management
 */
export const addBannerThunk = createAsyncThunk(
  'catalog/addBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const result = await createBannerUseCase.execute(bannerData);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add banner');
    }
  }
);

export const updateBannerThunk = createAsyncThunk(
  'catalog/updateBanner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateBannerUseCase.execute(id, data);
      return toPlain(result);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update banner');
    }
  }
);

export const deleteBannerThunk = createAsyncThunk(
  'catalog/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await deleteBannerUseCase.execute(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete banner');
    }
  }
);

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products: [],
    categories: [],
    banners: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCatalogThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalogThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.banners = action.payload.banners;
      })
      .addCase(fetchCatalogThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Products
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })

      // Categories
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })

      // Banners
      .addCase(addBannerThunk.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      .addCase(updateBannerThunk.fulfilled, (state, action) => {
        const index = state.banners.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(deleteBannerThunk.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b.id !== action.payload);
      });
  }
});

export default catalogSlice.reducer;
