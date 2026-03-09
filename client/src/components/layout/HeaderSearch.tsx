import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  IconButton,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import type { SearchItem } from '../../utils/searchIndex';
import { resolveLocale } from '../../utils/locale';

const ICON_MAP: Record<SearchItem['type'], string> = {
  heading: 'solar:text-bold',
  chart: 'solar:chart-2-bold-duotone',
  table: 'solar:widget-5-bold-duotone',
  text: 'solar:document-text-bold-duotone',
  metric: 'solar:graph-up-bold-duotone',
  callout: 'solar:info-circle-bold-duotone',
};

interface Props {
  items: SearchItem[];
}

export function HeaderSearch({ items }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setInputValue('');
  }, []);

  const handleSelect = useCallback(
    (_event: React.SyntheticEvent, value: SearchItem | string | null) => {
      if (!value || typeof value === 'string') return;
      const el = document.getElementById(value.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
      }
      if (e.key === 'Escape' && open) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleOpen, handleClose]);

  if (items.length === 0) return null;

  if (!open) {
    return (
      <IconButton
        aria-label={t('layout.search')}
        onClick={handleOpen}
        size="small"
        sx={(theme) => ({
          width: theme.custom.layout.controlSize,
          height: theme.custom.layout.controlSize,
          borderRadius: `${theme.heroui.radius.small}px`,
          color: theme.heroui.default[400],
          '&:hover': {
            backgroundColor: alpha(theme.heroui.default[200], 0.5),
            color: theme.heroui.default[600],
          },
        })}
      >
        <Icon icon="solar:magnifer-bold-duotone" width={18} />
      </IconButton>
    );
  }

  return (
    <Autocomplete
      open
      freeSolo
      disableClearable
      options={items}
      inputValue={inputValue}
      onInputChange={(_e, v) => setInputValue(v)}
      onChange={handleSelect}
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : resolveLocale(opt.label, lang))}
      groupBy={(opt) => resolveLocale(opt.section, lang)}
      filterOptions={(options, state) => {
        const q = state.inputValue.toLowerCase();
        if (!q) return options.slice(0, 20);
        return options.filter((o) => {
          const ru = resolveLocale(o.label, 'ru').toLowerCase();
          const en = resolveLocale(o.label, 'en').toLowerCase();
          return ru.includes(q) || en.includes(q);
        });
      }}
      renderGroup={(params) => (
        <li key={params.key}>
          {params.group && (
            <Box
              sx={(theme) => ({
                px: 1.5,
                py: 0.5,
                fontSize: theme.heroui.typography.tiny.fontSize,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.heroui.default[400],
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: theme.custom.surface.dropdown,
              })}
            >
              {params.group}
            </Box>
          )}
          <Box component="ul" sx={{ padding: 0, margin: 0 }}>{params.children}</Box>
        </li>
      )}
      renderOption={(props, option) => {
        const { key, ...rest } = props;
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              cursor: 'pointer',
              borderRadius: `${theme.heroui.radius.small}px`,
              fontSize: theme.heroui.typography.small.fontSize,
              color: theme.heroui.default[600],
              '&:hover': {
                backgroundColor: alpha(theme.heroui.default[200], 0.4),
                color: theme.heroui.default[800],
              },
              '&[aria-selected="true"]': {
                backgroundColor: `${alpha(theme.heroui.primary[400], 0.12)} !important`,
                color: `${theme.heroui.primary[400]} !important`,
              },
            })}
          >
            <Box component="span" sx={{ flexShrink: 0, opacity: 0.6, display: 'flex' }}>
              <Icon icon={ICON_MAP[option.type]} width={16} />
            </Box>
            <Typography
              noWrap
              sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}
            >
              {resolveLocale(option.label, lang)}
            </Typography>
          </Box>
        );
      }}
      onClose={(_e, reason) => {
        if (reason === 'escape') handleClose();
      }}
      onBlur={handleClose}
      slotProps={{
        popper: {
          sx: (theme) => ({
            '& .MuiAutocomplete-paper': {
              backgroundColor: theme.custom.surface.dropdown,
              border: theme.custom.surface.card.border,
              borderRadius: `${theme.heroui.radius.medium}px`,
              boxShadow: theme.heroui.shadows.xl,
              mt: 0.5,
              maxHeight: 400,
            },
            '& .MuiAutocomplete-listbox': {
              py: 0.5,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            },
          }),
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          placeholder={t('layout.searchPlaceholder')}
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <Box component="span" sx={{ opacity: 0.5, display: 'flex' }}>
                    <Icon icon="solar:magnifer-bold-duotone" width={16} />
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0 }}>
                  <Box
                    component="kbd"
                    sx={(theme) => ({
                      fontSize: theme.heroui.typography.tiny.fontSize,
                      px: 0.5,
                      py: 0.2,
                      borderRadius: `${theme.heroui.radius.small / 2}px`,
                      border: `1px solid ${alpha(theme.heroui.default[300], 0.3)}`,
                      color: theme.heroui.default[400],
                      lineHeight: 1,
                    })}
                  >
                    ESC
                  </Box>
                </InputAdornment>
              ),
            },
          }}
          sx={(theme) => ({
            width: theme.custom.search.width,
            '& .MuiOutlinedInput-root': {
              height: theme.custom.search.height,
              borderRadius: `${theme.heroui.radius.small}px`,
              backgroundColor: alpha(theme.heroui.default[50], 0.6),
              fontSize: theme.heroui.typography.small.fontSize,
              color: theme.heroui.default[700],
              '& fieldset': {
                borderColor: alpha(theme.heroui.default[200], 0.4),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.heroui.default[300], 0.5),
              },
              '&.Mui-focused fieldset': {
                borderColor: alpha(theme.heroui.primary[400], 0.5),
                borderWidth: 1,
              },
            },
          })}
        />
      )}
      sx={{ flexShrink: 0 }}
    />
  );
}
