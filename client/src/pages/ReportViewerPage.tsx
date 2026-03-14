import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { axiosInstance } from '../providers';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { ReportFilterProvider, extractFilterDefs } from '../context/ReportFilterContext';
import { TableOfContents, TocDots, extractTocItems } from '../components/TableOfContents';
import { useAppLayout } from '../components/layout/AppLayout';
import { extractSearchItems } from '../utils/searchIndex';
import { resolveLocale } from '../utils/locale';
import type { Report } from '../types/report';

export function ReportViewerPage() {
  const { token } = useParams<{ token: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'network' | null>(null);
  const { setSidebar, setSearchItems } = useAppLayout();

  const fetchReport = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Report>(`/reports/${token}`);
      setReport(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.status === 404 ? 'not_found' : 'network');
      } else {
        setError('network');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  const blocks = report?.config?.blocks ?? [];
  const tocItems = useMemo(() => extractTocItems(blocks, lang), [blocks, lang]);
  const searchItems = useMemo(() => extractSearchItems(blocks), [blocks]);
  const filterDefs = useMemo(() => extractFilterDefs(blocks), [blocks]);

  useEffect(() => {
    if (report) {
      document.title = `${resolveLocale(report.title, lang)} | ZeroReports`;
    }
  }, [report, lang]);

  useEffect(() => {
    if (tocItems.length > 0) {
      setSidebar({
        title: t('report.toc'),
        body: <TableOfContents items={tocItems} />,
        collapsedBody: <TocDots items={tocItems} />,
      });
    } else {
      setSidebar(null);
    }
    return () => setSidebar(null);
  }, [tocItems, setSidebar, t]);

  useEffect(() => {
    setSearchItems(searchItems);
    return () => setSearchItems([]);
  }, [searchItems, setSearchItems]);

  const dateLocale = lang === 'en' ? 'en-US' : 'ru-RU';

  if (loading) {
    return (
      <Stack spacing={4}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Stack direction="row" spacing={2.5}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={120} sx={{ flex: 1 }} />
          ))}
        </Stack>
        <Skeleton variant="rounded" height={350} />
        <Skeleton variant="rounded" height={300} />
      </Stack>
    );
  }

  if (error === 'not_found') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Box
          sx={(theme) => ({
            color: 'text.secondary',
            opacity: theme.custom.iconOpacity.emptyState,
          })}
        >
          <Icon icon="solar:danger-circle-bold-duotone" width={64} />
        </Box>
        <Typography variant="h5" color="text.secondary">
          {t('report.notFound')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('report.notFoundHint')}
        </Typography>
        <Button variant="outlined" href="/" sx={{ mt: 2 }}>
          {t('common.toHome')}
        </Button>
      </Box>
    );
  }

  if (error === 'network') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Icon icon="solar:refresh-bold-duotone" width={20} />}
              onClick={() => void fetchReport()}
            >
              {t('common.retry')}
            </Button>
          }
          sx={{ maxWidth: 500, width: '100%' }}
        >
          {t('report.networkError')}
        </Alert>
      </Box>
    );
  }

  if (!report) return null;

  if (blocks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Box
          sx={(theme) => ({
            color: 'text.secondary',
            opacity: theme.custom.iconOpacity.emptyState,
            mb: 2,
          })}
        >
          <Icon icon="solar:inbox-bold-duotone" width={64} />
        </Box>
        <Typography variant="h6" color="text.secondary">
          {t('report.emptyReport')}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {resolveLocale(report.title, lang)}
          </Typography>
          {report.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {resolveLocale(report.description, lang)}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: 'text.caption' }}>
            {new Date(report.createdAt).toLocaleDateString(dateLocale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        </Box>
      </Box>

      <ReportFilterProvider filterDefs={filterDefs}>
        <Stack spacing={4}>
          {blocks.map((block, i) => (
            <Box key={i} id={`block-${i}`} sx={{ scrollMarginTop: '64px' }}>
              <BlockRenderer block={block} />
            </Box>
          ))}
        </Stack>
      </ReportFilterProvider>
    </>
  );
}
