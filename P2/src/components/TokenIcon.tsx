// ============================================
// File: src/components/TokenIcon.tsx
// ============================================
import React, { useState } from 'react';

interface TokenIconProps {
    currency: string;
    iconUrl?: string;
    size?: 'sm' | 'md' | 'lg';
}

const TokenIcon: React.FC<TokenIconProps> = ({
    currency,
    iconUrl,
    size = 'md'
}) => {
    const [imageError, setImageError] = useState(false);

    // Size mappings
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    };

    // If no icon URL or image failed to load, show gradient placeholder
    if (!iconUrl || imageError) {
        return (
            <div
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0`}
            >
                {currency.slice(0, 2).toUpperCase()}
            </div>
        );
    }

    // Show actual token icon
    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0`}>
            <img
                src={iconUrl}
                alt={`${currency} icon`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
        </div>
    );
};

export default TokenIcon;
