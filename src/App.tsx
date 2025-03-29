import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Suspense, lazy } from 'react';
import Layout from '@/components/Layout';
import { TuneProvider } from '@/context/TuneContext';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load page components
const TuneList = lazy(() => import('@/pages/TuneList'));
const TuneDetail = lazy(() => import('@/pages/TuneDetail'));
const Practice = lazy(() => import('@/pages/Practice'));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TuneProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<TuneList />} />
                <Route path="/tune/:id" element={<TuneDetail />} />
                <Route path="/practice" element={<Practice />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </TuneProvider>
    </ThemeProvider>
  );
}

export default App; 