// Cube.js Schema: Artists (Артисты)

cube('Artists', {
  sql: `SELECT * FROM artists`,
  
  sqlAlias: 'art',

  measures: {
    count: {
      type: 'count',
      drillMembers: [id, name, createdAt],
    },
  },

  dimensions: {
    id: {
      sql: 'id',
      type: 'string',
      primaryKey: true,
    },
    
    name: {
      sql: 'name',
      type: 'string',
    },
    
    genre: {
      sql: 'genre',
      type: 'string',
    },
    
    status: {
      sql: 'status',
      type: 'string',
    },
    
    country: {
      sql: 'country',
      type: 'string',
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

  segments: {
    active: {
      sql: `${CUBE}.status = 'active'`,
    },
    archived: {
      sql: `${CUBE}.status = 'archived'`,
    },
  },
});
