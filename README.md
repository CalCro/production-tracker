# Production Tracker v0.6 — isolated recovery candidate

Not approved for production. Existing v0.5 applications, backups and unrelated repositories are untouched. This repository contains generic application code and synthetic tests only.

## Run and test

Serve `index.html` and `core.js` over HTTPS (GitHub Pages: candidate branch, repository root). No dependencies or server are needed. `node test.cjs` runs the generic tests. The optional `PT_LOCAL_FIXTURE` environment variable points to a private CSV outside this checkout; never commit that file.

## Safeguards

- Uses `production_tracker_v06_candidate`, never the v0.5 storage key.
- CSV file chooser and paste fallback, visible progress/errors, full validation before a preview, explicit confirmation before adding records.
- Supports v0.1, v0.2 and v0.3–v0.5 CSV headers. All rows validate before any write. Existing IDs are retained; conflicts are counted and skipped. Future dates from old backups remain visible with a warning.
- Read-back verified local saves, checksum integrity checks, previous valid snapshot, fail-closed recovery when primary data is invalid. The checksum detects accidental changes, not malicious tampering.
- Web Locks serialize writes and stale revisions reject cross-tab overwrites. Browsers without Web Locks remain read only. No silent data reset or automatic migration.
- Download Previous Snapshot CSV exports the preceding valid state. Restore by previewing that CSV in a fresh candidate origin/browser. Import is additive, so it does not roll back edits with the same ID. No destructive replace operation is offered.
- CSV downloads are external backups. A download click cannot prove the file was saved successfully; check Files. Browser storage is not guaranteed against OS eviction, private browsing, clearing website data or device loss.
- No analytics, external scripts, network submission or account sync. Employee data entered by the user stays in their browser; downloaded CSVs contain that data and must be kept private.

## iPhone validation (Safari, candidate address only)

1. Preserve v0.5 and the original CSV in Files. Open the HTTPS candidate in a normal Safari tab. Check the candidate banner and diagnostics: zero records, no recovery error.
2. Open History & Reports. Tap Preview Selected CSV with no file: expect a visible instruction and zero changes.
3. Choose the recovered November 2 CSV from Files. Tap Preview Selected CSV: expect one valid/new row and no writes. Cancel Preview: still zero records.
4. Preview again and Confirm Add New Records. Expect one imported record. Compare every field, quantity and reason with your backup; do not send employee screenshots publicly.
5. Close Safari and reopen the exact same address. Expect one record. Import the same file again: zero new records and one skipped ID.
6. Tap Backup All CSV. Confirm the new CSV exists in Files. Preview it: zero new records. Do not delete the original.
7. Create a synthetic record (DEMO-PART, OP 10, DEMO-MACHINE, DEMO-OPERATOR; 10 produced, 2 NC, 1 scrap). Confirm good parts = 7. Edit its produced count to 11, then reopen and check 11. Delete only that synthetic record; the recovered record must remain.
8. Download Previous Snapshot CSV. Preview it; confirm it is valid. Existing IDs must not overwrite current records. To test a true restore without replacing candidate records, use a separate normal browser/origin with empty storage.
9. Paste an invalid CSV in the fallback and preview: visible error and unchanged record count. Paste the complete valid CSV: same duplicate preview as file import.
10. Open the candidate in two Safari tabs. Save a synthetic record in one; the other must show a reload warning or reject its stale save. Reload and confirm no record was lost.

Desktop browser tests do not establish iPhone Files picker, Safari persistence, download behavior or home-screen-app behavior. Those require the checks above before approval.
