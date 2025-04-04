import { digits } from "./biginthelper";
import { repeat } from "./stringhelper";

export class FixedNumber {
    private realInt: bigint = 0n;
    private realPad: bigint = 0n;
    private realDec: bigint = 0n;
    /**
     * Only use if realInt is 0 and realDec is not 0.
     */
    private realNeg?: boolean = undefined;
    private imagInt: bigint = 0n;
    private imagPad: bigint = 0n;
    private imagDec: bigint = 0n;
    /**
     * Only use if imagInt is 0 and imagDec is not 0.
     */
    private imagNeg?: boolean = undefined;

    public constructor(real: number);
    public constructor(real: bigint);
    public constructor(real: number, imaginary: number);
    public constructor(real: number, imaginary: bigint);
    public constructor(real: bigint, imaginary: number);
    public constructor(real: bigint, imaginary: bigint);
    public constructor(real: number | bigint, imaginary?: number | bigint) {
        let realStr = real.toString().replace('n', '');
        if (realStr.includes('.')) {
            let realSplit = realStr.split('.');
            this.realInt = BigInt(realSplit[0]);
            this.realDec = BigInt(realSplit[1]);
            for (let i = 0; i < realSplit[1].length; i++) {
                if (realSplit[1][i] != '0') {
                    break;
                }
                this.realPad++;
            }
        } else {
            this.realInt = BigInt(realStr);
        }

        if (imaginary != undefined) {
            let imgStr = imaginary.toString().replace('n', '');
            if (imgStr.includes('.')) {
                let imgSplit = imgStr.split('.');
                this.imagInt = BigInt(imgSplit[0]);
                this.imagDec = BigInt(imgSplit[1]);
                for (let i = 0; i < imgSplit[1].length; i++) {
                    if (imgSplit[1][i] != '0') {
                        break;
                    }
                    this.imagPad++;
                }
            } else {
                this.imagInt = BigInt(imgStr);
            }
        }
    }

    public toString() {
        return this.realInt.toString() + (this.realDec != 0n ? '.' + repeat('0', this.realPad) + this.realDec.toString() : '')
            + (this.imaginarySign() == 0n ? (this.imaginarySign() == 1n ? '+' : '') + this.imagInt.toString()
            + (this.imagDec != 0n ? '.' + repeat('0', this.imagPad) + this.imagDec.toString() : '') + 'i' : "");
    }

    public clone() {
        let c = new FixedNumber(0);
        c.realInt = this.realInt;
        c.realDec = this.realDec;
        c.realPad = this.realPad;
        c.realNeg = this.realNeg;
        c.imagInt = this.imagInt;
        c.imagDec = this.imagDec;
        c.imagPad = this.imagPad;
        c.imagNeg = this.imagNeg;
        return c;
    }

    public realSign(): -1n | 0n | 1n {
        if (this.realInt < 0n || this.realNeg) {
            return -1n;
        } else if (this.realInt > 0n || !this.realNeg) {
            return 1n;
        } else {
            return 0n;
        }
    }

    public imaginarySign(): -1n | 0n | 1n {
        if (this.imagInt < 0n || this.imagNeg) {
            return -1n;
        } else if (this.imagInt > 0n || !this.imagNeg) {
            return 1n;
        } else {
            return 0n;
        }
    }

    public makeNegative() {
        this.makeRealNegative();
        this.makeImagNegative();
    }

    public makeRealNegative() {
        if (this.realNeg === undefined) {
            this.realInt *= -1n;
        } else {
            this.realNeg = !this.realNeg;
        }
    }

    /**
     * aka, make it a conjugate.
     */
    public makeImagNegative() {
        if (this.imagNeg === undefined) {
            this.imagInt *= -1n;
        } else {
            this.imagNeg = !this.imagNeg;
        }
    }

    public static readonly Zero = new FixedNumber(0);

    //#region Math Helper Functions

