// ============================================
// File: src/hooks/useTokenPrices.ts
// ============================================
import { useState, useEffect } from 'react';
import { Token, TokenPrice } from '@/types/token.types';
import { getTokenIconUrl } from '@/utils/tokenUtils';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';

interface TokenApiResponse {
  currency: string;
  price: number;
  date: string;
}

/**
 * Custom hook to fetch and manage token prices from Switcheo API
 */
export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [prices, setPrices] = useState<TokenPrice>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        
        // Fetch from Switcheo API
        const response = await fetch(PRICES_API_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch token prices: ${response.statusText}`);
        }
        
        const data: TokenApiResponse[] = await response.json();
        
        // Filter out tokens without prices and create tokens array with additional data
        const validTokens = data.filter(token => token.price != null);
        
        // Create prices lookup object
        const pricesMap = validTokens.reduce((acc, token) => {
          acc[token.currency] = token.price;
          return acc;
        }, {} as TokenPrice);
        
        // Create tokens array with additional data
        const tokensWithData = validTokens.map(token => ({
          currency: token.currency,
          price: token.price,
          date: token.date,
          iconUrl: getTokenIconUrl(token.currency)
        }));
        
        setTokens(tokensWithData);
        setPrices(pricesMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching token prices:', err);
        setError('Failed to load token prices. Please try again later.');
        // Fallback to empty data instead of mock data to avoid confusion
        setTokens([]);
        setPrices({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
    
    // Set up polling to refresh prices every 30 seconds
    const intervalId = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  /**
   * Get the exchange rate between two tokens
   * @param fromCurrency - Source token symbol
   * @param toCurrency - Target token symbol
   * @returns Exchange rate or null if either token doesn't have a price
   */
  const getExchangeRate = (fromCurrency: string, toCurrency: string): number | null => {
    if (!fromCurrency || !toCurrency || !prices[fromCurrency] || !prices[toCurrency]) {
      return null;
    }
    return prices[fromCurrency] / prices[toCurrency];
  };
  
  /**
   * Convert an amount from one token to another
   * @param amount - Amount to convert
   * @param fromCurrency - Source token symbol
   * @param toCurrency - Target token symbol
   * @returns Converted amount or null if conversion is not possible
   */
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number | null => {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return rate !== null ? amount * rate : null;
  };
  
  return {
    tokens,
    prices,
    loading,
    error,
    getExchangeRate,
    convertAmount
  };
};