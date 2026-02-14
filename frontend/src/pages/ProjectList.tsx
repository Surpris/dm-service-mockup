import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
  type GridEventListener,
} from '@mui/x-data-grid';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { GET_PROJECTS } from '../graphql/queries';
import type { ProjectsData } from '../types/graphql';

export default function ProjectList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<ProjectsData>(GET_PROJECTS);

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    navigate(`/projects/${params.id}`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'projectNumber', headerName: 'Project Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 350 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${params.id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

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
          onRowClick={handleRowClick}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>
    </Box>
  );
}
