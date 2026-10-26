ALTER TABLE enrollments ADD COLUMN start_date TEXT;
ALTER TABLE enrollments ADD COLUMN graduation_date TEXT;
ALTER TABLE enrollments ADD COLUMN access_timezone TEXT NOT NULL DEFAULT 'America/Chicago';
-- SQLite cannot ADD COLUMN with a nonconstant timestamp default on populated tables.
-- Backfill old rows and supply the UTC default through an insert trigger instead.
ALTER TABLE enrollments ADD COLUMN updated_at TEXT;
UPDATE enrollments SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
CREATE TRIGGER enrollments_updated_at_default AFTER INSERT ON enrollments
WHEN NEW.updated_at IS NULL
BEGIN
  UPDATE enrollments SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = NEW.id;
END;
CREATE UNIQUE INDEX enrollments_id_dog ON enrollments(id, dog_id);

CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT INTO app_settings(key, value) VALUES
  ('training_video_weekly_price_minor', '9900'),
  ('training_video_currency', 'USD'),
  ('training_video_access_timezone', 'America/Chicago');

CREATE TABLE video_entitlements (
  id TEXT PRIMARY KEY,
  dog_id TEXT NOT NULL REFERENCES dogs(id),
  enrollment_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'suspended', 'revoked', 'expired')),
  coverage_start_at TEXT NOT NULL,
  coverage_end_at TEXT NOT NULL CHECK (coverage_end_at > coverage_start_at),
  access_starts_at TEXT NOT NULL,
  access_expires_at TEXT NOT NULL CHECK (access_expires_at > access_starts_at),
  provisional_expires_at TEXT,
  weeks_purchased INTEGER NOT NULL CHECK (typeof(weeks_purchased) = 'integer' AND weeks_purchased >= 1),
  weekly_price_minor_snapshot INTEGER NOT NULL CHECK (typeof(weekly_price_minor_snapshot) = 'integer' AND weekly_price_minor_snapshot >= 0),
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  amount_charged_minor INTEGER NOT NULL CHECK (typeof(amount_charged_minor) = 'integer' AND amount_charged_minor >= 0),
  payment_reference TEXT,
  activated_by_user_id TEXT REFERENCES users(id),
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  last_updated_by_user_id TEXT NOT NULL REFERENCES users(id),
  idempotency_key TEXT NOT NULL,
  request_fingerprint TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (enrollment_id, dog_id) REFERENCES enrollments(id, dog_id),
  UNIQUE (created_by_user_id, idempotency_key),
  UNIQUE (id, dog_id)
);
CREATE INDEX video_entitlements_dog_status ON video_entitlements(dog_id, status);
CREATE INDEX video_entitlements_enrollment_status ON video_entitlements(enrollment_id, status);
CREATE INDEX video_entitlements_expiry ON video_entitlements(access_expires_at);
CREATE INDEX video_entitlements_coverage ON video_entitlements(dog_id, enrollment_id, coverage_start_at, coverage_end_at);

CREATE TABLE video_entitlement_payments (
  id TEXT PRIMARY KEY,
  entitlement_id TEXT NOT NULL,
  dog_id TEXT NOT NULL REFERENCES dogs(id),
  weeks_purchased INTEGER NOT NULL CHECK (typeof(weeks_purchased) = 'integer' AND weeks_purchased >= 1),
  weekly_price_minor_snapshot INTEGER NOT NULL CHECK (typeof(weekly_price_minor_snapshot) = 'integer' AND weekly_price_minor_snapshot >= 0),
  amount_charged_minor INTEGER NOT NULL CHECK (typeof(amount_charged_minor) = 'integer' AND amount_charged_minor >= 0),
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  payment_reference TEXT,
  recorded_by_user_id TEXT NOT NULL REFERENCES users(id),
  recorded_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  idempotency_key TEXT NOT NULL,
  FOREIGN KEY (entitlement_id, dog_id) REFERENCES video_entitlements(id, dog_id),
  UNIQUE (recorded_by_user_id, idempotency_key)
);
CREATE INDEX video_entitlement_payments_entitlement ON video_entitlement_payments(entitlement_id);

CREATE TABLE training_session_recordings (
  id TEXT PRIMARY KEY,
  dog_id TEXT NOT NULL REFERENCES dogs(id),
  enrollment_id TEXT NOT NULL,
  stream_video_id TEXT UNIQUE,
  title TEXT NOT NULL,
  session_at TEXT NOT NULL,
  training_focus TEXT NOT NULL DEFAULT '',
  client_notes TEXT NOT NULL DEFAULT '',
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR (typeof(duration_seconds) = 'integer' AND duration_seconds >= 0)),
  processing_status TEXT NOT NULL DEFAULT 'upload_pending' CHECK (processing_status IN ('upload_pending', 'uploaded', 'processing', 'ready', 'error', 'deleted_remote', 'missing_remote')),
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'unpublished', 'deleted')),
  published_at TEXT,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  updated_by_user_id TEXT NOT NULL REFERENCES users(id),
  retention_hold INTEGER NOT NULL DEFAULT 0 CHECK (retention_hold IN (0, 1)),
  deletion_status TEXT NOT NULL DEFAULT 'none' CHECK (deletion_status IN ('none', 'pending', 'deleted', 'failed')),
  idempotency_key TEXT NOT NULL,
  request_fingerprint TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (enrollment_id, dog_id) REFERENCES enrollments(id, dog_id),
  UNIQUE (created_by_user_id, idempotency_key)
);
CREATE INDEX training_recordings_dog_session ON training_session_recordings(dog_id, session_at);
CREATE INDEX training_recordings_publication_processing ON training_session_recordings(publication_status, processing_status);
CREATE INDEX training_recordings_retention_deletion ON training_session_recordings(retention_hold, deletion_status);

CREATE TABLE video_audit_events (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX video_audit_created ON video_audit_events(created_at);
CREATE INDEX video_audit_entity ON video_audit_events(entity_type, entity_id);
