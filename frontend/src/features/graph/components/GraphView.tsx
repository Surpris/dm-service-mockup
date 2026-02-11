import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ReactFlow, Controls, Background, Panel } from '@xyflow/react';
import type {
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ProjectNode from '../nodes/ProjectNode';
import DatasetNode from '../nodes/DatasetNode';
import ContributorNode from '../nodes/ContributorNode';

const nodeTypes = {
  project: ProjectNode,
  dataset: DatasetNode,
  contributor: ContributorNode,
};

interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onLayout: (direction: string) => void;
  onConnect: (connection: Connection) => void;
}

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onLayout,
  onConnect,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        minHeight: '500px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={() => onLayout('TB')}
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Layout Vertical
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => onLayout('LR')}
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Layout Horizontal
            </Button>
          </Stack>
        </Panel>
      </ReactFlow>
    </Box>
  );
};

export default GraphView;
