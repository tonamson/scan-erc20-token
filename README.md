# Scan EVM Wallet Transfers

Scan incoming and outgoing ERC20 transfers or top-level native transfers for an EVM wallet.

Supports:
- custom `rpcUrl`
- optional proxy
- optional `fromBlock`
- optional `toBlock`
- optional `direction` filter: `in`, `out`, `both`
- optional token contract filter via `tokenAddress` for ERC20 scans
- injected providers for ERC20 and native scans
- JavaScript and TypeScript consumers

## Install

```bash
yarn add scan-erc20-token
```

## JavaScript

### Scan ERC20 Transfers

```js
import { scanErc20Transfers } from "scan-erc20-token";

const transfers = await scanErc20Transfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  tokenAddress: "0xYourTokenContractAddress",
  direction: "both",
  proxy: "http://127.0.0.1:7890",
  fromBlock: 100,
  toBlock: 200,
});

console.log(transfers[0]);
```

ERC20 response shape:

```js
{
  token: "0x...",
  from: "0x...",
  to: "0x...",
  amount: 29688142670000000000n,
  tx: "0x...",
  block: 85570465,
  blockTimestamp: 1773052865,
  logIndex: 216,
  transactionIndex: 71,
  data: "0x..."
}
```

### Scan Native Transfers

```js
import { scanNativeTransfers } from "scan-erc20-token";

const transfers = await scanNativeTransfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  direction: "both",
  fromBlock: 74229500,
  toBlock: 74229500,
});

console.log(transfers[0]);
```

Native response shape:

```js
{
  from: "0x...",
  to: "0x...",
  amount: 24259569238705576n,
  tx: "0x...",
  block: 74229500,
  blockTimestamp: 1767674408,
  transactionIndex: 99,
  direction: "in"
}
```

### Proxy Support

Proxy with username/password:

```js
const transfers = await scanErc20Transfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  direction: "out",
  proxy: {
    url: "http://proxy.example.com:8080",
    username: "my-user",
    password: "my-pass",
  },
});
```

You can also pass proxy credentials directly in the URL:

```js
const transfers = await scanNativeTransfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  proxy: "http://my-user:my-pass@proxy.example.com:8080",
});
```

## TypeScript

### ERC20

```ts
import { scanErc20Transfers, type Erc20Transfer } from "scan-erc20-token";

const transfers: Erc20Transfer[] = await scanErc20Transfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  direction: "in",
  fromBlock: 100,
  toBlock: 200,
});
```

### Native

```ts
import {
  scanNativeTransfers,
  type NativeTransfer,
} from "scan-erc20-token";

const transfers: NativeTransfer[] = await scanNativeTransfers({
  rpcUrl: "https://your-evm-rpc.example.com",
  wallet: "0xYourWalletAddress",
  direction: "both",
  fromBlock: 74229500,
  toBlock: 74229500,
});
```

## Reuse A Provider

`createRpcProvider(...)` works for both ERC20 and native scans.

```js
import {
  createRpcProvider,
  scanErc20Transfers,
  scanNativeTransfers,
} from "scan-erc20-token";

const provider = createRpcProvider({
  rpcUrl: "https://your-evm-rpc.example.com",
  proxy: {
    url: "http://proxy.example.com:8080",
    username: "my-user",
    password: "my-pass",
  },
});

const erc20Transfers = await scanErc20Transfers({
  provider,
  wallet: "0xYourWalletAddress",
  tokenAddress: "0xYourTokenContractAddress",
  direction: "both",
  fromBlock: 100,
  toBlock: 200,
});

const nativeTransfers = await scanNativeTransfers({
  provider,
  wallet: "0xYourWalletAddress",
  direction: "both",
  fromBlock: 74229500,
  toBlock: 74229500,
});

console.log(erc20Transfers.length, nativeTransfers.length);
```

## API

```ts
scanErc20Transfers({
  rpcUrl?: string,
  wallet: string,
  tokenAddress?: string | null,
  direction?: "in" | "out" | "both",
  proxy?: string | ProxyConfig | null,
  proxyUrl?: string | ProxyConfig | null,
  fromBlock?: number | bigint,
  toBlock?: number | bigint,
  timeoutMs?: number,
  provider?: ScanProvider,
}): Promise<Erc20Transfer[]>
```

```ts
scanNativeTransfers({
  rpcUrl?: string,
  wallet: string,
  direction?: "in" | "out" | "both",
  proxy?: string | ProxyConfig | null,
  proxyUrl?: string | ProxyConfig | null,
  fromBlock?: number | bigint,
  toBlock?: number | bigint,
  timeoutMs?: number,
  provider?: NativeScanProvider,
}): Promise<NativeTransfer[]>
```

```ts
createRpcProvider({
  rpcUrl: string,
  proxy?: string | ProxyConfig | null,
  proxyUrl?: string | ProxyConfig | null,
  timeoutMs?: number,
}): JsonRpcProvider
```

```ts
type ProxyConfig = {
  url: string
  username?: string
  password?: string
}
```

```ts
type Erc20Transfer = {
  token: string
  from: string
  to: string
  amount: bigint
  tx: string
  block: number
  blockTimestamp: number
  logIndex: number
  transactionIndex: number
  data: string
}
```

```ts
type NativeTransfer = {
  from: string
  to: string
  amount: bigint
  tx: string
  block: number
  blockTimestamp: number
  transactionIndex: number
  direction: "in" | "out"
}
```

## Notes

- If both `fromBlock` and `toBlock` are omitted, ERC20 and native scans both use `latestBlock - 100` through `latestBlock`.
- If only `toBlock` is omitted, the latest block is used.
- If only `fromBlock` is omitted, the scan uses `toBlock`.
- If `tokenAddress` is provided, the ERC20 RPC query filters by that contract address directly.
- If `direction` is omitted, both APIs scan both incoming and outgoing transfers.
- `rpcUrl` is required when you are not injecting a `provider`.
- Native scans cover top-level native transfers only.
- Native scans include positive-value contract calls and self-transfers according to the documented `direction` rules.
- Native scans do not include internal trace transfers or tracing-only value movement.
- Some `ethers` providers surface full block transactions through `prefetchedTransactions`; the package handles that internally.
- Some RPC providers have strict rate limits. For example, free plans may reject repeated `getBlock` calls with `429 Too Many Requests`.

## Scope Boundaries

- Native support in this milestone is limited to top-level native transfers returned by standard RPC block and receipt methods.
- Internal trace transfers are out of scope for `v1.0.5` and are not included in `scanNativeTransfers(...)`.
- If you need tracing-only value movement, plan that as a later feature instead of assuming it is covered by the current API.

## Tests

Run the standard test suite:

```bash
yarn test
```

Run type checking:

```bash
yarn typecheck
```

This package verifies native and ERC20 behavior with mocked provider data.
Tests do not require a real RPC endpoint and do not expose live mainnet URLs or personal transaction hashes.
