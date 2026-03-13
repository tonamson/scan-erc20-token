# Phase 1: Native Scan Core - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the core logic that finds top-level native-token transfers for an EVM wallet across a block range, with incoming/outgoing/both direction support and the same block fallback rules as the existing ERC20 scan. Public API expansion, declaration updates, and README polish remain in later phases.

</domain>

<decisions>
## Implementation Decisions

### Transfer source semantics
- Treat native transfers as top-level transactions with `value > 0`
- Include transactions with `value > 0` even when they are contract calls
- `wallet -> contract` with positive native value counts as an outgoing native transfer
- `sender -> wallet` with positive native value counts as an incoming native transfer, regardless of whether sender is an EOA or contract
- Do not support internal or trace-level native transfers in this phase

### Filtering boundaries
- Ignore transactions with `value = 0`
- Ignore failed transactions; only successful native movement should be returned
- Self-transfers where `from === to === wallet` and `value > 0` should match both directions
- In `both` mode, self-transfers should produce two records rather than being deduplicated away

### Block range behavior
- Keep the same fallback rules as `scanErc20Transfers(...)`
- If both `fromBlock` and `toBlock` are omitted, scan `latestBlock - 100` through `latestBlock`
- If only `toBlock` is omitted, use `latestBlock`
- If only `fromBlock` is omitted, use `toBlock`
- Throw an error when `fromBlock > toBlock`

### Result shape
- Keep the native-transfer result as close as practical to the existing ERC20 transfer shape
- Include an explicit `direction` field so callers do not have to infer it from `from` and `to`
- Do not include transaction `status` in the result because failed transactions are filtered out
- Do not add an `isContractInteraction` flag in this phase

### Claude's Discretion
- Exact field names for the native-specific result type, as long as the structure stays minimal and includes `direction`
- How to source block timestamps and normalize values while preserving parity with existing scan behavior
- Internal helper decomposition and test fixture structure

</decisions>

<specifics>
## Specific Ideas

- The feature should count positive-value contract calls as native transfers, not just plain wallet-to-wallet sends
- The native scan should feel behaviorally consistent with the existing ERC20 scan, especially around block defaults and validation
- Self-transfers should remain visible in both directions when the caller asks for `both`

</specifics>

<deferred>
## Deferred Ideas

- Internal/trace-level native transfers via tracing RPCs — future phase
- Richer transaction metadata such as status flags or contract-interaction flags — future phase if callers need it

</deferred>

---

*Phase: 01-native-scan-core*
*Context gathered: 2026-03-13*
