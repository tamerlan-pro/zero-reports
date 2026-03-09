export const formatNumber = (value: number | null, lang = 'ru'): string => {
  if (value === null) return '';
  const locale = lang === 'en' ? 'en-US' : 'ru-RU';
  return value.toLocaleString(locale);
};
