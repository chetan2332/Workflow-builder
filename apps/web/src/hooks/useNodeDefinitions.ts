import { useQuery } from '@tanstack/react-query';
import type { NodeDefinition } from '@n8n-project/shared';
import { fetchNodeDefinitions } from '../api/execution';

/**
 * Hook to fetch and cache node definitions from backend using TanStack Query
 *
 * Usage:
 *   const { definitions, definitionsById, groupedDefinitions, isLoading, error } = useNodeDefinitions();
 */
export function useNodeDefinitions() {
  const { data: definitions = [], isLoading, error } = useQuery({
    queryKey: ['nodeDefinitions'],
    queryFn: fetchNodeDefinitions,
    staleTime: Infinity, // Definitions don't change during app runtime
  });

  // Create lookup map by type (e.g., "code.http" -> definition)
  const definitionsById = definitions.reduce((acc, def) => {
    acc[def.type] = def;
    return acc;
  }, {} as Record<string, NodeDefinition>);

  // Group by category for node library drawer
  const groupedDefinitions = definitions.reduce((acc, def) => {
    if (!acc[def.category]) {
      acc[def.category] = [];
    }
    acc[def.category].push(def);
    return acc;
  }, {} as Record<string, NodeDefinition[]>);

  return {
    definitions,
    definitionsById,
    groupedDefinitions,
    isLoading,
    error: error?.message,
  };
}
