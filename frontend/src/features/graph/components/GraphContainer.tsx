import { useEffect, useCallback, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { ReactFlowProvider, useNodesState, useEdgesState } from '@xyflow/react';
import type { Connection, Node, Edge } from '@xyflow/react';
import { useMutation } from '@apollo/client/react';
import GraphView from './GraphView';
import GraphFilterSidebar from './GraphFilterSidebar';
import CreateRelationshipDialog from './CreateRelationshipDialog';
import NodeDetailsDrawer from './NodeDetailsDrawer';
import { useGraphData } from '../hooks/useGraphData';
import { getLayoutedElements } from '../utils/layout';
import { CREATE_USER_DEFINED_RELATIONSHIP } from '../../../graphql/queries';

const GraphContainerContent = () => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    loading,
    error,
    refetch,
  } = useGraphData();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [createUserDefinedRelationship] = useMutation(
    CREATE_USER_DEFINED_RELATIONSHIP,
  );

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

  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      setPendingConnection(params);
      setCreateDialogOpen(true);
    }
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  }, []);

  const handleCreateRelationship = async ({
    relationshipType,
    description,
  }: {
    relationshipType: string;
    description: string;
  }) => {
    if (
      !pendingConnection ||
      !pendingConnection.source ||
      !pendingConnection.target
    )
      return;

    const sourceNode = nodes.find((n) => n.id === pendingConnection.source);
    const targetNode = nodes.find((n) => n.id === pendingConnection.target);

    if (!sourceNode || !targetNode) return;

    // Map lowercase types to uppercase Enum
    const getEntityType = (type: string | undefined) =>
      type?.toUpperCase() || 'PROJECT';

    try {
      await createUserDefinedRelationship({
        variables: {
          input: {
            relationshipType,
            sourceId: sourceNode.id,
            sourceType: getEntityType(sourceNode.type),
            targetId: targetNode.id,
            targetType: getEntityType(targetNode.type),
            properties: JSON.stringify({ description }),
            createdBy: 'user', // Mock user ID
          },
        },
      });

      // Refresh graph data
      await refetch();
    } catch (e) {
      console.error('Failed to create relationship', e);
      alert('Failed to create relationship. Check console for details.');
    }
  };

  const getPendingSourceNode = () => {
    if (!pendingConnection) return null;
    return nodes.find((n) => n.id === pendingConnection.source) || null;
  };

  const getPendingTargetNode = () => {
    if (!pendingConnection) return null;
    return nodes.find((n) => n.id === pendingConnection.target) || null;
  };

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
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      >
        <GraphView
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onLayout={onLayout}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          // ここでサイズを制御します
          sx={{
            position: 'absolute', // 親の relative に対して絶対配置
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 'auto', // absolute なので auto でOK（top/left等に従う）
            height: 'auto', // 同上
            border: 'none', // 必要に応じて枠線を消すなど調整
            borderRadius: 0,
          }}
        />
        <CreateRelationshipDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateRelationship}
          sourceNode={getPendingSourceNode()}
          targetNode={getPendingTargetNode()}
        />
        <NodeDetailsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          node={selectedNode}
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
