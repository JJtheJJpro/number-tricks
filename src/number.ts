/**
 * A class that represents an arbitrary complex decimal number.
 */
export class FixedNumber {
    private realInt: bigint;
    private realPad: bigint;
    private realDec: bigint;
    private realNeg?: boolean;
    private imaginaryInt: bigint;
    private imaginaryPad: bigint;
    private imaginaryDec: bigint;
    private imaginaryNeg?: boolean;

    /**
     * The main constructor for the FixedNumber. Input must be a number, not an expression.
     */
    public constructor(input: number | bigint | string) {
        // convert to string
        if (typeof input === 'number' || typeof input === 'bigint') {
            input = input.toString();
        }

        // get rid of whitespace and possible + sign at beginning
        input = input.replace(/\s+/g, '');
        if (input.startsWith('+')) {
            input = input.slice(1);
        }

        // there are multiple cases to follow through: ±a±bi, ±a, and ±bi
        if (input.includes('i')) {
            
        } else {

        }
    }

    /**
     * Converts the FixedNumber to an accurate representation in a string.
     */
    public toString() {

    }
}