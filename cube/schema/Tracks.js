// Cube.js Schema: Tracks (Треки)

cube('Tracks', {
  sql: `SELECT * FROM tracks`,
  
  sqlAlias: 'trk',

  joins: {
    Artists: {
      relationship: 'belongsTo',
      sql: `${Tracks}.artist_id = ${Artists}.id`,
    },
  },

  measures: {
    count: {
      type: 'count',
      drillMembers: [id, title, createdAt],
    },
    
    totalDuration: {
      sql: 'duration_seconds',
      type: 'sum',
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
    
    title: {
      sql: 'title',
      type: 'string',
    },
    
    artistId: {
      sql: 'artist_id',
      type: 'string',
    },
    
    isrc: {
      sql: 'isrc',
      type: 'string',
      description: 'International Standard Recording Code',
    },
    
    genre: {
      sql: 'genre',
      type: 'string',
    },
    
    releaseDate: {
      sql: 'release_date',
      type: 'time',
    },
    
    createdAt: {
      sql: 'created_at',
      type: 'time',
    },
    
    tenantId: {
      sql: 'tenant_id',
      type: 'string',
    },
  },
});
