import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchTasks = async (token, filters = {}) => {
    const { page = 1, limit = 50, assigneeId, status, priority, tags } = filters;
    const params = new URLSearchParams({ page, limit });
    if (assigneeId) params.append('assigneeId', assigneeId);
    if (status) params.append('status', status);
    if (priority?.length) params.append('priority', Array.isArray(priority) ? priority.join(',') : priority);
    if (tags?.length) params.append('tags', Array.isArray(tags) ? tags.join(',') : tags);

    const res = await axios.get(`${API_URL}/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // { data: Task[], total: number }
};

const updateTask = async ({ id, token, ...data }) => {
    const res = await axios.patch(`${API_URL}/api/tasks/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const useTasks = (filters = {}) => {
    const { token } = useSelector(state => state.auth);
    
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => fetchTasks(token, filters),
        enabled: !!token,
        staleTime: 1000 * 60 * 2, // 2 minutes before checking background
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();
    const { token } = useSelector(state => state.auth);

    return useMutation({
        mutationFn: ({ id, ...data }) => updateTask({ id, ...data, token }),
        onMutate: async (newStatusUpdate) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData(['tasks']);

            // Optimistically update to the new value
            queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
                if (!old || !old.data) return old;
                return {
                    ...old,
                    data: old.data.map(task => 
                        task.id === newStatusUpdate.id ? { ...task, ...newStatusUpdate } : task
                    )
                };
            });

            // Return a context object with the snapshotted value
            return { previousTasks };
        },
        onError: (err, newStatusUpdate, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
        },
        onSettled: () => {
            // Always refetch after error or success to ensure server and client match
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
