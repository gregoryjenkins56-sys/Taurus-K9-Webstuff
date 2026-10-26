import { createAgreementSnapshot } from '/portal/js/agreement-model.js';
import { mountAgreement } from '/portal/js/agreement.js';
import { createPreviewStore } from './contract-preview-store.js';
import { createSimulationPdf } from './contract-preview-pdf.js';
import { createProviderTemplate, signingProviders } from './provider-templates.js';

const main = document.getElementById('content');
let mounted;
let store;
let snapshot;
let template;

function downloadFile(bytes, type, filename) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function renderProviderTemplates() {
  main.replaceChildren();
  const title = document.createElement('h1');
  title.textContent = 'Provider Templates';
  const notice = document.createElement('p');
  notice.className = 'agreement-draft-banner';
  notice.textContent = 'Draft - Not for signing. Approved contract text and provider configuration are pending. No documents will be sent.';
  main.append(title, notice);
  for (const [provider, name] of Object.entries(signingProviders)) {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = name;
    const actions = document.createElement('div');
    actions.className = 'agreement-actions';
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    for (const format of ['PDF', 'Field map']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `Download ${name} ${format}`;
      button.addEventListener('click', async () => {
        button.disabled = true;
        status.textContent = 'Preparing draft...';
        try {
          const library = await import('/vendor/pdf-lib.js');
          const result = await createProviderTemplate(template, provider, library);
          const pdf = format === 'PDF';
          downloadFile(pdf ? result.bytes : JSON.stringify(result.mapping, null, 2), pdf ? 'application/pdf' : 'application/json', `Taurus-K9-${provider}-DRAFT.${pdf ? 'pdf' : 'json'}`);
          status.textContent = 'Draft download prepared. Not sent for signing.';
        } catch (error) {
          status.textContent = `Download failed: ${error.message}`;
        } finally {
          button.disabled = false;
        }
      });
      actions.append(button);
    }
    section.append(heading, actions, status);
    main.append(section);
  }
}

async function download() {
  const library = await import('/vendor/pdf-lib.js');
  const state = await store.load();
  const bytes = await createSimulationPdf(snapshot, state, library);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Taurus-K9-SIMULATION-NOT-FOR-SIGNING.pdf';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
async function render() {
  mounted?.dispose();
  main.setAttribute('aria-busy', 'true');
  const documents = location.hash === '#/documents';
  const templates = location.hash === '#/templates';
  document.querySelectorAll('[data-view]').forEach(anchor => {
    if (anchor.dataset.view === (templates ? 'templates' : documents ? 'documents' : 'agreement')) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
  if (templates) {
    renderProviderTemplates();
    mounted = null;
  } else if (documents) {
    main.replaceChildren();
    const title = document.createElement('h1');
    title.textContent = 'Completed Documents';
    const notice = document.createElement('p');
    notice.className = 'agreement-draft-banner';
    notice.textContent = 'Simulation - Draft - Not for signing. No real completed agreements are stored here.';
    main.append(title, notice);
    const state = await store.load();
    if (state.completion) {
      const section = document.createElement('section');
      section.className = 'card';
      const heading = document.createElement('h2');
      heading.textContent = 'Training Agreement / DRAFT-1';
      const details = document.createElement('p');
      details.textContent = `Fictional client: Alex Morgan / Scout. Simulation completed: ${state.completion.completedAt}`;
      const link = document.createElement('a');
      link.href = '#/agreement';
      link.textContent = 'View completed simulation';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Download simulated agreement PDF';
      button.addEventListener('click', () => download().catch(error => { details.textContent = `Download failed: ${error.message}`; }));
      const actions = document.createElement('div');
      actions.className = 'agreement-actions';
      actions.append(link, button);
      section.append(heading, details, actions);
      main.append(section);
    } else {
      const empty = document.createElement('p');
      empty.textContent = 'No completed simulations yet.';
      main.append(empty);
    }
    mounted = null;
  } else {
    mounted = await mountAgreement({ root: main, snapshot, transport: store, simulation: true, onDownload: download });
  }
  main.setAttribute('aria-busy', 'false');
  document.getElementById('route-status').textContent = templates ? 'Provider draft templates.' : documents ? 'Completed documents simulation.' : 'Training agreement simulation.';
}
async function start() {
  const response = await fetch('/draft-contract.json');
  if (!response.ok) throw new Error('Cannot load the draft contract fixture.');
  template = await response.json();
  snapshot = await createAgreementSnapshot(template, {
    agreementId: 'simulation-agreement-01', clientId: 'fictional-client',
    client: { name: 'Alex Morgan' }, dog: { name: 'Scout', breed: 'Labrador mix' },
    service: { name: 'Private Lessons', enrollmentId: 'fictional-enrollment' }
  });
  store = createPreviewStore(snapshot, localStorage);
  document.getElementById('reset-simulation').addEventListener('click', async () => {
    await store.reset();
    await render();
    main.focus();
  });
  document.querySelectorAll('[data-view]').forEach(anchor => anchor.addEventListener('click', event => {
    if (mounted?.hasUnsavedChanges() && !confirm('Leave without saving the current draft changes?')) event.preventDefault();
  }));
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); });
  window.addEventListener('hashchange', () => { render().catch(showFailure); });
  await render();
}
function showFailure(error) {
  main.replaceChildren();
  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = `Preview unavailable: ${error.message}. No real signing occurred.`;
  main.append(message);
  main.setAttribute('aria-busy', 'false');
}
start().catch(showFailure);