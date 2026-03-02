import { Box, Typography, Button } from '@mui/material';
import { SearchOff } from '@mui/icons-material';
import { Layout } from '../components/Layout';

export function NotFoundPage() {
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
        <SearchOff
          sx={(theme) => ({
            fontSize: 64,
            color: 'text.secondary',
            opacity: theme.custom.iconOpacity.emptyState,
          })}
        />
        <Typography variant="h4" color="text.secondary">
          404
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Страница не найдена
        </Typography>
        <Button variant="outlined" href="/" sx={{ mt: 2 }}>
          На главную
        </Button>
      </Box>
    </Layout>
  );
}
