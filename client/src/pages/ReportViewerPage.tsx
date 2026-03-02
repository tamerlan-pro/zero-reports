import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { ErrorOutline, Inbox, Refresh } from '@mui/icons-material';
import { axiosInstance } from '../providers';
import { Layout } from '../components/Layout';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import type { Report } from '../types/report';

export function ReportViewerPage() {
  const { token } = useParams<{ token: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'network' | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(`/reports/${token}`);
      setReport(data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 404 ? 'not_found' : 'network');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReport();
  }, [token]);

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (error === 'not_found') {
    return (
      <Layout>
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
          <ErrorOutline
            sx={(theme) => ({
              fontSize: 64,
              color: 'text.secondary',
              opacity: theme.custom.iconOpacity.emptyState,
            })}
          />
          <Typography variant="h5" color="text.secondary">
            Отчет не найден
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Проверьте ссылку или обратитесь к администратору
          </Typography>
          <Button variant="outlined" href="/" sx={{ mt: 2 }}>
            На главную
          </Button>
        </Box>
      </Layout>
    );
  }

  if (error === 'network') {
    return (
      <Layout>
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
                startIcon={<Refresh />}
                onClick={fetchReport}
              >
                Повторить
              </Button>
            }
            sx={{ maxWidth: 500, width: '100%' }}
          >
            Не удалось загрузить отчет. Проверьте подключение к сети.
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!report) return null;

  const blocks = report.config?.blocks || [];

  if (blocks.length === 0) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Inbox
            sx={(theme) => ({
              fontSize: 64,
              color: 'text.secondary',
              opacity: theme.custom.iconOpacity.emptyState,
              mb: 2,
            })}
          />
          <Typography variant="h6" color="text.secondary">
            Отчет пока не содержит данных
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {report.title}
        </Typography>
        {report.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {report.description}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.caption' }}>
          {new Date(report.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
      </Box>

      <Stack spacing={4}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </Stack>
    </Layout>
  );
}
