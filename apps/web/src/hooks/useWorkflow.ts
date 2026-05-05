import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflow, updateWorkflow } from '../api/workflows';

export function useWorkflow(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => fetchWorkflow(id!),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data for active editing
    refetchOnWindowFocus: false, // Don't refetch when switching tabs
  });
  return { data, isLoading, error };
}

export function useUpdateWorkflow(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateWorkflow>[1]) =>
      updateWorkflow(id!, data),
    onSuccess: () => {
      // Invalidate to force refetch instead of manually setting data
      // This ensures we always have the latest from backend
      queryClient.invalidateQueries({ queryKey: ['workflow', id] });
    },
  });
}
