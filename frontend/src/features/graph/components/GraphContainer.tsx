import { useEffect, useCallback, useState, useMemo } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import type { Connection } from 'reactflow';
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

  if (loading) return <div className="p-4">Loading graph data...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error loading graph: {error.message}
      </div>
    );

  return (
    <div className="h-[80vh] w-full bg-gray-50 flex" style={{ height: '80vh' }}>
      <div className="flex-grow h-full" style={{ height: '100%' }}>
        <GraphView
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onLayout={onLayout}
          onConnect={onConnect}
        />
      </div>
      <GraphFilterSidebar filters={filters} onFilterChange={setFilters} />
    </div>
  );
};

const GraphContainer = () => {
  return (
    <ReactFlowProvider>
      <GraphContainerContent />
    </ReactFlowProvider>
  );
};

export default GraphContainer;
