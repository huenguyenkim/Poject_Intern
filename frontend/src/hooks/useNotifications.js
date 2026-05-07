import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useNotifications = (user) => {
    const queryClient = useQueryClient();
    const socket = useSocket();

    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const token = localStorage.getItem('candy_token');
            const res = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (socket && user) {
            socket.emit('joinUserRoom');
            
            socket.on('notificationReceived', (notif) => {
                queryClient.setQueryData(['notifications'], (old) => [notif, ...(old || [])]);
            });

            return () => socket.off('notificationReceived');
        }
    }, [socket, user, queryClient]);

    return query;
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('candy_token');
            await axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('candy_token');
            await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });
};
