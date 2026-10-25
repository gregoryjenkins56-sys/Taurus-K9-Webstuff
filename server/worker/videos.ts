import { HttpError, requireStaff } from './auth.ts';
import type { Env, Identity } from './auth.ts';
import { input, json, text } from './http.ts';
import { calendarDate, choice, fingerprint, graduationAccessExpiresAt, idempotency, identifier, instant, integer, interval, localMidnight, timezone } from './video-validation.ts';

type Row = Record<string, string | number | null>;
type Enrollment = { id: string; dog_id: string; start_date: string | null; graduation_date: string | null; access_timezone: string };
const entitlementStatuses = ['pending', 'active', 'suspended', 'revoked', 'expired'] as const;
const publicationStatuses = ['draft', 'published', 'unpublished'] as const;
const entitlementCreateFields = ['dogId', 'enrollmentId', 'weeksPurchased', 'amountChargedMinor', 'paymentReference', 'status', 'coverageStartAt', 'coverageEndAt', 'accessStartsAt', 'accessExpiresAt', 'provisionalExpiresAt', 'idempotencyKey'];
const entitlementPatchFields = ['status', 'coverageStartAt', 'coverageEndAt', 'accessStartsAt', 'accessExpiresAt', 'provisionalExpiresAt', 'reason', 'version'];
const recordingFields = ['dogId', 'enrollmentId', 'title', 'sessionAt', 'trainingFocus', 'clientNotes', 'durationSeconds', 'streamVideoId', 'publicationStatus', 'retentionHold', 'idempotencyKey'];

async function enrollment(env: Env, enrollmentId: string, dogId: string) {
  const row = await env.DB.prepare('SELECT id, dog_id, start_date, graduation_date, access_timezone FROM enrollments WHERE id = ? AND dog_id = ?')
    .bind(enrollmentId, dogId).first<Enrollment>();
  if (!row) throw new HttpError(400, 'Enrollment does not belong to this dog.');
  return row;
}

function validateEnrollmentDates(row: Enrollment) {
  if (row.start_date !== null) calendarDate(row.start_date, 'enrollment start date');
  if (row.graduation_date !== null) calendarDate(row.graduation_date, 'graduation date');
  if (row.start_date !== null && row.graduation_date !== null && row.start_date > row.graduation_date) {
    throw new HttpError(400, 'Graduation date must not precede enrollment start date.');
  }
}

async function setting(env: Env, key: string, fallback: string) {
  const row = await env.DB.prepare('SELECT value FROM app_settings WHERE key = ?').bind(key).first<{ value: string }>();
  return row?.value ?? fallback;
}

function videoAudit(env: Env, user: string, action: string, type: string, id: string, metadata: Record<string, unknown> = {}, conditional = false) {
  return env.DB.prepare(`INSERT INTO video_audit_events(id, actor_user_id, action, entity_type, entity_id, metadata_json)
    SELECT ?, ?, ?, ?, ?, ?${conditional ? ' WHERE changes() = 1' : ''}`)
    .bind(crypto.randomUUID(), user, action, type, id, JSON.stringify(metadata));
}

