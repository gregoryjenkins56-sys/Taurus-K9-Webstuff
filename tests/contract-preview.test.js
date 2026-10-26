import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { request } from 'node:http';
import * as library from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createAgreementSnapshot } from '../portal/js/agreement-model.js';
import { createPreviewServer } from '../scripts/preview-contract.mjs';
import { createSimulationPdf } from './fixtures/contract-preview-pdf.js';
import { createPreviewStore } from './fixtures/contract-preview-store.js';
import { createProviderTemplate, signingProviders } from './fixtures/provider-templates.js';

test('Adobe draft templates preserve text and map blank signer fields', async () => {
  assert.deepEqual(Object.keys(signingProviders), ['adobe']);
  const template = JSON.parse(await readFile(new URL('../server/contracts/training-contract.draft.json', import.meta.url), 'utf8'));
  template.sections[0].content = `${'Preserved contract wording. '.repeat(200)}\nSecond paragraph.`;
  for (const provider of Object.keys(signingProviders)) {
    const { bytes, mapping } = await createProviderTemplate(template, provider, library);
    assert.equal(mapping.provider, provider);
    assert.equal(mapping.readyToSend, false);
    const document = await library.PDFDocument.load(bytes);
    assert.ok(document.getPageCount() > 1);
    assert.equal(document.getForm().getFields().length, mapping.fields.length);
    for (const field of mapping.fields) {
      assert.equal(field.recipientRole, 'Client');
      assert.ok(field.page >= 1 && field.page <= document.getPageCount());
      assert.ok(field.bounds.y >= 54);
      const control = document.getForm().getField(field.name);
      if (field.type === 'checkbox') assert.equal(control.isChecked(), false);
      else assert.equal(control.getText(), undefined);
    }
    for (const section of template.sections.filter(item => item.acknowledgmentType !== 'none')) {
      const field = mapping.fields.find(item => item.sectionId === section.sectionId);
      assert.equal(field.type, section.acknowledgmentType);
      assert.equal(field.required, section.required);
    }
    assert.equal(mapping.fields.find(item => item.consentId).required, false);
    assert.equal(mapping.fields.find(item => item.name === 'signed_at').source, 'provider');
    const parsed = await getDocument({ data: bytes, useSystemFonts: true }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= parsed.numPages; pageNumber += 1) {
      const content = await (await parsed.getPage(pageNumber)).getTextContent();
      pages.push(content.items.filter(item => item.str !== 'DRAFT - NOT FOR SIGNING' && item.str !== `${mapping.providerName} / ${template.version}`).map(item => item.str).join(' '));
    }
    const text = pages.join(' ').replace(/\s+/g, ' ');
    for (const section of template.sections) assert.ok(text.includes(section.content.replace(/\s+/g, ' ')));
    assert.match(document.getTitle(), /DRAFT/);
    await parsed.cleanup?.();
  }
  await assert.rejects(createProviderTemplate(template, 'unknown', library), /Unknown/);
  await assert.rejects(createProviderTemplate({ ...template, isPlaceholder: false }, 'adobe', library), /Only draft/);
});

test('preview serves only explicit fixture assets, not APIs, source, or arbitrary files', async context => {
  const server = createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  context.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const shell = await fetch(origin);
  assert.equal(shell.status, 200);
  assert.match(await shell.text(), /Simulation only/);
  assert.equal(shell.headers.get('cache-control'), 'no-store');
  assert.equal((await fetch(`${origin}/vendor/pdf-lib.js`)).status, 200);
  assert.equal((await fetch(`${origin}/adobe/`)).status, 200);
  for (const path of ['/docusign', '/docusign/', '/pandadoc', '/pandadoc/']) {
    assert.equal((await fetch(`${origin}${path}`)).status, 404, path);
  }
  for (const path of ['/api/me', '/api/agreements', '/server/worker/auth.ts', '/package.json', '/.dev.vars', '/migrations/0001_foundation.sql']) {
    assert.equal((await fetch(`${origin}${path}`)).status, 404, path);
  }
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
  const foreignHostStatus = await new Promise((resolve, reject) => {
    const probe = request(origin, { headers: { host: 'example.invalid' } }, response => {
      response.resume();
      resolve(response.statusCode);
    });
    probe.on('error', reject);
    probe.end();
  });
  assert.equal(foreignHostStatus, 403);
});

test('sample PDF preserves sections and acknowledgment placement with a marked completion record', async () => {
  const template = JSON.parse(await readFile(new URL('../server/contracts/training-contract.draft.json', import.meta.url), 'utf8'));
  template.sections[0].content = `${'Long section text retained in the sample document. '.repeat(150)}\nSecond paragraph remains present.`;
  const snapshot = await createAgreementSnapshot(template, {
    agreementId: 'simulation-agreement-01', clientId: 'fictional-client',
    client: { name: 'Alex Morgan' }, dog: { name: 'Scout', breed: 'Labrador mix' }, service: { name: 'Private Lessons' }
  });
  const store = createPreviewStore(snapshot, { getItem: () => null, setItem() {}, removeItem() {} });
  for (const section of snapshot.sections.filter(item => item.required)) await store.acknowledge(section.sectionId, section.acknowledgmentType === 'initials' ? 'AM' : 'Alex Morgan');
  const state = await store.complete({ printedName: 'Alex Morgan', signature: 'Alex Morgan', consent: true, intent: true }, 'pdf-test');
  const bytes = await createSimulationPdf(snapshot, state, library);
  const pdf = await getDocument({ data: bytes, useSystemFonts: true }).promise;
  assert.ok(pdf.numPages > 1);
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const content = await (await pdf.getPage(pageNumber)).getTextContent();
    const items = content.items.filter(item => item.str);
    assert.ok(items.some(item => item.str === 'SIMULATION - DRAFT - NOT FOR SIGNING'));
    for (const item of items) assert.ok(item.transform[5] >= 28 && item.transform[5] <= 805, 'Text stays within printable page bounds');
    pages.push(items.filter(item => item.str !== 'SIMULATION - DRAFT - NOT FOR SIGNING' && !item.str.startsWith('SIMULATION ONLY |')).map(item => item.str).join(' '));
  }
  const text = pages.join(' ').replace(/\s+/g, ' ');
  let previous = -1;
  for (const section of snapshot.sections) {
    const heading = text.indexOf(section.heading, previous + 1);
    assert.ok(heading > previous);
    const body = section.content.replace(/\s+/g, ' ');
    assert.ok(text.includes(body));
    if (section.required) {
      const label = section.acknowledgmentType === 'initials' ? 'Initials: AM' : 'Section signature: Alex Morgan';
      const acknowledgment = text.indexOf(label, heading);
      const nextHeading = snapshot.sections.find(item => item.order > section.order)?.heading;
      assert.ok(acknowledgment > heading);
      if (nextHeading) assert.ok(acknowledgment < text.indexOf(nextHeading, heading));
    }
    previous = heading;
  }
  for (const value of [snapshot.version, snapshot.contentHash, state.completion.completedAt, 'Final simulated signature', 'Typed signature: Alex Morgan', 'Simulation completion record']) assert.ok(text.includes(value), value);
  await pdf.cleanup?.();
});