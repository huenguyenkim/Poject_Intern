import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  axios.defaults.withCredentials = true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('candy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
