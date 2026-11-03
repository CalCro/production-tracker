# Machine start time candidate

Optional HH:mm machine start time on the production date. No automatic timestamps, timezone conversion, end time or duration. Existing records stay without a start time until explicitly edited. Included in entry, edit, history, full/filtered CSV export, previous snapshot CSV and restore.

27 tests passed including the private November 2 fixture (26 reproducible without it). Added valid/invalid time, extended CSV round trip with reasons, storage reload, blank-vs-missing equality, changed-time conflicts and invalid-tail rejection. Existing historical CSV schemas remain accepted. Private fixtures are not committed.

The current storage key and schema remain unchanged; no migration or startup write. New exports append startTime to the CSV schema. Previous v0.6 code cannot import the extended CSV and can omit this field when editing/exporting a timed record. Keep earlier backups and use the updated application for timed records. Shared older Patch 1/legacy pages remain unchanged and should not be used to edit timed records.

Approved and deployed through PR #2 on November 3, 2026; GitHub Pages deployment succeeded. HTTPS desktop Chrome verified 07:30 save, reload persistence, 7:30 AM history display, populated edit control, clearing and reloading a blank time, and setting the time again. Synthetic records only; no user-device data accessed. Browser CSV round trip is covered by automated logic tests, not this browser session.

Remaining iPhone checks: enter a start time, save and reopen, edit/clear the time, verify AM/PM display including midnight, export and restore through the separate Restore Test page, and check old records and quantities remain unchanged. Normal candidate page count/revision should stay unchanged by Restore Test. User approval for this deployment was received.
