/*
export function padStart(str: string, maxLength: bigint, fillString = " ") {
    if (str.length > maxLength) {
        return str;
    }
    
    let ret = "";
    const fsl = fillString.length;
    
    while (BigInt(str.length + ret.length + fsl) < maxLength) {
        ret = fillString + ret;
    }

    let t = "";
    for (let i = 0n; i < maxLength - BigInt(str.length + ret.length); i++) {
        t += fillString[Number(i)];
    }

    return ret + t + str;
}
*/

export function repeat(str: string, n: bigint) {
    let sb = "";
    for (let i = 0n; i < n; i++) {
        sb += str;
    }
    return sb;
}