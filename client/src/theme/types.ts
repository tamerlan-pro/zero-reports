export interface ZeroCustomTokens {
  chartColors: string[];
  chartColorPairs: Record<string, string>;
  iconOpacity: {
    emptyState: number;
    muted: number;
  };
  iconSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    hero: number;
  };
  layout: {
    maxWidth: number;
    contentPadding: number;
    pagePadding: number;
    contentGap: number;
    cardRadius: number;
    sidebarWidthOpen: number;
    sidebarWidthClosed: number;
    controlSize: number;
    headerHeight: number;
  };
  surface: {
    card: {
      background: string;
      border: string;
      shadow: string;
    };
    dropdown: string;
    fadeTop: string;
    fadeBottom: string;
    fadeHeader: string;
  };
  chart: {
    defaultHeight: number;
    sparklineMaxHeight: number;
    gaugeMaxHeight: number;
    gaugeSize: number;
    gaugeFontSize: number;
    lineStrokeWidth: number;
    barBorderRadius: number;
  };
  dataGrid: {
    rowHeight: number;
    headerHeight: number;
    toolbarHeight: number;
    footerHeight: number;
  };
  search: {
    width: number;
    height: number;
  };
  zIndex: {
    sidebar: number;
    header: number;
    dropdown: number;
    modal: number;
    overlay: number;
    tooltip: number;
  };
}
