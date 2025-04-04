import { FixedNumber } from "./src/number";

const l = new FixedNumber(5, 0);
const r = new FixedNumber(-6, -1);
const n = FixedNumber.add(l, r);

console.log(n.toString());