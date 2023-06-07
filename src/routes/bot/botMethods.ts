import { BlockfrostAdapter, NetworkId } from '../../minswap';

const projectId: string = "mainnet7lDGXMeFRWbeBWqtKPwpbM97rCer30Ri";

export default class BotMethods {
    private readonly blockfrostAdapter: BlockfrostAdapter;
    private readonly networkId = NetworkId.MAINNET;
    constructor(
    ) {
        this.blockfrostAdapter = new BlockfrostAdapter({ projectId, networkId: this.networkId });
    }
    async getTxnTimeBlockfrost(txn:string){
        let txnTime = this.blockfrostAdapter.getTxn(txn);
        return (txnTime);
    }
    async getOrderUTXO(orderId: string) {
        const orderUTxO = await this.blockfrostAdapter.getOrderUTxO(orderId);
        return orderUTxO;
    }

    async getPools() {
        const pools = await this.blockfrostAdapter.getPools({ page: 1 });
        return pools;
    }

    async getPoolPrice(poolId: string) {
        console.log(poolId);
        const maxResult = 100;
        let count = 0;
        const historyData: [{}] = [{}];
        const history = await this.blockfrostAdapter.getPoolHistory({ id: poolId });
        for (const historyPoint of history) {
            if (count === maxResult) {
                break
            } else {
                const pool = await this.blockfrostAdapter.getPoolInTx({ txHash: historyPoint.txHash });
                if (!pool) {
                    throw new Error("pool not found");
                }
                const [price0, price1] = await this.blockfrostAdapter.getPoolPrice({
                    pool,
                    decimalsA: undefined,
                    decimalsB: undefined,
                });

                historyData.push({ time: historyPoint.time, price0, price1 });
                console.log(`${historyPoint.time}: ${price0} ADA/MIN, ${price1} MIN/ADA`);
                count++;
            }
        }
        return historyData;
    }

}