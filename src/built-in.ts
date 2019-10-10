/// <reference types="@vechain/connex" />
/// <reference types="thor-devkit/dist/abi"/>

import { strToHexStr, isAddress, isByte32 } from "./utils";
import { to } from 'await-to-js';

// Built-in contract addresses
const authorityAddr = strToHexStr("Authority", 40);
const energyAddr = strToHexStr("Energy", 40);
const paramsAddr = strToHexStr("Params", 40);
const executorAddr = strToHexStr("Executor", 40);
const extensionAddr = strToHexStr("Extension", 40);
const extensionV2Addr = strToHexStr("ExtensionV2", 40);
const prototypeAddr = strToHexStr("Prototype", 40);

// Built-in contract ABIs
const authorityABI = JSON.parse('[{"constant":true,"inputs":[],"name":"first","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nodeMaster","type":"address"}],"name":"revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_nodeMaster","type":"address"}],"name":"next","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nodeMaster","type":"address"}],"name":"get","outputs":[{"name":"listed","type":"bool"},{"name":"endorsor","type":"address"},{"name":"identity","type":"bytes32"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"executor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nodeMaster","type":"address"},{"name":"_endorsor","type":"address"},{"name":"_identity","type":"bytes32"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"nodeMaster","type":"address"},{"indexed":false,"name":"action","type":"bytes32"}],"name":"Candidate","type":"event"}]');
const energyABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"move","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalBurned","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]');
const paramsABI = JSON.parse('[{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_key","type":"bytes32"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"executor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Set","type":"event"}]');
const executorABI = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"approvers","outputs":[{"name":"identity","type":"bytes32"},{"name":"inPower","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"approverCount","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approver","type":"address"}],"name":"revokeApprover","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"proposals","outputs":[{"name":"timeProposed","type":"uint64"},{"name":"proposer","type":"address"},{"name":"quorum","type":"uint8"},{"name":"approvalCount","type":"uint8"},{"name":"executed","type":"bool"},{"name":"target","type":"address"},{"name":"data","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approver","type":"address"},{"name":"_identity","type":"bytes32"}],"name":"addApprover","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_target","type":"address"},{"name":"_data","type":"bytes"}],"name":"propose","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"attachVotingContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proposalID","type":"bytes32"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"detachVotingContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proposalID","type":"bytes32"}],"name":"execute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"votingContracts","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalID","type":"bytes32"},{"indexed":false,"name":"action","type":"bytes32"}],"name":"Proposal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"approver","type":"address"},{"indexed":false,"name":"action","type":"bytes32"}],"name":"Approver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contractAddr","type":"address"},{"indexed":false,"name":"action","type":"bytes32"}],"name":"VotingContract","type":"event"}]');
const extensionABI = JSON.parse('[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"data","type":"bytes"}],"name":"blake2b256","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockSigner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockTotalScore","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txExpiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txID","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txProvedWork","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockID","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txBlockRef","outputs":[{"name":"","type":"bytes8"}],"payable":false,"stateMutability":"view","type":"function"}]');
const extensionV2ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"data","type":"bytes"}],"name":"blake2b256","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockSigner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockTotalScore","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txGasPayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txExpiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txID","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txProvedWork","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"num","type":"uint256"}],"name":"blockID","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"txBlockRef","outputs":[{"name":"","type":"bytes8"}],"payable":false,"stateMutability":"view","type":"function"}]');
const prototypeABI = JSON.parse('[{"constant":false,"inputs":[{"name":"_self","type":"address"},{"name":"_newMaster","type":"address"}],"name":"setMaster","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_user","type":"address"}],"name":"isUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_key","type":"bytes32"}],"name":"storageFor","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_blockNumber","type":"uint256"}],"name":"energy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"},{"name":"_user","type":"address"}],"name":"removeUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"}],"name":"currentSponsor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"},{"name":"_credit","type":"uint256"},{"name":"_recoveryRate","type":"uint256"}],"name":"setCreditPlan","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"},{"name":"_sponsor","type":"address"}],"name":"selectSponsor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_blockNumber","type":"uint256"}],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"}],"name":"sponsor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"}],"name":"creditPlan","outputs":[{"name":"credit","type":"uint256"},{"name":"recoveryRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"},{"name":"_user","type":"address"}],"name":"addUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"}],"name":"hasCode","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"}],"name":"master","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_user","type":"address"}],"name":"userCredit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_self","type":"address"}],"name":"unsponsor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_self","type":"address"},{"name":"_sponsor","type":"address"}],"name":"isSponsor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]');

/**
 * Get the ABI for a specific function or event of a specific built-in contract
 * 
 * @param contract  - contract name
 * @param name      - function/event name
 * @param type      - 'function' or 'event'
 */
