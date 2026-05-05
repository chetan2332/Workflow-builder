import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkflows, createWorkflow, deleteWorkflow } from '../api/workflows';
/**
 * Hook to fetch and cache all workflows using TanStack Query
 *
 * Usage:
 *   const { workflows, isLoading, error } = useWorkflows();
 */
export function useWorkflows() {
  const { data: workflows = [], isLoading, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: getWorkflows,
    staleTime: 30000, // 30 seconds - balance between freshness and performance
  });

  return {
    workflows,
    isLoading,
    error: error?.message,
  };
}

/**
 * Hook to create a new workflow
 * Automatically invalidates the workflows cache on success
 *
 * Usage:
 *   const createMutation = useCreateWorkflow();
 *   createMutation.mutate({ name: 'My Workflow', description: 'Description' });
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      // Invalidate to refetch and ensure backend is source of truth
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

/**
 * Hook to delete a workflow
 * Automatically invalidates the workflows cache on success
 *
 * Usage:
 *   const deleteMutation = useDeleteWorkflow();
 *   deleteMutation.mutate(workflowId);
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      // Invalidate to refetch and ensure backend is source of truth
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}
