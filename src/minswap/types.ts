export enum NetworkId {
    TESTNET = 0,
    MAINNET,
  }

  export type Asset = {
    unit: string;
    quantity: bigint;
  }

  export type Value = {
    unit: string;
    quantity: string;
  }[];

  export type TxIn = {
    txHash: string;
    index: number;
  };

  export type Address = string;

  export enum OrderRedeemer {
    APPLY_ORDER = 0,
    CANCEL_ORDER,
  }

  export type BlockfrostUtxo = {
    tx_hash: string;
    output_index: number;
    address: Address;
    amount: { unit: string; quantity: string }[];
    data_hash: string | null;
    inline_datum: string | null;
    reference_script_hash: string | null;
  };