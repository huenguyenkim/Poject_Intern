import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const usePurchasedProducts = (isLoggedIn) => {
    return useQuery({
        queryKey: ['orders', 'purchased-products'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/orders/purchased-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data; // Array of product IDs
        },
        enabled: !!isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
