import type { PropsWithChildren } from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export function Layout({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <Box component="span" sx={{ color: 'primary.main', display: 'flex' }}>
              <Icon icon="solar:chart-square-bold-duotone" width={24} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              ZeroReports
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flex: 1, py: 4, px: 3, maxWidth: 1200, mx: 'auto', width: '100%' }}
      >
        {children}
      </Box>
      <Box
        component="footer"
        sx={(theme) => ({
          py: 3,
          px: 3,
          textAlign: 'center',
          borderTop: `1px solid ${theme.palette.surface.level2}`,
        })}
      >
        <Typography variant="caption" sx={{ color: 'text.caption' }}>
          ZeroReports
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout;
