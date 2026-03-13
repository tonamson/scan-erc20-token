# Phase 2: Public API & Typings - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Expose native transfer scanning as a stable public package API with corresponding TypeScript declarations, while keeping the existing ERC20 API backward-compatible. This phase decides how the public function, options, result types, and package exports should look; it does not expand the scope beyond the already-implemented Phase 1 native scan behavior.

</domain>

<decisions>
## Implementation Decisions

### Public function naming
- The public function name will be `scanNativeTransfers`
- Naming should stay short and easy to remember
- The function should be exported as a top-level peer of `scanErc20Transfers`
- Export organization should still leave the package in a clean position to add more asset scanners later

### Public options shape
- `scanNativeTransfers(...)` should use an options object that is as close as practical to `scanErc20Transfers(...)`
- The native options should keep the current transport/provider fields: `rpcUrl`, `proxy`, `proxyUrl`, `timeoutMs`, and `provider`
- `direction` should keep the same public values as ERC20: `"in" | "out" | "both"`
- Do not add native-specific public options in this phase unless absolutely required to preserve the locked behavior
- The main expected difference from ERC20 options is the absence of `tokenAddress`

### Public result shape
- The public native transfer record should stay as close as practical to `Erc20Transfer`
- The public record must include `direction`
- `amount` should remain a `bigint`
- Do not add a public field such as `assetType: "native"` in this phase; the dedicated type name is sufficient

### Package exports and typings
- Export `scanNativeTransfers` directly from the package root alongside `scanErc20Transfers`
- Add dedicated public types for native scanning, such as `NativeTransfer` and `ScanNativeTransfersOptions`
- Export those native types from the package root so TypeScript consumers can use them naturally
- Export additional native-related constants/helpers in this phase, because the package should be structured to scale to more asset scanners later
- Do not rename or reshape the existing ERC20 API just to make naming more symmetrical; backward compatibility wins

### Claude's Discretion
- Exact names for any additional native constants/helpers, as long as they are genuinely useful and do not create noisy surface area
- Whether common option/result pieces are factored internally into shared types or kept duplicated for readability
- How to organize `src/index.js` and `src/index.d.ts` so the new public API stays clear without changing ERC20 behavior

</decisions>

<specifics>
## Specific Ideas

- The public native API should feel like a natural sibling of `scanErc20Transfers`, not a separate subsystem with a different calling style
- The package root export surface should stay simple for JavaScript users and explicit for TypeScript users
- The export design should avoid painting the package into a corner if ERC721/ERC1155 or aggregate asset scanning is added later

</specifics>

<deferred>
## Deferred Ideas

- Renaming or reshaping the existing ERC20 API for naming symmetry
- Generic multi-asset scan API that merges ERC20, native, and future asset types
- New capabilities beyond the already-implemented Phase 1 native scan semantics

</deferred>

---

*Phase: 02-public-api-typings*
*Context gathered: 2026-03-13*
