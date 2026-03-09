import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ZeroThemeProvider } from '@zero/theme';
import { useTranslation } from 'react-i18next';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ReportViewerPage } from './pages/ReportViewerPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppRoutes() {
  const { i18n } = useTranslation();

  return (
    <ZeroThemeProvider locale={i18n.language as 'ru' | 'en'}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/r/:token" element={<ReportViewerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ZeroThemeProvider>
  );
}

export default AppRoutes;
