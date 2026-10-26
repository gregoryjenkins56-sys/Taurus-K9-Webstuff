import { HttpError, requireStaff } from './auth.ts';
import type { Env, Identity } from './auth.ts';
import { acknowledgmentProgress, contentHash, createAgreementSnapshot, liveSigningAvailable, validateTemplate, validSignatureValue } from '../../portal/js/agreement-model.js';
import type { AgreementSnapshot, ContractTemplate, SigningState } from '../../portal/js/agreement-model.js';

type Input = (request: Request, allowed: string[], limit?: number) => Promise<Record<string, unknown>>;
interface AgreementRow {
  id: string; version_id: string; signer_id: string; household_id: string;
  snapshot_json: string; content_hash: string; state_json: string;
  revision: number; status: string; updated_at: string;
}
export interface ExecutionRow {
  agreement_id: string; event_id: string; actor_id: string; signature_json: string;
  idempotency_key: string; request_hash: string; document_key: string; document_hash: string; signed_at: string;
}

const identifier = /^[A-Za-z0-9_-]{1,80}$/;
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const now = () => new Date().toISOString();
function id(value: unknown) {
  if (typeof value !== 'string' || !identifier.test(value)) throw new HttpError(400, 'Enter a valid record identifier.');
  return value;
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'An object is required.');
  return value as Record<string, unknown>;
}
function exact(value: unknown, maximum: number, empty = false): string {
  if (typeof value !== 'string' || value.length > maximum || (!empty && !value.trim()) || value.includes('\u0000')) throw new HttpError(400, 'Text is missing or exceeds its allowed size.');
  return value;
}
export function contractContent(value: unknown): ContractTemplate {
  const source = record(value);
  try { validateTemplate(source); } catch { throw new HttpError(400, 'Invalid section configuration. Use unique IDs/orders and valid acknowledgment types.'); }
  const template = source as unknown as ContractTemplate;
  if (template.sections.length > 100) throw new HttpError(400, 'A contract may contain at most 100 sections.');
  const disclosure = record(source.electronicDisclosure);
  const approval = record(source.approval);
  if (typeof source.isPlaceholder !== 'boolean' || typeof approval.contract !== 'boolean' || typeof approval.electronicDisclosure !== 'boolean') throw new HttpError(400, 'Explicit placeholder and approval flags are required.');
  const optional = source.optionalConsents ?? [];
  if (!Array.isArray(optional) || optional.length > 30) throw new HttpError(400, 'Invalid optional consents.');
  const optionalIds = new Set<string>();
  return {
    title: exact(source.title, 160), version: exact(source.version, 80), isPlaceholder: source.isPlaceholder,
    approval: { contract: approval.contract, electronicDisclosure: approval.electronicDisclosure },
    electronicDisclosure: { version: exact(disclosure.version, 80), content: exact(disclosure.content, 100000) },
    sections: template.sections.map(section => {
      if (['constructor', 'prototype'].includes(section.sectionId)) throw new HttpError(400, 'Reserved section identifier.');
      return { sectionId: section.sectionId, heading: exact(section.heading, 500), content: exact(section.content, 100000), order: section.order, acknowledgmentType: section.acknowledgmentType, required: section.required };
    }).sort((left, right) => left.order - right.order),
    optionalConsents: optional.map(value => {
      const item = record(value);
      const consentId = id(item.consentId);
      if (optionalIds.has(consentId) || ['constructor','prototype','__proto__','electronic-signing'].includes(consentId)) throw new HttpError(400, 'Invalid or duplicate optional consent identifier.');
      optionalIds.add(consentId);
      return { consentId, heading: exact(item.heading, 500), content: exact(item.content, 100000) };
    })
  };
}
function initialState(): SigningState {
  return { acknowledgments: {}, optionalConsents: {}, drafts: {}, printedName: '', signature: '', events: [], completion: null, revision: 0, savedAt: null };
}
function audit(env: Env, identity: Identity, action: string, resource: string) {
  return env.DB.prepare('INSERT INTO audit_logs(id, actor_id, action, resource_id) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), identity.id, action, resource);
}
export async function ownedAgreement(env: Env, identity: Identity, agreementId: string, write = false) {
  const row = await env.DB.prepare(
    `SELECT a.* FROM agreements a WHERE a.id = ? AND
     ((a.signer_id = ? AND EXISTS (SELECT 1 FROM memberships m WHERE m.user_id = ? AND m.household_id = a.household_id)) OR ? = 1)`
  ).bind(agreementId, identity.id, identity.id, !write && identity.role === 'admin' ? 1 : 0).first<AgreementRow>();
  if (!row) throw new HttpError(404, 'Agreement not found.');
  return row;
}
export function requireRevision(row: AgreementRow, data: Record<string, unknown>) {
  if (row.status === 'signed') throw new HttpError(409, 'The executed agreement is locked.');
  if (data.expectedRevision !== row.revision || data.agreementHash !== row.content_hash) throw new HttpError(409, 'This agreement changed. Reload it before saving.');
}
export function signingEvent(env: Env, row: AgreementRow, identity: Identity, action: string, sectionId: string | null, time: string, eventId = crypto.randomUUID()) {
  return env.DB.prepare(`INSERT INTO agreement_events(id,agreement_id,actor_id,expected_revision,action,section_id,agreement_hash,recorded_at) VALUES (?,?,?,?,?,?,?,?)`)
    .bind(eventId, row.id, identity.id, row.revision, action, sectionId, row.content_hash, time);
}
export async function agreementBatch(env: Env, statements: D1PreparedStatement[]) {
  try { await env.DB.batch(statements); }
  catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/revision_conflict|agreement_locked|UNIQUE constraint failed: agreement_events/.test(message)) throw new HttpError(409, 'The agreement changed during this request. Reload before retrying.');
    throw error;
  }
}
export async function agreementView(env: Env, row: AgreementRow) {
  const snapshot = JSON.parse(row.snapshot_json) as AgreementSnapshot;
  const state = JSON.parse(row.state_json) as SigningState;
  state.revision = row.revision;
  state.savedAt = row.updated_at;
  const { results } = await env.DB.prepare('SELECT id, action, section_id AS sectionId, recorded_at AS recordedAt FROM agreement_events WHERE agreement_id = ? ORDER BY expected_revision').bind(row.id).all();
  state.events = results as unknown as SigningState['events'];
  const receipt = await env.DB.prepare('SELECT * FROM agreement_executions WHERE agreement_id = ?').bind(row.id).first<ExecutionRow>();
  state.completion = receipt ? { ...JSON.parse(receipt.signature_json), id: receipt.event_id, completedAt: receipt.signed_at, disclosureVersion: snapshot.electronicDisclosure.version } : null;
  return { snapshot, state, status: row.status, progress: acknowledgmentProgress(snapshot, state.acknowledgments), emailDelivery: 'unconfigured' };
}
async function saveMutation(env: Env, row: AgreementRow, identity: Identity, state: SigningState, action: string, sectionId: string | null, time: string, extra: D1PreparedStatement[] = [], eventId = crypto.randomUUID()) {
  await agreementBatch(env, [
    signingEvent(env, row, identity, action, sectionId, time, eventId), ...extra,
    env.DB.prepare("UPDATE agreements SET state_json = ?, revision = revision + 1, status = 'in_progress', updated_at = ? WHERE id = ?")
      .bind(JSON.stringify(state), time, row.id), audit(env, identity, `contract.${action}`, row.id)
  ]);
  return json(await agreementView(env, await ownedAgreement(env, identity, row.id, true)));
}

