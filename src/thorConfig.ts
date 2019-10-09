import { Account, Authority, Params, Approver, Executor, Config } from './config';
import { masterNodes, endorsor, approvers } from './settings';
import { strToHexStr } from './utils';
import * as fs from "fs";

/**
 * Set masternode accounts
 */
let _authority: Authority[] = [];
for (let addr of masterNodes) {
    _authority.push({
        masterAddress: addr,
        endorsorAddress: endorsor,
        identity: strToHexStr('masterNode', 64)
    });
}

/**
 * Set network global parameters
 */
const _params: Params = {
    rewardRatio: 300000000000000000,
    baseGasPrice: 1000000000000000,
    proposerEndorsement: 25000000000000000000000000,
    executorAddress: strToHexStr('Executor', 40)
}

/**
 * Set accounts
 */
let _accounts: Account[] = [
    {
        address: endorsor,
        balance: 25000000000000000000000000
    }
];
for (let addr of approvers) {
    _accounts.push({
        address: addr,
        balance: 0,
        energy: 1e25
    })
}

/**
 * Set Executor contract
 */
let _approvers: Approver[] = [];
for (let addr of approvers) {
    _approvers.push({
        address: addr,
        identity: strToHexStr('approver', 64)
    })
}
const _executor: Executor = {
    approvers: _approvers
}

/**
 * Construct the JSON object
 */
const config: Config = {
    launchTime: Math.floor(new Date().getTime() / 1000),  // Launch time in the unit of second
    gasLimit: 10000000,
    extraData: 'CustomChain',
    accounts: _accounts,
    authority: _authority,
    params: _params,
    executor: _executor
}

// Write the JSON string to file
fs.writeFileSync(
    './customChainConfig.json',
    // Correct scientific notations
    JSON.stringify(config).replace(/([1-9]\.?[0-9]*)e\+([1-9][0-9]*)/ig, (_, p1, p2) => {
        p1 = p1.replace('.', '');
        const n = parseInt(p2) - p1.length + 1;
        const str = p1 + '0'.repeat(n);
        return str;
    })
);