import { createAgreementSnapshot } from '/portal/js/agreement-model.js';
import { mountAgreement } from '/portal/js/agreement.js';
import { createPreviewStore } from './contract-preview-store.js';
import { createSimulationPdf } from './contract-preview-pdf.js';

const providers = {
  adobe: { name: 'Adobe Acrobat Sign', shortName: 'Acrobat Sign', action: 'Review with Adobe Sign', heading: 'Review and sign', stage: 'Hosted review', accent: '#b52720', summary: 'Training agreement', next: 'Next required field' }
};
const providerId = location.pathname.split('/').filter(Boolean)[0];
const provider = providers[providerId];
const main = document.getElementById('content');
let mounted;
let store;
let snapshot;

function icon(name) {
  return window.lucide.createElement(window.lucide.icons[name], { width: 18, height: 18, 'stroke-width': 1.7, 'aria-hidden': 'true', focusable: 'false' });
}
function iconLink(label, href, iconName, className = '') {
  const anchor = link(label, href, className);
  anchor.append(icon(iconName));
  return anchor;
}
function pageHeading(kicker, title, description) {
  return element('header', { class: 'page-heading' }, element('p', { class: 'eyebrow' }, kicker), element('h1', {}, title), element('p', { class: 'muted' }, description));
}
function journey(state) {
  const complete = Boolean(state.completion);
  return element('ol', { class: 'client-journey', 'aria-label': 'Enrollment progress' },
    ...[['Profile', 'Complete', true], ['Agreement', complete ? 'Demo completed' : 'Your next step', complete], ['Training', 'Scheduling pending', false]].map(([title, detail, done], index) =>
      element('li', { class: done ? 'journey-done' : index === 1 ? 'journey-current' : '' },
        element('span', { class: 'journey-marker', 'aria-hidden': 'true' }, done ? icon('Check') : String(index + 1)),
        element('div', {}, element('strong', {}, title), element('span', {}, detail)))));
}
function activity(state) {
  const labels = {
    'simulation.draft.saved': 'Draft saved on this device',
    'simulation.acknowledgment.recorded': 'Section acknowledgment recorded',
    'simulation.acknowledgment.corrected': 'Section acknowledgment updated',
    'simulation.acknowledgment.removed': 'Section acknowledgment removed',
    'simulation.optional-consent.accepted': 'Optional consent selected',
    'simulation.optional-consent.declined': 'Optional consent cleared',
    'simulation.electronic-consent.confirmed': 'Simulated electronic consent confirmed',
    'simulation.agreement.completed': 'Signing simulation completed'
  };
  const events = state.events.slice(-3).reverse();
  return element('section', { class: 'recent-activity' }, element('h2', {}, 'Recent activity'),
    events.length ? element('ol', {}, events.map(event => element('li', {}, icon('Clock3'), element('div', {},
      element('span', {}, labels[event.action] ?? 'Demo updated'), element('time', { datetime: event.recordedAt }, new Date(event.recordedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })))))) :
      element('p', { class: 'muted activity-empty' }, 'No activity yet. Your saved demo changes will appear here.'));
}

