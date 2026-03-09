import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CalloutBlock as CalloutBlockType } from '../../types/report';
import { resolveLocale } from '../../utils/locale';

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Alert
      severity={block.severity}
      sx={{
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      {block.title && <AlertTitle>{resolveLocale(block.title, lang)}</AlertTitle>}
      {resolveLocale(block.content, lang)}
    </Alert>
  );
}
