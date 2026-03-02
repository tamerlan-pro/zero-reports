export const formatNumber = (value: number | null): string => {
  if (value === null) return '';
  return value.toLocaleString('ru-RU');
};
