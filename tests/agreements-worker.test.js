import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import worker from '../server/worker/index.ts';
import { hash } from '../server/worker/auth.ts';

let mf;
let db;
let env;
let tokens;
beforeEach(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: 'export default {fetch(){return new Response("isolated contracts test")}}',
    compatibilityDate: '2026-10-19', d1Databases: ['DB'], r2Buckets: ['AGREEMENT_DOCUMENTS']
  }));
  db = await mf.getD1Database('DB');
  const foundation = await readFile(new URL('../migrations/0001_foundation.sql', import.meta.url), 'utf8');
  for (const sql of foundation.split(';').map(value => value.trim()).filter(Boolean)) await db.prepare(sql).run();
  const contracts = await readFile(new URL('../migrations/0003_contract_signing.sql', import.meta.url), 'utf8');
  for (const sql of contracts.split('--> statement-breakpoint').map(value => value.trim()).filter(Boolean)) await db.prepare(sql).run();
  env = { DB: db, AGREEMENT_DOCUMENTS: await mf.getR2Bucket('AGREEMENT_DOCUMENTS'), APP_ENV: 'development', APP_ORIGIN: 'http://localhost:8787', CONTRACT_SIGNING_ENABLED: 'true', ASSETS: { fetch: async () => new Response('assets') } };
  tokens = {};
  for (const user of ['client-a','client-b','housemate','admin','reviewer']) {
    await db.prepare('INSERT INTO users(id,issuer,subject,display_name) VALUES (?,?,?,?)').bind(user,'https://identity.example.invalid/',user,`Synthetic ${user}`).run();
    tokens[user] = 'x'.repeat(43 - user.length) + user;
    await db.prepare('INSERT INTO sessions(token_hash,user_id,csrf_token,expires_at) VALUES (?,?,?,?)').bind(await hash(tokens[user]),user,`csrf-${user}`,Math.floor(Date.now()/1000)+3600).run();
  }
  await db.prepare("INSERT INTO staff_roles(user_id,role) VALUES ('admin','admin'),('reviewer','reviewer')").run();
  await db.prepare("INSERT INTO households(id,contact_name) VALUES ('house-a','Synthetic household')").run();
  await db.prepare("INSERT INTO memberships(user_id,household_id) VALUES ('client-a','house-a'),('housemate','house-a')").run();
  await db.prepare("INSERT INTO dogs(id,household_id,name,breed) VALUES ('dog-a','house-a','Synthetic Scout','Labrador')").run();
  await db.prepare("INSERT INTO training_programs(id,name,price_minor,deposit_minor,currency) VALUES ('program-a','Synthetic lessons',50000,10000,'USD')").run();
  await db.prepare("INSERT INTO enrollments(id,dog_id,program_id) VALUES ('enroll-a','dog-a','program-a')").run();
});
afterEach(async () => { await mf?.dispose(); });

test('additive migration installs compound guards and immutable signing tables', async () => {
  const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%agreement%'").all();
  assert.equal(tables.results.length, 5);
  const triggers = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'trigger'").all();
  assert.ok(triggers.results.length >= 14);
  assert.equal((await db.prepare('PRAGMA foreign_key_check').all()).results.length, 0);
});

