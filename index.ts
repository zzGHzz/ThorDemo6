import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex.driver-nodejs';
import { to } from 'await-to-js';

import { Authority, authorityAddr, Executor, getABI } from './src/built-in';
import { approvers, endorsor, sks } from './src/settings';
import { strToHexStr, toAndThrow } from './src/utils';
import { decodeEvent, encodeABI, getReceipt } from './src/connexUtils';

const validator = '0x1bcb328e455d15b4bf75cab5f5c459954b032b4a';

try {
    (async () => {
        const net = new SimpleNet("https://sync-testnet.vechain.org");
        const wallet = new SimpleWallet();
        const driver = await toAndThrow(Driver.connect(net, wallet));
        const connex = new Framework(driver);

        for (let i = 0; i < 3; i++) {
            wallet.import(sks[i]);
        }

        const authority = new Authority(connex);
        const executorAddr = await toAndThrow(authority.executor());
        const executor = new Executor(connex, executorAddr);

        let txResponse: Connex.Vendor.TxResponse;

        // Propose
        console.log("PROPOSE")
        txResponse = await toAndThrow(propose(executor));
        console.log("TXID: " + txResponse.txid + "\n");

        // Get proposalID
        const proposalID = await toAndThrow(getProposalID(connex, txResponse.txid, 5));

        // Approve proposal
        console.log('APPROVE');
        await toAndThrow(approve(executor, proposalID));

        // Execute proposal
        console.log('EXECUTE');
        txResponse = await toAndThrow(execute(executor, proposalID));
        console.log('txid: ' + txResponse.txid);

        // Check
        console.log('CHECK');
        console.log('Calling Autority.get(_nodeMaster)');
        console.log(await toAndThrow(check(connex, 5)));

        driver.close();
    })();
} catch (e) { console.log(e); }

/**
 * Make a proposal on adding a new validator.
 * 
 * Proposer:    0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0
 * Validator:   0x1bcb328e455d15b4bf75cab5f5c459954b032b4a
 * Endorsor:    0x5e4abda5cced44f70c9d2e1be4fda08c4291945b
 */
async function propose(executor: Executor): Promise<Connex.Vendor.TxResponse> {
    // Encoding
    const obj = getABI('authority', 'add', 'function');
    const data = encodeABI(obj, validator, endorsor, strToHexStr('NewValidator', 40));

    // Assign signer and gas limit
    executor.signer(approvers[0]).gas(300000);

    // Propose
    const txResponse = await toAndThrow(executor.propose(authorityAddr, data));

    return new Promise<Connex.Vendor.TxResponse>((resolve, _) => { resolve(txResponse); });
}

async function getProposalID(connex: Connex, txid: string, nblock: number): Promise<string> {
    const receipt = await toAndThrow(getReceipt(connex, txid, nblock));
    const decoded = decodeEvent(receipt.outputs[0].events[0], getABI('executor', 'proposal', 'event'));
    return new Promise((resolve, _) => { resolve(decoded["proposal"]); });
}

async function approve(executor: Executor, proposalID: string): Promise<void> {
    try {
        let txResponse: Connex.Vendor.TxResponse;

        executor.signer(approvers[0]).gas(300000);
        txResponse = await executor.approve(proposalID);
        console.log('txid: ' + txResponse.txid);

        executor.signer(approvers[1]).gas(300000);
        txResponse = await executor.approve(proposalID);
        console.log('txid: ' + txResponse.txid);
    } catch (err) { throw err; }
}

async function execute(executor: Executor, proposalID: string): Promise<Connex.Vendor.TxResponse> {
    executor.signer(approvers[2]).gas(200000);
    return executor.execute(proposalID);
}

async function check(connex: Connex, nblock: number): Promise<Connex.Thor.Decoded> {
    const ticker = connex.thor.ticker();
    const n = nblock >= 1 ? Math.floor(nblock) : 1;
    const abiObj = getABI('authority', 'get', 'function');
    const method = connex.thor.account(authorityAddr).method(abiObj);

    let err: Error, out: Connex.Thor.VMOutput;
    for (let i = 0; i < n; i++) {
        console.log('Round ' + (i + 1));
        [err, out] = await to(method.call(validator));
        if (err) { continue; }
        if (!out.decoded.listed) { continue; }

        return new Promise((resolve, _) => { resolve(out.decoded); });
    }

    throw "New validator not found!";
}