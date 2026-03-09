import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export function NotFoundPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('notFound.title')} | ZeroReports`;
  }, [t]);

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
        <Icon icon="solar:magnifer-zoom-in-bold-duotone" width={64} />
      </Box>
      <Typography variant="h4" color="text.secondary">
        404
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('notFound.title')}
      </Typography>
      <Button variant="outlined" href="/" sx={{ mt: 2 }}>
        {t('notFound.toHome')}
      </Button>
    </Box>
  );
}
