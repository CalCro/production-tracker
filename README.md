# Production Tracker v0.6 Personal Edition — approved release

Status: user approved promotion on November 3, 2026. PR #1 was merged as 65391b68891737824b2fe2b72bfa73d0fe79aa09 into the serving branch candidate/v0.6-recovery. GitHub Pages publishes this branch. Main remains unchanged.

## Deployment

The approved release was merged into candidate/v0.6-recovery, which backs GitHub Pages. It replaces index.html and core.js at the existing address with the tested Patch 1 application and a Personal Edition label. Main was not changed.

Storage key and schema remain production_tracker_v06_candidate / schema 6. No data migration, reset or automatic write runs on startup. Existing browser records and snapshots remain in place. No real employee or production data is in the release.

The old root application is preserved as legacy/v06-recovery/index.html with its matching core.js. The existing patch1/ pages remain unchanged. restore-test.html at the root uses the same separate test key as patch1/restore-test.html; those two test URLs share only their test records.

## Review evidence

See patch1/VALIDATION.md for automated, desktop browser, and supplied iPhone evidence and their limits. Root application logic is byte-identical to tested Patch 1 core.js. Root HTML differs from Patch 1 only in release wording. Run node test.cjs; PT_LOCAL_FIXTURE can point to a private local fixture outside the repository.

The selected backup restoration and original record-count separation were demonstrated on iPhone. The normal candidate revision after that restore was not shown. No offline shell, cloud account, synchronization, guarantee against Safari eviction, or home-screen-specific validation is included.

## Before and after approved promotion

Before: download Backup All CSV from the normal candidate and retain all earlier backups. Do not clear Safari data.

After: reopen the usual URL, confirm Personal Edition, check the preexisting count, quantities, reasons and diagnostics, and export a fresh backup. Any new failure should stop further entry until reviewed.

Rollback: restore the prior root index.html/core.js from legacy/v06-recovery in a new commit on the serving branch. This reverts code only; it does not roll back records. Export current data before any recovery work. Additive CSV import never overwrites an existing ID, including an edited record.
