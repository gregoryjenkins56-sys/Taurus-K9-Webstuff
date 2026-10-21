import type { Env } from './auth.ts';

const MAX_ATTEMPTS = 6;
const BATCH_SIZE = 5;
const now = () => Math.floor(Date.now() / 1000);

export function hubspotEnabled(env: Env) {
  return env.APP_ENV === 'preview' && env.HUBSPOT_SYNC_ENABLED === 'true' &&
    !!env.HUBSPOT_ACCESS_TOKEN?.trim();
}

// Append to the household write's D1 batch: the outbox and source change commit together.
export function enqueueHubspot(env: Env, householdId: string) {
  if (!hubspotEnabled(env)) return [];
  return [env.DB.prepare(
    `INSERT INTO hubspot_sync_jobs(household_id, idempotency_key, payload, status, updated_at)
     SELECT id, ?, json_object('firstname', contact_name, 'phone', phone, 'city', city), 'pending', ?
     FROM households WHERE id = ?
     ON CONFLICT(household_id) DO UPDATE SET
       idempotency_key = excluded.idempotency_key, payload = excluded.payload,
       status = CASE WHEN hubspot_sync_jobs.status = 'processing' THEN 'processing' ELSE 'pending' END,
       attempt_count = 0, next_attempt_at = 0, last_error = NULL, updated_at = excluded.updated_at
     WHERE hubspot_sync_jobs.payload != excluded.payload`
  ).bind(crypto.randomUUID(), now(), householdId)];
}

interface Job {
  household_id: string;
  idempotency_key: string;
  payload: string;
  attempt_count: number;
}

async function sendContact(env: Env, job: Job): Promise<{ id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
      method: 'POST',
      headers: { authorization: ['Bearer', env.HUBSPOT_ACCESS_TOKEN].join(' '), 'content-type': 'application/json' },
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ inputs: [{
        id: `preview:${job.household_id}`,
        idProperty: 'tk9_preview_household_id',
        properties: { ...JSON.parse(job.payload), tk9_preview_household_id: `preview:${job.household_id}` }
      }] })
    });
    // Never persist provider bodies, headers or thrown messages: they may contain PII/tokens.
    if (response.status !== 200 && response.status !== 201) {
      await response.body?.cancel();
      return { error: `hubspot_http_${response.status}` };
    }
    const result = await response.json() as { status?: string; numErrors?: number; results?: { id?: string }[] };
    const id = result.results?.[0]?.id;
    if (result.status !== 'COMPLETE' || result.numErrors || result.results?.length !== 1 ||
        typeof id !== 'string' || !/^\d{1,30}$/.test(id)) return { error: 'hubspot_invalid_response' };
    return { id };
  } catch {
    return { error: 'hubspot_network_or_response_error' };
  }
}

export async function processHubspot(env: Env) {
  if (!hubspotEnabled(env)) return { enabled: false, processed: 0 };
  const timestamp = now();
  const { results } = await env.DB.prepare(
    `SELECT household_id FROM hubspot_sync_jobs
     WHERE (status = 'pending' AND next_attempt_at <= ?) OR (status = 'processing' AND lease_until <= ?)
     ORDER BY next_attempt_at, household_id LIMIT ?`
  ).bind(timestamp, timestamp, BATCH_SIZE).all<{ household_id: string }>();
  let processed = 0;
  for (const candidate of results) {
    const lease = crypto.randomUUID();
    const claimedAt = now();
    // Expired sixth attempts become terminal even if the Worker died before saving a result.
    await env.DB.prepare(
      `UPDATE hubspot_sync_jobs SET status = 'failed', last_error = 'hubspot_attempts_exhausted',
       lease_token = NULL, lease_until = 0 WHERE household_id = ? AND attempt_count >= ?
       AND status = 'processing' AND lease_until <= ?`
    ).bind(candidate.household_id, MAX_ATTEMPTS, claimedAt).run();
    const job = await env.DB.prepare(
      `UPDATE hubspot_sync_jobs SET status = 'processing', attempt_count = attempt_count + 1,
       lease_token = ?, lease_until = ?, updated_at = ?
       WHERE household_id = ? AND attempt_count < ? AND
       ((status = 'pending' AND next_attempt_at <= ?) OR (status = 'processing' AND lease_until <= ?))
       RETURNING household_id, idempotency_key, payload, attempt_count`
    ).bind(lease, claimedAt + 120, claimedAt, candidate.household_id, MAX_ATTEMPTS, claimedAt, claimedAt).first<Job>();
    if (!job) continue;
    const result = await sendContact(env, job);
    const finishedAt = now();
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE hubspot_sync_jobs SET status = ?, next_attempt_at = ?, last_error = ?,
         hubspot_contact_id = COALESCE(?, hubspot_contact_id),
         last_success_at = CASE WHEN ? IS NOT NULL THEN ? ELSE last_success_at END,
         lease_token = NULL, lease_until = 0, updated_at = ?
         WHERE household_id = ? AND lease_token = ? AND idempotency_key = ?`
      ).bind(result.id ? 'succeeded' : job.attempt_count >= MAX_ATTEMPTS ? 'failed' : 'pending',
        result.id ? 0 : finishedAt + 60 * 2 ** (job.attempt_count - 1), result.error || null,
        result.id || null, result.id || null, finishedAt, finishedAt,
        job.household_id, lease, job.idempotency_key),
      // A newer profile arrived during HTTP: release its lease, without acknowledging the new payload.
      env.DB.prepare(
        `UPDATE hubspot_sync_jobs SET status = 'pending', lease_token = NULL, lease_until = 0
         WHERE household_id = ? AND lease_token = ? AND idempotency_key != ?`
      ).bind(job.household_id, lease, job.idempotency_key)
    ]);
    processed++;
  }
  return { enabled: true, processed };
}

export async function hubspotDiagnostics(env: Env) {
  if (!hubspotEnabled(env)) return { enabled: false };
  const summary = await env.DB.prepare(
    `SELECT COUNT(*) AS total,
     COALESCE(SUM(status = 'pending'), 0) AS pending,
     COALESCE(SUM(status = 'processing'), 0) AS processing,
     COALESCE(SUM(status = 'failed'), 0) AS failed,
     COALESCE(SUM(status = 'succeeded'), 0) AS succeeded,
     MAX(last_success_at) AS last_success_at FROM hubspot_sync_jobs`
  ).first();
  const { results: failures } = await env.DB.prepare(
    `SELECT idempotency_key, status, attempt_count, next_attempt_at, last_error, updated_at
     FROM hubspot_sync_jobs WHERE last_error IS NOT NULL ORDER BY updated_at DESC, household_id LIMIT 20`
  ).all();
  const { results: successes } = await env.DB.prepare(
    `SELECT idempotency_key, last_success_at FROM hubspot_sync_jobs
     WHERE last_success_at IS NOT NULL ORDER BY last_success_at DESC, household_id LIMIT 20`
  ).all();
  return { enabled: true, summary, failures, successes, limit: 20 };
}
