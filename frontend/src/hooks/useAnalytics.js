import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAnalytics = (days = 180) => {
    const { token } = useSelector(state => state.auth);

    const kpisQuery = useQuery({
        queryKey: ['analytics', 'kpis', days],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/analytics/kpis?days=${days}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
        staleTime: 60000,
    });

    const chartQuery = useQuery({
        queryKey: ['analytics', 'chart', days],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/analytics/revenue-chart?days=${days}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
        staleTime: 60000,
    });

    const topProductsQuery = useQuery({
        queryKey: ['analytics', 'topProducts'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/analytics/top-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
        staleTime: 60000,
    });

    const forecastQuery = useQuery({
        queryKey: ['analytics', 'forecast'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/analytics/forecast`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
        staleTime: 3600000, // Cache for 1 hour (forecast doesn't change often)
    });

    const bundlesQuery = useQuery({
        queryKey: ['analytics', 'bundles'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/analytics/bundled-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!token,
        staleTime: 1800000, // 30 mins
    });

    return {
        kpis: kpisQuery.data,
        chart: chartQuery.data,
        topProducts: topProductsQuery.data,
        forecast: forecastQuery.data,
        bundles: bundlesQuery.data,
        isLoading: kpisQuery.isLoading || chartQuery.isLoading || topProductsQuery.isLoading || forecastQuery.isLoading || bundlesQuery.isLoading,
        isError: kpisQuery.isError || chartQuery.isError || topProductsQuery.isError || forecastQuery.isError || bundlesQuery.isError,
    };
};
