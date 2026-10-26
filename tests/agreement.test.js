import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  acknowledgmentProgress, createAgreementSnapshot, finalSigningErrors, liveSigningAvailable, validateTemplate
} from '../portal/js/agreement-model.js';
import { createPreviewStore } from './fixtures/contract-preview-store.js';

const template = JSON.parse(await readFile(new URL('../server/contracts/training-contract.draft.json', import.meta.url), 'utf8'));
const assignment = {
  agreementId: 'simulation-agreement-01', clientId: 'fictional-client',
  client: { name: 'Alex Morgan' }, dog: { name: 'Scout', breed: 'Labrador mix' },
  service: { name: 'Private Lessons', enrollmentId: 'fictional-enrollment' }
};
const snapshot = await createAgreementSnapshot(template, assignment);
const submission = { printedName: 'Alex Morgan', signature: 'Alex Morgan', consent: true, intent: true };

function evidence(section) {
  return {
    agreementId: snapshot.agreementId, clientId: snapshot.clientId, version: snapshot.version,
    agreementHash: snapshot.contentHash, sectionId: section.sectionId, sectionHash: section.contentHash,
    type: section.acknowledgmentType, value: section.acknowledgmentType === 'initials' ? 'AM' : 'Alex Morgan',
    recordedAt: '2026-10-23T12:00:00.000Z'
  };
}
function completedState() {
  return { acknowledgments: Object.fromEntries(snapshot.sections.filter(section => section.required).map(section => [section.sectionId, evidence(section)])) };
}

test('draft and missing approved disclosures always block real signing', () => {
  assert.equal(liveSigningAvailable(snapshot), false);
  assert.ok(finalSigningErrors(snapshot, completedState(), submission).some(error => error.field === 'legal-review'));
  assert.deepEqual(finalSigningErrors(snapshot, completedState(), submission, { simulation: true }), []);
});
test('missing initials and section signature each block completion', () => {
  const errors = finalSigningErrors(snapshot, { acknowledgments: {} }, submission, { simulation: true });
  assert.equal(errors.length, 3);
  assert.deepEqual(acknowledgmentProgress(snapshot, {}), { required: 3, completed: 0 });
});
test('printed name, final signature, consent and intent are independently required', () => {
  for (const field of ['printedName', 'signature', 'consent', 'intent']) {
    const value = { ...submission, [field]: typeof submission[field] === 'boolean' ? false : '' };
    assert.equal(finalSigningErrors(snapshot, completedState(), value, { simulation: true }).length, 1);
  }
});
test('optional consents are not a condition of completion', () => {
  assert.deepEqual(finalSigningErrors(snapshot, { ...completedState(), optionalConsents: {} }, submission, { simulation: true }), []);
});
test('evidence must match agreement, client, version, section, type and hashes', () => {
  const section = snapshot.sections[1];
  for (const field of ['agreementId', 'clientId', 'version', 'sectionId', 'agreementHash', 'sectionHash', 'type']) {
    const state = completedState();
    state.acknowledgments[section.sectionId][field] = 'wrong';
    assert.equal(acknowledgmentProgress(snapshot, state.acknowledgments).completed, 2, field);
  }
});
test('snapshot preserves exact text and is detached from later template edits', async () => {
  const draft = structuredClone(template);
  draft.sections[0].content = 'Exact first line.\n\nSecond paragraph: <script>not HTML</script>.';
  const issued = await createAgreementSnapshot(draft, assignment);
  assert.equal(issued.sections[0].content, draft.sections[0].content);
  draft.sections[0].content = 'Changed';
  assert.notEqual(issued.sections[0].content, draft.sections[0].content);
  assert.notEqual((await createAgreementSnapshot(draft, assignment)).contentHash, issued.contentHash);
});
test('invalid section configuration is rejected', () => {
  for (const change of [{ sectionId: 'section-02' }, { order: 2 }, { required: true }, { acknowledgmentType: 'automatic' }]) {
    const draft = structuredClone(template);
    Object.assign(draft.sections[0], change);
    assert.throws(() => validateTemplate(draft));
  }
});

function memoryStorage() {
  const entries = new Map();
  return { getItem: key => entries.get(key), setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
}
async function readyStore(storage = memoryStorage()) {
  const store = createPreviewStore(snapshot, storage);
  for (const section of snapshot.sections.filter(item => item.required)) await store.acknowledge(section.sectionId, evidence(section).value);
  return store;
}
test('save and resume retains explicitly recorded and unrecorded draft values separately', async () => {
  const storage = memoryStorage();
  const store = createPreviewStore(snapshot, storage);
  await store.acknowledge('section-02', 'AM');
  await store.saveDraft({ drafts: { 'section-02': 'AM', 'section-03': 'XX' }, printedName: 'Alex', signature: '' });
  const resumed = await createPreviewStore(snapshot, storage).load();
  assert.equal(resumed.drafts['section-03'], 'XX');
  assert.equal(resumed.acknowledgments['section-03'], undefined);
  assert.equal(resumed.printedName, 'Alex');
  assert.equal(acknowledgmentProgress(snapshot, resumed.acknowledgments).completed, 1);
});
test('correction and removal change current evidence and retain event history', async () => {
  const store = createPreviewStore(snapshot, memoryStorage());
  await store.acknowledge('section-02', 'AM');
  await store.acknowledge('section-02', 'AX');
  const updated = await store.load();
  assert.equal(updated.acknowledgments['section-02'].value, 'AX');
  assert.equal(updated.events.at(-1).action, 'simulation.acknowledgment.corrected');
  await store.remove('section-02');
  assert.equal((await store.load()).acknowledgments['section-02'], undefined);
  assert.equal((await store.load()).events.length, 3);
});
test('identical final retries are idempotent and completed state rejects edits', async () => {
  const store = await readyStore();
  const result = await store.complete(submission, 'submission-01');
  assert.deepEqual(await store.complete(submission, 'submission-01'), result);
  await assert.rejects(store.complete({ ...submission, signature: 'Other' }, 'submission-01'));
  await assert.rejects(store.complete(submission, 'submission-02'));
  await assert.rejects(store.acknowledge('section-02', 'AX'));
  await assert.rejects(store.remove('section-02'));
  await assert.rejects(store.setOptionalConsent('optional-example', true));
  assert.equal(result.events.filter(item => item.action === 'simulation.agreement.completed').length, 1);
});
test('failed simulated finalization leaves no partial completion', async () => {
  const storage = memoryStorage();
  const store = await readyStore(storage);
  const before = await store.load();
  storage.setItem = () => { throw new Error('Simulated storage failure'); };
  await assert.rejects(store.complete(submission, 'submission-01'), /storage failure/);
  assert.deepEqual(await store.load(), before);
});
test('a new version starts with fresh acknowledgments', async () => {
  const storage = memoryStorage();
  await readyStore(storage);
  const nextTemplate = structuredClone(template);
  nextTemplate.version = 'DRAFT-2';
  const next = await createAgreementSnapshot(nextTemplate, assignment);
  assert.deepEqual((await createPreviewStore(next, storage).load()).acknowledgments, {});
});