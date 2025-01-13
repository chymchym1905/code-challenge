// Using mathematical formula
const sum_to_n_a = (n: number): number => {
    return (n * (n + 1)) / 2;
};

// Using a for loop
const sum_to_n_b = (n: number): number => {
    let res = 0;
    for (let i = 1; i <= n; i++) {
        res += i;
    }
    return res;
};

// Using recursion
const sum_to_n_c = (n: number): number => {
    if (n === 1) return n;
    return n + sum_to_n_c(n - 1);
};

// Using high-order function (reduce)
const sum_to_n_d = (n: number): number => {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0);
};

// Test the functions
console.log('Formula: ', sum_to_n_a(15));
console.log('For loop: ', sum_to_n_b(15));
console.log('Recursion: ', sum_to_n_c(15));
console.log('High order function: ', sum_to_n_d(15));
