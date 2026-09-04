/**
 * Formats monetary amounts in integer paise/cents into standard currency representation
 */
export function formatCurrency(
  amountInPaise: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts decimal currency amount to integer subunits (e.g. 99.50 INR -> 9950 Paise)
 */
export function toSubunits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts integer subunits to decimal currency amount (e.g. 9950 Paise -> 99.50 INR)
 */
export function fromSubunits(subunits: number): number {
  return subunits / 100;
}

/**
 * Calculates profit margin percentage given cost and selling price in subunits
 */
export function calculateProfitMargin(costPrice: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return Number((((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(2));
}
