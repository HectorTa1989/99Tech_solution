# Problem 2: Currency Swap Form - Line-by-Line Explanation

## Architecture Decisions

### Why Vite Instead of Create React App?
- **Problem requirement**: "Bonus: extra points if you use Vite"
- **Performance**: Vite uses native ES modules, resulting in instant server start and lightning-fast HMR
- **Bundle size**: Vite produces smaller production bundles using Rollup
- **Modern**: Better TypeScript support out of the box
- **Alternative rejected**: CRA is deprecated and slower

### Why TypeScript?
- **Type safety**: Prevents runtime errors with compile-time checks
- **Better DX**: IntelliSense, autocomplete, refactoring tools
- **Self-documenting**: Types serve as inline documentation
- **Alternative rejected**: Plain JavaScript lacks these guarantees

### Why Tailwind CSS?
- **Rapid development**: Utility classes allow fast UI prototyping
- **No CSS bloat**: Only used classes are included in production
- **Consistency**: Design system built-in with standardized spacing/colors
- **Responsive**: Mobile-first responsive utilities
- **Alternative rejected**: CSS modules require more boilerplate; styled-components adds runtime overhead

---

## File Structure Explanation

```
src/
├── components/      # UI components (presentation logic)
├── hooks/          # Custom hooks (business logic)
├── types/          # TypeScript definitions
└── utils/          # Pure utility functions
```

**Why this structure?**
- **Separation of concerns**: UI separate from logic
- **Reusability**: Hooks and utils can be reused across components
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features without refactoring

**Alternative rejected**: Flat structure becomes unmaintainable; feature-based folders add complexity for small projects

---

## Core Files Deep Dive

### 1. `package.json` - Dependencies

```json
"dependencies": {
  "react": "^18.2.0",           // UI library
  "react-dom": "^18.2.0",       // React DOM renderer
  "lucide-react": "^0.263.1"    // Icon library
}
```

**Why lucide-react?**
- Lightweight (tree-shakeable)
- Beautiful, consistent icons
- React components (not SVG strings)
- **Alternative rejected**: react-icons is larger; heroicons has fewer options

```json
"devDependencies": {
  "@types/react": "^18.2.43",        // React type definitions
  "@vitejs/plugin-react": "^4.2.1",  // Vite React plugin
  "tailwindcss": "^3.4.0",           // CSS framework
  "typescript": "^5.2.2"             // TypeScript compiler
}
```

---

### 2. `vite.config.ts` - Build Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
```

**Why these imports?**
- `defineConfig`: Provides TypeScript IntelliSense for Vite config
- `react`: Enables JSX transformation and Fast Refresh
- `path`: Node.js module for path resolution

```typescript
export default defineConfig({
  plugins: [react()],
```

**Why react() plugin?**
- Enables JSX/TSX support
- Provides Fast Refresh for instant hot reload
- Optimizes React production builds

```typescript
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
```

**Why path alias `@`?**
- Clean imports: `import { Token } from '@/types/token.types'`
- No relative path hell: No more `../../../utils/formatters`
- Refactoring safe: Moving files doesn't break imports
- **Alternative rejected**: Relative paths become unmaintainable in deep hierarchies

```typescript
  server: {
    port: 3000,
    open: true,
  },
})
```

**Why these server settings?**
- `port: 3000`: Standard development port, familiar to developers
- `open: true`: Auto-opens browser on `npm run dev` for convenience
- **Alternative**: Port 5173 (Vite default) works but 3000 is more common

---

### 3. `tsconfig.json` - TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
```

**Why ES2020?**
- Modern features: Optional chaining, nullish coalescing, BigInt
- Good browser support: Works in all modern browsers
- Balance: Not bleeding edge (ESNext) but not outdated (ES5)
- **Alternative rejected**: ES2015 lacks modern features; ESNext has compatibility issues

```json
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
```

**Why these libs?**
- `ES2020`: JavaScript standard library APIs
- `DOM`: Browser APIs (document, window, etc.)
- `DOM.Iterable`: Array-like DOM collections (NodeList, HTMLCollection)
- **Required for**: `document.getElementById`, `element.classList`, etc.

