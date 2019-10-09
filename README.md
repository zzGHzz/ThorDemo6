# ThorDemo6 - On-chain governance demo1

Demo1 runs on a customized VeChainThor with 3 validators. The objective is to execute the result of an off-chain vote by the validators to add a new validator. The demo is to show step by step the on-chain operations required to achieve the objective.
 
1. One of the validators registers a proposal which defines the operation to change the base gas price in the built-in Executor contract.
2. All validators votes in the contract to decide whether to carry out the operation.
3. One of the validators executes the proposal.