export function digits(n: bigint, radix = 10) {
    if (n < 0n) n = -n;
    if (n == 0n || n == 1n) return 1n;

    let count = 0n;
    const bigRadix = BigInt(radix);
    while (n > 0n) {
        n /= bigRadix;
        count++;
    }

    return count;
}