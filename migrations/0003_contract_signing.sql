CREATE TABLE contract_templates (
  id TEXT PRIMARY KEY,
  draft_json TEXT NOT NULL CHECK (json_valid(draft_json)),
  revision INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL REFERENCES users(id),
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE contract_versions (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES contract_templates(id),
  version TEXT NOT NULL,
  content_json TEXT NOT NULL CHECK (json_valid(content_json)),
  content_hash TEXT NOT NULL,
  published_by TEXT NOT NULL REFERENCES users(id),
  published_at TEXT NOT NULL,
  UNIQUE(template_id, version),
  CHECK (json_extract(content_json, '$.isPlaceholder') = 0),
  CHECK (json_extract(content_json, '$.approval.contract') = 1),
  CHECK (json_extract(content_json, '$.approval.electronicDisclosure') = 1)
);
--> statement-breakpoint
CREATE TABLE agreements (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES contract_versions(id),
  signer_id TEXT NOT NULL REFERENCES users(id),
  household_id TEXT NOT NULL REFERENCES households(id),
  dog_id TEXT NOT NULL REFERENCES dogs(id),
  enrollment_id TEXT NOT NULL REFERENCES enrollments(id),
  snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
  content_hash TEXT NOT NULL,
  state_json TEXT NOT NULL CHECK (json_valid(state_json)),
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'signed')),
  assigned_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (json_extract(snapshot_json, '$.agreementId') = id),
  CHECK (json_extract(snapshot_json, '$.clientId') = signer_id),
  CHECK (json_extract(snapshot_json, '$.contentHash') = content_hash)
);
--> statement-breakpoint
CREATE INDEX agreements_signer ON agreements(signer_id, assigned_at);
--> statement-breakpoint
CREATE INDEX agreements_status ON agreements(status, assigned_at);
--> statement-breakpoint
CREATE TABLE agreement_events (
  id TEXT PRIMARY KEY,
  agreement_id TEXT NOT NULL REFERENCES agreements(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  expected_revision INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('agreement.assigned','draft.saved','acknowledgment.recorded','acknowledgment.corrected','acknowledgment.removed','optional-consent.updated','agreement.signed')),
  section_id TEXT,
  agreement_hash TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  UNIQUE(agreement_id, expected_revision)
);
--> statement-breakpoint
CREATE TABLE agreement_evidence (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE REFERENCES agreement_events(id),
  agreement_id TEXT NOT NULL REFERENCES agreements(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  version_id TEXT NOT NULL REFERENCES contract_versions(id),
  agreement_hash TEXT NOT NULL,
  section_id TEXT NOT NULL,
  section_hash TEXT NOT NULL,
  value TEXT,
  acknowledgment_type TEXT NOT NULL CHECK (acknowledgment_type IN ('initials','signature')),
  recorded_at TEXT NOT NULL,
  CHECK (value IS NULL OR (length(trim(value)) > 0 AND length(value) <= 160))
);
--> statement-breakpoint
CREATE INDEX agreement_evidence_history ON agreement_evidence(agreement_id, section_id, recorded_at);
--> statement-breakpoint
CREATE TABLE agreement_consents (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES agreement_events(id),
  agreement_id TEXT NOT NULL REFERENCES agreements(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  consent_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  accepted INTEGER NOT NULL CHECK (accepted IN (0,1)),
  recorded_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE agreement_executions (
  agreement_id TEXT PRIMARY KEY REFERENCES agreements(id),
  event_id TEXT NOT NULL UNIQUE REFERENCES agreement_events(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  expected_revision INTEGER NOT NULL,
  version_id TEXT NOT NULL REFERENCES contract_versions(id),
  agreement_hash TEXT NOT NULL,
  signature_json TEXT NOT NULL CHECK (json_valid(signature_json)),
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  document_key TEXT NOT NULL UNIQUE,
  document_hash TEXT NOT NULL,
  renderer_version TEXT NOT NULL,
  signed_at TEXT NOT NULL,
  UNIQUE(actor_id, idempotency_key),
  CHECK (length(trim(json_extract(signature_json, '$.printedName'))) BETWEEN 1 AND 160),
  CHECK (length(trim(json_extract(signature_json, '$.signature'))) BETWEEN 1 AND 160),
  CHECK (json_extract(signature_json, '$.consent') = 1),
  CHECK (json_extract(signature_json, '$.intent') = 1)
);
--> statement-breakpoint
CREATE TRIGGER contract_versions_no_update BEFORE UPDATE ON contract_versions BEGIN SELECT RAISE(ABORT, 'published_version_immutable'); END;
--> statement-breakpoint
CREATE TRIGGER contract_versions_no_delete BEFORE DELETE ON contract_versions BEGIN SELECT RAISE(ABORT, 'published_version_immutable'); END;
--> statement-breakpoint
CREATE TRIGGER agreements_guard_update BEFORE UPDATE ON agreements BEGIN
  SELECT RAISE(ABORT, 'agreement_locked') WHERE OLD.status = 'signed';
  SELECT RAISE(ABORT, 'snapshot_immutable') WHERE NEW.snapshot_json != OLD.snapshot_json OR NEW.content_hash != OLD.content_hash OR NEW.version_id != OLD.version_id OR NEW.signer_id != OLD.signer_id OR NEW.household_id != OLD.household_id OR NEW.dog_id != OLD.dog_id OR NEW.enrollment_id != OLD.enrollment_id OR NEW.assigned_at != OLD.assigned_at;
  SELECT RAISE(ABORT, 'revision_conflict') WHERE NEW.revision != OLD.revision + 1 OR NOT EXISTS (SELECT 1 FROM agreement_events WHERE agreement_id = OLD.id AND expected_revision = OLD.revision);
  SELECT RAISE(ABORT, 'execution_required') WHERE NEW.status = 'signed' AND NOT EXISTS (SELECT 1 FROM agreement_executions WHERE agreement_id = OLD.id AND expected_revision = OLD.revision);
END;
--> statement-breakpoint
CREATE TRIGGER agreements_no_delete BEFORE DELETE ON agreements BEGIN SELECT RAISE(ABORT, 'agreement_immutable'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_events_guard BEFORE INSERT ON agreement_events BEGIN
  SELECT RAISE(ABORT, 'revision_conflict') WHERE NOT EXISTS (SELECT 1 FROM agreements WHERE id = NEW.agreement_id AND revision = NEW.expected_revision AND status != 'signed' AND content_hash = NEW.agreement_hash);
  SELECT RAISE(ABORT, 'signer_required') WHERE NEW.action != 'agreement.assigned' AND NOT EXISTS (SELECT 1 FROM agreements a JOIN memberships m ON m.household_id = a.household_id WHERE a.id = NEW.agreement_id AND a.signer_id = NEW.actor_id AND m.user_id = NEW.actor_id);
  SELECT RAISE(ABORT, 'admin_required') WHERE NEW.action = 'agreement.assigned' AND NOT EXISTS (SELECT 1 FROM staff_roles WHERE user_id = NEW.actor_id AND role = 'admin');
END;
--> statement-breakpoint
CREATE TRIGGER agreement_evidence_guard BEFORE INSERT ON agreement_evidence BEGIN
  SELECT RAISE(ABORT, 'evidence_binding_invalid') WHERE NOT EXISTS (
    SELECT 1 FROM agreements a, json_each(a.snapshot_json, '$.sections') s
    JOIN agreement_events e ON e.id = NEW.event_id
    WHERE a.id = NEW.agreement_id AND a.signer_id = NEW.actor_id AND a.version_id = NEW.version_id AND a.content_hash = NEW.agreement_hash
    AND e.agreement_id = a.id AND e.actor_id = NEW.actor_id AND e.section_id = NEW.section_id
    AND e.action IN ('acknowledgment.recorded','acknowledgment.corrected','acknowledgment.removed')
    AND json_extract(s.value, '$.sectionId') = NEW.section_id AND json_extract(s.value, '$.contentHash') = NEW.section_hash
    AND json_extract(s.value, '$.acknowledgmentType') = NEW.acknowledgment_type
  );
END;
--> statement-breakpoint
CREATE TRIGGER agreement_execution_guard BEFORE INSERT ON agreement_executions BEGIN
  SELECT RAISE(ABORT, 'execution_binding_invalid') WHERE NOT EXISTS (
    SELECT 1 FROM agreements a JOIN agreement_events e ON e.id = NEW.event_id
    WHERE a.id = NEW.agreement_id AND a.signer_id = NEW.actor_id AND a.status != 'signed'
    AND a.revision = NEW.expected_revision AND a.version_id = NEW.version_id AND a.content_hash = NEW.agreement_hash
    AND e.agreement_id = a.id AND e.expected_revision = a.revision AND e.actor_id = a.signer_id AND e.action = 'agreement.signed'
  );
  SELECT RAISE(ABORT, 'required_acknowledgments_missing') WHERE EXISTS (
    SELECT 1 FROM agreements a, json_each(a.snapshot_json, '$.sections') s
    WHERE a.id = NEW.agreement_id AND json_extract(s.value, '$.required') = 1 AND json_extract(s.value, '$.acknowledgmentType') != 'none'
    AND NOT EXISTS (
      SELECT 1 FROM agreement_evidence v
      WHERE v.id = json_extract(a.state_json, '$.acknowledgments.' || json_extract(s.value, '$.sectionId') || '.evidenceId')
      AND v.agreement_id = a.id AND v.actor_id = a.signer_id AND v.version_id = a.version_id AND v.agreement_hash = a.content_hash
      AND v.section_id = json_extract(s.value, '$.sectionId') AND v.section_hash = json_extract(s.value, '$.contentHash')
      AND v.acknowledgment_type = json_extract(s.value, '$.acknowledgmentType') AND v.value IS NOT NULL
      AND v.value = json_extract(a.state_json, '$.acknowledgments.' || v.section_id || '.value')
    )
  );
END;
--> statement-breakpoint
CREATE TRIGGER agreement_events_no_update BEFORE UPDATE ON agreement_events BEGIN SELECT RAISE(ABORT, 'audit_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_events_no_delete BEFORE DELETE ON agreement_events BEGIN SELECT RAISE(ABORT, 'audit_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_evidence_no_update BEFORE UPDATE ON agreement_evidence BEGIN SELECT RAISE(ABORT, 'evidence_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_evidence_no_delete BEFORE DELETE ON agreement_evidence BEGIN SELECT RAISE(ABORT, 'evidence_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_consents_no_update BEFORE UPDATE ON agreement_consents BEGIN SELECT RAISE(ABORT, 'consent_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_consents_no_delete BEFORE DELETE ON agreement_consents BEGIN SELECT RAISE(ABORT, 'consent_append_only'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_executions_no_update BEFORE UPDATE ON agreement_executions BEGIN SELECT RAISE(ABORT, 'execution_immutable'); END;
--> statement-breakpoint
CREATE TRIGGER agreement_executions_no_delete BEFORE DELETE ON agreement_executions BEGIN SELECT RAISE(ABORT, 'execution_immutable'); END;