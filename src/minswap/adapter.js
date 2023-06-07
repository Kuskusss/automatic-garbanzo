"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockfrostAdapter = void 0;
const blockfrost_js_1 = require("@blockfrost/blockfrost-js");
const big_js_1 = __importDefault(require("big.js"));
const constants_1 = require("./constants");
const pool_1 = require("./pool");
const types_1 = require("./types");
const tiny_invariant_1 = __importDefault(require("@minswap/tiny-invariant"));
class BlockfrostAdapter {
    constructor({ projectId, networkId = types_1.NetworkId.MAINNET, }) {
        this.networkId = networkId;
        this.api = new blockfrost_js_1.BlockFrostAPI({
            projectId,
            network: networkId === types_1.NetworkId.MAINNET ? "mainnet" : "preprod",
        });
    }
    /**
     *
     * @returns The latest pools or empty array if current page is after last page
     */
    async getPools({ page, count = 100, order = "asc", }) {
        const utxos = await this.api.addressesUtxos(constants_1.POOL_ADDRESS[this.networkId], {
            count,
            order,
            page,
        });
        return utxos
            .filter((utxo) => (0, pool_1.isValidPoolOutput)(this.networkId, constants_1.POOL_ADDRESS[this.networkId], utxo.amount, utxo.data_hash))
            .map((utxo) => new pool_1.PoolState({ txHash: utxo.tx_hash, index: utxo.output_index }, utxo.amount, utxo.data_hash));
    }
    /**
     * Get a specific pool by its ID.
     * @param {Object} params - The parameters.
     * @param {string} params.pool - The pool ID. This is the asset name of a pool's NFT and LP tokens. It can also be acquired by calling pool.id.
     * @returns {PoolState | null} - Returns the pool or null if not found.
     */
    async getPoolById({ id, }) {
        const nft = `${constants_1.POOL_NFT_POLICY_ID}${id}`;
        const nftTxs = await this.api.assetsTransactions(nft, {
            count: 1,
            page: 1,
            order: "desc",
        });
        if (nftTxs.length === 0) {
            return null;
        }
        return this.getPoolInTx({ txHash: nftTxs[0].tx_hash });
    }
    async getPoolHistory({ id, page = 1, count = 100, order = "desc", }) {
        const nft = `${constants_1.POOL_NFT_POLICY_ID}${id}`;
        const nftTxs = await this.api.assetsTransactions(nft, {
            count,
            page,
            order,
        });
        return nftTxs.map((tx) => ({
            txHash: tx.tx_hash,
            txIndex: tx.tx_index,
            blockHeight: tx.block_height,
            time: new Date(Number(tx.block_time) * 1000),
        }));
    }
    /**
     * Get pool state in a transaction.
     * @param {Object} params - The parameters.
     * @param {string} params.txHash - The transaction hash containing pool output. One of the way to acquire is by calling getPoolHistory.
     * @returns {PoolState} - Returns the pool state or null if the transaction doesn't contain pool.
     */
    async getPoolInTx({ txHash, }) {
        const poolTx = await this.api.txsUtxos(txHash);
        const poolUtxo = poolTx.outputs.find((o) => o.address === constants_1.POOL_ADDRESS[this.networkId]);
        if (!poolUtxo) {
            return null;
        }
        (0, pool_1.checkValidPoolOutput)(this.networkId, poolUtxo.address, poolUtxo.amount, poolUtxo.data_hash);
        return new pool_1.PoolState({ txHash, index: poolUtxo.output_index }, poolUtxo.amount, poolUtxo.data_hash);
    }
    async getAssetDecimals(asset) {
        if (asset === "lovelace") {
            return 6;
        }
        try {
            const assetAInfo = await this.api.assetsById(asset);
            return assetAInfo.metadata?.decimals ?? 0;
        }
        catch (err) {
            if (err instanceof blockfrost_js_1.BlockfrostServerError && err.status_code === 404) {
                return 0;
            }
            throw err;
        }
    }
    /**
     * Get pool price.
     * @param {Object} params - The parameters to calculate pool price.
     * @param {string} params.pool - The pool we want to get price.
     * @param {string} [params.decimalsA] - The decimals of assetA in pool, if undefined then query from Blockfrost.
     * @param {string} [params.decimalsB] - The decimals of assetB in pool, if undefined then query from Blockfrost.
     * @returns {[string, string]} - Returns a pair of asset A/B price and B/A price, adjusted to decimals.
     */
    async getPoolPrice({ pool, decimalsA, decimalsB, }) {
        if (decimalsA === undefined) {
            decimalsA = await this.getAssetDecimals(pool.assetA);
        }
        if (decimalsB === undefined) {
            decimalsB = await this.getAssetDecimals(pool.assetB);
        }
        const adjustedReserveA = (0, big_js_1.default)(pool.reserveA.toString()).div((0, big_js_1.default)(10).pow(decimalsA));
        const adjustedReserveB = (0, big_js_1.default)(pool.reserveB.toString()).div((0, big_js_1.default)(10).pow(decimalsB));
        const priceAB = adjustedReserveA.div(adjustedReserveB);
        const priceBA = adjustedReserveB.div(adjustedReserveA);
        return [priceAB, priceBA];
    }
    async getOrderUTxO(orderId) {
        const orderTx = await this.api.txsUtxos(orderId);
        const orderUtxo = orderTx.outputs.find((o) => o.address === constants_1.STAKE_ORDER_ADDRESS[this.networkId]);
        (0, tiny_invariant_1.default)(orderUtxo, "not found orderUtxo");
        return { ...orderUtxo, tx_hash: orderTx.hash };
    }
    async getTxn(txn) {
        let txnResult = await this.api.txs(txn);
        console.log(txnResult);
        return txnResult;
    }
}
exports.BlockfrostAdapter = BlockfrostAdapter;
