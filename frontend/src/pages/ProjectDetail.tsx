import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GET_PROJECT } from '../graphql/queries';
import type { ProjectData } from '../types/graphql';

/**
 * ProjectDetail component displays detailed information about a specific project,
 * including its basic information, associated datasets, and contributors.
 */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<ProjectData>(GET_PROJECT, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Error loading project: {error.message}</Alert>
    );
  }

  const project = data?.project;

  if (!project) {
    return <Alert severity="info">Project not found</Alert>;
  }

  return (
    <Box data-testid="project-detail-page">
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/projects"
          underline="hover"
          color="inherit"
        >
          Projects
        </Link>
        <Typography color="text.primary">{project.projectNumber}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Project Details: {project.projectNumber}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 1 }}>
          <Typography variant="subtitle2">Project Number:</Typography>
          <Typography variant="body1">{project.projectNumber}</Typography>

          <Typography variant="subtitle2">Description:</Typography>
          <Typography variant="body1">
            {project.description || 'No description'}
          </Typography>

          <Typography variant="subtitle2">Created At:</Typography>
          <Typography variant="body1">
            {new Date(project.createdAt).toLocaleString()}
          </Typography>

          <Typography variant="subtitle2">Updated At:</Typography>
          <Typography variant="body1">
            {project.updatedAt
              ? new Date(project.updatedAt).toLocaleString()
              : 'N/A'}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Datasets
          </Typography>
          <Divider />
          <List>
            {project.datasets && project.datasets.length > 0 ? (
              project.datasets.map((ds) => (
                <ListItem key={ds.id} divider>
                  <ListItemText
                    primary={`${ds.datasetNo}: ${ds.title}`}
                    secondary={`Policy: ${ds.accessPolicy}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No datasets associated with this project" />
              </ListItem>
            )}
          </List>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contributors
          </Typography>
          <Divider />
          <List>
            {project.contributors && project.contributors.length > 0 ? (
              project.contributors.map((pc) => (
                <ListItem key={pc.id} divider>
                  <ListItemText
                    primary={pc.contributor.name}
                    secondary={`Role: ${pc.role}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No contributors assigned to this project" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
