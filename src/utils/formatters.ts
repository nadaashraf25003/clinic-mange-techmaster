export const formatCurrency = (amount: number, currency = 'ج.م'): string => {
  return `${amount.toLocaleString('ar-EG')} ${currency}`;
};

export const formatDateAr = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
