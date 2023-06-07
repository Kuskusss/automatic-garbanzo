"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRedeemer = exports.NetworkId = void 0;
var NetworkId;
(function (NetworkId) {
    NetworkId[NetworkId["TESTNET"] = 0] = "TESTNET";
    NetworkId[NetworkId["MAINNET"] = 1] = "MAINNET";
})(NetworkId = exports.NetworkId || (exports.NetworkId = {}));
var OrderRedeemer;
(function (OrderRedeemer) {
    OrderRedeemer[OrderRedeemer["APPLY_ORDER"] = 0] = "APPLY_ORDER";
    OrderRedeemer[OrderRedeemer["CANCEL_ORDER"] = 1] = "CANCEL_ORDER";
})(OrderRedeemer = exports.OrderRedeemer || (exports.OrderRedeemer = {}));
