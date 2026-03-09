const en = {
  common: {
    search: 'Search...',
    collapse: 'Collapse',
    expand: 'Expand',
    columns: 'Columns',
    filters: 'Filters',
    exportCsv: 'Export CSV',
    print: 'Print',
    clearSearch: 'Clear search',
    retry: 'Retry',
    toHome: 'Go home',
    copyLink: 'Copy link',
    open: 'Open',
  },
  home: {
    title: 'Reports',
    subtitle: 'Interactive reports with data and visualizations',
    errorLoad: 'Failed to load report list',
    emptyTitle: 'No reports yet',
    emptyHint: 'Create a report via API: POST /reports',
  },
  report: {
    toc: 'Table of Contents',
    notFound: 'Report not found',
    notFoundHint: 'Check the link or contact the administrator',
    emptyReport: 'The report has no data yet',
    networkError: 'Failed to load the report. Check your network connection.',
  },
  notFound: {
    title: 'Page not found',
    toHome: 'Go home',
  },
  layout: {
    search: 'Search',
    searchPlaceholder: 'Search...',
    footer: 'ZeroReports',
    switchLanguage: 'Switch to Russian',
    skipToContent: 'Skip to content',
    goHome: 'Go to home',
    account: 'Account',
  },
} as const;

export default en;
