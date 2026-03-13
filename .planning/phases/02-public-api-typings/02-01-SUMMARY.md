---
phase: 02-public-api-typings
plan: "01"
subsystem: api
tags: [native-transfer, package-exports, runtime-api]
requires:
  - phase: 01-01
    provides: Internal native transfer scan core in `src/native.js`
  - phase: 01-02
    provides: Mocked native transfer regression coverage in `test/scan-native.test.js`
provides:
  - Package-root `scanNativeTransfers(...)` runtime API for native token scanning
  - Root-exported native direction helper aligned with the existing ERC20 transport setup
affects: [phase-02-typings, phase-03-docs-verification]
tech-stack:
  added: []
  patterns: [root export delegation, provider-option parity, package self-reference testing]
key-files:
  created: []
  modified: [src/index.js, src/native.js, test/scan-native.test.js]
key-decisions:
  - "Native runtime API reuses `createRpcProvider(...)` when no provider is injected"
  - "Only a small native helper surface is exported publicly: `scanNativeTransfers` and `NATIVE_TRANSFER_DIRECTIONS`"
patterns-established:
  - "Package-root exports wrap the internal native scan core instead of duplicating scan logic"
  - "Public native runtime behavior is tested through the package export, not internal relative imports"
requirements-completed: [NATIVE-04, API-01]
duration: 9 min
completed: 2026-03-13
---

# Phase 2 Plan 1: Public Runtime API Summary

**Package-root native transfer scanning API with transport-option parity and public runtime regression coverage**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-13T04:40:00Z
- **Completed:** 2026-03-13T04:49:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Exported `scanNativeTransfers(...)` from the package root as a peer of `scanErc20Transfers(...)`
- Reused the existing provider/bootstrap path so native scans accept the same `rpcUrl`, proxy, timeout, and injected-provider style as ERC20 scans
- Moved native runtime coverage to the public package surface and added assertions that ERC20 exports remain untouched

## Task Commits

Each task was committed atomically:

1. **Task 1: Add root-level native scan runtime export** - `c9f6226` (feat)
2. **Task 2: Prove runtime parity and backward compatibility** - `b891fa3` (test)

## Files Created/Modified

- `src/index.js` - Public `scanNativeTransfers(...)` wrapper and root-level native helper export
- `src/native.js` - Exported native direction constant for package-root reuse
- `test/scan-native.test.js` - Runtime coverage through `scan-erc20-token` package exports

## Decisions Made

- Kept the public native surface minimal by exporting only `scanNativeTransfers` and `NATIVE_TRANSFER_DIRECTIONS`
- Preserved the existing ERC20 runtime contract exactly, so no migration is required for current callers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- A transient `.git/index.lock` appeared during commit orchestration; retrying the sequential commit resolved it without repository changes

## User Setup Required

None - runtime verification stayed fully local with mocked providers.

## Next Phase Readiness

- Public runtime native scanning is now ready for matching TypeScript declarations
- Phase 2 typing work can bind directly to the shipped package-root runtime exports

## Self-Check: PASSED

Summary backed by committed runtime export changes and passing `npm test`.

---
*Phase: 02-public-api-typings*
*Completed: 2026-03-13*
