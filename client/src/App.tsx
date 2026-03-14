import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ZeroThemeProvider } from '@zero/theme';
import { useTranslation } from 'react-i18next';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { ReportViewerPage } from './pages/ReportViewerPage';
import { NotFoundPage } from './pages/NotFoundPage';

const SUPPORTED_LOCALES = ['ru', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(lang: string): lang is SupportedLocale {
  return SUPPORTED_LOCALES.includes(lang as SupportedLocale);
}

function AppRoutes() {
  const { i18n } = useTranslation();
  const locale: SupportedLocale = isSupportedLocale(i18n.language) ? i18n.language : 'en';

  return (
    <ZeroThemeProvider locale={locale}>
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

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
