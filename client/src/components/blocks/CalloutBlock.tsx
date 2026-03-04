import { Alert, AlertTitle } from '@mui/material';
import type { CalloutBlock as CalloutBlockType } from '../../types/report';

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  return (
    <Alert
      severity={block.severity}
      sx={{
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      {block.title && <AlertTitle>{block.title}</AlertTitle>}
      {block.content}
    </Alert>
  );
}