function getABI(contract: string, name: string, type: 'function' | 'event'): object {
    let abi: object[] = [];
    switch (contract.toLowerCase()) {
        case "prototype": { abi = prototypeABI; break; }
        case "energy": { abi = energyABI; break; }
        case "authority": { abi = authorityABI; break; }
        case "extension": { abi = extensionABI; break; }
        case "extensionv2": { abi = extensionV2ABI; break; }
        case "params": { abi = paramsABI; break; }
        case "executor": { abi = executorABI; break; }
        default: { return {}; }
    }

    const lname: string = name.toLowerCase();
    for (let fabi of abi) {
        const _name: string = fabi['name'];
        const _type: string = fabi['type'];

        if (type === _type && _name.toLowerCase() === lname) { return fabi; }
    }

    return {};
}

/**
 * A wrapper of built-in contract Authority.
 */
class Authority {
    connex: Connex;
    addr: string;

    constructor(_connex: Connex) {
        this.connex = _connex;
        this.addr = authorityAddr;
    }

    // Get Executor contract address
    public async executor(): Promise<string> {
        const abi = getABI('authority', 'executor', 'function');
        if (abi == {}) { throw new Error('ABI not found'); }

        const method = this.connex.thor.account(this.addr).method(abi);

        let err: Error, output: Connex.Thor.VMOutput;
        [err, output] = await to(method.call());
        if (err) { throw err; }

        return new Promise((resolve, reject) => {
            if (output.vmError == "") {
                resolve(output.decoded['0']);
            } else {
                reject(output.vmError);
            }
        });
    }

    // Check the status of a validator.
    public async get(_nodeMaster: string): Promise<Connex.Thor.Decoded> {
        const abi = getABI('authority', 'get', 'function');
        if (abi == {}) { throw new Error('ABI not found'); }

        const method = this.connex.thor.account(this.addr).method(abi);

        let err: Error, output: Connex.Thor.VMOutput;
        [err, output] = await to(method.call());
        if (err) { throw err; }

        return new Promise((resolve, reject) => {
            if (output.vmError == "") {
                resolve(output.decoded);
            } else {
                reject(output.vmError);
            }
        });
    }
}

/**
 * A wrapper of built-in contract Executor
 */
class Executor {
    private connex: Connex;
    private addr: string;
    private signingService: Connex.Vendor.SigningService<'tx'>;

    constructor(_connex: Connex, _addr: string) {
        if (!isAddress(_addr)) { throw new Error("Invalid address"); }

        this.connex = _connex;
        this.addr = _addr;
        this.signingService = _connex.vendor.sign('tx');
    }

    // Assign signer
    public signer(addr: string): Executor {
        if (!isAddress(addr)) { throw new Error("Invalid address!"); }

        this.signingService.signer(addr);
        return this;
    }

    // Assign max gas amount
    public gas(gas: number): Executor {
        const g = Math.floor(Math.abs(gas));
        this.signingService.gas(g);
        return this;
    }

    // Propose a proposal
    public propose(_target: string, _data: string): Promise<Connex.Vendor.TxResponse> {
        if (!isAddress(_target)) { throw new Error("Invalid adress"); }

        const abi = getABI('executor', 'propose', 'function');
        if (abi == {}) { throw new Error("ABI not found"); }

        return this.sendTX(abi, _target, _data);
    }

    // Approve a proposal
    public approve(_proposalID: string) {
        if (!isByte32(_proposalID)) { throw new Error("Invalid proposalID"); }

        const abi = getABI('executor', 'approve', 'function');
        if (abi == {}) { throw new Error("ABI not found"); }

        return this.sendTX(abi, _proposalID);
    }

    // Execute an proposal 
    public execute(_proposalID: string): Promise<Connex.Vendor.TxResponse> {
        if (!isByte32(_proposalID)) { throw new Error("Invalid proposalID"); }

        const abi = getABI('executor', 'execute', 'function');
        if (abi == {}) { throw new Error("ABI not found"); }

        return this.sendTX(abi, _proposalID);
    }

    private sendTX(abi: object, ...data: any[]): Promise<Connex.Vendor.TxResponse> {
        const method = this.connex.thor.account(this.addr).method(abi);
        const clause = method.asClause(...data);

        return this.signingService.request([{
            ...clause
        }])
    }
}

export {
    authorityABI, authorityAddr, Authority,
    energyABI, energyAddr,
    paramsABI, paramsAddr,
    extensionABI, extensionAddr, Executor,
    extensionV2ABI, extensionV2Addr,
    executorABI, executorAddr,
    prototypeABI, prototypeAddr,
    getABI
}