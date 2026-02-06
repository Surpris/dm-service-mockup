import { Box, Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              System Status
            </Typography>
            <Typography component="p" variant="h4">
              Online
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Backend is connected
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
