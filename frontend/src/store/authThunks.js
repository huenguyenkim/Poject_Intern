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
      
      // Clear any existing tokens first to avoid mixing
      localStorage.removeItem('candy_token');
      sessionStorage.removeItem('candy_token');

      // Persist access token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('candy_token', accessToken);
      } else {
        sessionStorage.setItem('candy_token', accessToken);
      }
      
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
    const token = localStorage.getItem('candy_token') || sessionStorage.getItem('candy_token');
    if (!token) {
      // Check if we have a hint that a session might exist to avoid unnecessary 401s in console
      const hasSessionHint = document.cookie.includes('candy_remember');
      if (!hasSessionHint) {
        return rejectWithValue('No session hint found');
      }

      try {
        const response = await apiClient.post('/auth/remember');
        const { user, accessToken } = response.data;
        
        // Use a persistent hint to decide where to save the refreshed token
        const isPersistent = document.cookie.includes('candy_remember'); // If cookie exists, we refresh it
        if (isPersistent) {
          localStorage.setItem('candy_token', accessToken);
        } else {
          sessionStorage.setItem('candy_token', accessToken);
        }
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
      const response = await apiClient.post('/auth/forgot-password/request', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const verifyResetTokenThunk = createAsyncThunk(
  'auth/verifyResetToken',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/forgot-password/verify', { email, otp });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid or expired token');
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/forgot-password/reset', { email, otp, newPassword });
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
      sessionStorage.removeItem('candy_token');
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

/**
 * Thunk: Update User Profile
 */
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      // Map frontend fields to backend fields if necessary
      const data = {
        fullName: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        dob: profileData.dob,
        address: profileData.address,
        avatarUrl: profileData.avatarUrl,
        coverUrl: profileData.coverUrl,
        username: profileData.username
      };
      
      const response = await apiClient.put(`/users/${id}`, data);
      
      // Return plain serializable objects only
      return JSON.parse(JSON.stringify(response.data));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Profile update failed');
    }
  }
);

/**
 * Thunk: Check Username Availability
 */
export const checkUsernameThunk = createAsyncThunk(
  'auth/checkUsername',
  async (username, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/check-username/${username}`);
      return response.data.available;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Check failed');
    }
  }
);
