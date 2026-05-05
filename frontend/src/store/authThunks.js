import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

/**
 * Thunk: Login User
 * Calls backend API, saves token, and returns user data.
 */
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, accessToken } = response.data;
      
      // Persist short-lived access token. Long-lived remember sessions stay in HttpOnly cookies.
      localStorage.setItem('candy_token', accessToken);
      
      // Return plain serializable objects only
      return { 
        user: JSON.parse(JSON.stringify(user)), 
        token: accessToken 
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

/**
 * Thunk: Initialize Auth (Check for existing session)
 */
export const initializeAuthThunk = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('candy_token');
    if (!token) {
      try {
        const response = await apiClient.post('/auth/remember');
        const { user, accessToken } = response.data;
        localStorage.setItem('candy_token', accessToken);
        return { user: JSON.parse(JSON.stringify(user)), token: accessToken };
      } catch {
        return rejectWithValue('No token found');
      }
    }

    try {
      const response = await apiClient.get('/auth/me');
      return { user: JSON.parse(JSON.stringify(response.data)), token };
    } catch (err) {
      localStorage.removeItem('candy_token');
      return rejectWithValue('Session expired');
    }
  }
);

export const requestPasswordResetThunk = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/password/forgot', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const verifyResetTokenThunk = createAsyncThunk(
  'auth/verifyResetToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/password/verify', { token });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid or expired token');
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/password/reset', { token, newPassword });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Password reset failed');
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    } finally {
      localStorage.removeItem('candy_token');
    }
  }
);

/**
 * Thunk: Register User
 */
export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { user, accessToken } = response.data;
      
      // Auto-login: Persist JWT and return session data immediately
      localStorage.setItem('candy_token', accessToken);
      
      return { 
        user: JSON.parse(JSON.stringify(user)), 
        token: accessToken 
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);