```json
    "jsx": "react-jsx",
```

**Why react-jsx?**
- New JSX transform: No need to `import React` in every file
- Smaller bundle: Automatic runtime imports
- Better performance: Optimized JSX transformation
- **Alternative rejected**: `react` (old transform) requires manual React imports

```json
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
```

**Why strict mode?**
- Catches bugs at compile time instead of runtime
- `strict`: Enables all strict type-checking options
- `noUnusedLocals`: Prevents dead code accumulation
- `noUnusedParameters`: Catches unused function parameters
- `noFallthroughCasesInSwitch`: Prevents switch case bugs
- **Trade-off**: More errors to fix initially, but prevents production bugs

```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
```

**Why path mapping?**
- Works with Vite alias for consistent imports
- TypeScript understands `@/` imports for IntelliSense
- **Alternative rejected**: Without this, TypeScript shows errors on aliased imports

---

### 4. `tailwind.config.js` - Styling Configuration

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
```

**Why content configuration?**
- Tells Tailwind which files contain class names
- **Critical for production**: Unused classes are purged, reducing CSS from 3MB to ~10KB
- **Alternative rejected**: Without this, all Tailwind CSS is included (huge bundle)

```javascript
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... color scale
          900: '#0c4a6e',
        },
      },
```

**Why custom color palette?**
- **Consistency**: All blues use same scale
- **Maintainability**: Change one place, updates everywhere
- **Design system**: Professional color harmony
- **Alternative rejected**: Inline hex codes scattered throughout components

```javascript
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
```

**Why custom animation?**
- Success messages need subtle, slow pulse
- Default `animate-pulse` is too fast (2s)
- Cubic bezier creates smooth easing
- **Alternative rejected**: CSS keyframes in component files (not reusable)

---

### 5. `src/types/token.types.ts` - Type Definitions

```typescript
export interface Token {
  currency: string;    // e.g., "ETH", "USDC"
  date?: string;       // ISO date from API
  price?: number;      // USD price
}
```

**Why this interface?**
- Matches API response structure from `prices.json`
- `price?` is optional because some tokens don't have prices
- `date?` is optional for flexibility
- **Alternative rejected**: Single string[] loses type information

```typescript
export interface SwapFormData {
  fromToken: string;
  toToken: string;
  fromAmount: string;    // String, not number!
  toAmount: string;
}
```

**Why string for amounts?**
- **Input handling**: HTML inputs emit strings
- **Precision**: "0.000000000001" as number loses precision
- **UX**: User can type "0." or "10." mid-input
- **Validation**: Can check empty string vs "0"
- **Alternative rejected**: Using `number` causes issues with partial input and precision

```typescript
export interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;     // Now number for calculations
  toAmount: number;
  exchangeRate: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}
