CREATE TABLE hubspot_sync_jobs (
  household_id TEXT PRIMARY KEY REFERENCES households(id),
  idempotency_key TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  lease_token TEXT,
  lease_until INTEGER NOT NULL DEFAULT 0,
  hubspot_contact_id TEXT,
  last_success_at INTEGER,
  updated_at INTEGER NOT NULL
);
CREATE INDEX hubspot_sync_due ON hubspot_sync_jobs(status, next_attempt_at, lease_until);
