import { useCallback } from 'react';
import { ButtonBase } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isRu = i18n.language === 'ru';

  const toggle = useCallback(() => {
    void i18n.changeLanguage(isRu ? 'en' : 'ru');
  }, [i18n, isRu]);

  return (
    <ButtonBase
      aria-label={t('layout.switchLanguage')}
      onClick={toggle}
      sx={(theme) => ({
        width: theme.custom.layout.controlSize,
        height: theme.custom.layout.controlSize,
        borderRadius: `${theme.heroui.radius.small}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: theme.heroui.typography.tiny.fontSize,
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: theme.heroui.default[500],
        userSelect: 'none',
        transition: `all ${theme.heroui.transitions.fast}`,
        '&:hover': {
          backgroundColor: alpha(theme.heroui.default[200], 0.5),
          color: theme.heroui.default[700],
        },
      })}
    >
      {isRu ? 'RU' : 'EN'}
    </ButtonBase>
  );
}
