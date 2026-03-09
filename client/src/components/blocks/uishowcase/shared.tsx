import { Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

export const COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

export function SectionTitle({ children }: { children: string }) {
  return (
    <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
      {children}
    </Typography>
  );
}

export function SubTitle({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {children}
    </Typography>
  );
}

export function SwitchThumbIcon({ icon }: { icon: string }) {
  return (
    <Box
      sx={(theme) => ({
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: theme.palette.common.white,
        boxShadow: theme.heroui.shadows.base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Box component="span" sx={(theme) => ({ color: theme.heroui.default[400], display: 'flex' })}>
        <Icon icon={icon} width={14} height={14} />
      </Box>
    </Box>
  );
}
