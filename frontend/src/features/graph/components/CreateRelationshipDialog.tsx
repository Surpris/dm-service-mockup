import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import type { Node } from '@xyflow/react';

interface CreateRelationshipDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { relationshipType: string; description: string }) => void;
  sourceNode: Node | null;
  targetNode: Node | null;
}

const CreateRelationshipDialog: React.FC<CreateRelationshipDialogProps> = ({
  open,
  onClose,
  onSubmit,
  sourceNode,
  targetNode,
}) => {
  const [relationshipType, setRelationshipType] = useState('');
  const [description, setDescription] = useState('');

  const handleEnter = () => {
    setRelationshipType('');
    setDescription('');
  };

  const handleSubmit = () => {
    onSubmit({ relationshipType, description });
    onClose();
  };

  if (!sourceNode || !targetNode) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ onEnter: handleEnter }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create User Defined Relationship</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            From: <strong>{sourceNode.data.label as string}</strong> (
            {sourceNode.type})
            <br />
            To: <strong>{targetNode.data.label as string}</strong> (
            {targetNode.type})
          </Typography>
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Relationship Type"
          fullWidth
          variant="outlined"
          value={relationshipType}
          onChange={(e) => setRelationshipType(e.target.value)}
          placeholder="e.g. RELATED_TO, FUNDED_BY"
          helperText="Uppercase with underscores recommended"
        />
        <TextField
          margin="dense"
          label="Description (stored in properties)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!relationshipType}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRelationshipDialog;
