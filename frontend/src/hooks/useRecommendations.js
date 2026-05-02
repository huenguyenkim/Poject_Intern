import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchRecommendations = async (productId) => {
  if (!productId) return [];
  const { data } = await axios.get(`/api/products/${productId}/recommendations`);
  return data;
};

export const useRecommendations = (productId) => {
  return useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => fetchRecommendations(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
