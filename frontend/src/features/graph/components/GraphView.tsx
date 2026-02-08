import React from 'react';
import ReactFlow, { Controls, Background, Panel } from 'reactflow';
import type {
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ProjectNode from '../nodes/ProjectNode';
import DatasetNode from '../nodes/DatasetNode';
import ContributorNode from '../nodes/ContributorNode';



interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onLayout: (direction: string) => void;
  onConnect: (connection: Connection) => void;
}

const nodeTypes = {
  project: ProjectNode,
  dataset: DatasetNode,
  contributor: ContributorNode,
};

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onLayout,
  onConnect,
}) => {

  return (
    <div className="h-full w-full min-h-[500px] border border-gray-200 rounded-lg" style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={() => onLayout('TB')}
              className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm"
            >
              Layout Vertical
            </button>
            <button
              onClick={() => onLayout('LR')}
              className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm"
            >
              Layout Horizontal
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default GraphView;
