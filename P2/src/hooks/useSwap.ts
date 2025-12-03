// ============================================
// File: src/hooks/useSwap.ts
// ============================================
import { useState, useCallback } from 'react';
import { SwapFormData, SwapTransaction } from '@/types/token.types';

interface UseSwapReturn {
  executeSwap: (formData: SwapFormData, exchangeRate: number) => Promise<SwapTransaction>;
  isSwapping: boolean;
  lastTransaction: SwapTransaction | null;
  error: string | null;
}

/**
 * Custom hook to handle swap execution
 */
export const useSwap = (): UseSwapReturn => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<SwapTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeSwap = useCallback(
    async (formData: SwapFormData, exchangeRate: number): Promise<SwapTransaction> => {
      setIsSwapping(true);
      setError(null);

      try {
        // Simulate API call to backend
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('Transaction failed. Please try again.');
        }

        const transaction: SwapTransaction = {
          id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromToken: formData.fromToken,
          toToken: formData.toToken,
          fromAmount: parseFloat(formData.fromAmount),
          toAmount: parseFloat(formData.toAmount),
          exchangeRate,
          timestamp: new Date(),
          status: 'completed',
        };

        setLastTransaction(transaction);
        return transaction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Swap failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsSwapping(false);
      }
    },
    []
  );

  return {
    executeSwap,
    isSwapping,
    lastTransaction,
    error,
  };
};