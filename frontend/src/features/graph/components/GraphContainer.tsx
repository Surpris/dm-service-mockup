import { useEffect, useCallback, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import type { Connection, Node, Edge } from '@xyflow/react';
import GraphView from './GraphView';
import GraphFilterSidebar from './GraphFilterSidebar';
import { useGraphData } from '../hooks/useGraphData';
import { getLayoutedElements } from '../utils/layout';

const GraphContainerContent = () => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    loading,
    error,
  } = useGraphData();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [filters, setFilters] = useState({
    showProjects: true,
    showDatasets: true,
    showContributors: true,
  });

  // Filter nodes based on state
  const visibleNodes = useMemo(() => {
    if (!initialNodes.length) return [];
    return initialNodes.filter((node) => {
      if (node.type === 'project' && !filters.showProjects) return false;
      if (node.type === 'dataset' && !filters.showDatasets) return false;
      if (node.type === 'contributor' && !filters.showContributors)
        return false;
      return true;
    });
  }, [initialNodes, filters]);

  const visibleEdges = useMemo(() => {
    // Filter edges where both source and target are visible
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    return initialEdges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    );
  }, [initialEdges, visibleNodes]);

  useEffect(() => {
    // When data loads or filters change, apply layout
    if (visibleNodes.length > 0 || initialNodes.length > 0) {
      // Should handle empty result too
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(visibleNodes, visibleEdges);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
  }, [visibleNodes, visibleEdges, setNodes, setEdges, initialNodes.length]); // Depend on visual/filtered nodes

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(
          nodes, // Use current nodes (which are filtered)
          edges,
          direction,
        );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (loading)
    return (
      <Box sx={{ p: 4, height: '100%', width: '100%' }}>
        Loading graph data...
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 4, color: 'error.main', height: '100%', width: '100%' }}>
        Error loading graph: {error.message}
      </Box>
    );

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        bgcolor: 'grey.50',
      }}
    >
      <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }}>
        <GraphView
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onLayout={onLayout}
          onConnect={onConnect}
        />
      </Box>
      <GraphFilterSidebar filters={filters} onFilterChange={setFilters} />
    </Box>
  );
};

const GraphContainer = () => {
  return (
    <Box sx={{ flexGrow: 1, height: '100%', width: '100%', minHeight: 0 }}>
      <ReactFlowProvider>
        <GraphContainerContent />
      </ReactFlowProvider>
    </Box>
  );
};

export default GraphContainer;
