import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Skeleton,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { ContentCopy, OpenInNew, Assessment } from '@mui/icons-material';
import { axiosInstance } from '../providers';
import { Layout } from '../components/Layout';
import type { ReportListItem } from '../types/report';

export function HomePage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/reports')
      .then(({ data }) => setReports(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/r/${token}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Layout>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Отчеты
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Интерактивные отчеты с данными и визуализациями
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не удалось загрузить список отчетов
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : reports.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Assessment
            sx={(theme) => ({
              fontSize: 64,
              color: 'text.secondary',
              opacity: theme.custom.iconOpacity.emptyState,
              mb: 2,
            })}
          />
          <Typography variant="h6" color="text.secondary">
            Пока нет отчетов
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Создайте отчет через API: POST /reports
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={(theme) => ({
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: theme.palette.surface.level7,
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  },
                })}
                onClick={() => navigate(`/r/${report.token}`)}
              >
                <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                  {report.title}
                </Typography>
                {report.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flex: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {report.description}
                  </Typography>
                )}
                <Box
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto',
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.surface.level2}`,
                  })}
                >
                  <Typography variant="caption" sx={{ color: 'text.caption' }}>
                    {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Box>
                    <Tooltip title="Копировать ссылку">
                      <IconButton
                        size="small"
                        onClick={(e) => copyLink(report.token, e)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Открыть">
                      <IconButton
                        size="small"
                        sx={{ color: 'text.secondary' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/r/${report.token}`);
                        }}
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}

export default HomePage;
