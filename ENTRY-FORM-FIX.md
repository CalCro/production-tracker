# Entry form correction

Remove (optional) from the Machine start time label while preserving optional input behavior. Group the machine input and start time in a single grid cell, so start time is directly beneath Machine on desktop and phone layouts. Apply the same width constraints used by date controls to the time control.

Produced, Nonconforming and Scrapped start blank and reset blank. Each remains required: the user explicitly types zero when the count is zero. Existing saved values are still populated during editing. No storage, CSV or calculation changes. Both normal and Restore Test entry pages are updated.

26 existing automated tests passed. Desktop browser verified empty initial values; typing 1 yields 1, explicit NC/scrap zero input works, and Clear/Cancel returns all three to blank. DOM geometry verified time below machine in the same container. Local HTTP preview cannot save due to its safe-locking restriction. Actual iPhone appearance remains unverified.

Not deployed; promotion requires user approval. No private screenshots or actual records were uploaded.