    private static addReal(l: { realInt: bigint, realDec: bigint, realPad: bigint }, r: { realInt: bigint, realDec: bigint, realPad: bigint }) {
        let ret = { realInt: l.realInt + r.realInt, realDec: 0n, realPad: 0n };
        let tlDec = l.realDec;
        let trDec = r.realDec;
        {
            let totalCountLRealDec = l.realPad + digits(tlDec);
            let totalCountRRealDec = r.realPad + digits(trDec);
            if (totalCountLRealDec < totalCountRRealDec) {
                tlDec *= 10n ** (totalCountRRealDec - totalCountLRealDec);
            } else if (totalCountLRealDec > totalCountRRealDec) {
                trDec *= 10n ** (totalCountLRealDec - totalCountRRealDec);
            }
        }
        let minRealPad = l.realPad == r.realPad ? l.realPad : !l.realDec || l.realPad > r.realPad ? r.realPad : l.realPad;

        // i went through like 3 revision of this part.  alsdkjf;alkdjf;alskdjf
        //if (l.realPad == r.realPad) {
        //    minRealPad = l.realPad;
        //} else if (!l.realDec || l.realPad > r.realPad) {
        //    minRealPad = r.realPad;
        //} else { // if (!r.realDec || l.realPad < r.realPad) { // bit of a stretch to comment this out but it should still work.
        //    minRealPad = l.realPad;
        //}

        let lDigits = digits(tlDec);
        let rDigits = digits(trDec);
        let maxRealDec = lDigits > rDigits ? lDigits : rDigits;
        ret.realDec = tlDec + trDec;
        ret.realPad = digits(ret.realDec) == maxRealDec ? minRealPad : minRealPad - 1n;
        if (ret.realPad == -1n) {
            const prevCount = digits(ret.realDec);
            ret.realDec -= 10n ** (prevCount - 1n);
            ret.realPad = ret.realDec == 0n ? 0n : prevCount - digits(ret.realDec) - 1n;
            ret.realInt++;
        }
        if (ret.realDec != 0n) {
            while (ret.realDec % 10n == 0n) {
                ret.realDec /= 10n;
            }
        }
        return ret;
    }
    private static addImag(l: { imagInt: bigint, imagDec: bigint, imagPad: bigint }, r: { imagInt: bigint, imagDec: bigint, imagPad: bigint }) {
        let ret = { imagInt: l.imagInt + r.imagInt, imagDec: 0n, imagPad: 0n };
        let tlDecI = l.imagDec;
        let trDecI = r.imagDec;
        {
            let totalCountLImagDec = l.imagPad + digits(tlDecI);
            let totalCountRImagDec = r.imagPad + digits(trDecI);
            if (totalCountLImagDec < totalCountRImagDec) {
                tlDecI *= 10n ** (totalCountRImagDec - totalCountLImagDec);
            } else if (totalCountLImagDec > totalCountRImagDec) {
                trDecI *= 10n ** (totalCountLImagDec - totalCountRImagDec);
            }
        }
        //let minImagPad = l.imagPad < r.imagPad ? (!r.imagPad && !r.imagDec ? l.imagPad : r.imagPad) : (!l.imagPad && !l.imagDec ? r.imagPad : l.imagPad);
        let minImagPad = l.imagPad == r.imagPad ? l.imagPad : !l.imagDec || l.imagPad > r.imagPad ? r.imagPad : l.imagPad;
        let lDigitsI = digits(tlDecI);
        let rDigitsI = digits(trDecI);
        let maxImagDec = lDigitsI > rDigitsI ? lDigitsI : rDigitsI;
        ret.imagDec = tlDecI + trDecI;
        ret.imagPad = digits(ret.imagDec) == maxImagDec ? minImagPad : minImagPad - 1n;
        if (ret.imagPad == -1n) {
            const prevCount = digits(ret.imagDec);
            ret.imagDec -= 10n ** (prevCount - 1n);
            ret.imagPad = ret.imagDec == 0n ? 0n : prevCount - digits(ret.imagDec) - 1n;
            ret.imagInt++;
        }
        if (ret.imagDec != 0n) {
            while (ret.imagDec % 10n == 0n) {
                ret.imagDec /= 10n;
            }
        }
        return ret;
    }