function element(tag, attributes = {}, ...children) {
  const result = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) result.setAttribute(name, value);
  for (const child of children.flat()) if (child != null) result.append(child instanceof Node ? child : String(child));
  return result;
}
function action(label, callback, className = '') {
  const button = element('button', { type: 'button', class: className }, label);
  button.addEventListener('click', callback);
  return button;
}
function link(label, href, className = '') {
  return element('a', { href, class: className }, label);
}
function facts(entries) {
  return element('dl', { class: 'facts' }, entries.flatMap(([name, value]) => [element('dt', {}, name), element('dd', {}, value)]));
}
function statusFor(state) {
  return state.completion ? 'Demo completed' : state.events.length ? 'In progress' : 'Awaiting your review';
}
async function download() {
  const library = await import('/vendor/pdf-lib.js');
  const bytes = await createSimulationPdf(snapshot, await store.load(), library);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const anchor = link('', url);
  anchor.download = `Taurus-K9-${providerId}-SIMULATION.pdf`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function downloadButton() {
  const status = element('p', { role: 'status' });
  const button = action('Download demo PDF', async () => {
    button.disabled = true;
    status.textContent = 'Preparing your document...';
    try { await download(); status.textContent = 'Demo PDF prepared.'; }
    catch (error) { status.textContent = `Download failed: ${error.message}`; }
    finally { button.disabled = false; }
  });
  button.prepend(icon('Download'));
  return element('div', { class: 'download-action' }, button, status);
}
function documentRow(state) {
  return element('section', { class: 'portal-document-row' },
    element('span', { class: 'document-symbol', 'aria-hidden': 'true' }, icon(state.completion ? 'FileCheck2' : 'FilePenLine')),
    element('div', { class: 'document-description' }, element('p', { class: 'sidebar-caption' }, 'TRAINING AGREEMENT / DRAFT-1'), element('h2', {}, 'Private Lessons Training Agreement'), element('p', { class: 'muted' }, `Prepared for Alex Morgan & Scout · ${provider.name}`)),
    element('div', { class: 'document-row-actions' }, element('span', { class: `status ${state.completion ? 'status-completed' : 'status-pending'}` }, statusFor(state)), iconLink(state.completion ? 'View demo agreement' : 'Review agreement', '#/agreement', 'ArrowUpRight', 'button')));
}
function overview(state) {
  const recorded = snapshot.sections.filter(section => section.required && state.acknowledgments[section.sectionId]).length;
  const required = snapshot.sections.filter(section => section.required).length;
  main.append(pageHeading('YOUR TRAINING JOURNEY', 'Welcome back, Alex.', 'A little progress today. A stronger partnership tomorrow.'),
    element('section', { class: 'training-summary', 'aria-label': 'Training enrollment' },
      element('div', { class: 'training-identity' }, element('span', { class: 'pet-mark', 'aria-hidden': 'true' }, icon('PawPrint')),
        element('div', {}, element('h2', {}, 'Scout'), element('p', {}, 'Labrador mix · Private Lessons'))),
      facts([['Program', 'Private Lessons'], ['Acknowledgments', `${recorded} of ${required} recorded`], ['Signing provider', provider.name]])),
    journey(state),
    element('div', { class: 'section-heading' }, element('h2', {}, state.completion ? 'Your agreement' : 'Ready when you are'), iconLink('All documents', '#/documents', 'ArrowRight')),
    documentRow(state),
    element('div', { class: 'overview-bottom' }, activity(state), element('section', { class: 'training-details' }, element('h2', {}, 'Enrollment details'), facts([['Client', 'Alex Morgan'], ['Training partner', 'Scout'], ['Scheduling', state.completion ? 'Not scheduled' : 'Pending agreement review']]), element('p', { class: 'connection-note' }, 'Fictional enrollment. No appointments or payments are booked.'))));
}
function agreement(state) {
  main.append(pageHeading('MY AGREEMENT', provider.heading, `${provider.name} / ${statusFor(state)}`), journey(state));
  const details = element('section', { class: 'handoff-summary' },
    element('div', { class: 'document-cover', 'aria-hidden': 'true' }, icon('FilePenLine'), element('span', {}, 'TAURUS K9 / CLIENT AGREEMENT'), element('strong', {}, 'Better together.'), element('span', {}, 'Private Lessons · DRAFT-1')),
    element('h2', {}, provider.summary), facts([['Document', 'Private Lessons Training Agreement'], ['Client', 'Alex Morgan'], ['Dog', 'Scout / Labrador mix'], ['Version', 'DRAFT-1'], ['Required', '2 initials, 1 section signature, final signature']]));
  const launch = element('section', { class: 'provider-launch' },
    element('span', { class: 'provider-wordmark' }, provider.shortName),
    element('h2', {}, state.completion ? 'Your demo is complete' : 'Ready for your review'),
    element('p', { class: 'sender-line' }, icon('ShieldCheck'), 'Prepared by Taurus K9 LLC'),
    element('ul', { class: 'review-checklist' }, element('li', {}, icon('Check'), 'Review all four contract sections'), element('li', {}, icon('Check'), 'Record each required acknowledgment'), element('li', {}, icon('Check'), 'Confirm consent and final signature')),
    iconLink(state.completion ? 'View completed demo' : provider.action, '#/sign', 'ArrowUpRight', 'button'),
    element('p', { class: 'connection-note' }, 'Local signing simulation · No provider connection'));
  main.append(element('div', { class: 'handoff-layout' }, details, launch));
  main.append(element('details', { class: 'proposal-outline' }, element('summary', {}, `Agreement sections (${snapshot.sections.length})`), element('ol', {}, snapshot.sections.map(section => element('li', {}, section.heading)))));
  if (state.completion) main.append(downloadButton());
}
function nextField(workspace) {
  const acknowledgment = [...workspace.querySelectorAll('.agreement-acknowledgment input')].find(input => !input.closest('section').querySelector('.agreement-recorded'));
  const finalField = [...workspace.querySelectorAll('.agreement-final input')].find(input => input.type === 'checkbox' ? !input.checked : !input.value.trim());
  const target = acknowledgment ?? finalField ?? workspace.querySelector('.agreement-final-button, #completion-title');
  target?.scrollIntoView({ behavior: 'auto', block: 'center' });
  target?.focus({ preventScroll: true });
}
async function signing() {
  document.body.classList.add('signing-active');
  const workspace = element('div', { class: 'provider-document' });
  const next = action(provider.next, () => {
    if (workspace.querySelector('.agreement-completion')) location.hash = '#/documents';
    else nextField(workspace);
  });
  next.append(icon('ArrowRight'));
  const toolbar = element('header', { class: 'provider-toolbar' },
    element('div', {}, element('strong', { class: 'provider-wordmark' }, provider.shortName), element('span', {}, `${provider.stage} · Local simulation`)),
    element('div', { class: 'agreement-actions' }, iconLink('Return to portal', '#/agreement', 'ArrowLeft'), next));
  const progress = element('p', { class: 'context-progress', role: 'status' }, '0 of 3 recorded');
  const outline = element('nav', { class: 'document-outline', 'aria-label': 'Agreement sections' },
    ...snapshot.sections.map((section, index) => {
      const button = action('', () => {
        const heading = workspace.querySelector(`#heading-${section.sectionId}`);
        if (heading) { heading.tabIndex = -1; heading.scrollIntoView({ block: 'center' }); heading.focus({ preventScroll: true }); }
      });
      button.dataset.section = section.sectionId;
      button.append(element('span', { class: 'outline-index', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')), element('span', {}, `Section ${index + 1}`), icon(section.acknowledgmentType === 'none' ? 'FileText' : 'Circle'));
      return button;
    }));
  const context = element('aside', { class: 'signing-context', 'aria-label': provider.summary },
    element('p', { class: 'sidebar-caption' }, 'DOCUMENT DETAILS'),
    element('h2', {}, provider.summary), element('p', {}, 'Private Lessons'), progress, outline,
    facts([['From', 'Taurus K9 LLC'], ['To', 'Alex Morgan'], ['Dog', 'Scout'], ['Version', 'DRAFT-1']]),
    element('p', { class: 'connection-note' }, 'Illustrative provider workflow. No document has been sent to a signing service.'));
  main.append(toolbar, element('div', { class: 'signing-layout' }, context, workspace));
  const transport = {
    ...store,
    async complete(submission, idempotencyKey) {
      const state = await store.complete(submission, idempotencyKey);
      document.getElementById('portal-status').textContent = `${provider.name} demo completed. No real signing occurred.`;
      return state;
    }
  };
  const agreementMount = await mountAgreement({ root: workspace, snapshot, transport, simulation: true, onDownload: download });
  function updateContext() {
    const meter = workspace.querySelector('#agreement-progress');
    const message = workspace.querySelector('.agreement-completion') ? 'Demo completed' : `${meter?.value ?? 0} of ${meter?.max ?? 3} recorded`;
    if (progress.textContent !== message) progress.textContent = message;
    for (const button of outline.querySelectorAll('button')) {
      const section = workspace.querySelector(`#heading-${button.dataset.section}`)?.closest('section');
      const recorded = Boolean(section?.querySelector('.agreement-recorded'));
      button.dataset.recorded = String(recorded);
      const label = button.querySelector('span:not(.outline-index)').textContent;
      button.setAttribute('aria-label', `${label}: ${section?.querySelector('h2')?.textContent ?? 'Agreement section'}${recorded ? ', acknowledgment recorded' : ''}`);
      const marker = button.querySelector('svg');
      if (recorded && marker?.dataset.lucide !== 'check') {
        const check = icon('Check');
        check.dataset.lucide = 'check';
        marker?.replaceWith(check);
      } else if (!recorded && marker?.dataset.lucide === 'check') marker.replaceWith(icon('Circle'));
    }
    if (workspace.querySelector('.agreement-completion')) next.replaceChildren('View documents', icon('ArrowRight'));
  }
  updateContext();
  const observer = new MutationObserver(updateContext);
  observer.observe(workspace, { childList: true, subtree: true });
  mounted = { ...agreementMount, dispose() { observer.disconnect(); agreementMount.dispose(); } };
}
function documents(state) {
  main.append(pageHeading('DOCUMENT LIBRARY', 'Your documents', `Alex Morgan & Scout / ${provider.name}`));
  if (state.completion) {
    main.append(documentRow(state), element('p', {}, `Demo completion: ${state.completion.completedAt}. This is not an executed contract.`), downloadButton());
  } else main.append(element('div', { class: 'documents-empty' }, element('span', { class: 'empty-symbol', 'aria-hidden': 'true' }, icon('FolderOpen')), element('h2', {}, 'No completed demo documents yet'), element('p', { class: 'muted' }, 'Your agreement will be available here after the signing simulation is complete.'), iconLink('Review your agreement', '#/agreement', 'ArrowRight', 'button')));
  main.append(activity(state));
}
async function render() {
  mounted?.dispose();
  mounted = null;
  main.classList.remove('agreement-document');
  document.body.classList.remove('signing-active');
  main.setAttribute('aria-busy', 'true');
  main.replaceChildren();
  const route = location.hash.slice(2) || 'home';
  document.querySelectorAll('[data-route]').forEach(anchor => {
    if (anchor.dataset.route === (route === 'sign' ? 'agreement' : route)) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
  const state = await store.load();
  if (route === 'sign') await signing();
  else if (route === 'agreement') agreement(state);
  else if (route === 'documents') documents(state);
  else overview(state);
  main.setAttribute('aria-busy', 'false');
  document.getElementById('portal-status').textContent = `${provider.name} portal / ${route} / local prototype`;
}
function showFailure(error) {
  main.replaceChildren(element('p', { role: 'alert' }, `Preview unavailable: ${error.message}. No real signing occurred.`));
  main.setAttribute('aria-busy', 'false');
}
async function start() {
  if (!provider) throw new Error('Unknown provider portal.');
  document.body.dataset.provider = providerId;
  document.body.style.setProperty('--provider-accent', provider.accent);
  document.title = `${provider.name} client portal preview | Taurus K9`;
  document.getElementById('provider-name').textContent = provider.name;
  for (const [route, name] of [['home', 'House'], ['agreement', 'FilePenLine'], ['documents', 'FolderClosed']]) document.querySelector(`[data-route="${route}"]`).prepend(icon(name));
  document.getElementById('reset-provider').prepend(icon('RotateCcw'));
  const response = await fetch('/draft-contract.json');
  if (!response.ok) throw new Error('Draft contract is unavailable.');
  snapshot = await createAgreementSnapshot(await response.json(), {
    agreementId: `simulation-${providerId}-agreement`, clientId: 'fictional-client',
    client: { name: 'Alex Morgan' }, dog: { name: 'Scout', breed: 'Labrador mix' }, service: { name: 'Private Lessons' }
  });
  const isolatedStorage = {
    getItem: key => localStorage.getItem(`${providerId}:${key}`),
    setItem: (key, value) => localStorage.setItem(`${providerId}:${key}`, value),
    removeItem: key => localStorage.removeItem(`${providerId}:${key}`)
  };
  store = createPreviewStore(snapshot, isolatedStorage);
  document.getElementById('reset-provider').addEventListener('click', async () => {
    if (!confirm(`Reset this ${provider.name} demo? Saved drafts and completed simulation documents in this portal will be removed. Other portals will not change.`)) return;
    try { await store.reset(); await render(); main.focus(); }
    catch (error) { showFailure(error); }
  });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (anchor && mounted?.hasUnsavedChanges() && !confirm('Leave without saving the current draft changes?')) event.preventDefault();
  });
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); });
  window.addEventListener('hashchange', () => { render().then(() => main.focus()).catch(showFailure); });
  await render();
}
start().catch(showFailure);