export type LocalizedString = string | Record<string, string>;

export function resolveLocale(
  value: LocalizedString | undefined | null,
  lang: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.ru ?? Object.values(value)[0] ?? '';
}

export function isLocalizedString(val: unknown): val is LocalizedString {
  if (typeof val === 'string') return true;
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
    const values = Object.values(val);
    return values.length > 0 && values.every((v) => typeof v === 'string');
  }
  return false;
}

export function resolveChartData(
  data: Record<string, unknown>[],
  lang: string,
): Record<string, unknown>[] {
  return data.map((row) => {
    const resolved: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        const entries = Object.entries(val);
        if (entries.length > 0 && entries.every(([, v]) => typeof v === 'string')) {
          resolved[key] = resolveLocale(val as Record<string, string>, lang);
          continue;
        }
      }
      resolved[key] = val;
    }
    return resolved;
  });
}
