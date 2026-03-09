import { Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

export function AccountAvatar() {
  const { t } = useTranslation();

  return (
    <Avatar
      aria-label={t('layout.account')}
      sx={(theme) => ({
        width: theme.custom.layout.controlSize,
        height: theme.custom.layout.controlSize,
        backgroundColor: alpha(theme.heroui.default[200], 0.5),
        cursor: 'pointer',
        transition: `all ${theme.heroui.transitions.fast}`,
        '&:hover': {
          backgroundColor: alpha(theme.heroui.default[300], 0.5),
        },
      })}
    >
      <Icon icon="solar:user-bold-duotone" width={18} />
    </Avatar>
  );
}
