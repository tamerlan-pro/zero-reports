/**
 * Formats a number for display using locale-specific formatting.
 */
export function formatNumber(value: number, lang: string): string {
  const locale = lang === 'en' ? 'en-US' : 'ru-RU';
  return value.toLocaleString(locale);
}
