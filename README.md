# Demo of VeChainThor On-chain Governance - Adding a New Validator

This demo runs on a customized VeChainThor with 3 approvers. The objective is to execute the result of an off-chain vote by the approvers to add a new validator. The demo is to show step by step the required on-chain operations.
 
1. The first approver registers a proposal which defines the operation of adding a new validator.
2. Tne first two approvers votes for the proposal to reach the required majority.
3. The third approver executes the proposal. Note that anyone can execute a proposal which has been approved.

## Prerequisites

1. Edit `./src/setting.ts` to check values of `masterNodes` to the master addresses of your local thor nodes. The address can be obtained via command `thor master-key --config-dir <KEY_DIR>`.

2. Run `./src/thorConfig.ts` to generate `./customChainConfig.json` for launching your customized VeChainThor locally.