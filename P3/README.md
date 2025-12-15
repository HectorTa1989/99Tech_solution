# Wallet Balances Example

This repository contains a simple React + TypeScript component (`index.tsx`) that displays wallet balances, sorts them by blockchain priority, and calculates their USD value.

# Task

List out the computational inefficiencies and anti-patterns found in the code block below.

1. This code block uses
    1. ReactJS with TypeScript.
    2. Functional components.
    3. React Hooks
2. You should also provide a refactored version of the code, but more points are awarded to accurately stating the issues and explaining correctly how to improve them.

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
---

## Task

**Goal:**  
Identify computational inefficiencies and anti-patterns in the code, and suggest improvements.

---

## Brainstorming Flow:

1. **Identify Issues**  
   - Type safety problems
   - Missing dependencies
   - Logic errors
   - Performance inefficiencies
   - Anti-patterns
   - Unused code

2. **Categorize Problems**  
   - Critical bugs (will cause runtime errors)
   - Performance issues (unnecessary re-renders)
   - Code quality issues (type safety, clarity)

## Issues Found

### CRITICAL BUGS

1. **Undefined Variable lhsPriority (Line in filter)**  
   - Variable lhsPriority is used but never defined.
   - Should be balancePriority.

2. **Wrong Filter Logic**  
   - Returns true when balance.amount <= 0 (should filter OUT zero/negative).  
   - Should return balances with amount > 0 and priority > -99.

3. **Missing Return in Sort**  
   - Sort function doesn't return 0 when priorities are equal.
   - Can cause unstable sorting.

4. **Type Mismatch**
   - sortedBalances contains WalletBalance but is mapped to FormattedWalletBalance in rows.	
   - Should use formattedBalances instead

5. **Missing blockchain Property**
   - WalletBalance interface doesn't have blockchain: string
   - Causes TypeScript errors

6. **Using index as Key**
   - Anti-pattern: Using array index as React key
   - Should use unique ID

### PERFORMANCE ISSUES
7. **Unused Dependency in useMemo**
   - prices is in dependency array but never used in the memo
   - Causes unnecessary recalculations

8. **getPriority Recreated on Every Render**
   - Function should be outside component or wrapped in useCallback

9. **Redundant Mapping**
   - formattedBalances is computed but not used consistently
   - rows maps over sortedBalances again

### CODE QUALITY
10. **Poor Type Safety**
   - blockchain: any parameter
   - Should be a union type or enum

11. **Inconsistent Formatting**
   - toFixed() without decimal places
   - Should specify precision
   
---

## Refactored Approach

The refactored code:  
- Combines filtering, formatting, and sorting in one pass.  
- Simplifies `getPriority` by using a mapping object.  
- Uses more reliable keys (`currency + blockchain`).  
- Formats amounts directly when rendering.  