```

**Why different types for Transaction?**
- **After validation**: Amounts are confirmed valid numbers
- **Union type for status**: Prevents typos like "compltd"
- **Date type**: Real Date object for sorting/formatting
- **Alternative rejected**: String status allows any value (typo-prone)

---

### 6. `src/utils/formatters.ts` - Utility Functions

```typescript
export const formatCurrency = (
  value: number,
  decimals: number = 2,
  showCurrency: boolean = false,
  currency: string = 'USD'
): string => {
```

**Why default parameters?**
- **Flexibility**: `formatCurrency(100)` uses sensible defaults
- **DX**: Most calls don't need all 4 parameters
- **Backwards compatible**: Adding new params doesn't break existing calls

```typescript
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
```

**Why `toLocaleString`?**
- **Internationalization**: Automatically uses user's locale (1,234.56 vs 1.234,56)
- **Native API**: No external library needed
- **Consistent**: Browser handles edge cases
- **Alternative rejected**: Manual formatting with regex (error-prone)

**Why `undefined` locale?**
- Uses browser's default locale
- Works globally without configuration
- **Alternative**: Hardcoding 'en-US' forces American format on everyone

```typescript
export const isValidNumber = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value) && value !== '';
};
```

**Why this regex?**
- `^\d*`: Start with zero or more digits
- `\.?`: Optional decimal point
- `\d*$`: End with zero or more digits
- **Allows**: "123", "123.456", ".5", "5."
- **Blocks**: "1.2.3", "abc", "1e5"
- **Alternative rejected**: `!isNaN(parseFloat(value))` allows "1e5" (scientific notation)

```typescript
export const truncateDecimals = (value: number, decimals: number = 6): string => {
  const multiplier = Math.pow(10, decimals);
  const truncated = Math.floor(value * multiplier) / multiplier;
  return truncated.toFixed(decimals);
};
```

**Why truncate instead of round?**
- **Crypto convention**: Never give users more than they'll receive
- **Example**: 0.9999999 → 0.999999 (not 1.000000)
- **User trust**: Underpromise, overdeliver
- **Alternative rejected**: `toFixed()` rounds, which could mislead users

**Why Math.floor calculation?**
- Multiply by 10^6 → apply Math.floor → divide by 10^6
- **Example**: 1.23456789 × 1000000 = 1234567.89 → floor = 1234567 → / 1000000 = 1.234567
- **Alternative rejected**: String slicing can have precision errors

---

### 7. `src/utils/validators.ts` - Input Validation

```typescript
export const validateSwapAmount = (
  amount: string,
  field: 'fromAmount' | 'toAmount'
): ValidationError | null => {
```

**Why return `null` on success?**
- **Clear intent**: null = no error, object = error details
- **Falsy check**: `if (error)` is clean
- **Alternative rejected**: Boolean return loses error message information

```typescript
  if (!amount || amount.trim() === '') {
    return {
      field,
      message: 'Amount is required',
    };
  }
```

**Why check both conditions?**
- `!amount`: Catches null, undefined, empty string
- `amount.trim() === ''`: Catches "   " (whitespace-only)
- **Edge case prevention**: User can't submit spaces
- **Alternative rejected**: Only `!amount` allows whitespace strings

```typescript
  if (numValue > Number.MAX_SAFE_INTEGER) {
    return {
      field,
      message: 'Amount is too large',
    };
  }
```

**Why MAX_SAFE_INTEGER?**
- JavaScript integers lose precision above 2^53 - 1 (9,007,199,254,740,991)
- **Example**: 9007199254740993 === 9007199254740992 (true!)
- **Safety**: Prevents calculation errors in large numbers
- **Alternative rejected**: Arbitrary limit like 1 billion is either too restrictive or unsafe

---

### 8. `src/hooks/useTokenPrices.ts` - Data Fetching Hook

```typescript
export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [prices, setPrices] = useState<TokenPrice>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
```

**Why separate tokens and prices?**
- `tokens`: Array for dropdowns (ordered, with metadata)
- `prices`: Object for O(1) lookups by currency
- **Performance**: `prices['ETH']` is instant vs array search
- **Alternative rejected**: Only keeping array requires `find()` on every render

```typescript
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        
        // In production:
        // const response = await fetch('https://interview.switcheo.com/prices.json');
        // const data = await response.json();
```

**Why useEffect?**
- **Side effect**: Data fetching is a side effect
- **Runs once**: Empty dependency array = componentDidMount behavior
- **Cleanup**: Can return cleanup function if needed
- **Alternative rejected**: Fetching in component body causes infinite loops

**Why async/await over .then()?**
- **Readability**: Linear code flow, easier to understand
- **Error handling**: try/catch is cleaner than .catch()
- **Debugging**: Better stack traces
- **Alternative rejected**: Promise chains are harder to debug

```typescript
        const mockTokens: Token[] = [
          { currency: 'ETH', price: 3500.00, date: '2024-01-01' },
          // ...
        ];
```

**Why mock data?**
- **Problem requirement**: "feel free to simulate or mock interactions"
- **Development**: Works without network/API key
- **Demo**: Shows full functionality immediately
- **Production ready**: Uncomment real fetch to go live

```typescript
        const priceMap: TokenPrice = {};
        mockTokens.forEach(token => {
          if (token.price) {
            priceMap[token.currency] = token.price;
          }
        });
```

**Why build price map?**
- **O(1) lookups**: `priceMap['ETH']` vs O(n) array search
- **Frequency**: Prices are looked up on every render
- **Performance**: Critical for 60fps animations
- **Alternative rejected**: Array search in render = janky UI

---

### 9. `src/hooks/useSwap.ts` - Swap Logic Hook

```typescript
export const useSwap = (): UseSwapReturn => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<SwapTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
```

**Why separate state for each?**
- **Granular updates**: Only re-render what changed
- **UI states**: Show spinner while `isSwapping`, show error if `error`
- **History**: Keep `lastTransaction` for success message
- **Alternative rejected**: Single object causes unnecessary re-renders

```typescript
  const executeSwap = useCallback(
    async (formData: SwapFormData, exchangeRate: number): Promise<SwapTransaction> => {
```

**Why useCallback?**
- **Performance**: Function identity stable across renders
- **Prevents re-renders**: If passed as prop to child components
- **Alternative rejected**: Regular function recreates on every render

```typescript
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Transaction failed. Please try again.');
      }
```

**Why simulate delay and failures?**
- **Realism**: Shows loading states work correctly
- **Testing**: Ensures error handling works
- **User feedback**: Demonstrates transaction is processing
- **Problem requirement**: "implement a loading indicator with timeout delay"

```typescript
      const transaction: SwapTransaction = {
        id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
```

**Why this ID format?**
- `Date.now()`: Timestamp ensures uniqueness over time
- `Math.random().toString(36).substr(2, 9)`: Random alphanumeric string
- **Collision resistant**: Timestamp + random = virtually impossible to collide
- **Alternative rejected**: Sequential IDs leak transaction volume; UUID library is overkill

---

### 10. `src/components/TokenSelector.tsx` - Dropdown Component

```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const dropdownRef = useRef<HTMLDivElement>(null);
```

**Why useRef?**
- **DOM access**: Need actual DOM node for click-outside detection
- **No re-renders**: Ref changes don't trigger re-renders
- **Persistent**: Survives across renders
- **Alternative rejected**: querySelector is fragile; getElementById requires global IDs

```typescript
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
```

**Why this pattern?**
- **UX**: Clicking outside closes dropdown (expected behavior)
- **Event listener**: `mousedown` fires before `click` (prevents race conditions)
- **Conditional**: Only add listener when open (performance)
- **Cleanup**: Remove listener on unmount/close (memory leak prevention)
- **Alternative rejected**: onClick on overlay doesn't work with portals

```typescript
const filteredTokens = tokens.filter(
  token =>
    token.currency !== exclude &&
    token.currency.toLowerCase().includes(searchTerm.toLowerCase())
);
```

**Why toLowerCase()?**
- **Case insensitive**: "eth" finds "ETH"
- **UX**: User shouldn't need to know exact casing
- **Alternative rejected**: Case-sensitive search frustrates users

**Why exclude check?**
- **Business logic**: Can't swap ETH → ETH
- **UI**: Don't show selected token in opposite dropdown
- **Alternative**: Allow selection and show error (worse UX)

---

### 11. `src/components/CurrencySwapForm.tsx` - Main Component

```typescript
const [lastUpdatedField, setLastUpdatedField] = useState<'from' | 'to'>('from');
```

**Why track last updated field?**
- **Problem**: Both fields auto-calculate from each other
- **Race condition**: Changing exchange rate could overwrite user input
- **Solution**: Only update the field user didn't touch
- **Alternative rejected**: Always updating both causes input cursor jumping

```typescript
const exchangeRate = useMemo(() => {
  const fromPrice = prices[formData.fromToken];
  const toPrice = prices[formData.toToken];
  if (fromPrice && toPrice) {
    return fromPrice / toPrice;
  }
  return 0;
}, [formData.fromToken, formData.toToken, prices]);
```

**Why useMemo?**
- **Expensive calculation**: Division isn't free (okay, it's cheap but principle matters)
- **Dependency tracking**: Only recalculate when tokens or prices change
- **Prevents bugs**: Stable value across renders prevents infinite loops
- **Alternative rejected**: Calculating in render runs on every state change

```typescript
const handleFromAmountChange = (value: string) => {
  if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
    setError('Please enter a valid number');
    return;
  }
  
  setError('');
  setLastUpdatedField('from');
```

**Why immediate validation?**
- **UX**: User sees error immediately, not on submit
- **Prevents bad input**: Can't type letters
- **Clear before accepting**: Always clear previous errors
- **Track intent**: Mark 'from' as user's focus

```typescript
  const numValue = parseNumber(value);
  const converted = numValue * exchangeRate;
  
  setFormData({
    ...formData,
    fromAmount: value,
    toAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
  });
};
```

**Why update both fields?**
- **Real-time conversion**: User sees result immediately
- **Smooth UX**: No "Calculate" button needed
- **truncateDecimals**: Show precision without rounding up
- **Alternative rejected**: Manual input for both fields (tedious for users)

```typescript
useEffect(() => {
  if (exchangeRate > 0) {
    if (lastUpdatedField === 'from' && formData.fromAmount) {
      const numValue = parseNumber(formData.fromAmount);
      const converted = numValue * exchangeRate;
      setFormData(prev => ({
        ...prev,
        toAmount: converted > 0 ? truncateDecimals(converted, 6) : '',
      }));
    }
    // ... similar for 'to'
  }
}, [exchangeRate]);
```

**Why this useEffect?**
- **Problem**: User changes token → exchange rate changes → need to recalculate
- **Solution**: Watch exchange rate, update non-active field
- **lastUpdatedField**: Ensures we update the right field
- **Functional update**: `prev => ({...prev})` uses latest state (avoids stale closures)
- **Alternative rejected**: Not updating causes stale amounts when switching tokens

```typescript
const handleSubmit = async () => {
  const amountValidation = validateSwapAmount(formData.fromAmount, 'fromAmount');
  if (amountValidation) {
    setError(amountValidation.message);
    return;
  }
```

**Why validate on submit?**
- **Final check**: User might have bypassed input validation
- **Business rules**: Amount > 0, tokens different
- **Return early**: Don't proceed if validation fails
- **Alternative rejected**: Trusting client-side only is insecure (though this is frontend-only demo)

```typescript
  try {
    setError('');
    const transaction = await executeSwap(formData, exchangeRate);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setFormData({
      ...formData,
      fromAmount: '',
      toAmount: '',
    });
```

**Why this flow?**
- **Clear previous error**: Fresh start
- **await**: Wait for swap to complete
- **Success message**: 3-second auto-dismiss (just enough time to read)
- **Reset form**: Ready for next swap, but keep token selection (likely to swap again)
- **Alternative rejected**: Not clearing form means user has to manually delete

```typescript
<button
  onClick={handleSubmit}
  disabled={
    isSwapping ||
    !formData.fromAmount ||
    parseNumber(formData.fromAmount) <= 0 ||
    !exchangeRate
  }
```

**Why these disabled conditions?**
- `isSwapping`: Prevent double-submit
- `!formData.fromAmount`: No empty submits
- `parseNumber(...) <= 0`: No zero/negative amounts
- `!exchangeRate`: Tokens need valid prices
- **UX**: Disabled button with visual feedback is better than error message
- **Alternative rejected**: Allowing invalid submit shows error (more friction)

---

## Design Patterns Used

### 1. **Custom Hooks Pattern**
```typescript
const { tokens, prices, loading } = useTokenPrices();
const { executeSwap, isSwapping } = useSwap();
```

**Why?**
- **Separation of concerns**: Logic separate from UI
- **Reusability**: Can use in multiple components
- **Testing**: Test logic without rendering components
- **Composition**: Combine multiple hooks easily

### 2. **Controlled Components Pattern**
```typescript
<input
  value={formData.fromAmount}
  onChange={(e) => handleFromAmountChange(e.target.value)}
/>
```

**Why?**
- **Single source of truth**: React state controls input
- **Validation**: Can intercept and validate every keystroke
- **Derived state**: toAmount calculated from fromAmount
- **Alternative rejected**: Uncontrolled components (refs) lose real-time updates

### 3. **Compound Components Pattern**
```typescript
<CurrencySwapForm>
  <TokenSelector />
  <SwapButton />
</CurrencySwapForm>
```

**Why?**
- **Modularity**: Each component has single responsibility
- **Reusability**: TokenSelector can be used elsewhere
- **Testing**: Test each component in isolation
- **Alternative rejected**: Single monolithic component is hard to maintain

### 4. **Error Boundary Pattern** (Implicit)
```typescript
try {
  await executeSwap();
} catch (err) {
  setError(errorMessage);
}
```

**Why?**
- **Graceful degradation**: App doesn't crash
- **User feedback**: Shows error message instead of blank screen
- **Recovery**: User can try again
- **Alternative rejected**: Uncaught errors crash app

---

## Performance Optimizations

### 1. **useMemo for expensive calculations**
```typescript
const exchangeRate = useMemo(() => {
  return fromPrice / toPrice;
}, [formData.fromToken, formData.toToken, prices]);
```

**Impact**: Prevents recalculation on every render

### 2. **useCallback for stable function references**
```typescript
const executeSwap = useCallback(async (formData) => {
  // ...
}, []);
```

**Impact**: Prevents child component re-renders

### 3. **Price map for O(1) lookups**
```typescript
const priceMap: TokenPrice = {};
tokens.forEach(token => {
  priceMap[token.currency] = token.price;
});
```

**Impact**: `O(1)` vs `O(n)` for price lookups

### 4. **Conditional event listeners**
```typescript
if (isOpen) {
  document.addEventListener('mousedown', handleClickOutside);
}
```

**Impact**: Only attach listener when needed

### 5. **Truncate decimals instead of recalculate**
```typescript
truncateDecimals(converted, 6)
```

**Impact**: Fast string operation vs repeated division

---

## Why NOT Other Approaches?

### ❌ Redux/Context API for State
**Rejected because:**
- Overkill for single-component form
- Adds boilerplate (actions, reducers)
- Local state is simpler and sufficient
- **When to use**: Multi-component apps with shared state

### ❌ React Query for Data Fetching
**Rejected because:**
- Simple fetch doesn't need caching/retry logic
- Mock data doesn't benefit from React Query features
- Adds dependency size
- **When to use**: Complex API interactions with caching needs

### ❌ Form Libraries (React Hook Form, Formik)
**Rejected because:**
- Only 2 inputs, not complex form
- Custom validation is simple enough
- Would obscure learning value
- **When to use**: Forms with 10+ fields and complex validation

### ❌ CSS-in-JS (styled-components, emotion)
**Rejected because:**
- Tailwind CSS is faster to prototype
- No runtime overhead
- Problem emphasizes visual appeal (Tailwind excels here)
- **When to use**: Component libraries with dynamic theming

### ❌ Class Components
**Rejected because:**
- Functional components are modern React standard
- Hooks are more composable than lifecycle methods
- Less boilerplate (no `this` binding)
- **When to use**: Legacy codebases only

### ❌ Prop Drilling
**Rejected because:**
- Used custom hooks instead
- Hooks avoid passing props through many layers
- **When to use**: Simple parent-child relationships

---

## Summary: Key Decisions

| Decision | Reason | Alternative |
|----------|--------|-------------|
| Vite | Fast, modern, bonus points | CRA (deprecated) |
| TypeScript | Type safety, better DX | JavaScript (error-prone) |
| Tailwind | Rapid UI development | CSS Modules (verbose) |
| Custom Hooks | Reusable logic | Inline logic (messy) |
| useMemo | Prevent recalculation | Regular variable (wasteful) |
| String amounts | Input handling | Number (precision issues) |
| Price map | O(1) lookups | Array search (O(n)) |
| Mock data | Works offline | Real API (requires setup) |
| Modular files | Scalable architecture | Single file (unmaintainable) |

This architecture balances **simplicity** (easy to understand), **performance** (60fps UI), **maintainability** (easy to extend), and **user experience** (intuitive interface).