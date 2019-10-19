import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex.driver-nodejs';

import { authorityAddr, getBuiltinABI } from './src/built-in';
import { approvers, endorsor, sks } from './src/settings';
import { strToHexStr } from './src/utils';
import { decodeEvent, getReceipt, contractCall, contractCallWithTx, encodeABI } from './src/connexUtils';

(async () => {
    const net = new SimpleNet("http://localhost:8669");
    const wallet = new SimpleWallet();
    const driver = await Driver.connect(net, wallet);
    const connex = new Framework(driver);

    for (let i = 0; i < 3; i++) {
        wallet.import(sks[i]);
    }

    const executorAddr = (await contractCall(
        connex, authorityAddr, getBuiltinABI('authority', 'executor', 'function')
    )).decoded['0'];

    const timeout = 5;
    const validator = '2a49980921dd25babbee592a685a54cb75acea35';

    console.log("0. Check existence of new validator")
    await checkValidatorStatus(connex, validator);

    console.log("I. Propose proposoal of adding validator " + validator);
    const proposalID = await propose(connex, timeout, approvers[0], executorAddr, validator);

    console.log('II. Approve proposal');
    await approve(connex, timeout, executorAddr, proposalID);

    console.log('III. Execute proposal');
    await execute(connex, timeout, approvers[1], executorAddr, proposalID);

    console.log('IV. Check new validator status');
    await checkValidatorStatus(connex, validator);

    driver.close();
})().catch(err => console.log(err));

async function propose(
    connex: Connex, timeout: number, txSender: string, executorAddr: string, validator: string
): Promise<string> {
    const txResponse = await contractCallWithTx(
        connex, txSender, 300000,
        executorAddr, 0, getBuiltinABI('executor', 'propose', 'function'),
        authorityAddr, encodeABI(
            getBuiltinABI('authority', 'add', 'function'), validator, endorsor, strToHexStr('New Validator', 64)
        )
    );
    console.log('\tTx Sender: ' + txSender);
    console.log('\ttxid: ' + txResponse.txid);
    const proposalID = await getProposalID(connex, timeout, txResponse.txid);
    console.log('\tproposalID: ' + proposalID);

    return proposalID;
}

async function getProposalID(connex: Connex, timeout: number, txid: string): Promise<string> {
    const receipt = await getReceipt(connex, timeout, txid);
    const decoded = decodeEvent(
        receipt.outputs[0].events[0],
        getBuiltinABI('executor', 'proposal', 'event')
    );
    return decoded["proposalID"];
}

async function approve(
    connex: Connex, timeout: number, executorAddr: string, proposalID: string
) {
    const txids: string[] = [];
    for (let approver of approvers) {
        console.log('\tApprover: ' + approver);
        const txResponse = await contractCallWithTx(
            connex, approver, 300000, executorAddr, 0, getBuiltinABI('executor', 'approve', 'function'), proposalID
        );
        console.log('\ttxid: ' + txResponse.txid);
        txids.push(txResponse.txid);
    }
    for (let id of txids) { await getReceipt(connex, timeout, id); }    // Confirm TXs
}

async function execute(
    connex: Connex, timeout: number, txSender: string, executorAddr: string, proposalID: string
) {
    console.log("\tTX Sender: " + txSender);
    const txResponse = await contractCallWithTx(
        connex, txSender, 500000, executorAddr, 0, getBuiltinABI('executor', 'execute', 'function'), proposalID
    );
    console.log('\ttxid: ' + txResponse.txid);
    await getReceipt(connex, timeout, txResponse.txid);
}

async function checkValidatorStatus(connex: Connex, validator: string) {
    console.log('\taddress: ' + validator);
    const decoded = (await contractCall(
        connex, authorityAddr, getBuiltinABI('authority', 'get', 'function'), validator
    )).decoded;

    const names = ['listed', 'endorsor', 'identity', 'active'];
    for (let i = 0; i < 4; i++) {
        console.log('\t' + names[i] + ': ' + decoded['' + i]);
    }

    // for (let [key, _] of Object.entries(decoded)) {
    //     if (!/^\d+&/.test(key)) { continue; }
    //     console.log('\t' + key + ': ' + decoded[key])
    // }
}