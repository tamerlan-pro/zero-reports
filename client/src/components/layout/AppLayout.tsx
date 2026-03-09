import { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { Sidebar, type SidebarConfig } from './Sidebar';
import { HeaderSearch } from './HeaderSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AccountAvatar } from './AccountAvatar';
import type { SearchItem } from '../../utils/searchIndex';

interface LayoutContext {
  setSidebar: (config: SidebarConfig | null) => void;
  setSearchItems: (items: SearchItem[]) => void;
}

export function useAppLayout() {
  return useOutletContext<LayoutContext>();
}

export function AppLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarConfig, setSidebar] = useState<SidebarConfig | null>(null);
  const [searchItems, setSearchItemsRaw] = useState<SearchItem[]>([]);

  const setSearchItems = useCallback((items: SearchItem[]) => {
    setSearchItemsRaw(items);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Skip-to-content for keyboard users */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
          '&:focus': {
            position: 'static',
            width: 'auto',
            height: 'auto',
            overflow: 'visible',
            zIndex: 9999,
          },
        }}
      >
        {t('layout.skipToContent')}
      </Box>

      <Box
        sx={(theme) => ({
          display: 'flex',
          height: '100vh',
          p: theme.custom.layout.pagePadding,
          gap: theme.custom.layout.contentGap,
          background: theme.heroui.layout.background,
        })}
      >
        {sidebarConfig && <Sidebar config={sidebarConfig} />}

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <Box
            component="header"
            sx={(theme) => ({
              position: 'sticky',
              top: 0,
              zIndex: theme.custom.zIndex.header,
              background: theme.heroui.layout.background,
            })}
          >
            <Box
              sx={(theme) => ({
                background: theme.custom.surface.card.background,
                border: theme.custom.surface.card.border,
                boxShadow: theme.custom.surface.card.shadow,
                borderRadius: `${theme.custom.layout.cardRadius}px`,
                height: theme.custom.layout.headerHeight,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                gap: 1,
              })}
            >
              <ButtonBase
                aria-label={t('layout.goHome')}
                onClick={() => navigate('/')}
                sx={(theme) => ({
                  color: 'primary.main',
                  display: 'flex',
                  flexShrink: 0,
                  borderRadius: `${theme.heroui.radius.small}px`,
                  p: 0.5,
                })}
              >
                <Icon icon="solar:chart-square-bold-duotone" width={22} />
              </ButtonBase>

              <HeaderSearch items={searchItems} />

              <Box sx={{ flex: 1 }} />

              <LanguageSwitcher />
              <AccountAvatar />
            </Box>

            <Box
              aria-hidden="true"
              sx={(theme) => ({
                height: 24,
                mb: '-24px',
                background: theme.custom.surface.fadeHeader,
                opacity: scrolled ? 1 : 0,
                pointerEvents: 'none',
                transition: `opacity ${theme.heroui.transitions.slow}`,
              })}
            />
          </Box>

          {/* Page content */}
          <Box
            id="main-content"
            component="main"
            sx={(theme) => ({
              flex: 1,
              pt: theme.custom.layout.contentPadding,
              px: theme.custom.layout.contentPadding,
              pb: theme.custom.layout.contentPadding,
              maxWidth: theme.custom.layout.maxWidth,
              mx: 'auto',
              width: '100%',
            })}
          >
            <Outlet context={{ setSidebar, setSearchItems }} />
          </Box>

          {/* Footer */}
          <Box component="footer" sx={{ pt: 1, flexShrink: 0 }}>
            <Box
              sx={(theme) => ({
                background: theme.custom.surface.card.background,
                border: theme.custom.surface.card.border,
                boxShadow: theme.custom.surface.card.shadow,
                borderRadius: `${theme.custom.layout.cardRadius}px`,
                height: theme.custom.layout.headerHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: 'text.caption',
                  fontSize: theme.heroui.typography.tiny.fontSize,
                })}
              >
                {t('layout.footer')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
