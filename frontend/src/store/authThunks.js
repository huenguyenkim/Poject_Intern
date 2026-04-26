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
      
      // Persist token
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
    if (!token) return rejectWithValue('No token found');

    try {
      const response = await apiClient.get('/auth/me');
      return { user: JSON.parse(JSON.stringify(response.data)), token };
    } catch (err) {
      localStorage.removeItem('candy_token');
      return rejectWithValue('Session expired');
    }
  }
);

/**
 * Thunk: Register User
 */
export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post('/auth/register', userData);
      // Auto login after registration
      return dispatch(loginUserThunk({ email: userData.email, password: userData.password })).unwrap();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);
