/// <reference types="@vechain/connex" />

import { abi } from 'thor-devkit';
import { isByte32, toAndThrow, isAddress } from './utils';
import { to } from 'await-to-js';

function decodeEvent(output: Connex.Thor.Event, abiObj: object): abi.Decoded {
    const event = new abi.Event({
        type: "event",
        name: abiObj["name"],
        anonymous: abiObj["anonymous"],
        inputs: abiObj["inputs"]
    });

    return event.decode(output.data, output.topics);
}

function encodeABI(abiObj: object, ...params: any[]): string {
    const fn = new abi.Function({
        constant: abiObj["constant"],
        inputs: abiObj["inputs"],
        outputs: abiObj["outputs"],
        name: abiObj["name"],
        payable: abiObj["payable"],
        stateMutability: abiObj["stateMutability"],
        type: "function"
    });
    return fn.encode(params);
}

async function getReceipt(connex: Connex, txid: string, nblock: number): Promise<Connex.Thor.Receipt> {
    if (!isByte32(txid)) { throw "Invalid txid!"; }

    const ticker = connex.thor.ticker();
    const n = nblock >= 1 ? Math.floor(nblock) : 1;

    let receipt: Connex.Thor.Receipt, err: Error;

    for (let i = 0; i < n; i++) {
        await toAndThrow(ticker.next());

        [err, receipt] = await to(connex.thor.transaction(txid).getReceipt());
        if (err) { continue; }

        if (receipt.reverted) { throw "TX reverted!"; }

        return new Promise((resolve, _) => { resolve(receipt); });
    }

    throw "Failed to get receipt!";
}

export {
    decodeEvent,
    encodeABI,
    getReceipt
}