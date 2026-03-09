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
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { axiosInstance } from '../providers';
import type { ReportListItem } from '../types/report';
import { resolveLocale } from '../utils/locale';

export function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = `${t('home.title')} | ZeroReports`;
  }, [t]);

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
    void navigator.clipboard.writeText(url);
  };

  const dateLocale = lang === 'en' ? 'en-US' : 'ru-RU';

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {t('home.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('home.subtitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('home.errorLoad')}
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
          <Box
            sx={(theme) => ({
              color: 'text.secondary',
              opacity: theme.custom.iconOpacity.emptyState,
              mb: 2,
            })}
          >
            <Icon icon="solar:chart-square-bold-duotone" width={64} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            {t('home.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('home.emptyHint')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                variant="interactive"
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => navigate(`/r/${report.token}`)}
                role="article"
                aria-label={resolveLocale(report.title, lang)}
              >
                <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                  {resolveLocale(report.title, lang)}
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
                    {resolveLocale(report.description, lang)}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.caption' }}>
                    {new Date(report.createdAt).toLocaleDateString(dateLocale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Box>
                    <Tooltip title={t('common.copyLink')}>
                      <IconButton
                        aria-label={t('common.copyLink')}
                        size="small"
                        onClick={(e) => copyLink(report.token, e)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Icon icon="solar:copy-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.open')}>
                      <IconButton
                        aria-label={t('common.open')}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/r/${report.token}`);
                        }}
                      >
                        <Icon icon="solar:square-arrow-right-up-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default HomePage;
