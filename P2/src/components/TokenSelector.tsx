// ============================================
// File: src/components/TokenSelector.tsx
// ============================================
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Token } from '@/types/token.types';
import { formatCurrency } from '@/utils/formatters';
import TokenIcon from './TokenIcon';

interface TokenSelectorProps {
  selected: string;
  onSelect: (currency: string) => void;
  tokens: Token[];
  exclude?: string;
  disabled?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selected,
  onSelect,
  tokens,
  exclude,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedToken = tokens.find(t => t.currency === selected);

  const filteredTokens = tokens.filter(
    token =>
      token.currency !== exclude &&
      token.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (currency: string) => {
    onSelect(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TokenIcon
          currency={selected}
          iconUrl={selectedToken?.iconUrl}
          size="sm"
        />
        <span className="font-semibold">{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-700 sticky top-0 bg-slate-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                className="bg-transparent outline-none text-sm flex-1 text-white placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Token List */}
          <div className="overflow-y-auto max-h-80">
            {filteredTokens.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">
                No tokens found
              </div>
            ) : (
              filteredTokens.map(token => (
                <button
                  key={token.currency}
                  onClick={() => handleSelect(token.currency)}
                  className="w-full px-4 py-3 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                >
                  <TokenIcon
                    currency={token.currency}
                    iconUrl={token.iconUrl}
                    size="md"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{token.currency}</div>
                    <div className="text-xs text-slate-400">
                      {token.price ? `$${formatCurrency(token.price, 2)}` : 'Price N/A'}
                    </div>
                  </div>
                  {token.currency === selected && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;