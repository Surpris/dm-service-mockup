import { useQuery } from '@apollo/client/react';
import { DataGrid, type GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { GET_DATASETS } from '../graphql/queries';
import type { Dataset, DatasetsData } from '../types/graphql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'datasetNo', headerName: 'No.', width: 70, type: 'number' },
  { field: 'title', headerName: 'Title', width: 300 },
  { field: 'accessPolicy', headerName: 'Access Policy', width: 150 },
  {
    field: 'projectNumber',
    headerName: 'Project',
    width: 150,
    valueGetter: (_value: unknown, row: Dataset) =>
      row.project?.projectNumber || '-',
  },
  {
    field: 'collectedAt',
    headerName: 'Collected At',
    width: 200,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

export default function DatasetList() {
  const { loading, error, data } = useQuery<DatasetsData>(GET_DATASETS);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error">Error loading datasets: {error.message}</Alert>
    );

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Datasets
      </Typography>
      <Paper sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={data?.datasets || []}
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
