// Base URL for token icons from Switcheo's GitHub repository
export const TOKEN_ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokenIcons';

/**
 * Get the URL for a token's icon
 * @param currency - The token symbol (e.g., 'ETH', 'BTC')
 * @returns URL string for the token icon
 */
export const getTokenIconUrl = (currency: string): string => {
  // Switcheo repository uses uppercase filenames
  return `${TOKEN_ICON_BASE_URL}/${currency.toUpperCase()}.svg`;
};

/**
 * Fallback icon URL for tokens without an icon
 */
export const FALLBACK_ICON_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/unknown.svg';

/**
 * Check if a token has a price in the prices data
 * @param currency - The token symbol
 * @param prices - The token prices object
 * @returns boolean indicating if the token has a price
 */
export const hasTokenPrice = (currency: string, prices: Record<string, number>): boolean => {
  return currency in prices;
};

/**
 * Calculate the exchange rate between two tokens
 * @param fromToken - The source token symbol
 * @param toToken - The target token symbol
 * @param prices - The token prices object
 * @returns The exchange rate or null if either token doesn't have a price
 */
export const getExchangeRate = (
  fromToken: string,
  toToken: string,
  prices: Record<string, number>
): number | null => {
  if (!hasTokenPrice(fromToken, prices) || !hasTokenPrice(toToken, prices)) {
    return null;
  }
  return prices[fromToken] / prices[toToken];
};
