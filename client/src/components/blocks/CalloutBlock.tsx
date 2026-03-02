import { Alert, AlertTitle } from '@mui/material';
import type { CalloutBlock as CalloutBlockType } from '../../types/report';

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  return (
    <Alert
      severity={block.severity}
      variant="outlined"
      sx={{
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      {block.title && <AlertTitle sx={{ fontWeight: 600 }}>{block.title}</AlertTitle>}
      {block.content}
    </Alert>
  );
}
