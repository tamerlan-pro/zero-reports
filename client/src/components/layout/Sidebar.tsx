import { useState, type ReactNode } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export interface SidebarConfig {
  title: string;
  body: ReactNode;
  collapsedBody?: ReactNode;
  footer?: ReactNode;
}

interface Props {
  config: SidebarConfig;
}

export function Sidebar({ config }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  return (
    <Box
      component="aside"
      sx={(theme) => ({
        width: open
          ? theme.custom.layout.sidebarWidthOpen
          : theme.custom.layout.sidebarWidthClosed,
        minWidth: open
          ? theme.custom.layout.sidebarWidthOpen
          : theme.custom.layout.sidebarWidthClosed,
        height: 'calc(100vh - 24px)',
        display: 'flex',
        flexDirection: 'column',
        background: theme.custom.surface.card.background,
        border: theme.custom.surface.card.border,
        boxShadow: theme.custom.surface.card.shadow,
        borderRadius: `${theme.custom.layout.cardRadius}px`,
        transition: `width ${theme.heroui.transitions.slow}, min-width ${theme.heroui.transitions.slow}`,
        overflow: 'hidden',
        flexShrink: 0,
        alignSelf: 'flex-start',
      })}
    >
      {/* Header */}
      <Box
        sx={(theme) => ({
          height: theme.custom.layout.headerHeight,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          flexShrink: 0,
          gap: open ? 1 : 0,
        })}
      >
        <Typography
          sx={(theme) => ({
            flex: open ? 1 : 0,
            minWidth: 0,
            fontSize: theme.heroui.typography.tiny.fontSize,
            lineHeight: theme.heroui.typography.tiny.lineHeight,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: theme.heroui.default[400],
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            opacity: open ? 1 : 0,
            transition: `opacity ${theme.heroui.transitions.fast}`,
            pl: open ? 1 : 0,
          })}
        >
          {config.title}
        </Typography>
        <Tooltip title={open ? t('common.collapse') : config.title} placement="right">
          <IconButton
            aria-label={open ? t('common.collapse') : t('common.expand')}
            onClick={() => setOpen((v) => !v)}
            size="small"
            sx={(theme) => ({
              width: theme.custom.layout.controlSize,
              height: theme.custom.layout.controlSize,
              flexShrink: 0,
              borderRadius: `${theme.heroui.radius.small}px`,
              color: theme.heroui.default[400],
              '&:hover': {
                backgroundColor: alpha(theme.heroui.default[200], 0.5),
                color: theme.heroui.default[600],
              },
            })}
          >
            <Icon
              icon={open ? 'solar:sidebar-minimalistic-bold' : 'solar:hamburger-menu-bold'}
              width={18}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Body area — both views always mounted, crossfade via opacity */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Expanded body */}
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: theme.custom.layout.sidebarWidthOpen,
            display: 'flex',
            flexDirection: 'column',
            opacity: open ? 1 : 0,
            transition: `opacity ${theme.heroui.transitions.fast}`,
            transitionDelay: open ? '90ms' : '0ms',
            pointerEvents: open ? 'auto' : 'none',
          })}
        >
          <Box
            aria-hidden="true"
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              background: theme.custom.surface.fadeTop,
              zIndex: 1,
              pointerEvents: 'none',
            })}
          />
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              pt: 2.5,
              pb: 2.5,
            }}
          >
            {config.body}
          </Box>
          <Box
            aria-hidden="true"
            sx={(theme) => ({
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 20,
              background: theme.custom.surface.fadeBottom,
              zIndex: 1,
              pointerEvents: 'none',
            })}
          />
        </Box>

        {/* Collapsed body */}
        {config.collapsedBody && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              opacity: open ? 0 : 1,
              transition: `opacity ${theme.heroui.transitions.fast}`,
              transitionDelay: open ? '0ms' : '90ms',
              pointerEvents: open ? 'none' : 'auto',
            })}
          >
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 16,
                background: theme.custom.surface.fadeTop,
                zIndex: 1,
                pointerEvents: 'none',
              })}
            />
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                pt: 2,
                pb: 2,
              }}
            >
              {config.collapsedBody}
            </Box>
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 16,
                background: theme.custom.surface.fadeBottom,
                zIndex: 1,
                pointerEvents: 'none',
              })}
            />
          </Box>
        )}
      </Box>

      {/* Footer */}
      {config.footer && (
        <Box
          sx={(theme) => ({
            flexShrink: 0,
            borderTop: `1px solid ${alpha(theme.heroui.layout.divider, 0.06)}`,
            px: 2,
            py: 1,
            opacity: open ? 1 : 0,
            transition: `opacity ${theme.heroui.transitions.fast}`,
            pointerEvents: open ? 'auto' : 'none',
          })}
        >
          {config.footer}
        </Box>
      )}
    </Box>
  );
}
