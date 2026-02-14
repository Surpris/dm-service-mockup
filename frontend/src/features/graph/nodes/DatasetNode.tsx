import { memo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { Database } from 'lucide-react';

type DatasetNodeData = {
  label: string;
  datasetNo?: number;
  targetPosition?: Position;
  sourcePosition?: Position;
};

type DatasetNodeType = Node<DatasetNodeData, 'dataset'>;

const DatasetNode = ({ id, data }: NodeProps<DatasetNodeType>) => {
  return (
    <Box
      data-testid={`node-dataset-${id}`}
      sx={{
        px: 2,
        py: 1,
        boxShadow: 2,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'success.main',
        minWidth: '150px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'green.50',
            color: 'success.main',
          }}
        >
          <Database size={16} />
        </Avatar>
        <Box sx={{ ml: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            {data.label}
          </Typography>
          {data.datasetNo !== undefined && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block' }}
            >
              No. {data.datasetNo}
            </Typography>
          )}
        </Box>
      </Box>
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        style={{ width: 12, height: 12, background: '#2e7d32' }}
      />
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        style={{ width: 12, height: 12, background: '#2e7d32' }}
      />
    </Box>
  );
};

export default memo(DatasetNode);