    private static subtractReal(l: { realInt: bigint, realDec: bigint, realPad: bigint }, r: { realInt: bigint, realDec: bigint, realPad: bigint }) {
        let ret = { realInt: l.realInt - r.realInt, realDec: 0n, realPad: 0n };
        let tlDec = l.realDec;
        let trDec = r.realDec;
        {
            let totalCountLRealDec = l.realPad + digits(tlDec);
            let totalCountRRealDec = r.realPad + digits(trDec);
            if (totalCountLRealDec < totalCountRRealDec) {
                tlDec *= 10n ** (totalCountRRealDec - totalCountLRealDec);
            } else if (totalCountLRealDec > totalCountRRealDec) {
                trDec *= 10n ** (totalCountLRealDec - totalCountRRealDec);
            }
        }
        let minRealPad = l.realPad == r.realPad ? l.realPad : !l.realDec || l.realPad > r.realPad ? r.realPad : l.realPad;
        let lDigits = digits(tlDec);
        let rDigits = digits(trDec);
        let maxRealDec = lDigits > rDigits ? lDigits : rDigits;
        if (ret.realInt != 0n) {
            
        }
        return ret;
    }

    //#endregion

    //#region Math Functions

    public static abs(n: FixedNumber) {
        // WIP
        if (n.imagInt == 0n && n.imagDec == 0n) {
            let ret = n.clone();
            if (ret.realInt < 0) {
                ret.realInt *= -1n;
            }
            return ret;
        } else {
            return FixedNumber.Zero;
        }
    }

    /**
     * 
     */
    public static add(l: FixedNumber, r: FixedNumber): FixedNumber {
        const { lr, li, rr, ri } = { lr: l.realSign(), li: l.imaginarySign(), rr: r.realSign(), ri: r.imaginarySign() };
        let ret = FixedNumber.Zero;

        if (lr >= 0n && rr >= 0n) {
            let retR = this.addReal({ realInt: l.realInt, realDec: l.realDec, realPad: l.realPad }, { realInt: r.realInt, realDec: r.realDec, realPad: r.realPad });
            ret.realInt = retR.realInt;
            ret.realDec = retR.realDec;
            ret.realPad = retR.realPad;
        } else if (lr == -1n && rr == -1n) {
            const tl = l.clone();
            const tr = r.clone();
            tl.makeRealNegative();
            tr.makeRealNegative();
            let retR = this.addReal({ realInt: tl.realInt, realDec: tl.realDec, realPad: tl.realPad }, { realInt: tr.realInt, realDec: tr.realDec, realPad: tr.realPad });
            ret.realInt = retR.realInt;
            ret.realDec = retR.realDec;
            ret.realPad = retR.realPad;
        } else if (lr == -1n && rr >= 0n) {
            const tl = l.clone();
            tl.makeRealNegative();
            let retR = this.subtractReal({ realInt: r.realInt, realDec: r.realDec, realPad: r.realPad }, { realInt: tl.realInt, realDec: tl.realDec, realPad: tl.realPad });
            ret.realInt = retR.realInt;
            ret.realDec = retR.realDec;
            ret.realPad = retR.realPad;
        } else {
            const tr = r.clone();
            tr.makeRealNegative();
            let retR = this.subtractReal({ realInt: l.realInt, realDec: l.realDec, realPad: l.realPad }, { realInt: tr.realInt, realDec: tr.realDec, realPad: tr.realPad });
            ret.realInt = retR.realInt;
            ret.realDec = retR.realDec;
            ret.realPad = retR.realPad;
        }

        if (li >= 0n && ri >= 0n) {
            let retI = this.addImag({ imagInt: l.imagInt, imagDec: l.imagDec, imagPad: l.imagPad }, { imagInt: r.imagInt, imagDec: r.imagDec, imagPad: r.imagPad });
            ret.imagInt = retI.imagInt;
            ret.imagDec = retI.imagDec;
            ret.imagPad = retI.imagPad;
        } else if (lr == -1n && rr == -1n) {

        } else if (lr == -1n && rr >= 0n) {

        } else {

        }

        return ret;
    }

    public static subtract(l: FixedNumber, r: FixedNumber) {
        let tr = r.clone();
        tr.makeNegative();
        return this.add(l, tr);
    }

    //#endregion
}