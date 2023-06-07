"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPoolOutput = exports.checkValidPoolOutput = exports.PoolState = exports.normalizeAssets = void 0;
const tiny_invariant_1 = __importDefault(require("@minswap/tiny-invariant"));
const big_js_1 = __importDefault(require("big.js"));
const constants_1 = require("./constants");
// ADA goes first
// If non-ADA, then sort lexicographically
function normalizeAssets(a, b) {
    if (a === "lovelace") {
        return [a, b];
    }
    if (b === "lovelace") {
        return [b, a];
    }
    if (a < b) {
        return [a, b];
    }
    else {
        return [b, a];
    }
}
exports.normalizeAssets = normalizeAssets;
/**
 * Represents state of a pool UTxO. The state could be latest state or a historical state.
 */
class PoolState {
    constructor(txIn, value, datumHash) {
        this.txIn = txIn;
        this.value = value;
        this.datumHash = datumHash;
        const nft = value.find(({ unit }) => unit.startsWith(constants_1.POOL_NFT_POLICY_ID));
        (0, tiny_invariant_1.default)(nft, "pool doesn't have NFT");
        const poolId = nft.unit.slice(56);
        // validate and memoize assetA and assetB
        const relevantAssets = value.filter(({ unit }) => !unit.startsWith(constants_1.FACTORY_POLICY_ID) && // factory token
            !unit.endsWith(poolId) // NFT and LP tokens from profit sharing
        );
        switch (relevantAssets.length) {
            case 2: {
                // ADA/A pool
                this.assetA = "lovelace";
                const nonADAAssets = relevantAssets.filter(({ unit }) => unit !== "lovelace");
                (0, tiny_invariant_1.default)(nonADAAssets.length === 1, "pool must have 1 non-ADA asset");
                this.assetB = nonADAAssets[0].unit;
                break;
            }
            case 3: {
                // A/B pool
                const nonADAAssets = relevantAssets.filter(({ unit }) => unit !== "lovelace");
                (0, tiny_invariant_1.default)(nonADAAssets.length === 2, "pool must have 1 non-ADA asset");
                [this.assetA, this.assetB] = normalizeAssets(nonADAAssets[0].unit, nonADAAssets[1].unit);
                break;
            }
            default:
                throw new Error("pool must have 2 or 3 assets except factory, NFT and LP tokens");
        }
    }
    get nft() {
        const nft = this.value.find(({ unit }) => unit.startsWith(constants_1.POOL_NFT_POLICY_ID));
        (0, tiny_invariant_1.default)(nft, "pool doesn't have NFT");
        return nft.unit;
    }
    get id() {
        // a pool's ID is the NFT's asset name
        return this.nft.slice(constants_1.POOL_NFT_POLICY_ID.length);
    }
    get assetLP() {
        return `${constants_1.LP_POLICY_ID}${this.id}`;
    }
    get reserveA() {
        return BigInt(this.value.find(({ unit }) => unit === this.assetA)?.quantity ?? "0");
    }
    get reserveB() {
        return BigInt(this.value.find(({ unit }) => unit === this.assetB)?.quantity ?? "0");
    }
    /**
     * Get the output amount if we swap a certain amount of a token in the pair
     * @param assetIn The asset that we want to swap from
     * @param amountIn The amount that we want to swap from
     * @returns The amount of the other token that we get from the swap and its price impact
     */
    getAmountOut(assetIn, amountIn) {
        (0, tiny_invariant_1.default)(assetIn === this.assetA || assetIn === this.assetB, `asset ${assetIn} doesn't exist in pool ${this.assetA}-${this.assetB}`);
        const [reserveIn, reserveOut] = assetIn === this.assetA
            ? [this.reserveA, this.reserveB]
            : [this.reserveB, this.reserveA];
        const amtOutNumerator = amountIn * 997n * reserveOut;
        const amtOutDenominator = amountIn * 997n + reserveIn * 1000n;
        const priceImpactNumerator = reserveOut * amountIn * amtOutDenominator * 997n -
            amtOutNumerator * reserveIn * 1000n;
        const priceImpactDenominator = reserveOut * amountIn * amtOutDenominator * 1000n;
        return {
            amountOut: amtOutNumerator / amtOutDenominator,
            priceImpact: new big_js_1.default(priceImpactNumerator.toString())
                .mul(new big_js_1.default(100))
                .div(new big_js_1.default(priceImpactDenominator.toString())),
        };
    }
    /**
     * Get the input amount needed if we want to get a certain amount of a token in the pair from swapping
     * @param assetOut The asset that we want to get from the pair
     * @param amountOut The amount of assetOut that we want get from the swap
     * @returns The amount needed of the input token for the swap and its price impact
     */
    getAmountIn(assetOut, amountOut) {
        (0, tiny_invariant_1.default)(assetOut === this.assetA || assetOut === this.assetB, `asset ${assetOut} doesn't exist in pool ${this.assetA}-${this.assetB}`);
        const [reserveIn, reserveOut] = assetOut === this.assetB
            ? [this.reserveA, this.reserveB]
            : [this.reserveB, this.reserveA];
        const amtInNumerator = reserveIn * amountOut * 1000n;
        const amtInDenominator = (reserveOut - amountOut) * 997n;
        const priceImpactNumerator = reserveOut * amtInNumerator * 997n -
            amountOut * amtInDenominator * reserveIn * 1000n;
        const priceImpactDenominator = reserveOut * amtInNumerator * 1000n;
        return {
            amountIn: amtInNumerator / amtInDenominator + 1n,
            priceImpact: new big_js_1.default(priceImpactNumerator.toString())
                .mul(new big_js_1.default(100))
                .div(new big_js_1.default(priceImpactDenominator.toString())),
        };
    }
}
exports.PoolState = PoolState;
function checkValidPoolOutput(networkId, address, value, datumHash) {
    (0, tiny_invariant_1.default)(address === constants_1.POOL_ADDRESS[networkId], `expect pool address of ${constants_1.POOL_ADDRESS[networkId]}, got ${address}`);
    // must have 1 factory token
    if (value.find(({ unit }) => unit === `${constants_1.FACTORY_POLICY_ID}${constants_1.FACTORY_ASSET_NAME}`)?.quantity !== "1") {
        throw new Error(`expect pool to have 1 factory token`);
    }
    (0, tiny_invariant_1.default)(datumHash, `expect pool to have datum hash, got ${datumHash}`);
}
exports.checkValidPoolOutput = checkValidPoolOutput;
function isValidPoolOutput(networkId, address, value, datumHash) {
    try {
        checkValidPoolOutput(networkId, address, value, datumHash);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isValidPoolOutput = isValidPoolOutput;
