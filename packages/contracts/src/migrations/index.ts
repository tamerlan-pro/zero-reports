import { SCHEMA_VERSION, type ReportConfig } from '../report';

type MigrationFn = (config: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, MigrationFn> = {
  // When schema v1 -> v2 is needed, add: 2: (config) => { ... return upgraded; }
};

/**
 * Migrates a stored report config to the latest schema version.
 * Runs all migration steps between the stored version and SCHEMA_VERSION.
 */
export function migrateConfig(config: Record<string, unknown>): ReportConfig {
  const storedVersion = typeof config.schemaVersion === 'number' ? config.schemaVersion : 1;
  let current: Record<string, unknown> = { ...config, schemaVersion: storedVersion };

  for (let v = storedVersion + 1; v <= SCHEMA_VERSION; v++) {
    const migrate = migrations[v];
    if (migrate) {
      current = migrate(current);
      current['schemaVersion'] = v;
    }
  }

  if (!current['schemaVersion']) {
    current['schemaVersion'] = SCHEMA_VERSION;
  }

  return current as unknown as ReportConfig;
}

export { SCHEMA_VERSION };
