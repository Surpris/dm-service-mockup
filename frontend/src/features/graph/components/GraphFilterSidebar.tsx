import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Divider,
} from '@mui/material';

interface GraphFilterSidebarProps {
  filters: {
    showProjects: boolean;
    showDatasets: boolean;
    showContributors: boolean;
  };
  onFilterChange: (newFilters: GraphFilterSidebarProps['filters']) => void;
}

const GraphFilterSidebar: React.FC<GraphFilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box
      sx={{ width: 250, p: 2, borderLeft: '1px solid #ddd', height: '100%' }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Entity Types
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showProjects}
              onChange={handleChange}
              name="showProjects"
            />
          }
          label="Projects"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showDatasets}
              onChange={handleChange}
              name="showDatasets"
            />
          }
          label="Datasets"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showContributors}
              onChange={handleChange}
              name="showContributors"
            />
          }
          label="Contributors"
        />
      </FormGroup>
    </Box>
  );
};

export default GraphFilterSidebar;
