import { Typography, type TypographyProps } from '@mui/material';
import type { ReactNode } from 'react';

interface BlockTitleProps extends Omit<TypographyProps, 'variant' | 'children'> {
  children: ReactNode;
}

/**
 * Standard block heading. Uses h6 variant — controlled by theme typography.
 */
export function BlockTitle({ children, sx, ...rest }: BlockTitleProps) {
  return (
    <Typography
      variant="h6"
      sx={[{ mb: 2.5 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    >
      {children}
    </Typography>
  );
}
