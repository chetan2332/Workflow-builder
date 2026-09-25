import { useQuery } from '@tanstack/react-query';
import type { NodeDefinition } from '@n8n-project/shared';
import { fetchNodeDefinitions } from '../api/execution';

export function useNodeDefinitions() {
  const { data: definitions = [], isLoading, error } = useQuery({
    queryKey: ['nodeDefinitions'],
    queryFn: fetchNodeDefinitions,
    staleTime: Infinity,
  });

  const definitionsById = definitions.reduce<Record<string, NodeDefinition>>((acc, def) => {
    acc[def.type] = def;
    return acc;
  }, {});

  const groupedDefinitions = definitions.reduce<Record<string, NodeDefinition[]>>((acc, def) => {
    if (!acc[def.category]) acc[def.category] = [];
    acc[def.category].push(def);
    return acc;
  }, {});

  return { definitions, definitionsById, groupedDefinitions, isLoading, error: error?.message };
}
