const acknowledgmentTypes = new Set(['none', 'initials', 'signature']);

export function validateTemplate(template) {
  if (!template || typeof template.title !== 'string' || !template.title.trim() ||
      typeof template.version !== 'string' || !template.version.trim() ||
      !Array.isArray(template.sections) || !template.sections.length) {
    throw new Error('A title, version, and contract sections are required.');
  }
  const identifiers = new Set();
  const orders = new Set();
  for (const section of template.sections) {
    if (!/^[a-z][a-z0-9-]{0,79}$/.test(section.sectionId) || identifiers.has(section.sectionId) ||
        !Number.isInteger(section.order) || section.order < 0 || orders.has(section.order) ||
        typeof section.heading !== 'string' || !section.heading.trim() ||
        typeof section.content !== 'string' || !section.content.trim() ||
        !acknowledgmentTypes.has(section.acknowledgmentType) || typeof section.required !== 'boolean' ||
        (section.acknowledgmentType === 'none' && section.required)) {
      throw new Error('Each section needs a unique ID/order, exact text, and a valid acknowledgment configuration.');
    }
    identifiers.add(section.sectionId);
    orders.add(section.order);
  }
  return template;
}

export function liveSigningAvailable(template) {
  return template?.isPlaceholder === false && template?.approval?.contract === true &&
    template?.approval?.electronicDisclosure === true &&
    typeof template?.electronicDisclosure?.content === 'string' &&
    Boolean(template.electronicDisclosure.content.trim());
}

export async function contentHash(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function createAgreementSnapshot(template, assignment) {
  validateTemplate(template);
  const sections = await Promise.all([...template.sections].sort((left, right) => left.order - right.order)
    .map(async section => {
      const exact = {
        sectionId: section.sectionId, heading: section.heading, content: section.content,
        order: section.order, acknowledgmentType: section.acknowledgmentType, required: section.required
      };
      return { ...exact, contentHash: await contentHash(exact) };
    }));
  const snapshot = {
    agreementId: assignment.agreementId, clientId: assignment.clientId,
    client: structuredClone(assignment.client), dog: structuredClone(assignment.dog),
    service: structuredClone(assignment.service), title: template.title, version: template.version,
    isPlaceholder: template.isPlaceholder !== false, approval: structuredClone(template.approval ?? {}),
    electronicDisclosure: structuredClone(template.electronicDisclosure ?? null),
    optionalConsents: structuredClone(template.optionalConsents ?? []), sections
  };
  return { ...snapshot, contentHash: await contentHash(snapshot) };
}

export function acknowledgmentMatches(snapshot, section, record) {
  return Boolean(record && record.agreementId === snapshot.agreementId &&
    record.clientId === snapshot.clientId && record.version === snapshot.version &&
    record.agreementHash === snapshot.contentHash && record.sectionId === section.sectionId &&
    record.sectionHash === section.contentHash && record.type === section.acknowledgmentType &&
    validSignatureValue(record.value, section.acknowledgmentType) &&
    typeof record.recordedAt === 'string' && Number.isFinite(Date.parse(record.recordedAt)));
}

export function validSignatureValue(value, type = 'signature') {
  return typeof value === 'string' && Boolean(value.trim()) && value.length <= (type === 'initials' ? 12 : 160) &&
    Array.from(value).every(character => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127);
}

export function acknowledgmentProgress(snapshot, acknowledgments) {
  const required = snapshot.sections.filter(section => section.required && section.acknowledgmentType !== 'none');
  return {
    required: required.length,
    completed: required.filter(section => acknowledgmentMatches(snapshot, section, acknowledgments[section.sectionId])).length
  };
}

export function finalSigningErrors(snapshot, state, submission, { simulation = false } = {}) {
  const errors = [];
  if (!simulation && !liveSigningAvailable(snapshot)) {
    errors.push({ field: 'legal-review', message: 'Real signing is blocked until the contract and electronic-signing disclosures are approved.' });
  }
  for (const section of snapshot.sections) {
    if (section.required && section.acknowledgmentType !== 'none' &&
        !acknowledgmentMatches(snapshot, section, state.acknowledgments[section.sectionId])) {
      errors.push({ field: `ack-${section.sectionId}`, message: `Record your ${section.acknowledgmentType} for ${section.heading}.` });
    }
  }
  if (!validSignatureValue(submission.printedName)) errors.push({ field: 'printed-name', message: 'Enter your final printed name.' });
  if (!validSignatureValue(submission.signature)) errors.push({ field: 'final-signature', message: 'Enter your final typed signature.' });
  if (submission.consent !== true) errors.push({ field: 'electronic-consent', message: 'Explicit electronic-signing consent is required.' });
  if (submission.intent !== true) errors.push({ field: 'signing-intent', message: 'Explicit intent to sign the complete agreement is required.' });
  return errors;
}