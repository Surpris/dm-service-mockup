import { Box, Typography, Paper } from '@mui/material';
import GraphContainer from '../features/graph/components/GraphContainer';

const GraphPage = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Knowledge Graph
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          flexGrow: 1,
          height: '70vh',
          width: '70vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <GraphContainer />
      </Paper>
    </Box>
  );
};

export default GraphPage;
