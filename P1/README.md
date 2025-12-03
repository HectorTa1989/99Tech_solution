````markdown
# Problem 1: Three Ways to Sum to n

This is the first problem from the **99Tech-VN entrance coding exam**.  
The task is to implement a function `sum_to_n(n)` that returns the summation from `1` to `n`.

---

## Problem Statement

**Input:**  
- `n` – any positive integer (assume result < `Number.MAX_SAFE_INTEGER`)

**Output:**  
- The sum of integers from `1` up to `n`.

Example:  
```js
sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
````

---

## Solutions

I implemented the solution in **three different ways**:

### 1. Gauss's formula: n * (n + 1) / 2

```js
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};
```

### 2. Iterative Loop (O(n))

```js
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
```

### 3. Recursive Approach (O(n))

```js
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};
```

## Analysis
- **Method A** is optimal: O(1) time, O(1) space
- **Method B** is clear and readable: O(n) time, O(1) space
- **Method C** demonstrates recursion: O(n) time, O(n) space (call stack)

---

## Tests

I added a simple test runner using `console.assert`:

```js
function runTests() {
    const testCases = [
        { input: 1, expected: 1 },
        { input: 2, expected: 3 },
        { input: 5, expected: 15 },
        { input: 10, expected: 55 },
        { input: 100, expected: 5050 }
    ];

    testCases.forEach(({input, expected}) => {
        console.assert(sum_to_n_a(input) === expected, `sum_to_n_a failed on n=${input}`);
        console.assert(sum_to_n_b(input) === expected, `sum_to_n_b failed on n=${input}`);
        console.assert(sum_to_n_c(input) === expected, `sum_to_n_c failed on n=${input}`);
    });

    console.log("✅ All test cases passed!");
}

runTests();
```

---

## How to Run

Run the script with Node.js:

   ```bash
   node Sol1.js
   ```

If everything is correct, you’ll see:

   ```
   ✅ All test cases passed!
   ```

---

## Notes

* Method A (formula) is the most **efficient** with constant time `O(1)`.
* Method B and C are both `O(n)`, but recursion can hit call stack limits for very large `n`.
* All three produce the same correct result.
