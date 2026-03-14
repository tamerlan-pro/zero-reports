import { heroui } from './tokens/colors.ts';
import type { ZeroCustomTokens } from './types.ts';

export const custom: ZeroCustomTokens = {
  chartColors: [
    heroui.primary[400],
    heroui.success[400],
    heroui.warning[400],
    heroui.danger[400],
    '#06B7DB',
    heroui.secondary[400],
  ],
  chartColorPairs: {
    [heroui.primary[400]]: heroui.primary[300],
    [heroui.secondary[400]]: heroui.secondary[300],
    [heroui.success[400]]: heroui.success[300],
    [heroui.warning[400]]: heroui.warning[300],
    [heroui.danger[400]]: heroui.danger[300],
    [heroui.default[400]]: heroui.default[300],
    '#06B7DB': '#09AACD',
  },
  iconOpacity: {
    emptyState: 0.4,
    muted: 0.7,
  },
  iconSize: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 24,
    xl: 32,
    hero: 64,
  },
  layout: {
    maxWidth: 1200,
    contentPadding: 3,
    pagePadding: 1.5,
    contentGap: 1.5,
    cardRadius: 16,
    sidebarWidthOpen: 280,
    sidebarWidthClosed: 48,
    controlSize: 32,
    headerHeight: heroui.layout.appBarHeight,
  },
  surface: {
    card: {
      background: `linear-gradient(to bottom, ${heroui.content[1]}, ${heroui.layout.background})`,
      border: `1px solid rgba(43, 43, 45, 0.4)`,
      shadow: '0px 4px 10px 0px rgba(105, 104, 104, 0.25)',
    },
    dropdown: heroui.content[1],
    fadeTop: `linear-gradient(to bottom, ${heroui.content[1]}, transparent)`,
    fadeBottom: `linear-gradient(to top, ${heroui.layout.background}, transparent)`,
    fadeHeader: `linear-gradient(to bottom, ${heroui.layout.background}, transparent)`,
  },
  chart: {
    defaultHeight: 350,
    sparklineMaxHeight: 150,
    gaugeMaxHeight: 300,
    gaugeSize: 300,
    gaugeFontSize: 22,
    lineStrokeWidth: 2.5,
    barBorderRadius: 6,
  },
  dataGrid: {
    rowHeight: 40,
    headerHeight: 40,
    toolbarHeight: 52,
    footerHeight: 56,
  },
  search: {
    width: 340,
    height: 34,
  },
  zIndex: {
    sidebar: 10,
    header: 20,
    dropdown: 30,
    modal: 40,
    overlay: 50,
    tooltip: 60,
  },
};
