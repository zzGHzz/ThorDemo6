interface KVs {
    [key: string]: string
}

interface Account {
    address: string,
    balance: number,
    energy?: number,
    code?: string,
    storage?: KVs
}

interface Authority {
    masterAddress: string,
    endorsorAddress: string,
    identity: string
}

interface Params {
    rewardRatio: number,
    baseGasPrice: number,
    proposerEndorsement: number,
    executorAddress: string
}

interface Approver {
    address: string,
    identity: string
}

interface Executor {
    approvers: Approver[]
}

interface Config {
    launchTime: number,
    gasLimit: number,
    extraData: string,
    accounts: Account[],
    authority: Authority[],
    params: Params,
    executor: Executor
}

export { Account, Authority, Params, Approver, Executor, Config }