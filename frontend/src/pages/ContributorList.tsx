import { useQuery } from '@apollo/client/react';
import { DataGrid, type GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { GET_CONTRIBUTORS } from '../graphql/queries';
import type { ContributorsData } from '../types/graphql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'contributorId', headerName: 'Contributor ID', width: 150 },
  { field: 'name', headerName: 'Name', width: 250 },
];

export default function ContributorList() {
  const { loading, error, data } = useQuery<ContributorsData>(GET_CONTRIBUTORS);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error">
        Error loading contributors: {error.message}
      </Alert>
    );

  return (
    <Box
      sx={{ height: 600, width: '100%' }}
      data-testid="contributor-list-page"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Contributors
      </Typography>
      <Paper sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={data?.contributors || []}
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
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
