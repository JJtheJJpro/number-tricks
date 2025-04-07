import { FixedNumber } from "./src/number";

const l = new FixedNumber('1+i');
const r = new FixedNumber('2+2i');
const n = FixedNumber.add(l, r);

console.log(n.toString());