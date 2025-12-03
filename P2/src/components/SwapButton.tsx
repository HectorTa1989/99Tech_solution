// ============================================
// File: src/components/SwapButton.tsx
// ============================================
import React from 'react';
import { ArrowDownUp } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <div className="flex justify-center -my-2 relative z-10">
      <button
        onClick={onClick}
        disabled={disabled}
        className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:scale-110 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Swap tokens"
      >
        <ArrowDownUp className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default SwapButton;