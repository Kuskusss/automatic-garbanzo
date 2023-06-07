"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot = express_1.default.Router();
exports.default = bot;
const botMethods_1 = __importDefault(require("./botMethods"));
let botMethods = new botMethods_1.default();
bot.get('/utxo/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const utxo = await botMethods.getOrderUTXO(orderId);
    res.status(200).json({ utxo });
});
bot.get('/getPools', async (req, res) => {
    const data = await botMethods.getPools();
    res.status(200).json({ data });
});
bot.get('/getPoolsPrice/:poolId', async (req, res) => {
    const poolId = req.params.poolId;
    const data = await botMethods.getPoolPrice(poolId);
    res.status(200).json({ data });
});
bot.get('/getTxnBlockTime/:txn', async (req, res) => {
    const txnString = req.params.txn;
    const txnResult = await botMethods.getTxnTimeBlockfrost(txnString);
    console.log(txnResult.block_time);
    const txnTime = txnResult.block_time;
    res.json({ response: 200, data: txnTime });
    // const data = await botMethods.getPoolPrice(poolId);
    // res.status(200).json({txnTime});
});
bot.get('/getNumberOfTransactions/:txn', async (req, res) => {
    const txnString = req.params.txn;
    const txnResult = await botMethods.getTxnTimeBlockfrost(txnString);
    console.log(txnResult.block_time);
    const txnTime = txnResult.block_time;
    res.json({ response: 200, data: txnTime });
    // const data = await botMethods.getPoolPrice(poolId);
    // res.status(200).json({txnTime});
});
