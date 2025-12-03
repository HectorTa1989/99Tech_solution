// ============================================
// File: src/components/CurrencySwapForm.tsx
// ============================================
import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import TokenSelector from './TokenSelector';
import SwapButton from './SwapButton';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { useSwap } from '@/hooks/useSwap';
import { SwapFormData } from '@/types/token.types';
import {
  formatCurrency,
  formatExchangeRate,
  truncateDecimals,
  parseNumber,
} from '@/utils/formatters';
import { validateSwapAmount, validateTokensDifferent } from '@/utils/validators';

const CurrencySwapForm: React.FC = () => {
  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: 'ETH',
    toToken: 'USDC',
    fromAmount: '',
    toAmount: '',
  });
  const [error, setError] = useState<string>('');
  const [lastUpdatedField, setLastUpdatedField] = useState<'from' | 'to'>('from');
  const [showSuccess, setShowSuccess] = useState(false);

  // Custom hooks
  const { tokens, prices, loading: pricesLoading } = useTokenPrices();
  const { executeSwap, isSwapping, lastTransaction, error: swapError } = useSwap();

  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    const fromPrice = prices[formData.fromToken];
    const toPrice = prices[formData.toToken];
    if (fromPrice && toPrice) {
      return fromPrice / toPrice;
    }
    return 0;
  }, [formData.fromToken, formData.toToken, prices]);

  // Calculate USD values
  const fromUsdValue = useMemo(() => {
    const amount = parseNumber(formData.fromAmount);
    const price = prices[formData.fromToken];
    return amount * (price || 0);
  }, [formData.fromAmount, formData.fromToken, prices]);

  const toUsdValue = useMemo(() => {
    const amount = parseNumber(formData.toAmount);
    const price = prices[formData.toToken];
    return amount * (price || 0);
  }, [formData.toAmount, formData.toToken, prices]);

  // Handle amount changes
  const handleFromAmountChange = (value: string) => {
    // Allow empty or valid decimal numbers
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      setError('Please enter a valid number');
      return;
    }

    setError('');
    setLastUpdatedField('from');
    
    const numValue = parseNumber(value);
    const converted = numValue * exchangeRate;
    
    setFormData({
      ...formData,
      fromAmount: value,
      toAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
    });
  };

  const handleToAmountChange = (value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      setError('Please enter a valid number');
      return;
    }

    setError('');
    setLastUpdatedField('to');
    
    const numValue = parseNumber(value);
    const converted = exchangeRate > 0 ? numValue / exchangeRate : 0;
    
    setFormData({
      ...formData,
      toAmount: value,
      fromAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
    });
  };

  // Handle token selection
  const handleFromTokenChange = (currency: string) => {
    setFormData(prev => ({
      ...prev,
      fromToken: currency,
    }));
  };

  const handleToTokenChange = (currency: string) => {
    setFormData(prev => ({
      ...prev,
      toToken: currency,
    }));
  };

  // Swap tokens
  const handleSwapTokens = () => {
    setFormData({
      fromToken: formData.toToken,
      toToken: formData.fromToken,
      fromAmount: formData.toAmount,
      toAmount: formData.fromAmount,
    });
    setLastUpdatedField(lastUpdatedField === 'from' ? 'to' : 'from');
  };

  // Recalculate when exchange rate changes
  useEffect(() => {
    if (exchangeRate > 0) {
      if (lastUpdatedField === 'from' && formData.fromAmount) {
        const numValue = parseNumber(formData.fromAmount);
        const converted = numValue * exchangeRate;
        setFormData(prev => ({
          ...prev,
          toAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
        }));
      } else if (lastUpdatedField === 'to' && formData.toAmount) {
        const numValue = parseNumber(formData.toAmount);
        const converted = numValue / exchangeRate;
        setFormData(prev => ({
          ...prev,
          fromAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
        }));
      }
    }
  }, [exchangeRate]);

  // Submit swap
  const handleSubmit = async () => {
    // Validation
    const amountValidation = validateSwapAmount(formData.fromAmount, 'fromAmount');
    if (amountValidation) {
      setError(amountValidation.message);
      return;
    }

    const tokenValidation = validateTokensDifferent(formData.fromToken, formData.toToken);
    if (tokenValidation) {
      setError(tokenValidation.message);
      return;
    }

    try {
      setError('');
      const transaction = await executeSwap(formData, exchangeRate);
      
      // Show success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setFormData({
        ...formData,
        fromAmount: '',
        toAmount: '',
      });
      
      console.log('Swap completed:', transaction);
    } catch (err) {
      // Error handled by useSwap hook
    }
  };

  // Handle max button
  const handleMaxAmount = () => {
    // In production, this would get the actual wallet balance
    const mockBalance = 10;
    handleFromAmountChange(mockBalance.toString());
  };

  if (pricesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading token prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Currency Swap</h1>
          </div>
          <p className="text-slate-400">Exchange your tokens instantly</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 animate-pulse-slow">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <p className="text-green-400 font-semibold">Swap Successful!</p>
              <p className="text-green-300 text-sm">
                {lastTransaction && `${lastTransaction.fromAmount} ${lastTransaction.fromToken} → ${truncateDecimals(lastTransaction.toAmount, 6)} ${lastTransaction.toToken}`}
              </p>
            </div>
          </div>
        )}

        {/* Swap Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700">
          {/* From Section */}
          <div className="bg-slate-900/50 rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">From</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMaxAmount}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20"
                >
                  MAX
                </button>
                <TokenSelector
                  selected={formData.fromToken}
                  onSelect={handleFromTokenChange}
                  tokens={tokens}
                  exclude={formData.toToken}
                  disabled={isSwapping}
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00"
              value={formData.fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              disabled={isSwapping}
              className="w-full bg-transparent text-3xl font-bold outline-none text-white placeholder-slate-600 disabled:opacity-50"
            />
            <div className="text-sm text-slate-400 mt-2">
              ≈ ${formatCurrency(fromUsdValue, 2)}
            </div>
          </div>

          {/* Swap Button */}
          <SwapButton onClick={handleSwapTokens} disabled={isSwapping} />

          {/* To Section */}
          <div className="bg-slate-900/50 rounded-2xl p-4 mt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">To</span>
              <TokenSelector
                selected={formData.toToken}
                onSelect={handleToTokenChange}
                tokens={tokens}
                exclude={formData.fromToken}
                disabled={isSwapping}
              />
            </div>
            <input
              type="text"
              placeholder="0.00"
              value={formData.toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              disabled={isSwapping}
              className="w-full bg-transparent text-3xl font-bold outline-none text-white placeholder-slate-600 disabled:opacity-50"
            />
            <div className="text-sm text-slate-400 mt-2">
              ≈ ${formatCurrency(toUsdValue, 2)}
            </div>
          </div>

          {/* Exchange Rate */}
          {exchangeRate > 0 && (
            <div className="mt-4 p-3 bg-slate-900/30 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Exchange Rate</span>
                <span className="text-sm text-white font-medium">
                  {formatExchangeRate(exchangeRate, formData.fromToken, formData.toToken)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || swapError) && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error || swapError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={
              isSwapping ||
              !formData.fromAmount ||
              parseNumber(formData.fromAmount) <= 0 ||
              !exchangeRate
            }
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isSwapping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Swap...</span>
              </>
            ) : (
              <span>Swap Tokens</span>
            )}
          </button>

          {/* Transaction Info */}
          {formData.fromAmount && formData.toAmount && (
            <div className="mt-4 p-3 bg-slate-900/30 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Minimum received:</span>
                <span className="text-white">
                  {truncateDecimals(parseNumber(formData.toAmount) * 0.99, 6)} {formData.toToken}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Price impact:</span>
                <span className="text-green-400">{'<0.01%'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Network fee:</span>
                <span className="text-white">~$0.50</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-slate-400 space-y-2">
          <p>Prices update in real-time</p>
          <p className="text-xs">
            Token icons from{' '}
            <a
              href="https://github.com/Switcheo/token-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Switcheo Token Icons
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencySwapForm;