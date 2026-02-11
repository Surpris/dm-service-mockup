import type { Node, Edge } from '@xyflow/react';

// Define types locally since we don't have generated types yet
export interface BackendGraphNode {
  id: string;
  label: string;
  type: string; // 'PROJECT', 'DATASET', 'CONTRIBUTOR'
  data?: string | null;
}

export interface BackendGraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string | null;
  data?: string | null;
}

export interface BackendGraphData {
  nodes: BackendGraphNode[];
  edges: BackendGraphEdge[];
}

export const mapGraphDataToReactFlow = (
  data: BackendGraphData,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = data.nodes.map((node) => {
    let parsedData = {};
    try {
      if (node.data) {
        parsedData = JSON.parse(node.data);
      }
    } catch (e) {
      console.warn(`Failed to parse data for node ${node.id}`, e);
    }

    return {
      id: node.id,
      // Map CUSTOM_TYPE to custom-type (camelCase or lowercase for node types)
      type: node.type.toLowerCase(),
      data: {
        label: node.label,
        ...parsedData,
      },
      position: { x: 0, y: 0 }, // Initial position, will be calculated by layout
    };
  });

  const edges: Edge[] = data.edges.map((edge) => {
    let parsedData = {};
    try {
      if (edge.data) {
        parsedData = JSON.parse(edge.data);
      }
    } catch (e) {
      console.warn(`Failed to parse data for edge ${edge.id}`, e);
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || undefined,
      data: parsedData,
      // You can define 'type' property for ReactFlow custom edges if needed
      // type: 'smoothstep',
    };
  });

  return { nodes, edges };
};