export async function agreementRoutes(request: Request, env: Env, path: string, identity: Identity, input: Input): Promise<Response | null> {
  const surface = path === '/api/documents' || path === '/api/agreements' || path.startsWith('/api/agreements/') || path.startsWith('/api/admin/contracts') || path === '/api/admin/agreements';
  if (!surface) return null;
  if (env.CONTRACT_SIGNING_ENABLED !== 'true') throw new HttpError(503, 'Contract signing is not enabled.');
  if (path.startsWith('/api/admin/')) requireStaff(identity, true);
  if (path === '/api/admin/contracts' && request.method === 'GET') {
    const templates = await env.DB.prepare('SELECT * FROM contract_templates ORDER BY updated_at DESC LIMIT 100').all();
    const versions = await env.DB.prepare('SELECT id, template_id, version, content_hash, published_at FROM contract_versions ORDER BY published_at DESC LIMIT 100').all();
    return json({ templates: templates.results.map(row => ({ ...row, draft: JSON.parse(String(row.draft_json)), draft_json: undefined })), versions: versions.results, limit: 100 });
  }
  if (path === '/api/admin/contracts' && request.method === 'POST') {
    const data = await input(request, ['template'], 512000);
    const template = contractContent(data.template);
    const templateId = crypto.randomUUID();
    await env.DB.batch([env.DB.prepare('INSERT INTO contract_templates(id,draft_json,created_by,updated_at) VALUES (?,?,?,?)').bind(templateId, JSON.stringify(template), identity.id, now()), audit(env, identity, 'contract.template.created', templateId)]);
    return json({ id: templateId }, 201);
  }
  const templateRoute = path.match(/^\/api\/admin\/contracts\/([A-Za-z0-9_-]{1,80})(\/publish)?$/);
  if (templateRoute && templateRoute[1] !== 'assignments') {
    const templateId = templateRoute[1];
    const draft = await env.DB.prepare('SELECT * FROM contract_templates WHERE id = ?').bind(templateId).first<{ draft_json: string; revision: number }>();
    if (!draft) throw new HttpError(404, 'Template not found.');
    if (!templateRoute[2] && request.method === 'PATCH') {
      const data = await input(request, ['template','expectedRevision'], 512000);
      if (data.expectedRevision !== draft.revision) throw new HttpError(409, 'Template changed. Reload before editing.');
      const template = contractContent(data.template);
      const result = await env.DB.prepare('UPDATE contract_templates SET draft_json = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(template), now(), templateId, draft.revision).run();
      if (!result.meta.changes) throw new HttpError(409, 'Template changed. Reload before editing.');
      return json({ updated: true });
    }
    if (templateRoute[2] && request.method === 'POST') {
      const data = await input(request, ['expectedRevision','legalApproval']);
      if (data.expectedRevision !== draft.revision) throw new HttpError(409, 'Template changed. Reload before publishing.');
      const template = contractContent(JSON.parse(draft.draft_json));
      if (data.legalApproval !== true || !liveSigningAvailable(template) ||
          JSON.stringify(template).match(/\[Insert\b|Approved text pending/i) || /^draft/i.test(template.version)) throw new HttpError(422, 'Placeholders cannot be published. Approved contract text and electronic disclosures require explicit legal approval.');
      const versionId = crypto.randomUUID();
      try {
        await env.DB.batch([
          env.DB.prepare('INSERT INTO contract_versions(id,template_id,version,content_json,content_hash,published_by,published_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM contract_templates WHERE id = ? AND revision = ?)')
            .bind(versionId, templateId, template.version, JSON.stringify(template), await contentHash(template), identity.id, now(), templateId, draft.revision),
          env.DB.prepare("INSERT INTO audit_logs(id,actor_id,action,resource_id) SELECT ?,?,'contract.version.published',id FROM contract_versions WHERE id = ?")
            .bind(crypto.randomUUID(), identity.id, versionId)
        ]);
      } catch (error) {
        if (String(error).includes('UNIQUE')) throw new HttpError(409, 'This template version already exists. Create a new version label.');
        throw error;
      }
      if (!await env.DB.prepare('SELECT id FROM contract_versions WHERE id = ?').bind(versionId).first()) throw new HttpError(409, 'Template changed. Reload before publishing.');
      return json({ id: versionId }, 201);
    }
  }
  if (path === '/api/admin/contracts/assignments' && request.method === 'GET') {
    const { results } = await env.DB.prepare(`SELECT u.id AS signerId,u.display_name AS signerName,h.id AS householdId,d.id AS dogId,d.name AS dogName,e.id AS enrollmentId,p.name AS serviceName
      FROM users u JOIN memberships m ON m.user_id=u.id JOIN households h ON h.id=m.household_id
      JOIN dogs d ON d.household_id=h.id JOIN enrollments e ON e.dog_id=d.id JOIN training_programs p ON p.id=e.program_id WHERE u.active=1 ORDER BY u.display_name,d.name LIMIT 100`).all();
    return json({ assignments: results, limit: 100 });
  }
  if (path === '/api/admin/agreements' && request.method === 'POST') {
    const data = await input(request, ['versionId','signerId','enrollmentId']);
    const versionId = id(data.versionId);
    const signerId = id(data.signerId);
    const enrollmentId = id(data.enrollmentId);
    const version = await env.DB.prepare('SELECT content_json FROM contract_versions WHERE id = ?').bind(versionId).first<{ content_json: string }>();
    if (!version) throw new HttpError(404, 'Published version not found.');
    const assignment = await env.DB.prepare(`SELECT u.display_name,h.id AS household_id,h.contact_name,h.phone,h.city,d.id AS dog_id,d.name AS dog_name,d.breed,d.birth_date,d.approximate_age,p.id AS program_id,p.name AS program_name,p.price_minor,p.deposit_minor,p.currency
      FROM enrollments e JOIN dogs d ON d.id=e.dog_id JOIN households h ON h.id=d.household_id
      JOIN memberships m ON m.household_id=h.id JOIN users u ON u.id=m.user_id JOIN training_programs p ON p.id=e.program_id
      WHERE e.id=? AND u.id=? AND u.active=1`).bind(enrollmentId, signerId).first<Record<string, string | number | null>>();
    if (!assignment) throw new HttpError(422, 'The signer, dog and enrollment must belong to the same household.');
    const agreementId = crypto.randomUUID();
    const template = contractContent(JSON.parse(version.content_json));
    const snapshot = await createAgreementSnapshot(template, {
      agreementId, clientId: signerId,
      client: { name: String(assignment.display_name), contactName: String(assignment.contact_name), phone: String(assignment.phone), city: String(assignment.city) },
      dog: { name: String(assignment.dog_name), breed: String(assignment.breed), birthDate: assignment.birth_date as string | null, approximateAge: String(assignment.approximate_age) },
      service: { name: String(assignment.program_name), enrollmentId, programId: String(assignment.program_id), priceMinor: Number(assignment.price_minor), depositMinor: Number(assignment.deposit_minor), currency: String(assignment.currency) }
    });
    const time = now();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO agreements(id,version_id,signer_id,household_id,dog_id,enrollment_id,snapshot_json,content_hash,state_json,assigned_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .bind(agreementId, versionId, signerId, assignment.household_id, assignment.dog_id, enrollmentId, JSON.stringify(snapshot), snapshot.contentHash, JSON.stringify(initialState()), time, time),
      env.DB.prepare("INSERT INTO agreement_events(id,agreement_id,actor_id,expected_revision,action,agreement_hash,recorded_at) VALUES (?,?,?,0,'agreement.assigned',?,?)")
        .bind(crypto.randomUUID(), agreementId, identity.id, snapshot.contentHash, time),
      env.DB.prepare('UPDATE agreements SET revision = 1 WHERE id = ?').bind(agreementId), audit(env, identity, 'contract.agreement.assigned', agreementId)
    ]);
    return json({ id: agreementId }, 201);
  }
  if (['/api/agreements','/api/documents','/api/admin/agreements'].includes(path) && request.method === 'GET') {
    const admin = path === '/api/admin/agreements';
    const { results } = await env.DB.prepare(`SELECT id,status,snapshot_json,state_json,assigned_at FROM agreements WHERE (?=1 OR (signer_id=? AND EXISTS (SELECT 1 FROM memberships m WHERE m.user_id=? AND m.household_id=agreements.household_id))) AND (?=0 OR status='signed') ORDER BY assigned_at DESC LIMIT 100`)
      .bind(admin ? 1 : 0, identity.id, identity.id, path === '/api/documents' ? 1 : 0).all();
    return json({ agreements: results.map(row => {
      const snapshot = JSON.parse(String(row.snapshot_json)) as AgreementSnapshot;
      const state = JSON.parse(String(row.state_json)) as SigningState;
      return { id: row.id, status: row.status, title: snapshot.title, version: snapshot.version, client: snapshot.client.name, dog: snapshot.dog.name, service: snapshot.service.name, progress: acknowledgmentProgress(snapshot,state.acknowledgments), assignedAt: row.assigned_at };
    }), limit: 100 });
  }
  const route = path.match(/^\/api\/agreements\/([A-Za-z0-9_-]{1,80})(?:\/(draft|sections|consents|completion)(?:\/([A-Za-z0-9_-]{1,80}))?)?$/);
  if (!route) return null;
  const [, agreementId, action, itemId] = route;
  const writing = !['GET','HEAD'].includes(request.method);
  const row = await ownedAgreement(env, identity, agreementId, writing);
  if ((!action || action === 'completion') && request.method === 'GET') return json(await agreementView(env,row));
  if (!writing) throw new HttpError(405, 'Method not allowed.');
  const draftSave = action === 'draft' && request.method === 'POST';
  const data = await input(request, ['expectedRevision','agreementHash','value','drafts','printedName','signature','accepted'], draftSave ? 131072 : 8192);
  requireRevision(row,data);
  const snapshot = JSON.parse(row.snapshot_json) as AgreementSnapshot;
  const state = JSON.parse(row.state_json) as SigningState;
  const time = now();
  if (action === 'draft' && request.method === 'POST') {
    const drafts = record(data.drafts);
    const allowed = new Set(snapshot.sections.filter(section => section.acknowledgmentType !== 'none').map(section => section.sectionId));
    for (const [sectionId,value] of Object.entries(drafts)) {
      if (!allowed.has(sectionId)) throw new HttpError(400, 'Unknown draft section.');
      exact(value,160,true);
    }
    state.drafts = drafts as Record<string,string>;
    state.printedName = exact(data.printedName,160,true);
    state.signature = exact(data.signature,160,true);
    return saveMutation(env,row,identity,state,'draft.saved',null,time);
  }
  if (action === 'sections' && itemId && ['POST','DELETE'].includes(request.method)) {
    const section = snapshot.sections.find(item => item.sectionId === itemId && item.acknowledgmentType !== 'none');
    if (!section) throw new HttpError(404, 'Section not found.');
    const removing = request.method === 'DELETE';
    if (!removing && !validSignatureValue(data.value,section.acknowledgmentType)) throw new HttpError(422, 'Enter the required initials or typed section signature.');
    const eventId = crypto.randomUUID();
    const evidenceId = crypto.randomUUID();
    const actionName = removing ? 'acknowledgment.removed' : state.acknowledgments[itemId] ? 'acknowledgment.corrected' : 'acknowledgment.recorded';
    const value = removing ? null : String(data.value).trim();
    if (removing) { delete state.acknowledgments[itemId]; delete state.drafts[itemId]; }
    else {
      state.acknowledgments[itemId] = { agreementId, clientId: identity.id, version: snapshot.version, agreementHash: snapshot.contentHash, sectionId: itemId, sectionHash: section.contentHash, type: section.acknowledgmentType as 'initials'|'signature', value: value!, recordedAt: time, evidenceId };
      state.drafts[itemId] = value!;
    }
    return saveMutation(env,row,identity,state,actionName,itemId,time,[
      env.DB.prepare('INSERT INTO agreement_evidence(id,event_id,agreement_id,actor_id,version_id,agreement_hash,section_id,section_hash,value,acknowledgment_type,recorded_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .bind(evidenceId,eventId,agreementId,identity.id,row.version_id,snapshot.contentHash,itemId,section.contentHash,value,section.acknowledgmentType,time)
    ],eventId);
  }
  if (action === 'consents' && itemId && request.method === 'POST') {
    const consent = snapshot.optionalConsents.find(item => item.consentId === itemId);
    if (!consent || typeof data.accepted !== 'boolean') throw new HttpError(400, 'Invalid optional consent.');
    state.optionalConsents[itemId] = { accepted: data.accepted, recordedAt: time };
    const eventId = crypto.randomUUID();
    return saveMutation(env,row,identity,state,'optional-consent.updated',itemId,time,[
      env.DB.prepare('INSERT INTO agreement_consents(id,event_id,agreement_id,actor_id,consent_id,content_hash,accepted,recorded_at) VALUES (?,?,?,?,?,?,?,?)')
        .bind(crypto.randomUUID(),eventId,agreementId,identity.id,itemId,await contentHash(consent),data.accepted ? 1 : 0,time)
    ],eventId);
  }
  throw new HttpError(405, 'Method not allowed.');
}