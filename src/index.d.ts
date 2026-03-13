import type {
  Block,
  JsonRpcProvider,
  Log,
  PerformActionFilter,
} from "ethers";

/**
 * Topic hash of the ERC20 `Transfer(address,address,uint256)` event.
 */
export declare const ERC20_TRANSFER_TOPIC: string;

/**
 * Supported scan directions.
 *
 * - `in`: only transfers received by `wallet`
 * - `out`: only transfers sent from `wallet`
 * - `both`: merge incoming and outgoing transfers
 */
export declare const ERC20_TRANSFER_DIRECTIONS: readonly [
  "in",
  "out",
  "both",
];

/**
 * Supported scan directions for native transfer queries.
 */
export declare const NATIVE_TRANSFER_DIRECTIONS: readonly [
  "in",
  "out",
  "both",
];

export type Erc20TransferDirection =
  (typeof ERC20_TRANSFER_DIRECTIONS)[number];
export type NativeTransferDirection =
  (typeof NATIVE_TRANSFER_DIRECTIONS)[number];
export type NativeTransferRecordDirection = Exclude<
  NativeTransferDirection,
  "both"
>;

export interface ProxyConfig {
  /**
   * Full proxy URL, for example `http://proxy.example.com:8080`.
   */
  url: string;

  /**
   * Optional proxy username. If provided, it is injected into the proxy URL.
   */
  username?: string;

  /**
   * Optional proxy password. If provided, it is injected into the proxy URL.
   */
  password?: string;
}

export interface RpcProviderOptions {
  /**
   * EVM JSON-RPC endpoint URL.
   */
  rpcUrl: string;

  /**
   * Optional proxy configuration.
   *
   * You can pass a string URL such as `http://user:pass@host:port`
   * or an object with `url`, `username`, and `password`.
   */
  proxy?: string | ProxyConfig | null;

  /**
   * Alias of `proxy`.
   */
  proxyUrl?: string | ProxyConfig | null;

  /**
   * Optional HTTP timeout in milliseconds.
   */
  timeoutMs?: number;
}

export interface ScanErc20TransfersOptions extends RpcProviderOptions {
  /**
   * Wallet address to scan.
   */
  wallet: string;

  /**
   * Optional ERC20 token contract address.
   *
   * If provided, the RPC query is filtered to this token contract only.
   */
  tokenAddress?: string | null;

  /**
   * Optional start block.
   *
   * If both `fromBlock` and `toBlock` are omitted,
   * the scan starts at `latestBlock - 100`.
   *
   * If only `fromBlock` is omitted, the scan uses `toBlock`.
   */
  fromBlock?: number | bigint;

  /**
   * Optional end block.
   *
   * If both `fromBlock` and `toBlock` are omitted,
   * the scan ends at the latest block number.
   *
   * If only `toBlock` is omitted, the latest block number is used.
   */
  toBlock?: number | bigint;

  /**
   * Defaults to `both`.
   */
  direction?: Erc20TransferDirection;

  /**
   * Optional custom provider.
   *
   * If omitted, `createRpcProvider(options)` is used internally.
   */
  provider?: ScanProvider;
}

export interface Erc20Transfer {
  /**
   * ERC20 token contract address that emitted the `Transfer` log.
   */
  token: string;

  /**
   * Sender address from the event.
   */
  from: string;

  /**
   * Receiver address from the event.
   */
  to: string;

  /**
   * Raw token amount as a `bigint`.
   */
  amount: bigint;

  /**
   * Transaction hash containing the log.
   */
  tx: string;

  /**
   * Block number containing the log.
   */
  block: number;

  /**
   * Unix timestamp of the block.
   */
  blockTimestamp: number;

  /**
   * Log index inside the block.
   */
  logIndex: number;

  /**
   * Transaction index inside the block.
   */
  transactionIndex: number;

  /**
   * Raw log data field.
   */
  data: string;
}

export interface ScanProvider {
  /**
   * Returns the block for a given block number.
   */
  getBlock(blockNumber: number): Promise<Block | null>;

  /**
   * Returns the latest block number.
   */
  getBlockNumber(): Promise<number>;

  /**
   * Queries logs using an EVM log filter.
   */
  getLogs(filter: PerformActionFilter): Promise<Array<Log>>;
}

export interface NativeTransactionLike {
  /**
   * Sender address of the top-level transaction.
   */
  from: string;

  /**
   * Receiver address of the top-level transaction.
   */
  to: string | null;

  /**
   * Native token value sent in the transaction.
   */
  value: bigint | string;

  /**
   * Transaction hash.
   */
  hash: string;

  /**
   * Transaction index inside the block.
   */
  index: number;
}

export interface NativeBlockLike {
  /**
   * Unix timestamp of the block.
   */
  timestamp: number;

