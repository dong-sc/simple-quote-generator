# Browser draft failure recovery verification

Baseline: GitHub main `a814f33db001e96f639d454d4a44668f56aea260` (verified using GitHub API and fetched on 2026-10-24 UTC).

The existing storage writer/remover threw browser storage exceptions. Autosave runs in a React effect, so this could interrupt the document UI. Save now returns a success flag and catches storage errors; the UI exposes a persistent Traditional Chinese alert while saving fails. Reset remains usable in memory if removal is blocked. A subsequent successful edit clears the warning. No uploaded data, backend, or production configuration is involved.

## Reproduction and validation

`npm test` injects synthetic localStorage adapters; no real drafts or customer data are read.
- Unmodified baseline: storage tests 2 passed, 2 failed (blocked storage and write failure/recovery).
- Fixed storage: all 4 storage tests pass.
- Current complete suite: 8 tests pass.
- `npm run build` passed, including the existing prerender script.
- `npm run lint` passed.

Tests cover normal round-trip/reset, read/write/remove exceptions, preservation of the previous saved draft, recovery on a later successful write, and malformed JSON. Quote/payment also cover empty items, NaN/blank fields, fractional quantity, discount/tax, plus reimbursement options or overpayment as applicable.

Limitations: no interactive browser or PDF/Excel visual QA performed; this is deterministic storage/function testing and production compilation. When storage remains blocked, resetting only changes the current in-memory document; an older persisted draft can remain until a later successful save. The alert explicitly states that closing the page can lose current changes. No performance improvement is claimed.

Rollback: revert the fix commit, or discard this isolated clone. Original checkout, GitHub main, live sites, and user data were not modified. Dependencies were copied locally from the original checkout for isolated offline validation; no package upgrade was performed.

## Unread draft preservation (review follow-up)

A parse failure or blocked read previously returned a default document, which mount autosave could write over the original value. A module-level read-failure guard now blocks autosave for this page session until the user explicitly clears the form. The original string is retained untouched. Invalid root shapes (null, array, primitive) and non-string titles are also rejected. No comprehensive nested schema validation was added.

Two new deterministic tests cover corrupt JSON/root shape/title → load → autosave leaving the original bytes unchanged → explicit clear → successful save, and a blocked read followed by restored write access preserving the original draft. On the first fix without this guard both new tests fail (0 passed / 2 failed); with the guard both pass (2 passed / 0 failed) for each tool. Build/prerender/lint were rerun successfully. No calculation code changed.
