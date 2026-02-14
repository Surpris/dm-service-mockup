import { useQuery } from '@apollo/client/react';
import { DataGrid, type GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { GET_PROJECTS } from '../graphql/queries';
import type { ProjectsData } from '../types/graphql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'projectNumber', headerName: 'Project Number', width: 150 },
  { field: 'description', headerName: 'Description', width: 400 },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

export default function ProjectList() {
  const { loading, error, data } = useQuery<ProjectsData>(GET_PROJECTS);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error">Error loading projects: {error.message}</Alert>
    );

  return (
    <Box sx={{ height: 600, width: '100%' }} data-testid="project-list-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <Paper sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={data?.projects || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: { id: false },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
