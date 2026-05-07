import axios from 'axios';

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000') + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('candy_token') || sessionStorage.getItem('candy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and extract meaningful error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract the message from NestJS error response if available
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(message);
  }
);

export default apiClient;
