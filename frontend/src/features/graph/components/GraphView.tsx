import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material'; // 型定義を追加
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
  onNodeClick?: (event: React.MouseEvent, node: Node) => void; // 追加
  sx?: SxProps<Theme>; // 追加: 親からスタイルを受け取る
}

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onLayout,
  onConnect,
  onNodeClick, // 受け取る
  sx, // 受け取る
}) => {
  return (
    <Box
      data-testid="graph-view"
      sx={{
        // デフォルトスタイル: 親要素いっぱいに広げる
        width: '100%',
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        ...sx, // 親からのスタイルで上書き可能にする
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick} // 渡す
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <Panel position="top-right">
          <Stack direction="row" spacing={1}>
            <Button
              data-testid="layout-vertical-button"
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
              data-testid="layout-horizontal-button"
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
