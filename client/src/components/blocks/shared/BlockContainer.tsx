import { Paper, type PaperProps } from '@mui/material';
import type { ReactNode } from 'react';

interface BlockContainerProps extends Omit<PaperProps, 'children'> {
  children: ReactNode;
  noPadding?: boolean;
}

/**
 * Standard block wrapper. All visual styles (background, border, shadow)
 * come from the MuiPaper theme override — no visual values here.
 */
export function BlockContainer({ children, noPadding = false, sx, ...rest }: BlockContainerProps) {
  return (
    <Paper
      sx={[{ p: noPadding ? 0 : 3, overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    >
      {children}
    </Paper>
  );
}
