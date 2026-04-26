import { createSlice } from '@reduxjs/toolkit';
import { loginUserThunk, initializeAuthThunk, registerUserThunk } from './authThunks';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: null, 
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    initializing: true, // Specific state for app startup
    error: null 
  },
  reducers: {
    logout: (state) => { 
      state.user = null; 
      state.token = null; 
      state.status = 'idle';
      localStorage.removeItem('candy_token');
    },
    socialLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      localStorage.setItem('candy_token', action.payload.token);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Initialization
    builder
      .addCase(initializeAuthThunk.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.initializing = false;
        state.status = 'idle'; // Critical: allows login button to be enabled
      })
      // Login
      .addCase(loginUserThunk.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, socialLogin } = authSlice.actions;
export default authSlice.reducer;
