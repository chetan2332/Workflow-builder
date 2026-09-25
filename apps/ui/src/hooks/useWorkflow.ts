import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflow, updateWorkflow } from '../api/workflows';

export function useWorkflow(id: string | undefined) {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: () => fetchWorkflow(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateWorkflow(id: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateWorkflow>[1]) => updateWorkflow(id!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workflow', id] }),
  });
}
