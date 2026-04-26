import axios from 'axios';

/**
 * Data Source: API Client
 * 
 * Configured axios instance for centralized API interaction.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
