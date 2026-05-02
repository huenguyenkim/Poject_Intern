import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/blogs`);
            return res.data;
        }
    });
};

export const useBlogDetail = (id) => {
    return useQuery({
        queryKey: ['blogs', id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/blogs/${id}`);
            return res.data;
        },
        enabled: !!id
    });
};

export const useRelatedBlogs = (id) => {
    return useQuery({
        queryKey: ['blogs', 'related', id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/api/blogs/related/${id}`);
            return res.data;
        },
        enabled: !!id
    });
};
