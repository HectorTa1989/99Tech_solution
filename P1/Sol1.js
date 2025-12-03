// Method A: Mathematical Formula (Most Efficient - O(1))
// Uses Gauss's formula: n * (n + 1) / 2
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};

// Method B: Iterative Loop (O(n))
// Traditional for-loop accumulation
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Method C: Recursive Approach (O(n))
// Recursively adds n + sum of (n-1)
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};

// BONUS alternatives:
// Method D: Array.from + reduce
var sum_to_n_d = function(n) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};

// Method E: While loop
var sum_to_n_e = function(n) {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i++;
    }
    return sum;
};

// ================== Tests ==================
function runTests() {
    const testCases = [
        { input: 1, expected: 1 },
        { input: 2, expected: 3 },     // 1 + 2
        { input: 5, expected: 15 },    // 1+2+3+4+5
        { input: 10, expected: 55 },   // classic test
        { input: 100, expected: 5050 } // big n
    ];

    testCases.forEach(({input, expected}) => {
        console.assert(sum_to_n_a(input) === expected, `sum_to_n_a failed on n=${input}`);
        console.assert(sum_to_n_b(input) === expected, `sum_to_n_b failed on n=${input}`);
        console.assert(sum_to_n_c(input) === expected, `sum_to_n_c failed on n=${input}`);
    });

    console.log("✅ All test cases passed!");
}

runTests();