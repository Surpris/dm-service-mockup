import { memo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { User } from 'lucide-react';

type ContributorNodeData = {
  label: string;
  targetPosition?: Position;
  sourcePosition?: Position;
};

type ContributorNodeType = Node<ContributorNodeData, 'contributor'>;

const ContributorNode = ({ data }: NodeProps<ContributorNodeType>) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        boxShadow: 2,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'secondary.main',
        minWidth: '150px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'purple.50',
            color: 'secondary.main',
          }}
        >
          <User size={16} />
        </Avatar>
        <Box sx={{ ml: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            {data.label}
          </Typography>
        </Box>
      </Box>
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        style={{ width: 12, height: 12, background: '#9c27b0' }}
      />
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        style={{ width: 12, height: 12, background: '#9c27b0' }}
      />
    </Box>
  );
};

export default memo(ContributorNode);
