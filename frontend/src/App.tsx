
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Typography, 
  Button,
  Container
} from '@mui/material'

// Create a default theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Home() {
  const [count, setCount] = useState(0)

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Frontend Environment Setup
        </Typography>
        <Typography variant="body1">
          React + Vite + MUI + TypeScript
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
            Count is {count}
          </Button>
          <Button variant="outlined" color="secondary">
            MUI Button
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
