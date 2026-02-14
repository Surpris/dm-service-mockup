import React, { useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Node } from '@xyflow/react';

interface NodeDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  node: Node | null;
}

const NodeDetailsDrawer: React.FC<NodeDetailsDrawerProps> = ({
  open,
  onClose,
  node,
}) => {
  const nodeData = useMemo(() => {
    if (!node || !node.data.data) return {};
    try {
      return typeof node.data.data === 'string'
        ? JSON.parse(node.data.data)
        : node.data.data;
    } catch (e) {
      console.error('Failed to parse node data', e);
      return {};
    }
  }, [node]);

  if (!node) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        'data-testid': 'node-details-drawer',
      }}
      sx={{
        '& .MuiDrawer-paper': { width: 350, boxSizing: 'border-box' },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Node Details</Typography>
        <IconButton data-testid="node-details-close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography
          data-testid="node-details-title"
          variant="subtitle1"
          gutterBottom
        >
          {node.data.label as string}
        </Typography>
        <Chip
          label={node.type?.toUpperCase()}
          color="primary"
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          ID
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ wordBreak: 'break-all' }}
        >
          {node.id}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Properties
        </Typography>
        <List dense>
          {Object.entries(nodeData).map(([key, value]) => (
            <ListItem key={key} disablePadding>
              <ListItemText
                primary={key}
                secondary={String(value)}
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.primary',
                }}
              />
            </ListItem>
          ))}
          {Object.keys(nodeData).length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No additional properties.
            </Typography>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default NodeDetailsDrawer;
