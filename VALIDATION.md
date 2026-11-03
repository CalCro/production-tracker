# v0.6 recovery candidate validation — November 3, 2026

Status: candidate only. No promotion or merge into main. GitHub Pages serves the isolated candidate branch over HTTPS.

## Completed

- Recovered v0.5 source without editing the original archive or backups.
- Created a separate public production-tracker repository, after GitHub reported that name available.
- Candidate code is on candidate/v0.6-recovery. Main retains its initial README commit.
- Published generic application files and synthetic tests only. No CSVs, recovery archives, employee records or runtime storage were uploaded to the repository.
- New v0.6 storage namespace; no reads, migration, or writes to the v0.5 key.

## Automated evidence

18 tests passed with the private fixture enabled; 17 are reproducible without private data using `node test.cjs`.

Coverage: three historical header schemas; BOM/CRLF; quotes, commas and multiline reasons; invalid quantities/dates/reasons; whole-import rejection for an invalid tail row; duplicate IDs; preservation of existing conflicting IDs; idempotent reimport; read-back and previous snapshot; corrupt JSON/checksum; missing primary; stale tab; quota failure; snapshot-write failure.

The latest supplied November 2 CSV validated as one record and reimport added zero records. Four CSVs in the recovery archive also validated (4, 4, 1 and 4 rows respectively). These files are separate snapshots, not proof that any one contains all historical records. They were not combined or rewritten.

Original materialized archive and latest CSV SHA-256 values remained unchanged after validation. No private row contents are included in this report.

## Browser evidence (desktop Chrome)

- HTTP local preview explicitly became read only when safe write locking was unavailable.
- Empty file selection showed an instruction; invalid pasted headers showed an import error without changing records.
- HTTPS candidate loaded with working storage and Web Locks.
- Synthetic record saved at revision 1 and survived reload; 10 produced minus 2 NC minus 1 scrap showed 7 good parts.
- Synthetic CSV preview showed one new row before any write. Cancel preserved record count; confirmation imported one row at revision 2.
- Reimport preview showed zero new rows and one existing ID.
- Editing synthetic produced count to 11 persisted at revision 3 and survived reload.
- A second open tab showed the reload warning after the first tab saved.
- Confirmed deletion of the synthetic imported row left the other synthetic row intact at revision 4.

Only synthetic data was entered in the browser. The private fixture was validated by local application logic only.

## Unverified and limitations

The original silent iPhone import failure was not reproduced. The recovered CSV format is valid; the old temporary preview's picker/script restrictions remain a hypothesis, not a confirmed cause. The new candidate makes startup, file selection, reading, validation and storage failures visible, and supplies a paste fallback.

iPhone Files picker, Safari close/reopen, CSV download and restore, home-screen launch, and behavior under iOS eviction still require device validation. No offline shell/service worker or cloud synchronization is implemented. Local snapshots share the browser's lifetime; external CSV backups remain necessary. Import is additive: it cannot roll back an edited record with the same ID. Damaged primary storage is write-locked; use an exported snapshot or external backup in a fresh origin/browser for recovery. Browser UI file selection/download was not validated here.

Follow the exact ten-step iPhone checklist in README.md before approving promotion. Stop and report the visible diagnostic if any check fails; do not clear v0.5 website data.
