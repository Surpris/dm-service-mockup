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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { Node } from '@xyflow/react';
import { RELATIONSHIP_OPTIONS } from '../constants';

interface CreateRelationshipDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { relationshipType: string; description: string }) => void;
  sourceNode: Node | null;
  targetNode: Node | null;
}

const CUSTOM_OPTION = 'CUSTOM_USER_DEFINED';

const CreateRelationshipDialog: React.FC<CreateRelationshipDialogProps> = ({
  open,
  onClose,
  onSubmit,
  sourceNode,
  targetNode,
}) => {
  const [relationshipType, setRelationshipType] = useState('');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');

  // Derive available options during render
  const source = sourceNode?.type || '';
  const target = targetNode?.type || '';
  const availableOptions = RELATIONSHIP_OPTIONS[source]?.[target] || [];

  // Reset state when dialog opens or nodes change
  const [lastResetKey, setLastResetKey] = useState<string | null>(null);
  const currentResetKey = open ? `${sourceNode?.id}-${targetNode?.id}` : null;

  if (currentResetKey !== lastResetKey) {
    setLastResetKey(currentResetKey);
    if (open) {
      if (availableOptions.length > 0) {
        setRelationshipType(availableOptions[0]);
      } else {
        setRelationshipType(CUSTOM_OPTION);
      }
      setCustomType('');
      setDescription('');
    }
  }

  const handleSubmit = () => {
    const finalType =
      relationshipType === CUSTOM_OPTION ? customType : relationshipType;
    onSubmit({ relationshipType: finalType, description });
    onClose();
  };

  if (!sourceNode || !targetNode) return null;

  const isCustom = relationshipType === CUSTOM_OPTION;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Relationship</DialogTitle>
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

        {availableOptions.length > 0 ? (
          <FormControl fullWidth margin="dense">
            <InputLabel>Relationship Type</InputLabel>
            <Select
              value={relationshipType}
              label="Relationship Type"
              onChange={(e) => setRelationshipType(e.target.value)}
            >
              {availableOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt} (System Defined)
                </MenuItem>
              ))}
              <MenuItem value={CUSTOM_OPTION}>Other (User Defined)</MenuItem>
            </Select>
          </FormControl>
        ) : null}

        {(isCustom || availableOptions.length === 0) && (
          <TextField
            autoFocus={availableOptions.length === 0}
            margin="dense"
            label="Custom Relationship Type"
            fullWidth
            variant="outlined"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            placeholder="e.g. RELATED_TO"
            helperText="Uppercase with underscores recommended"
          />
        )}

        <TextField
          margin="dense"
          label="Description"
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
          disabled={relationshipType === CUSTOM_OPTION && !customType}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRelationshipDialog;
