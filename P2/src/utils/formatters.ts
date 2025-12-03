// ============================================
// File: src/utils/formatters.ts
// ============================================
/**
 * Format a number as currency with specified decimal places
 */
export const formatCurrency = (
  value: number,
  decimals: number = 2,
  showCurrency: boolean = false,
  currency: string = 'USD'
): string => {
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return showCurrency ? `${currency} ${formatted}` : formatted;
};

/**
 * Format a number with compact notation (1.2K, 1.5M, etc.)
 */
export const formatCompact = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

/**
 * Validate if a string is a valid number
 */
export const isValidNumber = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value) && value !== '';
};

/**
 * Parse string to number safely
 */
export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Truncate decimal places without rounding
 */
export const truncateDecimals = (value: number, decimals: number = 6): string => {
  const multiplier = Math.pow(10, decimals);
  const truncated = Math.floor(value * multiplier) / multiplier;
  return truncated.toFixed(decimals);
};

/**
 * Format exchange rate display
 */
export const formatExchangeRate = (
  rate: number,
  fromToken: string,
  toToken: string
): string => {
  return `1 ${fromToken} = ${truncateDecimals(rate, 6)} ${toToken}`;
};