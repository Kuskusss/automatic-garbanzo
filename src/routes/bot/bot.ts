import express, { Request, Response } from 'express';
const bot = express.Router();
export default bot;

import BotMethods from './botMethods';
let botMethods = new BotMethods();

bot.get('/utxo/:orderId', async (req: Request, res: Response) => {
    const orderId: string = req.params.orderId;
    const utxo = await botMethods.getOrderUTXO(orderId);
    res.status(200).json({utxo});
});

bot.get('/getPools', async (req: Request, res: Response) => {
    const data = await botMethods.getPools();
    res.status(200).json({data});
});

bot.get('/getPoolsPrice/:poolId', async (req: Request, res: Response) => {
    const poolId: string = req.params.poolId;
    const data = await botMethods.getPoolPrice(poolId);
    res.status(200).json({data});
});

bot.get('/getTxnBlockTime/:txn', async (req: Request, res: Response) => {
    const txnString: string = req.params.txn;
    const txnResult = await botMethods.getTxnTimeBlockfrost(txnString);
    console.log(txnResult.block_time);
    const txnTime = txnResult.block_time;
    res.json({response:200,data:txnTime});
    // const data = await botMethods.getPoolPrice(poolId);
    // res.status(200).json({txnTime});
});

bot.get('/getNumberOfTransactions/:txn', async (req: Request, res: Response) => {
    const txnString: string = req.params.txn;
    const txnResult = await botMethods.getTxnTimeBlockfrost(txnString);
    console.log(txnResult.block_time);
    const txnTime = txnResult.block_time;
    res.json({response:200,data:txnTime});
    // const data = await botMethods.getPoolPrice(poolId);
    // res.status(200).json({txnTime});
});