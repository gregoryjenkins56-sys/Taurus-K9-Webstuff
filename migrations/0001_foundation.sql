PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  issuer TEXT NOT NULL,
  subject TEXT NOT NULL,
  display_name TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (issuer, subject)
);
CREATE TABLE households (
  id TEXT PRIMARY KEY,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE TABLE memberships (
  user_id TEXT NOT NULL REFERENCES users(id),
  household_id TEXT NOT NULL REFERENCES households(id),
  PRIMARY KEY (user_id, household_id)
);
CREATE INDEX memberships_household ON memberships(household_id);
CREATE TABLE staff_roles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('reviewer', 'admin'))
);
CREATE TABLE dogs (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households(id),
  name TEXT NOT NULL,
  breed TEXT NOT NULL DEFAULT '',
  birth_date TEXT,
  approximate_age TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX dogs_household ON dogs(household_id);
CREATE TABLE training_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_minor INTEGER NOT NULL CHECK (price_minor >= 0),
  deposit_minor INTEGER NOT NULL CHECK (deposit_minor >= 0 AND deposit_minor <= price_minor),
  currency TEXT NOT NULL CHECK (length(currency) = 3)
);
CREATE TABLE enrollments (
  id TEXT PRIMARY KEY,
  dog_id TEXT NOT NULL REFERENCES dogs(id),
  program_id TEXT NOT NULL REFERENCES training_programs(id),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX enrollments_dog ON enrollments(dog_id);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  csrf_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX sessions_user ON sessions(user_id);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE auth_transactions (
  state_hash TEXT PRIMARY KEY,
  browser_hash TEXT NOT NULL,
  verifier TEXT NOT NULL,
  nonce TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX auth_transactions_expiry ON auth_transactions(expires_at);
CREATE TABLE rate_limits (
  bucket_hash TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
CREATE INDEX rate_limits_expiry ON rate_limits(reset_at);
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX audit_logs_created ON audit_logs(created_at);
CREATE INDEX audit_logs_actor ON audit_logs(actor_id);
