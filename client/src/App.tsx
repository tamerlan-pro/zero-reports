import { Refine } from '@refinedev/core';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import routerBindings, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { dataProvider, authProvider } from './providers';
import { Layout } from './components/Layout';
import { HomePage, ArtistsPage, TracksPage } from './pages';

// Тема Material UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

// Layout wrapper для роутов
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: 'artists',
              list: '/artists',
              create: '/artists/create',
              edit: '/artists/edit/:id',
              show: '/artists/show/:id',
              meta: {
                canDelete: true,
                label: 'Артисты',
              },
            },
            {
              name: 'tracks',
              list: '/tracks',
              create: '/tracks/create',
              edit: '/tracks/edit/:id',
              show: '/tracks/show/:id',
              meta: {
                canDelete: true,
                label: 'Треки',
              },
            },
            {
              name: 'releases',
              list: '/releases',
              create: '/releases/create',
              edit: '/releases/edit/:id',
              show: '/releases/show/:id',
              meta: {
                canDelete: true,
                label: 'Релизы',
              },
            },
            {
              name: 'analytics',
              list: '/analytics',
              meta: {
                label: 'Аналитика',
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route element={<LayoutWrapper />}>
              <Route index element={<HomePage />} />
              <Route path="artists" element={<ArtistsPage />} />
              <Route path="tracks" element={<TracksPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>

          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
