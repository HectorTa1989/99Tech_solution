// ============================================
// File: src/types/token.types.ts
// ============================================
export interface Token {
  currency: string;
  date?: string;
  price?: number;
  iconUrl?: string;
}

export interface TokenPrice {
  [currency: string]: number;
}

export interface SwapFormData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

export interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface ValidationError {
  field: 'fromAmount' | 'toAmount' | 'general';
  message: string;
}