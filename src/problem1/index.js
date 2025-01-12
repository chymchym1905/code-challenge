var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
}

var sum_to_n_b = function(n) {
    let res = 0;
    for (let i=1; i<=n; i++) {
        res += i
    }
    return res;
};

var sum_to_n_c = function(n) {
    if (n === 1) return n;
    return n + sum_to_n_c(n - 1);
};

var sum_to_n_d = function(n) {
    return Array.from({ length: n }, (v, i) => i + 1).reduce((acc, curr) => acc + curr);
};

console.log("Formula: ", sum_to_n_a(5));
console.log("For loop: ", sum_to_n_b(5));
console.log("Recursion: ", sum_to_n_c(5));
console.log("High order function: ", sum_to_n_d(5));