function request(path, user = 'client-a', body, method = body ? 'POST' : 'GET', bindings = env) {
  return worker.fetch(new Request(`http://localhost:8787${path}`, {
    method, headers: { ...(user ? { cookie: `tk9_session=${tokens[user]}`, origin: 'http://localhost:8787', 'x-csrf-token': `csrf-${user}` } : {}), ...(body ? { 'content-type':'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined
  }),bindings);
}
function syntheticTemplate() {
  return {
    title: 'Synthetic test agreement', version: 'TEST-1', isPlaceholder: false,
    approval: { contract: true, electronicDisclosure: true },
    sections: [
      { sectionId:'first',heading:'Synthetic first section',content:'Synthetic content for automated tests only.',order:1,acknowledgmentType:'initials',required:true },
      { sectionId:'second',heading:'Synthetic second section',content:'Synthetic content for automated tests only.',order:2,acknowledgmentType:'signature',required:true }
    ],
    electronicDisclosure: { version:'TEST-1',content:'Synthetic disclosure for automated tests only.' },
    optionalConsents: [{ consentId:'optional-test',heading:'Synthetic optional choice',content:'Synthetic optional text.' }]
  };
}
async function assigned(template = syntheticTemplate()) {
  const draft = await request('/api/admin/contracts','admin',{ template });
  assert.equal(draft.status,201);
  const templateId = (await draft.json()).id;
  const published = await request(`/api/admin/contracts/${templateId}/publish`,'admin',{ expectedRevision:0,legalApproval:true });
  assert.equal(published.status,201,JSON.stringify(await published.clone().json()));
  const versionId = (await published.json()).id;
  const issued = await request('/api/admin/agreements','admin',{ versionId,signerId:'client-a',enrollmentId:'enroll-a' });
  assert.equal(issued.status,201,JSON.stringify(await issued.clone().json()));
  const agreementId = (await issued.json()).id;
  return { templateId,versionId,agreementId };
}
async function view(agreementId) { return (await request(`/api/agreements/${agreementId}`)).json(); }
async function acknowledge(agreementId,sectionId,value) {
  const current = await view(agreementId);
  return request(`/api/agreements/${agreementId}/sections/${sectionId}`,'client-a',{ expectedRevision:current.state.revision,agreementHash:current.snapshot.contentHash,value });
}
test('placeholder publication is blocked and reviewer/client cannot manage templates', async () => {
  const template = syntheticTemplate();
  template.isPlaceholder = true;
  const created = await request('/api/admin/contracts','admin',{template});
  const templateId = (await created.json()).id;
  assert.equal((await request(`/api/admin/contracts/${templateId}/publish`,'admin',{expectedRevision:0,legalApproval:true})).status,422);
  for (const user of ['client-a','reviewer']) assert.equal((await request('/api/admin/contracts',user,{template})).status,403);
  assert.equal((await db.prepare('SELECT COUNT(*) AS total FROM contract_versions').first()).total,0);
});
test('assigned signer access is narrower than household membership on every agreement route', async () => {
  const {agreementId} = await assigned();
  assert.equal((await request(`/api/agreements/${agreementId}`)).status,200);
  assert.equal((await request(`/api/agreements/${agreementId}`,'admin')).status,200);
  for (const user of ['client-b','housemate','reviewer']) {
    assert.equal((await request(`/api/agreements/${agreementId}`,user)).status,404);
    assert.equal((await request(`/api/agreements/${agreementId}/sections/first`,user,{value:'XX'})).status,404);
    assert.equal((await request(`/api/agreements/${agreementId}/draft`,user,{drafts:{}})).status,404);
  }
  assert.equal((await request(`/api/agreements/${agreementId}`,null)).status,401);
  assert.equal((await request(`/api/agreements/${agreementId}/sections/first`,'admin',{value:'XX'})).status,404);
  assert.equal((await request('/api/admin/contracts/assignments','admin')).status,200);
});
test('save/resume and acknowledgment corrections preserve evidence versions and audit history', async () => {
  const {agreementId,versionId} = await assigned();
  assert.equal((await acknowledge(agreementId,'first','AM')).status,200);
  let current = await view(agreementId);
  const saved = await request(`/api/agreements/${agreementId}/draft`,'client-a',{
    expectedRevision:current.state.revision,agreementHash:current.snapshot.contentHash,
    drafts:{first:'AM',second:'Unrecorded name'},printedName:'Synthetic client',signature:''
  });
  assert.equal(saved.status,200);
  current = await view(agreementId);
  assert.equal(current.state.drafts.second,'Unrecorded name');
  assert.equal(current.state.acknowledgments.second,undefined);
  assert.equal(current.progress.completed,1);
  assert.equal((await acknowledge(agreementId,'first','AX')).status,200);
  current = await view(agreementId);
  assert.equal(current.state.acknowledgments.first.value,'AX');
  const evidence = (await db.prepare('SELECT * FROM agreement_evidence ORDER BY recorded_at').all()).results;
  assert.equal(evidence.length,2);
  assert.equal(evidence[0].version_id,versionId);
  assert.equal(evidence[0].section_hash,current.snapshot.sections[0].contentHash);
  assert.equal(evidence[0].actor_id,'client-a');
  assert.equal(current.state.events.at(-1).action,'acknowledgment.corrected');
  await assert.rejects(db.prepare("UPDATE agreement_evidence SET value='tampered'").run(),/evidence_append_only/);
  await assert.rejects(db.prepare("DELETE FROM agreement_events").run(),/audit_append_only/);
});
test('draft saves accept the maximum supported set of full-length section values', async () => {
  const template = syntheticTemplate();
  template.sections = Array.from({ length:100 },(_,index) => ({
    sectionId:`section-${index}`,heading:`Synthetic section ${index}`,content:'Synthetic content for automated tests only.',
    order:index+1,acknowledgmentType:'signature',required:true
  }));
  const {agreementId} = await assigned(template);
  const current = await view(agreementId);
  const drafts = Object.fromEntries(template.sections.map(section => [section.sectionId,'S'.repeat(160)]));
  const body = { expectedRevision:current.state.revision,agreementHash:current.snapshot.contentHash,drafts,printedName:'N'.repeat(160),signature:'S'.repeat(160) };
  assert.ok(Buffer.byteLength(JSON.stringify(body)) > 8192);
  const saved = await request(`/api/agreements/${agreementId}/draft`,'client-a',body);
  assert.equal(saved.status,200,JSON.stringify(await saved.clone().json()));
  assert.equal((await saved.json()).state.drafts['section-99'],'S'.repeat(160));
});
test('stale concurrent writes and untrusted identity/hash/section fields are rejected', async () => {
  const {agreementId} = await assigned();
  const current = await view(agreementId);
  const body = {expectedRevision:current.state.revision,agreementHash:current.snapshot.contentHash,value:'AM'};
  const responses = await Promise.all([request(`/api/agreements/${agreementId}/sections/first`,'client-a',body),request(`/api/agreements/${agreementId}/sections/first`,'client-a',body)]);
  assert.deepEqual(responses.map(result => result.status).sort(),[200,409]);
  assert.equal((await request(`/api/agreements/${agreementId}/sections/first`,'client-a',{...body,clientId:'client-b',recordedAt:'2000-01-01'})).status,400);
  assert.equal((await request(`/api/agreements/${agreementId}/sections/first`,'client-a',{...body,agreementHash:'wrong'})).status,409);
  assert.equal((await request(`/api/agreements/${agreementId}/sections/unknown`,'client-a',{...body,expectedRevision:(await view(agreementId)).state.revision})).status,404);
});