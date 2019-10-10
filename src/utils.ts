import { isHex, BN } from "web3-utils";
import { to } from 'await-to-js';

function numToHexStr(num: number): string {
    const flooredNum = Math.floor(num);

    if (flooredNum <= Number.MIN_SAFE_INTEGER) {
        return flooredNum.toString(16);
    }
    return "0x" + new BN('' + flooredNum).toString(16);
}

function BNToExpString(num: any, prec: number): string {
    if (!BN.isBN(num)) { throw new Error("Not a big number!"); }

    return parseInt(num.toString()).toExponential(prec);
}

function strToHexStr(str: string, hexLen: number): string {
    let hexstr = Buffer.from(str).toString('hex');
    const dif = hexstr.length - hexLen;
    if (dif > 0) {
        return '0x' + hexstr.slice(dif);
    } else {
        return '0x' + '0'.repeat(Math.abs(dif)) + hexstr;
    }
}

function isAddress(addr: string): boolean {
    return isHex(addr) && addr.replace(/^.?x/, '').length == 40
}

function isAddresses(...addrs: string[]): [boolean, number] {
    for (let i = 0; i < addrs.length; i++) {
        const addr = addrs[i];
        if (!(isHex(addr) && addr.replace(/^.?x/, '').length == 40)) { return [false, i]; }
    }
    return [true, null];
}

function isByte32(data: string): boolean {
    return isHex(data) && data.replace(/^.?x/, '').length == 64;
}

export {
    numToHexStr,
    BNToExpString,
    strToHexStr,
    isAddress, isAddresses,
    isByte32
}