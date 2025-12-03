// ============================================
// File: src/utils/validators.ts
// ============================================
import { ValidationError } from '@/types/token.types';

/**
 * Validate swap form input
 */
export const validateSwapAmount = (
  amount: string,
  field: 'fromAmount' | 'toAmount'
): ValidationError | null => {
  if (!amount || amount.trim() === '') {
    return {
      field,
      message: 'Amount is required',
    };
  }

  if (!/^\d*\.?\d*$/.test(amount)) {
    return {
      field,
      message: 'Please enter a valid number',
    };
  }

  const numValue = parseFloat(amount);

  if (isNaN(numValue) || numValue <= 0) {
    return {
      field,
      message: 'Amount must be greater than 0',
    };
  }

  if (numValue > Number.MAX_SAFE_INTEGER) {
    return {
      field,
      message: 'Amount is too large',
    };
  }

  return null;
};

/**
 * Validate if two tokens are different
 */
export const validateTokensDifferent = (
  fromToken: string,
  toToken: string
): ValidationError | null => {
  if (fromToken === toToken) {
    return {
      field: 'general',
      message: 'Cannot swap the same token',
    };
  }
  return null;
};