async function existingCreate(env: Env, table: string, user: string, key: string, expected: string) {
  const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE created_by_user_id = ? AND idempotency_key = ?`).bind(user, key).first<Row>();
  if (row && row.request_fingerprint !== expected) throw new HttpError(409, 'Idempotency key was already used with a different request.');
  return row;
}

function normalizeEntitlement(data: Record<string, unknown>, key: string) {
  const normalized: Record<string, unknown> = {
    dogId: identifier(data.dogId, 'dog ID'), enrollmentId: identifier(data.enrollmentId, 'enrollment ID'),
    weeksPurchased: integer(data.weeksPurchased, 'weeks purchased', 1),
    amountChargedMinor: integer(data.amountChargedMinor, 'amount charged'),
    status: choice(data.status ?? 'active', 'status', ['pending', 'active'] as const),
    coverageStartAt: instant(data.coverageStartAt, 'coverage start'), idempotencyKey: key
  };
  if ('paymentReference' in data) normalized.paymentReference = data.paymentReference === null ? null : text(data.paymentReference, 'payment reference', 200, false);
  for (const field of ['coverageEndAt', 'accessStartsAt', 'accessExpiresAt', 'provisionalExpiresAt']) {
    if (field in data) normalized[field] = data[field] === null && field === 'provisionalExpiresAt' ? null : instant(data[field], field);
  }
  return normalized;
}

async function createEntitlement(request: Request, env: Env, identity: Identity) {
  const data = await input(request, entitlementCreateFields);
  const key = idempotency(request, data);
  const normalized = normalizeEntitlement(data, key);
  const signature = fingerprint(normalized);
  const previous = await existingCreate(env, 'video_entitlements', identity.id, key, signature);
  if (previous) return json({ entitlement: previous });
  const dogId = normalized.dogId as string;
  const enrollmentId = normalized.enrollmentId as string;
  const row = await enrollment(env, enrollmentId, dogId);
  validateEnrollmentDates(row);
  const zone = timezone(row.access_timezone || await setting(env, 'training_video_access_timezone', 'America/New_York'));
  const weeks = normalized.weeksPurchased as number;
  const coverageStart = normalized.coverageStartAt as string;
  const endTime = Date.parse(coverageStart) + weeks * 7 * 86400000;
  if (!Number.isFinite(endTime) || endTime > Date.parse('9999-12-31T23:59:59.999Z')) throw new HttpError(400, 'Purchased weeks exceed the supported coverage date range.');
  const computedEnd = new Date(endTime).toISOString();
  const coverageEnd = normalized.coverageEndAt as string | undefined ?? computedEnd;
  if (coverageEnd !== computedEnd) throw new HttpError(400, 'Coverage end must equal coverage start plus the purchased weeks.');
  // Old enrollments without a start date explicitly fall back to coverage start.
  const accessStart = normalized.accessStartsAt as string | undefined ?? (row.start_date ? localMidnight(row.start_date, zone) : coverageStart);
  const provisional = normalized.provisionalExpiresAt as string | null | undefined ?? null;
  const accessEnd = normalized.accessExpiresAt as string | undefined ??
    (row.graduation_date ? graduationAccessExpiresAt(row.graduation_date, zone) : provisional);
  const status = normalized.status as string;
  if (!accessEnd) throw new HttpError(400, 'An access expiration or provisional expiration is required.');
  if (status === 'active' && !row.graduation_date && !provisional) throw new HttpError(400, 'Unknown graduation requires a provisional expiration before activation.');
  interval(accessStart, accessEnd, 'Access');
  interval(accessStart, provisional, 'Provisional access');
  const weeklyPrice = integer(Number(await setting(env, 'training_video_weekly_price_minor', '9900')), 'weekly price');
  const currency = await setting(env, 'training_video_currency', 'USD');
  if (!/^[A-Z]{3}$/.test(currency)) throw new HttpError(503, 'Video currency is not configured.');
  const id = crypto.randomUUID();
  const paymentReference = normalized.paymentReference as string | null | undefined ?? null;
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO video_entitlements(
        id,dog_id,enrollment_id,status,coverage_start_at,coverage_end_at,access_starts_at,access_expires_at,provisional_expires_at,
        weeks_purchased,weekly_price_minor_snapshot,currency,amount_charged_minor,payment_reference,activated_by_user_id,
        created_by_user_id,last_updated_by_user_id,idempotency_key,request_fingerprint)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id, dogId, enrollmentId, status, coverageStart, coverageEnd, accessStart, accessEnd, provisional, weeks, weeklyPrice,
          currency, normalized.amountChargedMinor, paymentReference, status === 'active' ? identity.id : null, identity.id, identity.id, key, signature),
      env.DB.prepare(`INSERT INTO video_entitlement_payments(
        id,entitlement_id,dog_id,weeks_purchased,weekly_price_minor_snapshot,amount_charged_minor,currency,payment_reference,recorded_by_user_id,idempotency_key)
        VALUES (?,?,?,?,?,?,?,?,?,?)`)
        .bind(crypto.randomUUID(), id, dogId, weeks, weeklyPrice, normalized.amountChargedMinor, currency, paymentReference, identity.id, key),
      videoAudit(env, identity.id, 'entitlement.created', 'entitlement', id, { dogId, enrollmentId, status })
    ]);
  } catch (error) {
    const concurrent = await existingCreate(env, 'video_entitlements', identity.id, key, signature);
    if (concurrent) return json({ entitlement: concurrent });
    throw error;
  }
  return json({ entitlement: await env.DB.prepare('SELECT * FROM video_entitlements WHERE id = ?').bind(id).first() }, 201);
}

async function getRow(env: Env, table: string, id: string) {
  const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first<Row>();
  if (!row) throw new HttpError(404, 'Video resource not found.');
  return row;
}

function expectedVersion(data: Record<string, unknown>, row: Row) {
  const version = Number(row.version);
  if ('version' in data && integer(data.version, 'version', 1) !== version) throw new HttpError(409, 'The resource changed. Refresh and try again.');
  return version;
}

async function casUpdate(env: Env, identity: Identity, table: string, id: string, version: number, updates: Record<string, string | number | null>, action: string, type: string, metadata: Record<string, unknown>) {
  const fields = Object.keys(updates);
  const results = await env.DB.batch([
    env.DB.prepare(`UPDATE ${table} SET ${fields.map(field => `${field} = ?`).join(', ')},
      version = version + 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND version = ?`)
      .bind(...fields.map(field => updates[field]), id, version),
    // changes() refers to the immediately preceding CAS inside this atomic batch.
    videoAudit(env, identity.id, action, type, id, metadata, true)
  ]);
  if (results[0].meta.changes !== 1) throw new HttpError(409, 'The resource changed. Refresh and try again.');
  return getRow(env, table, id);
}

async function patchEntitlement(request: Request, env: Env, identity: Identity, id: string) {
  const data = await input(request, entitlementPatchFields);
  if (!Object.keys(data).some(field => field !== 'reason' && field !== 'version')) throw new HttpError(400, 'Provide an entitlement change.');
  const current = await getRow(env, 'video_entitlements', id);
  const version = expectedVersion(data, current);
  const updates: Record<string, string | number | null> = { last_updated_by_user_id: identity.id };
  if ('status' in data) {
    updates.status = choice(data.status, 'status', entitlementStatuses);
    if (['revoked', 'expired'].includes(String(current.status)) && updates.status !== current.status) {
      throw new HttpError(409, 'Revoked or expired entitlements cannot be reactivated. Create a new entitlement.');
    }
    if (data.status === 'active' && current.status !== 'active') updates.activated_by_user_id = identity.id;
  }
  for (const [field, column] of Object.entries({
    coverageStartAt: 'coverage_start_at', coverageEndAt: 'coverage_end_at', accessStartsAt: 'access_starts_at',
    accessExpiresAt: 'access_expires_at', provisionalExpiresAt: 'provisional_expires_at'
  })) {
    if (field in data) updates[column] = data[field] === null && field === 'provisionalExpiresAt' ? null : instant(data[field], field);
  }
  const merged = { ...current, ...updates };
  interval(String(merged.coverage_start_at), String(merged.coverage_end_at), 'Coverage');
  if (Date.parse(String(merged.coverage_end_at)) - Date.parse(String(merged.coverage_start_at)) !== Number(merged.weeks_purchased) * 7 * 86400000) {
    throw new HttpError(400, 'Coverage must match the purchased weeks.');
  }
  interval(String(merged.access_starts_at), String(merged.access_expires_at), 'Access');
  interval(String(merged.access_starts_at), merged.provisional_expires_at as string | null, 'Provisional access');
  if (merged.status === 'active') {
    const linked = await enrollment(env, String(merged.enrollment_id), String(merged.dog_id));
    validateEnrollmentDates(linked);
    if (!linked.graduation_date && !merged.provisional_expires_at) throw new HttpError(400, 'Unknown graduation requires a provisional expiration before activation.');
  }
  const reason = 'reason' in data ? text(data.reason, 'reason', 1000) : null;
  const row = await casUpdate(env, identity, 'video_entitlements', id, version, updates, 'entitlement.updated', 'entitlement', { changes: updates, reason });
  return json({ entitlement: row });
}

function normalizeRecording(data: Record<string, unknown>, key: string) {
  const normalized: Record<string, unknown> = {
    dogId: identifier(data.dogId, 'dog ID'), enrollmentId: identifier(data.enrollmentId, 'enrollment ID'),
    title: text(data.title, 'title', 200), sessionAt: instant(data.sessionAt, 'session time'), idempotencyKey: key,
    trainingFocus: data.trainingFocus === undefined ? '' : text(data.trainingFocus, 'training focus', 2000, false),
    clientNotes: data.clientNotes === undefined ? '' : text(data.clientNotes, 'client notes', 4000, false),
    publicationStatus: choice(data.publicationStatus ?? 'draft', 'publication status', publicationStatuses),
    retentionHold: data.retentionHold === undefined ? false : boolean(data.retentionHold, 'retention hold')
  };
  if ('durationSeconds' in data) normalized.durationSeconds = data.durationSeconds === null ? null : integer(data.durationSeconds, 'duration seconds');
  if ('streamVideoId' in data) normalized.streamVideoId = data.streamVideoId === null ? null : identifier(data.streamVideoId, 'Stream video ID');
  return normalized;
}

function boolean(value: unknown, name: string) {
  if (typeof value !== 'boolean') throw new HttpError(400, `Enter a valid ${name}.`);
  return value;
}

async function createRecording(request: Request, env: Env, identity: Identity) {
  const data = await input(request, recordingFields);
  const key = idempotency(request, data);
  const normalized = normalizeRecording(data, key);
  const signature = fingerprint(normalized);
  const previous = await existingCreate(env, 'training_session_recordings', identity.id, key, signature);
  if (previous) return json({ recording: previous });
  await enrollment(env, String(normalized.enrollmentId), String(normalized.dogId));
  if (normalized.publicationStatus === 'published') throw new HttpError(400, 'Only ready recordings can be published.');
  const id = crypto.randomUUID();
  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO training_session_recordings(
        id,dog_id,enrollment_id,stream_video_id,title,session_at,training_focus,client_notes,duration_seconds,
        publication_status,created_by_user_id,updated_by_user_id,retention_hold,idempotency_key,request_fingerprint)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id, normalized.dogId, normalized.enrollmentId, normalized.streamVideoId ?? null, normalized.title, normalized.sessionAt,
          normalized.trainingFocus, normalized.clientNotes, normalized.durationSeconds ?? null, normalized.publicationStatus,
          identity.id, identity.id, normalized.retentionHold ? 1 : 0, key, signature),
      videoAudit(env, identity.id, 'recording.created', 'recording', id, { dogId: normalized.dogId, enrollmentId: normalized.enrollmentId })
    ]);
  } catch (error) {
    const concurrent = await existingCreate(env, 'training_session_recordings', identity.id, key, signature);
    if (concurrent) return json({ recording: concurrent });
    throw error;
  }
  return json({ recording: await getRow(env, 'training_session_recordings', id) }, 201);
}

async function patchRecording(request: Request, env: Env, identity: Identity, id: string) {
  const data = await input(request, ['title', 'sessionAt', 'trainingFocus', 'clientNotes', 'durationSeconds', 'publicationStatus', 'retentionHold', 'reason', 'version']);
  const current = await getRow(env, 'training_session_recordings', id);
  if (current.publication_status === 'deleted') throw new HttpError(409, 'Deleted recordings cannot be changed.');
  const version = expectedVersion(data, current);
  const updates: Record<string, string | number | null> = { updated_by_user_id: identity.id };
  for (const [field, column, max] of [['title', 'title', 200], ['trainingFocus', 'training_focus', 2000], ['clientNotes', 'client_notes', 4000]] as const) {
    if (field in data) updates[column] = text(data[field], field, max, field === 'title');
  }
  if ('sessionAt' in data) updates.session_at = instant(data.sessionAt, 'session time');
  if ('durationSeconds' in data) updates.duration_seconds = data.durationSeconds === null ? null : integer(data.durationSeconds, 'duration seconds');
  if ('retentionHold' in data) updates.retention_hold = boolean(data.retentionHold, 'retention hold') ? 1 : 0;
  if ('publicationStatus' in data) {
    updates.publication_status = choice(data.publicationStatus, 'publication status', publicationStatuses);
    if (data.publicationStatus === 'published') {
      if (current.processing_status !== 'ready' || current.deletion_status !== 'none') {
        throw new HttpError(409, 'Only ready recordings can be published.');
      }
      updates.published_at = current.published_at ?? new Date().toISOString();
    }
  }
  if (Object.keys(updates).length === 1) throw new HttpError(400, 'Provide a recording change.');
  const reason = 'reason' in data ? text(data.reason, 'reason', 1000) : null;
  return json({ recording: await casUpdate(env, identity, 'training_session_recordings', id, version, updates, 'recording.updated', 'recording', { changes: updates, reason }) });
}

async function reassignRecording(request: Request, env: Env, identity: Identity, id: string) {
  const data = await input(request, ['dogId', 'enrollmentId', 'reason', 'version']);
  const dogId = identifier(data.dogId, 'dog ID');
  const enrollmentId = identifier(data.enrollmentId, 'enrollment ID');
  const reason = 'reason' in data ? text(data.reason, 'reassignment reason', 1000) : null;
  const current = await getRow(env, 'training_session_recordings', id);
  if (current.publication_status === 'deleted') throw new HttpError(409, 'Deleted recordings cannot be reassigned.');
  const version = expectedVersion(data, current);
  await enrollment(env, enrollmentId, dogId);
  const updates = { dog_id: dogId, enrollment_id: enrollmentId, updated_by_user_id: identity.id };
  return json({ recording: await casUpdate(env, identity, 'training_session_recordings', id, version, updates, 'recording.reassigned', 'recording',
    { reason, previousDogId: current.dog_id, previousEnrollmentId: current.enrollment_id, dogId, enrollmentId }) });
}

async function deleteRecording(request: Request, env: Env, identity: Identity, id: string) {
  const data = await input(request, ['confirm', 'reason', 'version']);
  if (data.confirm !== true) throw new HttpError(400, 'Confirm deletion before continuing.');
  const reason = 'reason' in data ? text(data.reason, 'deletion reason', 1000) : null;
  const current = await getRow(env, 'training_session_recordings', id);
  const version = expectedVersion(data, current);
  if (current.publication_status === 'deleted') throw new HttpError(409, 'Recording is already deleted.');
  if (current.retention_hold === 1) throw new HttpError(409, 'Release the retention hold before deleting this recording.');
  const updates = { publication_status: 'deleted', updated_by_user_id: identity.id };
  return json({ recording: await casUpdate(env, identity, 'training_session_recordings', id, version, updates, 'recording.deleted', 'recording', { reason, retentionHold: current.retention_hold }) });
}

async function ownedDog(env: Env, identity: Identity, dogId: string) {
  const dog = await env.DB.prepare(`SELECT d.id, d.name, d.breed, d.birth_date, d.approximate_age FROM dogs d
    JOIN memberships m ON m.household_id = d.household_id WHERE d.id = ? AND m.user_id = ?`).bind(dogId, identity.id).first();
  if (!dog) throw new HttpError(404, 'Dog not found.');
  return dog;
}

// Coverage A is half-open and is separate from the half-open viewing window.
// A provisional expiration is always an additional cap, never an extension.
const accessible = `EXISTS (SELECT 1 FROM video_entitlements e
  WHERE e.dog_id = r.dog_id AND e.enrollment_id = r.enrollment_id AND e.status = 'active'
  AND e.coverage_start_at <= r.session_at AND r.session_at < e.coverage_end_at
  AND e.access_starts_at <= ? AND ? < e.access_expires_at
  AND (e.provisional_expires_at IS NULL OR ? < e.provisional_expires_at))`;
const visible = "r.publication_status = 'published' AND r.processing_status = 'ready' AND r.deletion_status = 'none'";

async function library(request: Request, env: Env, identity: Identity, dogId: string) {
  await ownedDog(env, identity, dogId);
  const params = new URL(request.url).searchParams;
  const from = params.has('from') ? instant(params.get('from'), 'from date') : null;
  const to = params.has('to') ? instant(params.get('to'), 'to date') : null;
  const focus = params.has('focus') ? text(params.get('focus'), 'training focus', 2000) : null;
  if (from && to) interval(from, to, 'Date filter');
  const filters: string[] = [];
  const values: string[] = [];
  if (from) { filters.push('r.session_at >= ?'); values.push(from); }
  if (to) { filters.push('r.session_at < ?'); values.push(to); }
  if (focus) { filters.push('instr(lower(r.training_focus), lower(?)) > 0'); values.push(focus); }
  const now = new Date().toISOString();
  const { results } = await env.DB.prepare(`SELECT r.id, r.dog_id, r.enrollment_id, r.title, r.session_at,
    r.training_focus, r.client_notes, r.duration_seconds, r.published_at FROM training_session_recordings r
    WHERE r.dog_id = ? AND ${visible} AND ${accessible}${filters.length ? ` AND ${filters.join(' AND ')}` : ''} ORDER BY r.session_at DESC, r.id`)
    .bind(dogId, now, now, now, ...values).all();
  return json({ recordings: results });
}

async function playback(env: Env, identity: Identity, id: string) {
  const now = new Date().toISOString();
  const row = await env.DB.prepare(`SELECT r.id FROM training_session_recordings r
    JOIN dogs d ON d.id = r.dog_id JOIN memberships m ON m.household_id = d.household_id
    WHERE r.id = ? AND m.user_id = ? AND ${visible} AND ${accessible}`)
    .bind(id, identity.id, now, now, now).first();
  if (!row) throw new HttpError(404, 'Recording not found.');
  return json({ authorized: true, configured: false, token: null, code: 'VIDEO_PLAYBACK_NOT_CONFIGURED', message: 'Video playback is not configured.' });
}

export async function videoApi(request: Request, env: Env, path: string, identity: Identity): Promise<Response | null> {
  const adminEntitlements = path === '/api/admin/video-entitlements';
  const entitlementMatch = path.match(/^\/api\/admin\/video-entitlements\/([A-Za-z0-9_-]{1,80})$/);
  const adminRecordings = path === '/api/admin/training-recordings';
  const recordingMatch = path.match(/^\/api\/admin\/training-recordings\/([A-Za-z0-9_-]{1,80})(?:\/(reassign))?$/);
  if (adminEntitlements || entitlementMatch || adminRecordings || recordingMatch) {
    requireStaff(identity, true);
    if (adminEntitlements && request.method === 'POST') return createEntitlement(request, env, identity);
    if (adminEntitlements && request.method === 'GET') {
      const url = new URL(request.url);
      const dog = url.searchParams.get('dogId');
      const enroll = url.searchParams.get('enrollmentId');
      const where: string[] = [];
      const values: string[] = [];
      if (dog !== null) { where.push('dog_id = ?'); values.push(identifier(dog, 'dog ID')); }
      if (enroll !== null) { where.push('enrollment_id = ?'); values.push(identifier(enroll, 'enrollment ID')); }
      const { results } = await env.DB.prepare(`SELECT * FROM video_entitlements${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC, id LIMIT 100`).bind(...values).all();
      return json({ entitlements: results });
    }
    if (entitlementMatch && request.method === 'PATCH') return patchEntitlement(request, env, identity, entitlementMatch[1]);
    if (adminRecordings && request.method === 'POST') return createRecording(request, env, identity);
    if (adminRecordings && request.method === 'GET') {
      const dog = new URL(request.url).searchParams.get('dogId');
      const { results } = await env.DB.prepare(`SELECT * FROM training_session_recordings${dog === null ? '' : ' WHERE dog_id = ?'} ORDER BY session_at DESC, id LIMIT 100`)
        .bind(...(dog === null ? [] : [identifier(dog, 'dog ID')])).all();
      return json({ recordings: results });
    }
    if (recordingMatch) {
      if (recordingMatch[2] === 'reassign' && request.method === 'POST') return reassignRecording(request, env, identity, recordingMatch[1]);
      if (!recordingMatch[2] && request.method === 'PATCH') return patchRecording(request, env, identity, recordingMatch[1]);
      if (!recordingMatch[2] && request.method === 'DELETE') return deleteRecording(request, env, identity, recordingMatch[1]);
    }
    throw new HttpError(405, 'Method not allowed.');
  }
  if (path === '/api/videos/dogs' && request.method === 'GET') {
    const now = new Date().toISOString();
    const { results } = await env.DB.prepare(`SELECT d.id, d.name, d.breed, d.birth_date, d.approximate_age,
      (SELECT MAX(CASE WHEN e.provisional_expires_at IS NOT NULL AND e.provisional_expires_at < e.access_expires_at
        THEN e.provisional_expires_at ELSE e.access_expires_at END)
       FROM video_entitlements e WHERE e.dog_id = d.id AND e.status = 'active'
       AND e.access_starts_at <= ? AND ? < e.access_expires_at
       AND (e.provisional_expires_at IS NULL OR ? < e.provisional_expires_at)) AS access_expires_at
      FROM dogs d JOIN memberships m ON m.household_id = d.household_id WHERE m.user_id = ? ORDER BY d.name, d.id`)
      .bind(now, now, now, identity.id).all();
    return json({ dogs: results.map(dog => ({ ...dog, has_video_access: dog.access_expires_at !== null })) });
  }
  if (path === '/api/videos' && request.method === 'GET') {
    const dogId = identifier(new URL(request.url).searchParams.get('dogId'), 'dog ID');
    return library(request, env, identity, dogId);
  }
  const playbackMatch = path.match(/^\/api\/videos\/([A-Za-z0-9_-]{1,80})\/playback-token$/);
  if (playbackMatch && request.method === 'POST') {
    await input(request, []);
    return playback(env, identity, playbackMatch[1]);
  }
  return null;
}
