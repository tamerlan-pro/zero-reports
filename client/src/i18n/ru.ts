const ru = {
  common: {
    search: 'Поиск...',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    columns: 'Колонки',
    filters: 'Фильтры',
    exportCsv: 'Экспорт CSV',
    print: 'Печать',
    clearSearch: 'Очистить поиск',
    retry: 'Повторить',
    toHome: 'На главную',
    copyLink: 'Копировать ссылку',
    open: 'Открыть',
  },
  home: {
    title: 'Отчеты',
    subtitle: 'Интерактивные отчеты с данными и визуализациями',
    errorLoad: 'Не удалось загрузить список отчетов',
    emptyTitle: 'Пока нет отчетов',
    emptyHint: 'Создайте отчет через API: POST /reports',
  },
  report: {
    toc: 'Содержание',
    notFound: 'Отчет не найден',
    notFoundHint: 'Проверьте ссылку или обратитесь к администратору',
    emptyReport: 'Отчет пока не содержит данных',
    networkError: 'Не удалось загрузить отчет. Проверьте подключение к сети.',
  },
  notFound: {
    title: 'Страница не найдена',
    toHome: 'На главную',
  },
  layout: {
    search: 'Поиск',
    searchPlaceholder: 'Поиск...',
    footer: 'ZeroReports',
    switchLanguage: 'Переключить на английский',
    skipToContent: 'Перейти к содержимому',
    goHome: 'На главную',
    account: 'Аккаунт',
  },
} as const;

export default ru;
