# scan-erc20-token

## What This Is

`scan-erc20-token` is a small JavaScript/TypeScript library for scanning on-chain transfer activity for an EVM wallet from a standard RPC endpoint. The current shipped surface focuses on ERC20 `Transfer` logs with block-range, direction, proxy, timeout, and custom-provider support. This milestone extends the package to also scan native-token transfers on EVM networks without breaking the existing ERC20 API.

## Core Value

Developers can reliably query EVM wallet transfer history through a small, typed API that works against ordinary RPC infrastructure.

## Requirements

### Validated

- ✓ Developer can scan incoming and outgoing ERC20 transfers for a wallet across a block range — shipped in `v1.0.4`
- ✓ Developer can filter ERC20 scans by token contract and direction — shipped in `v1.0.4`
- ✓ Developer can use proxy, timeout, and custom provider settings from JavaScript and TypeScript consumers — shipped in `v1.0.4`

### Active

- [ ] Developer can scan native-token transfers for an EVM wallet with range and direction controls
- [ ] Developer can call native-transfer scanning through a clear typed API without breaking ERC20 consumers
- [ ] Developer can understand and verify native-transfer support through docs and automated tests

### Out of Scope

- Internal/native trace transfers — requires client-specific tracing APIs and would break the current "standard RPC" simplicity
- Unified merged ERC20 + native timeline API — useful later, but not required to ship native support cleanly in `v1.0.5`
- Fiat pricing, token metadata, or explorer enrichment — not core to transfer scanning and would add unrelated external dependencies

## Context

- Existing runtime code is a compact ESM library in `src/index.js` with hand-maintained declarations in `src/index.d.ts`
- The package already ships `scanErc20Transfers(...)` and `createRpcProvider(...)`, with tests using injected fake providers rather than live RPC calls
- This is the first GSD-managed planning cycle for the repository; prior releases existed before `.planning/` was initialized
- Native-token support should follow the same design values as the current ERC20 feature set: minimal API surface, deterministic output, no vendor lock-in

## Constraints

- **Tech stack**: Stay on Node.js ESM with `ethers` v6 and the current package layout — keeps the release aligned with the existing library
- **Compatibility**: Existing `scanErc20Transfers(...)` behavior and exported types must remain backward-compatible — current users should not need migration work
- **RPC portability**: Prefer standard EVM JSON-RPC methods over vendor tracing extensions — broad chain/provider compatibility matters
- **Verification**: Tests must remain offline and deterministic — no live RPC dependencies in CI or local verification

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Add native-token support as a dedicated API instead of extending the ERC20 function | The current API and result shape are explicitly ERC20-specific; a separate API keeps semantics clear | — Pending |
| Scope `v1.0.5` native scanning to top-level transaction value transfers discoverable from standard RPC calls | Preserves provider portability and avoids tracing dependencies | — Pending |
| Keep native-transfer tests provider-injected and mock-driven | Matches current repo testing style and avoids flaky network-dependent verification | ✓ Good |

---
*Last updated: 2026-03-13 after starting milestone v1.0.5*
