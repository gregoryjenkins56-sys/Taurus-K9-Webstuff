import {
  finalSigningErrors, validSignatureValue, contentHash
} from '../../portal/js/agreement-model.js';

export function createPreviewStore(agreement, storage, clock = () => new Date().toISOString()) {
  const snapshot = structuredClone(agreement);
  const key = `taurus-k9:simulation-only:${snapshot.contentHash}`;
  const initial = () => ({
    agreementHash: snapshot.contentHash, revision: 0, acknowledgments: {}, optionalConsents: {},
    drafts: {}, printedName: '', signature: '', events: [], completion: null, savedAt: null
  });
  let state = initial();
  const persisted = storage.getItem(key);
  if (persisted) {
    try {
      const parsed = JSON.parse(persisted);
      if (parsed.agreementHash === snapshot.contentHash && parsed.acknowledgments && parsed.drafts && Array.isArray(parsed.events)) state = parsed;
    } catch { state = initial(); }
  }
  function commit(next) {
    next.revision = state.revision + 1;
    next.savedAt = clock();
    storage.setItem(key, JSON.stringify(next));
    state = next;
    return structuredClone(state);
  }
  function editable() {
    if (state.completion) throw new Error('This simulated completion is locked. Reset the simulation to start again.');
    return structuredClone(state);
  }
  function sectionFor(sectionId) {
    const section = snapshot.sections.find(item => item.sectionId === sectionId);
    if (!section || section.acknowledgmentType === 'none') throw new Error('Unknown acknowledgment section.');
    return section;
  }
  function event(next, action, sectionId = null) {
    next.events.push({ id: crypto.randomUUID(), action, sectionId, recordedAt: clock(), simulation: true });
  }
  return {
    async load() { return structuredClone(state); },
    async saveDraft(draft) {
      const next = editable();
      next.drafts = structuredClone(draft.drafts);
      next.printedName = draft.printedName;
      next.signature = draft.signature;
      event(next, 'simulation.draft.saved');
      return commit(next);
    },
    async acknowledge(sectionId, value) {
      const next = editable();
      const section = sectionFor(sectionId);
      if (!validSignatureValue(value, section.acknowledgmentType)) throw new Error('Enter a valid typed acknowledgment.');
      const previous = next.acknowledgments[sectionId];
      const record = {
        agreementId: snapshot.agreementId, clientId: snapshot.clientId, version: snapshot.version,
        agreementHash: snapshot.contentHash, sectionId, sectionHash: section.contentHash,
        type: section.acknowledgmentType, value: value.trim(), recordedAt: clock(), simulation: true
      };
      next.acknowledgments[sectionId] = record;
      next.drafts[sectionId] = record.value;
      event(next, previous ? 'simulation.acknowledgment.corrected' : 'simulation.acknowledgment.recorded', sectionId);
      return commit(next);
    },
    async remove(sectionId) {
      const next = editable();
      sectionFor(sectionId);
      delete next.acknowledgments[sectionId];
      delete next.drafts[sectionId];
      event(next, 'simulation.acknowledgment.removed', sectionId);
      return commit(next);
    },
    async setOptionalConsent(consentId, accepted) {
      const next = editable();
      if (!snapshot.optionalConsents.some(item => item.consentId === consentId) || typeof accepted !== 'boolean') throw new Error('Unknown optional consent.');
      next.optionalConsents[consentId] = { accepted, recordedAt: clock() };
      event(next, accepted ? 'simulation.optional-consent.accepted' : 'simulation.optional-consent.declined');
      return commit(next);
    },
    async complete(submission, idempotencyKey) {
      if (!idempotencyKey) throw new Error('A submission identifier is required.');
      const digest = await contentHash(submission);
      if (state.completion) {
        if (state.completion.idempotencyKey === idempotencyKey && state.completion.submissionHash === digest) return structuredClone(state);
        throw new Error('This simulation is already completed.');
      }
      const errors = finalSigningErrors(snapshot, state, submission, { simulation: true });
      if (errors.length) throw new Error(errors.map(error => error.message).join(' '));
      const next = editable();
      next.printedName = submission.printedName.trim();
      next.signature = submission.signature.trim();
      next.completion = {
        simulation: true, id: crypto.randomUUID(), agreementHash: snapshot.contentHash,
        printedName: next.printedName, signature: next.signature,
        consent: true, intent: true, disclosureVersion: snapshot.electronicDisclosure?.version,
        completedAt: clock(), idempotencyKey, submissionHash: digest
      };
      event(next, 'simulation.electronic-consent.confirmed');
      event(next, 'simulation.agreement.completed');
      return commit(next);
    },
    async reset() {
      storage.removeItem(key);
      state = initial();
      return structuredClone(state);
    }
  };
}