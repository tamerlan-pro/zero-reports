import { useState, memo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { resolveLocale } from '../../utils/locale';
import type { TabsBlock as TabsBlockType } from '../../types/report';
import { BlockRenderer } from './BlockRenderer';

interface Props {
  block: TabsBlockType;
}

export const TabsBlock = memo(function TabsBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [activeTab, setActiveTab] = useState<string>(
    block.defaultTab ?? block.tabs[0]?.id ?? '',
  );

  const activeTabData = block.tabs.find((t) => t.id === activeTab);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value: string) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="report tabs"
        >
          {block.tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={resolveLocale(tab.label, lang)}
              icon={tab.icon ? <Icon icon={tab.icon} width={18} /> : undefined}
              iconPosition="start"
              aria-controls={`tab-panel-${tab.id}`}
              id={`tab-${tab.id}`}
            />
          ))}
        </Tabs>
      </Box>

      {activeTabData && (
        <Box
          role="tabpanel"
          id={`tab-panel-${activeTabData.id}`}
          aria-labelledby={`tab-${activeTabData.id}`}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeTabData.blocks.map((childBlock, i) => (
              <BlockRenderer key={i} block={childBlock} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
});
