# v0.6 Patch 1 candidate — November 3, 2026

No promotion. Original root application files and main branch preserved. Patch is served under /patch1/. Only generic code and synthetic tests are included.

## Changes

- Phone grids stack below 600 CSS pixels. Grid tracks and Safari date controls have explicit width constraints. Actual iPhone layout still requires confirmation.
- Conflict comparison projects the supported backup fields into a stable order, including reason and quantity pairs. Object property order and unused display defaults no longer generate false conflicts. Actual quantities, dates, accounting version, reasons and timestamps still create conflicts and preserve existing IDs. No existing records are rewritten by loading the patch.
- Reproduced false conflict locally by loading a record with empty ncReason/scrapReason defaults and round-tripping through CSV. This establishes a code defect; it does not prove that every earlier iPhone conflict had that cause.
- Patch page shares the original candidate key deliberately, so current saved records remain available. Previous-state and multi-tab safeguards are unchanged.
- restore-test.html uses its own fixed key and lock name, production_tracker_v06_restore_lab_20261103, with a separate snapshot. It never selects the normal candidate key. This is logical isolation within the same origin, not a separate security boundary.

## Tests

23 automated tests passed locally, including the private November 2 fixture; 22 run without that fixture using node patch1/test.cjs. Private fixture stayed outside the repository.

Added regression tests cover display defaults, object/reason property ordering, genuine differences retained as conflicts, restoring and reloading in a separate store without changing primary/snapshot bytes, page key selection and inline JavaScript syntax.

## Existing iPhone evidence

Screenshots: file selection, preview/cancel, successful import, calculations, duplicate prevention, cross-tab warning, and older-tab refresh to 3 records / revision 3 passed. User confirmed completed Safari download and connectivity recovery. Full Safari termination/reopen remains unverified. None of these older checks constitute validation of Patch 1 layout.

## iPhone checks

1. At the original candidate address, use Backup All CSV and confirm the download exists in Files. Keep all earlier backups.
2. Open https://calcro.github.io/production-tracker/patch1/ in normal Safari. Check the Patch 1 banner, existing record count and revision. Check production date/shift and History From/To fields for overlap.
3. Preview the just-downloaded full backup. Expect zero new records and zero conflicts if records have not changed since export. Cancel; counts and revision must remain unchanged. A genuinely older or edited backup may still report conflicts.
4. Open https://calcro.github.io/production-tracker/patch1/restore-test.html. Confirm RESTORE TEST banner and zero records on first use. If it is nonempty, stop and report; do not clear Safari data.
5. Preview the downloaded full backup, compare counts, then confirm import in RESTORE TEST only. Compare restored fields and totals. Reimport: zero new records and zero conflicts for an unchanged backup.
6. Return to the original candidate tab; its record count and revision must be unchanged by the restore test.
7. Fully close Safari, reopen normal Safari, and open the Patch 1 address. Check the existing records, then the restore-test address and restored records. Do not clear website data or use private browsing.

No offline support, account sync or guarantee against browser eviction is added. Candidate approval is still pending.
