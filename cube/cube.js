// Cube.js Configuration
// https://cube.dev/docs/config

module.exports = {
  // Подключение к базе данных аналитики
  dbType: 'postgres',
  
  // Настройки API
  apiSecret: process.env.CUBEJS_API_SECRET,
  
  // Разрешённые источники (CORS)
  http: {
    cors: {
      origin: process.env.CUBEJS_CORS_ORIGIN || '*',
      credentials: true,
    },
  },

  // Использовать Cube Store для кэширования и pre-aggregations
  // Cube Store подключается через переменные окружения:
  // CUBEJS_CUBESTORE_HOST и CUBEJS_CUBESTORE_PORT
  cacheAndQueueDriver: 'cubestore',

  // Настройки кэширования
  orchestratorOptions: {
    queryCacheOptions: {
      refreshKeyRenewalThreshold: 2,
      backgroundRenew: true,
      queueOptions: {
        executionTimeout: 600, // 10 минут для тяжёлых отчётов
      },
    },
    preAggregationsOptions: {
      queueOptions: {
        executionTimeout: 1800, // 30 минут для pre-aggregations
      },
    },
  },

  // Планировщик для обновления pre-aggregations
  scheduledRefreshTimer: process.env.CUBEJS_SCHEDULED_REFRESH === 'true' ? 60 : false,
  
  // Контекст безопасности (multi-tenancy)
  contextToAppId: ({ securityContext }) => {
    return securityContext?.tenantId || 'default';
  },

  // Расширение контекста запроса
  extendContext: (req) => {
    // Получаем tenant из JWT или заголовка
    const tenantId = req.headers['x-tenant-id'] || 'default';
    return {
      securityContext: {
        tenantId,
      },
    };
  },

  // Логирование
  logger: (msg, params) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${msg}: ${JSON.stringify(params)}`);
    }
  },
};
