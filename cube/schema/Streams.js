// Cube.js Schema: Streams (Прослушивания)
// Пример схемы для аналитики музыкальных стримов

cube('Streams', {
  sql: `SELECT * FROM streams`,
  
  // Multi-tenancy фильтр
  sqlAlias: 'str',
  
  // Автоматическое обновление
  refreshKey: {
    every: '1 hour',
  },

  // Pre-aggregations для ускорения тяжёлых запросов
  preAggregations: {
    // Дневная агрегация по артистам
    dailyByArtist: {
      measures: [Streams.count, Streams.totalRevenue],
      dimensions: [Streams.artistId, Streams.platform],
      timeDimension: Streams.streamedAt,
      granularity: 'day',
      refreshKey: {
        every: '1 hour',
      },
    },
    
    // Месячная агрегация по трекам
    monthlyByTrack: {
      measures: [Streams.count, Streams.totalRevenue, Streams.uniqueListeners],
      dimensions: [Streams.trackId, Streams.country],
      timeDimension: Streams.streamedAt,
      granularity: 'month',
      refreshKey: {
        every: '6 hours',
      },
    },
  },

  joins: {
    Tracks: {
      relationship: 'belongsTo',
      sql: `${Streams}.track_id = ${Tracks}.id`,
    },
    Artists: {
      relationship: 'belongsTo',
      sql: `${Streams}.artist_id = ${Artists}.id`,
    },
  },

  measures: {
    count: {
      type: 'count',
      drillMembers: [id, trackId, streamedAt],
    },
    
    totalRevenue: {
      sql: 'revenue',
      type: 'sum',
      format: 'currency',
    },
    
    avgRevenue: {
      sql: 'revenue',
      type: 'avg',
      format: 'currency',
    },
    
    uniqueListeners: {
      sql: 'listener_id',
      type: 'countDistinct',
    },
    
    avgDuration: {
      sql: 'duration_seconds',
      type: 'avg',
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },
    
    trackId: {
      sql: 'track_id',
      type: 'string',
    },
    
    artistId: {
      sql: 'artist_id',
      type: 'string',
    },
    
    platform: {
      sql: 'platform',
      type: 'string',
      description: 'Платформа: spotify, apple_music, youtube, etc.',
    },
    
    country: {
      sql: 'country',
      type: 'string',
    },
    
    streamedAt: {
      sql: 'streamed_at',
      type: 'time',
    },
    
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },

  // Сегменты для быстрой фильтрации
  segments: {
    spotify: {
      sql: `${CUBE}.platform = 'spotify'`,
    },
    appleMusic: {
      sql: `${CUBE}.platform = 'apple_music'`,
    },
    youtube: {
      sql: `${CUBE}.platform = 'youtube'`,
    },
  },
});
