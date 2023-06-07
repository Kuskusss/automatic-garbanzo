"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minswap_1 = require("../../minswap");
const projectId = "mainnet7lDGXMeFRWbeBWqtKPwpbM97rCer30Ri";
class BotMethods {
    constructor() {
        this.networkId = minswap_1.NetworkId.MAINNET;
        this.blockfrostAdapter = new minswap_1.BlockfrostAdapter({ projectId, networkId: this.networkId });
    }
    async getTxnTimeBlockfrost(txn) {
        let txnTime = this.blockfrostAdapter.getTxn(txn);
        return (txnTime);
    }
    async getOrderUTXO(orderId) {
        const orderUTxO = await this.blockfrostAdapter.getOrderUTxO(orderId);
        return orderUTxO;
    }
    async getPools() {
        const pools = await this.blockfrostAdapter.getPools({ page: 1 });
        return pools;
    }
    async getPoolPrice(poolId) {
        console.log(poolId);
        const maxResult = 100;
        let count = 0;
        const historyData = [{}];
        const history = await this.blockfrostAdapter.getPoolHistory({ id: poolId });
        for (const historyPoint of history) {
            if (count === maxResult) {
                break;
            }
            else {
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
exports.default = BotMethods;
