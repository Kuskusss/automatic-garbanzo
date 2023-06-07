"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockfrostUtxosToUtxos = void 0;
function blockfrostUtxosToUtxos(u) {
    return {
        txHash: u.tx_hash,
        outputIndex: u.output_index,
        assets: (() => {
            const a = {};
            u.amount.forEach((am) => {
                a[am.unit] = BigInt(am.quantity);
            });
            return a;
        })(),
        address: u.address,
        datumHash: !u.inline_datum ? u.data_hash : undefined,
        datum: u.inline_datum,
        scriptRef: undefined, // TODO: not support yet
    };
}
exports.blockfrostUtxosToUtxos = blockfrostUtxosToUtxos;
