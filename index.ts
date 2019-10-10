import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex.driver-nodejs';
import { to } from 'await-to-js';

import { Authority, authorityAddr, Executor, getABI } from './src/built-in';
import { approvers, endorsor, sks } from './src/settings';
import { strToHexStr } from './src/utils';
import { decodeEvent, encodeABI, getReceipt } from './src/connexUtils';

const validator = '0x1bcb328e455d15b4bf75cab5f5c459954b032b4a';

(async () => {
    const net = new SimpleNet("http://localhost:8669");
    const wallet = new SimpleWallet();
    const driver = await Driver.connect(net, wallet);
    const connex = new Framework(driver);

    for (let i = 0; i < 3; i++) {
        wallet.import(sks[i]);
    }

    const authority = new Authority(connex);
    const executorAddr = await authority.executor();
    const executor = new Executor(connex, executorAddr);

    let txResponse: Connex.Vendor.TxResponse;

    // Propose
    console.log("PROPOSE")
    txResponse = await propose(executor);
    console.log("TXID: " + txResponse.txid + "\n");

    // Get proposalID
    const proposalID = await getProposalID(connex, txResponse.txid, 5);

    // Approve proposal
    console.log('APPROVE');
    await approve(executor, proposalID);

    // Execute proposal
    console.log('EXECUTE');
    txResponse = await execute(executor, proposalID);
    console.log('txid: ' + txResponse.txid);

    // Check
    console.log('CHECK');
    console.log('Calling Autority.get(_nodeMaster)');
    console.log(await check(connex, 5));

    driver.close();
})().catch(err => console.log(err));

/**
 * Make a proposal on adding a new validator.
 * 
 * @param executor
 * 
 * Proposer:  0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0
 * Validator: 0x1bcb328e455d15b4bf75cab5f5c459954b032b4a
 * Endorsor:  0x5e4abda5cced44f70c9d2e1be4fda08c4291945b
 */
async function propose(executor: Executor): Promise<Connex.Vendor.TxResponse> {
    // Encoding
    const abiObj = getABI('authority', 'add', 'function');
    const data = encodeABI(abiObj, validator, endorsor, strToHexStr('NewValidator', 64));

    // Assign signer and gas limit
    executor.signer(approvers[0]).gas(300000);

    // Propose
    const txResponse = await executor.propose(authorityAddr, data);

    return new Promise<Connex.Vendor.TxResponse>((resolve, _) => { resolve(txResponse); });
}

async function getProposalID(connex: Connex, txid: string, nblock: number): Promise<string> {
    const receipt = await getReceipt(connex, txid, nblock);
    const decoded = decodeEvent(receipt.outputs[0].events[0], getABI('executor', 'proposal', 'event'));
    return new Promise((resolve, _) => { resolve(decoded["proposalID"]); });
}

/**
 * Approve the submitted proposal.
 * 
 * @param executor 
 * @param proposalID 
 * 
 * Approvers
 * approvers[0]: 0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0
 * approvers[1]: 0x7d350a72ea46d0927139e57dfe2174d7acaa9d30
 */
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

/**
 * Execute the approved proposal.
 * 
 * @param executor 
 * @param proposalID 
 * 
 * Executed by 
 * approvers[2]: 0x62fa853cefc28aca2c225e66da96a692171d86e7
 */
async function execute(executor: Executor, proposalID: string): Promise<Connex.Vendor.TxResponse> {
    executor.signer(approvers[2]).gas(200000);
    return executor.execute(proposalID);
}

/**
 * Check the status of the new validator within a certain amount of time (in blocks)
 * to show that it has been added into the validator list.
 * 
 * It is conducted through calling function `get` of the built-in contract `Authority`. 
 * 
 * @param connex 
 * @param nblock 
 */
async function check(connex: Connex, nblock: number): Promise<Connex.Thor.Decoded> {
    const ticker = connex.thor.ticker();
    const n = nblock >= 1 ? Math.floor(nblock) : 1;
    const abiObj = getABI('authority', 'get', 'function');
    const method = connex.thor.account(authorityAddr).method(abiObj);

    let err: Error, out: Connex.Thor.VMOutput;
    for (let i = 0; i < n; i++) {
        await ticker.next();

        console.log('Round ' + (i + 1));
        [err, out] = await to(method.call(validator));
        if (err) { continue; }
        if (!out.decoded.listed) { continue; }

        return new Promise((resolve, _) => { resolve(out.decoded); });
    }

    throw new Error("New validator not found!");
}