  /**
   * Full transactions for this block.
   */
  transactions: NativeTransactionLike[];
}

export interface NativeTransactionReceiptLike {
  /**
   * Transaction status from the receipt.
   */
  status: number | bigint | null;
}

export interface NativeScanProvider {
  /**
   * Returns the latest block number.
   */
  getBlockNumber(): Promise<number>;

  /**
   * Returns a full block including transactions.
   */
  getBlock(
    blockNumber: number,
    includeTransactions: boolean
  ): Promise<NativeBlockLike | null>;

  /**
   * Returns the receipt for a given transaction hash.
   */
  getTransactionReceipt(
    transactionHash: string
  ): Promise<NativeTransactionReceiptLike | null>;
}

export interface ScanNativeTransfersOptions extends RpcProviderOptions {
  /**
   * Wallet address to scan.
   */
  wallet: string;

  /**
   * Optional start block.
   *
   * If both `fromBlock` and `toBlock` are omitted,
   * the scan starts at `latestBlock - 100`.
   *
   * If only `fromBlock` is omitted, the scan uses `toBlock`.
   */
  fromBlock?: number | bigint;

  /**
   * Optional end block.
   *
   * If both `fromBlock` and `toBlock` are omitted,
   * the scan ends at the latest block number.
   *
   * If only `toBlock` is omitted, the latest block number is used.
   */
  toBlock?: number | bigint;

  /**
   * Defaults to `both`.
   */
  direction?: NativeTransferDirection;

  /**
   * Optional custom provider.
   *
   * If omitted, `createRpcProvider(options)` is used internally.
   */
  provider?: NativeScanProvider;
}

export interface NativeTransfer {
  /**
   * Sender address of the top-level transaction.
   */
  from: string;

  /**
   * Receiver address of the top-level transaction.
   */
  to: string;

  /**
   * Raw native amount as a `bigint`.
   */
  amount: bigint;

  /**
   * Transaction hash.
   */
  tx: string;

  /**
   * Block number containing the transaction.
   */
  block: number;

  /**
   * Unix timestamp of the block.
   */
  blockTimestamp: number;

  /**
   * Transaction index inside the block.
   */
  transactionIndex: number;

  /**
   * Matched transfer direction for this wallet.
   */
  direction: NativeTransferRecordDirection;
}

/**
 * Creates an `ethers` JSON-RPC provider with optional proxy and timeout support.
 *
 * @param options.rpcUrl EVM JSON-RPC endpoint URL.
 * @param options.proxy Optional proxy configuration or proxy URL string.
 * @param options.proxyUrl Alias of `options.proxy`.
 * @param options.timeoutMs Optional HTTP timeout in milliseconds.
 */
export declare function createRpcProvider(
  options: RpcProviderOptions
): JsonRpcProvider;

/**
 * Scans ERC20 transfer logs for the given wallet.
 *
 * If `direction` is omitted, both incoming and outgoing transfers are returned.
 *
 * @param options.rpcUrl EVM JSON-RPC endpoint URL.
 * @param options.wallet Wallet address to scan.
 * @param options.tokenAddress Optional token contract filter.
 * @param options.direction Scan incoming, outgoing, or both directions.
 * @param options.proxy Optional proxy configuration or proxy URL string.
 * @param options.proxyUrl Alias of `options.proxy`.
 * @param options.fromBlock Optional start block. Defaults to `latestBlock - 100`
 * when both `fromBlock` and `toBlock` are omitted.
 * @param options.toBlock Optional end block. Defaults to `latestBlock`
 * when both `fromBlock` and `toBlock` are omitted.
 * @param options.timeoutMs Optional HTTP timeout in milliseconds.
 * @param options.provider Optional custom provider implementation.
 */
export declare function scanErc20Transfers(
  options: ScanErc20TransfersOptions
): Promise<Erc20Transfer[]>;

/**
 * Scans top-level native transfers for the given wallet.
 *
 * If `direction` is omitted, both incoming and outgoing transfers are returned.
 *
 * @param options.rpcUrl EVM JSON-RPC endpoint URL.
 * @param options.wallet Wallet address to scan.
 * @param options.direction Scan incoming, outgoing, or both directions.
 * @param options.proxy Optional proxy configuration or proxy URL string.
 * @param options.proxyUrl Alias of `options.proxy`.
 * @param options.fromBlock Optional start block. Defaults to `latestBlock - 100`
 * when both `fromBlock` and `toBlock` are omitted.
 * @param options.toBlock Optional end block. Defaults to `latestBlock`
 * when both `fromBlock` and `toBlock` are omitted.
 * @param options.timeoutMs Optional HTTP timeout in milliseconds.
 * @param options.provider Optional custom provider implementation.
 */
export declare function scanNativeTransfers(
  options: ScanNativeTransfersOptions
): Promise<NativeTransfer[]>;
