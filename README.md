# Demo of VeChainThor On-chain Governance - Authorizing a New Validator

This demo simulates the on-chain governance that authorizes a new consensus validator (i.e., authority masternode). The process consists of three steps: decision making, authorization and execution. The first step is assumed to be carried out off-chain by members of the governing body and the second two step conducted on-chain using the deployed built-in contract `Executor`.

The demo shows step by step how to do the required on-chain operations (functions that implement the operations are shown in brackets):
 
1. To propose a proposal of authorizing a new validator (`propose`);
2. To approve the proposal (`approve`);
3. To execute the proposal (`execute`).

## Terminology in Code

* `approver` / `approvers` - member(s) of the governing body;
* `authority` - built-in contract `Authority` that manages the list of validators;
* `executor` - built-in contact `Executor`.

## Prerequisites

This demo should be run on a customized version of VeChainThor. The definition of the network can be found in `./customChainConfig.json`. Related Thor-node commands can be found in `./nodeLaunchCmd`.

YOU MUST REPLACE all the `authorityAddress` with the master addresses of the Thor node launched by you to make the demo work. The master address can be obtained by command:
```
thor master-key --config-dir <KEY_DIR>
```

Please refer to my previous article ['What you might not know about VeChainThor yet (Part V) - Customizing Your Own VeChainThor'](https://medium.com/@ziheng.zhou/what-you-might-not-know-about-vechainthor-yet-part-v-customizing-your-own-vechainthor-dd40a7667452) for details. 

## Demo Output

The following are the outputs after I ran the demo on my machine:
```
0. Check existence of new validator
	address: 2a49980921dd25babbee592a685a54cb75acea35
	listed: false
	endorsor: 0x0000000000000000000000000000000000000000
	identity: 0x0000000000000000000000000000000000000000000000000000000000000000
	active: false
I. Propose proposoal of adding validator 2a49980921dd25babbee592a685a54cb75acea35
	Tx Sender: 0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0
	txid: 0xf90d9695ef8fc8cdaaa22ff962ed90ad7c6944099d245b12cf24df0ada82fed0
	proposalID: 0x1596231d71a49eb11cd1ac38332ab83cb5ba22bae26810f89b9f7241aa76f379
II. Approve proposal
	Approver: 0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0
	txid: 0x3979bb4a0d9bf595092363609d366518b57842a9b4e4ad3b062ade6a380043a7
	Approver: 0x7d350a72ea46d0927139e57dfe2174d7acaa9d30
	txid: 0x43f84dfc5b160e5059ecf4bb2934949fdd3c9b88b9f9631ab7222786e31b67be
	Approver: 0x62fa853cefc28aca2c225e66da96a692171d86e7
	txid: 0x1e2e389caa674a3ade32232574466538cd33710781d8bf75a1b744ecaec641e5
III. Execute proposal
	TX Sender: 0x7d350a72ea46d0927139e57dfe2174d7acaa9d30
	txid: 0x1f8a44ba88a135c8ab3de2c2acfe3678cc2e671751f2d99a29e8c80d98d56a70
IV. Check new validator status
	address: 2a49980921dd25babbee592a685a54cb75acea35
	listed: true
	endorsor: 0x5e4abda5cced44f70c9d2e1be4fda08c4291945b
	identity: 0x000000000000000000000000000000000000004e65772056616c696461746f72
	active: true
```