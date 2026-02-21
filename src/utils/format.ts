/**
 * Format helpers: date, currency, string, etc.
 */

export const formatDate = (date: Date | string, locale = 'vi-VN'): string => {
  return new Date(date).toLocaleDateString(locale)
}

export const formatCurrency = (amount: number, locale = 'vi-VN', currency = 'VND'): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
