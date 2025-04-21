export const formatDate = (iniDate: number): string => {
  return new Date(iniDate).toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}