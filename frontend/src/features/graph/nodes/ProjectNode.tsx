import { memo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { Folder } from 'lucide-react';

type ProjectNodeData = {
  label: string;
  projectNumber?: string;
  targetPosition?: Position;
  sourcePosition?: Position;
};

type ProjectNodeType = Node<ProjectNodeData, 'project'>;

const ProjectNode = ({ data }: NodeProps<ProjectNodeType>) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        boxShadow: 2,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'primary.main',
        minWidth: '150px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'blue.50',
            color: 'primary.main',
          }}
        >
          <Folder size={16} />
        </Avatar>
        <Box sx={{ ml: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            {data.label}
          </Typography>
          {data.projectNumber && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block' }}
            >
              {data.projectNumber}
            </Typography>
          )}
        </Box>
      </Box>
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        style={{ width: 12, height: 12, background: '#1976d2' }}
      />
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        style={{ width: 12, height: 12, background: '#1976d2' }}
      />
    </Box>
  );
};

export default memo(ProjectNode);
