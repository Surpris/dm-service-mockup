import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_GRAPH } from '../../../graphql/queries';
import { mapGraphDataToReactFlow } from '../utils/mapper';
import { Node, Edge } from 'reactflow';

import { ApolloError } from '@apollo/client';

interface UseGraphDataResult {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (variables?: Record<string, unknown>) => Promise<unknown>;
}

export const useGraphData = (filter?: string): UseGraphDataResult => {
  const { data, loading, error, refetch } = useQuery(GET_GRAPH, {
    variables: { filter },
    fetchPolicy: 'network-only', // Ensure we get fresh data especially when adding relations
  });

  const { nodes, edges } = useMemo(() => {
    if (!data || !data.graph) {
      return { nodes: [], edges: [] };
    }
    return mapGraphDataToReactFlow(data.graph);
  }, [data]);

  return {
    nodes,
    edges,
    loading,
    error,
    refetch,
  };
};
