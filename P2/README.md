# Currency Swap Form

A beautiful, production-ready currency swap interface built with React, TypeScript, Vite, and Tailwind CSS.

## Features

✨ **Modern UI/UX**
- Beautiful gradient design with glassmorphism effects
- Smooth animations and transitions
- Responsive layout for all devices
- Dark theme optimized

🔄 **Swap Functionality**
- Real-time currency conversion
- Bi-directional amount input
- Quick token swap with animation
- Exchange rate display
- USD value calculation

🎯 **User Experience**
- Token search with filtering
- MAX button for quick input
- Loading states and animations
- Success/error notifications
- Input validation
- Transaction details preview

🛠️ **Technical Features**
- Built with Vite for fast development
- TypeScript for type safety
- Custom React hooks for state management
- Modular component architecture
- Utility functions for formatting and validation
- Mock API integration ready

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/
│   ├── CurrencySwapForm.tsx    # Main swap form component
│   ├── TokenSelector.tsx        # Token dropdown selector
│   └── SwapButton.tsx           # Swap direction toggle button
├── hooks/
│   ├── useTokenPrices.ts        # Fetch and manage token prices
│   └── useSwap.ts               # Handle swap execution logic
├── types/
│   └── token.types.ts           # TypeScript interfaces
├── utils/
│   ├── formatters.ts            # Number and currency formatting
│   └── validators.ts            # Input validation functions
├── App.tsx                      # Root component
├── main.tsx                     # App entry point
└── index.css                    # Global styles with Tailwind
```

## API Integration

The app is designed to integrate with the Switcheo API:

- **Token Prices**: `https://interview.switcheo.com/prices.json`
- **Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/`

Currently uses mock data for demonstration. To integrate real API:

1. Update `src/hooks/useTokenPrices.ts`
2. Uncomment the fetch call
3. Add error handling as needed

## Customization

### Add New Tokens

Edit the mock data in `src/hooks/useTokenPrices.ts`:

```typescript
const mockTokens: Token[] = [
  { currency: 'YOUR_TOKEN', price: 100.00, date: '2024-01-01' },
  // ...
];
```

### Modify Styling

The project uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adjust Validation Rules

Modify validation logic in `src/utils/validators.ts`

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set

## Best Practices Implemented

✅ TypeScript for type safety  
✅ Custom hooks for reusable logic  
✅ Component composition  
✅ Input validation and error handling  
✅ Loading states and user feedback  
✅ Responsive design  
✅ Accessible UI elements  
✅ Clean code architecture  
✅ Utility functions for common operations  
✅ Mock backend integration pattern  

## Future Enhancements

- [ ] Connect to real wallet (MetaMask, WalletConnect)
- [ ] Add transaction history
- [ ] Implement slippage tolerance settings
- [ ] Add liquidity pool information
- [ ] Multi-language support
- [ ] Price charts and analytics
- [ ] Gas fee estimation
- [ ] Advanced order types (limit, stop-loss)

## Author

Long Hung