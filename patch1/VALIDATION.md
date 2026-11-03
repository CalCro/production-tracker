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

## Patch 1 browser workflow completed — November 3, 2026

Environment: remote desktop Chrome over the published HTTPS address. Synthetic records only; no iPhone records accessed. These checks do not establish iOS behavior.

- Started Patch 1 at zero records / revision 0; entered DEMO-QA-1103 via the normal form with 10 produced, 2 NC and 1 scrap. Save verified at revision 1; report showed 7 good.
- Backup All CSV completed a real browser download. Selected that exact downloaded file using the browser file chooser; preview showed zero new, one skipped ID and zero conflicts. Cancel preserved records.
- Restore Test started at zero records / revision 0. Selected the same downloaded file; preview showed one new record and no writes before confirmation. Confirm restored one record at revision 1 with matching fields and totals.
- Reimport into Restore Test showed zero new, one skipped and zero conflicts.
- Exported restored records through Backup All CSV. Source and restored downloads were both 363 bytes and byte-for-byte identical, including IDs, timestamps and reason JSON. SHA-256: 7de4b32e7651ffee2cea54be66af65a913f9bc94027c675963a14efeeeed0333.
- Closed both test tabs, created fresh tabs at the same addresses, and observed one record / revision 1 in each. History showed the original synthetic fields and totals in both. This tests tab reopening, not browser-process termination or iOS eviction.
- Edited only the restored record to 11 produced. Restore Test advanced to revision 2 with 8 good. Source remained revision 1 with 10 produced and 7 good, without a cross-tab storage warning.
- Previewed the older downloaded file against the edited Restore Test record: zero new, one skipped ID, one genuine conflict. Confirm Add New Records reported no new records, retained the edited 11-produced record, and kept revision 2.
- No application source changes were required by this workflow. The synthetic test records remain in the remote browser only; no user-device data was changed.

Still requires iPhone confirmation: Patch 1 date-control layout, restoring the user's actual downloaded backup through iOS Files, unchanged normal records afterward, and full Safari close/reopen persistence. Candidate promotion remains pending approval.

## iPhone evidence supplied after browser validation

User-supplied screenshots and report confirm a downloaded CSV restored successfully in Restore Test, displayed quantities and reasons, and survived closing/reopening Safari. An unchanged CSV preview showed zero new IDs and zero conflicts. Production date and shift are stacked without overlap on the supplied restore page.

A subsequent pair of screenshots shows the normal candidate retaining its earlier record count while Restore Test has its separate restored collection. Counts support isolation; the screenshots do not show the normal candidate's diagnostic revision. No independent byte comparison of the user's two collections was performed. The restore test covers the selected backup, not proof that it contains every normal candidate record.

No private screenshots, actual record contents, names, identifiers or production totals are included in this repository report. No user approval for promotion has been received.
