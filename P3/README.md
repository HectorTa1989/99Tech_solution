# Wallet Balances Example

This repository contains a simple React + TypeScript component (`index.tsx`) that displays wallet balances, sorts them by blockchain priority, and calculates their USD value.

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



