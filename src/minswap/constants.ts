import { Address, NetworkId } from "./types";

export const ORDER_ADDRESS = {
  [NetworkId.TESTNET]:
    "addr_test1wzn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc5lpd8w",
  [NetworkId.MAINNET]:
    "addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt",
};

export const STAKE_ORDER_ADDRESS: Record<number, Address> = {
  [NetworkId.TESTNET]:
    "addr_test1zzn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwurajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upq932hcy",
  [NetworkId.MAINNET]:
    "addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70",
};

export const POOL_ADDRESS: Record<number, Address> = {
  [NetworkId.TESTNET]:
    "addr_test1zrsnz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxzvrajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqs8q93k",
  [NetworkId.MAINNET]:
    "addr1z8snz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxz2j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq0xmsha",
};

export const FACTORY_POLICY_ID =
  "13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f";
export const FACTORY_ASSET_NAME = "4d494e53574150";
export const LP_POLICY_ID =
  "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86";
export const POOL_NFT_POLICY_ID =
  "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1";
export const orderScript = {
  type: "PlutusV1",
  script:
    "59014f59014c01000032323232323232322223232325333009300e30070021323233533300b3370e9000180480109118011bae30100031225001232533300d3300e22533301300114a02a66601e66ebcc04800400c5288980118070009bac3010300c300c300c300c300c300c300c007149858dd48008b18060009baa300c300b3754601860166ea80184ccccc0288894ccc04000440084c8c94ccc038cd4ccc038c04cc030008488c008dd718098018912800919b8f0014891ce1317b152faac13426e6a83e06ff88a4d62cce3c1634ab0a5ec133090014a0266008444a00226600a446004602600a601a00626600a008601a006601e0026ea8c03cc038dd5180798071baa300f300b300e3754601e00244a0026eb0c03000c92616300a001375400660106ea8c024c020dd5000aab9d5744ae688c8c0088cc0080080048c0088cc00800800555cf2ba15573e6e1d200201",
};

export enum MetadataMessage {
  DEPOSIT_ORDER = "Minswap: Deposit Order",
  CANCEL_ORDER = "Minswap: Cancel Order",
  ONE_SIDE_DEPOSIT_ORDER = "Minswap: Zap Order",
  SWAP_EXACT_IN_ORDER = "Minswap: Swap Exact In Order",
  SWAP_EXACT_IN_LIMIT_ORDER = "Minswap: Swap Exact In Limit Order",
  SWAP_EXACT_OUT_ORDER = "Minswap: Swap Exact Out Order",
  WITHDRAW_ORDER = "Minswap: Withdraw Order",
}

export const OUTPUT_ADA = 2_000_000n;
export const BATCHER_FEE = 2_000_000n;
export enum StepType {
  SWAP_EXACT_IN = 0,
  SWAP_EXACT_OUT,
  DEPOSIT,
  WITHDRAW,
  ONE_SIDE_DEPOSIT,
}