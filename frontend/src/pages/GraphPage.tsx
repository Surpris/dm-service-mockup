import { Box, Typography, Paper } from '@mui/material';
import GraphContainer from '../features/graph/components/GraphContainer';

const GraphPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Knowledge Graph
      </Typography>
      <Paper elevation={3} sx={{ p: 2, height: '85vh' }}>
        <GraphContainer />
      </Paper>
    </Box>
  );
};

export default GraphPage;
