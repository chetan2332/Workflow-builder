import { useMutation } from '@tanstack/react-query';
import type { NodeExecutionState } from '@n8n-project/shared';
import { executeNode, type ExecuteNodeRequest } from '../api/execution';

export function useExecute(onResult: (nodeId: string, state: NodeExecutionState) => void) {
  const mutation = useMutation({
    mutationFn: (payload: ExecuteNodeRequest) => executeNode(payload.nodeId, payload),
    onSuccess: (data, variables) => {
      if (data.success) {
        onResult(variables.nodeId, { status: 'success', outputData: (data.result?.outputs ?? {}) as Record<string, unknown[]> });
      } else {
        onResult(variables.nodeId, { status: 'error', outputData: {} });
      }
    },
    onError: (_err, variables) => {
      onResult(variables.nodeId, { status: 'error', outputData: {} });
    },
  });

  return {
    executeNode: (payload: ExecuteNodeRequest) => mutation.mutate(payload),
    isExecuting: mutation.isPending,
  };
}
