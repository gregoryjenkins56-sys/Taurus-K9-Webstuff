import { acknowledgmentProgress, finalSigningErrors, liveSigningAvailable } from './agreement-model.js';

function node(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  for (const child of children.flat()) if (child !== null && child !== undefined) element.append(child instanceof Node ? child : document.createTextNode(String(child)));
  return element;
}
function button(label, action, attributes = {}) {
  const element = node('button', { type: 'button', ...attributes }, label);
  element.addEventListener('click', action);
  return element;
}
function timestamp(value) {
  return node('time', { datetime: value }, new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
}
function facts(entries) {
  return node('dl', { class: 'agreement-facts' }, ...entries.flatMap(([label, value]) => [node('dt', {}, label), node('dd', {}, value)]));
}

export async function mountAgreement({ root, snapshot, transport, simulation = false, onDownload }) {
  let state = await transport.load();
  let busy = false;
  let drafts = { ...state.drafts };
  let printedName = state.printedName ?? '';
  let signature = state.signature ?? '';
  let consent = false;
  let intent = false;
  let dirty = false;
  const submissionId = crypto.randomUUID();
  const liveBlocked = !simulation && !liveSigningAvailable(snapshot);
  const announce = message => {
    const status = root.querySelector('[data-save-status]');
    if (status) status.textContent = message;
  };
  function change() {
    dirty = true;
    announce('Unsaved changes');
  }
  const beforeUnload = event => {
    if (dirty && !state.completion) { event.preventDefault(); event.returnValue = ''; }
  };
  window.addEventListener('beforeunload', beforeUnload);

  async function perform(action, message, focusId) {
    if (busy) return;
    busy = true;
    root.setAttribute('aria-busy', 'true');
    root.querySelectorAll('button, input').forEach(element => { element.disabled = true; });
    announce('Saving...');
    try {
      state = await action();
      dirty = Object.keys({ ...drafts, ...state.drafts }).some(id => (drafts[id] ?? '') !== (state.drafts[id] ?? '')) ||
        printedName !== (state.printedName ?? '') || signature !== (state.signature ?? '');
      render();
      announce(message);
      if (focusId) root.querySelector(`#${focusId}`)?.focus({ preventScroll: true });
    } catch (error) {
      announce(error.message || 'Unable to save. Please try again.');
    } finally {
      busy = false;
      root.setAttribute('aria-busy', 'false');
      root.querySelectorAll('button[data-action], input').forEach(element => { element.disabled = liveBlocked; });
    }
  }
  function save() {
    return perform(async () => {
      const saved = await transport.saveDraft({ drafts, printedName, signature });
      dirty = false;
      return saved;
    }, 'Draft saved on this device. Consent and intent must be confirmed again after reopening.', 'save-draft');
  }
  function checkbox(id, text, checked, update) {
    const input = node('input', { type: 'checkbox', id });
    input.checked = checked;
    input.addEventListener('change', () => update(input.checked));
    return node('label', { class: 'agreement-checkbox', for: id }, input, node('span', {}, text));
  }
  function inputField(id, label, value, update) {
    const input = node('input', { id, type: 'text', maxlength: '160', autocomplete: 'off', value });
    input.addEventListener('input', () => { update(input.value); change(); });
    return node('label', { for: id }, label, input);
  }
  function showErrors(errors) {
    root.querySelectorAll('[aria-invalid]').forEach(element => element.removeAttribute('aria-invalid'));
    const summary = root.querySelector('#agreement-errors');
    summary.hidden = false;
    summary.replaceChildren(node('h3', {}, 'Complete these items first'), node('ul', {}, ...errors.map(error => {
      const field = root.querySelector(`#${error.field}`);
      field?.setAttribute('aria-invalid', 'true');
      const anchor = node('a', { href: `#${error.field}` }, error.message);
      anchor.addEventListener('click', event => { event.preventDefault(); field?.focus(); });
      return node('li', {}, anchor);
    })));
    summary.focus();
  }
  function finalSubmit(event) {
    event.preventDefault();
    const submission = { printedName, signature, consent, intent };
    const errors = finalSigningErrors(snapshot, state, submission, { simulation });
    for (const section of snapshot.sections.filter(item => item.acknowledgmentType !== 'none')) {
      const record = state.acknowledgments[section.sectionId];
      const value = (drafts[section.sectionId] ?? record?.value ?? '').trim();
      if (value !== (record?.value ?? '') && !errors.some(error => error.field === `ack-${section.sectionId}`)) {
        errors.push({ field: `ack-${section.sectionId}`, message: `Record or discard your changed acknowledgment for ${section.heading}.` });
      }
    }
    if (errors.length) { showErrors(errors); return; }
    return perform(async () => {
      const completed = await transport.complete(submission, submissionId);
      dirty = false;
      return completed;
    }, 'Simulation completed. No real agreement was signed.', 'completion-title');
  }
  function sectionView(section, index) {
    const record = state.acknowledgments[section.sectionId];
    const content = node('section', { class: 'card agreement-section', 'aria-labelledby': `heading-${section.sectionId}` },
      node('div', { class: 'card-title' }, node('span', { class: 'agreement-section-number' }, String(index + 1).padStart(2, '0')),
        node('span', { class: 'status status-not_started' }, section.acknowledgmentType === 'none' ? 'No acknowledgment' : section.required ? 'Required' : 'Optional')),
      node('h2', { id: `heading-${section.sectionId}` }, section.heading),
      node('p', { class: 'agreement-text' }, section.content));
    if (section.acknowledgmentType === 'none') return content;
    if (record) content.append(node('p', { class: 'agreement-recorded' },
      node('strong', {}, `${record.type === 'initials' ? 'Initials' : 'Signature'} recorded: ${record.value}`),
      node('span', {}, simulation ? 'Demo time: ' : 'Recorded: ', timestamp(record.recordedAt))));
    if (state.completion) return content;
    const id = `ack-${section.sectionId}`;
    const value = drafts[section.sectionId] ?? record?.value ?? '';
    const input = node('input', { id, type: 'text', maxlength: section.acknowledgmentType === 'initials' ? '12' : '160',
      autocomplete: 'off', value, 'aria-describedby': `help-${section.sectionId}` });
    input.addEventListener('input', () => { drafts[section.sectionId] = input.value; change(); });
    const form = node('form', { class: 'agreement-acknowledgment', novalidate: '' },
      node('label', { for: id }, section.acknowledgmentType === 'initials' ? 'Your initials' : 'Your typed section signature', input),
      node('p', { class: 'help', id: `help-${section.sectionId}` }, simulation ? 'Simulation only. Entering text does not record it until you choose Record or Update.' : 'Record this section individually.'),
      node('div', { class: 'agreement-actions' },
        node('button', { type: 'submit', 'data-action': '' }, record ? 'Update acknowledgment' : section.acknowledgmentType === 'initials' ? 'Record initials' : 'Record section signature'),
        record ? button('Remove acknowledgment', () => perform(async () => {
          const next = await transport.remove(section.sectionId);
          delete drafts[section.sectionId];
          return next;
        }, 'Acknowledgment removed.', id), { class: 'agreement-secondary', 'data-action': '' }) : null));
    form.addEventListener('submit', event => {
      event.preventDefault();
      return perform(async () => {
        const next = await transport.acknowledge(section.sectionId, input.value);
        drafts[section.sectionId] = next.acknowledgments[section.sectionId].value;
        return next;
      }, 'Acknowledgment recorded individually.', id);
    });
    content.append(form);
    return content;
  }
  function render() {
    const completed = Boolean(state.completion);
    const progress = acknowledgmentProgress(snapshot, state.acknowledgments);
    root.replaceChildren();
    root.classList.add('agreement-document');
    if (simulation) root.append(node('div', { class: 'agreement-draft-banner', role: 'note' },
      node('strong', {}, 'Simulation - Draft - Not for signing'),
      node('span', {}, 'Fictional client data. Contract text and electronic disclosures await legal approval.')));
    root.append(node('header', { class: 'agreement-heading' },
      node('p', { class: 'agreement-kicker' }, completed ? 'Completed simulation' : 'Your agreement'),
      node('h1', {}, snapshot.title),
      node('p', { class: 'muted' }, `Version ${snapshot.version} / ${snapshot.agreementId}`)),
    facts([['Client', snapshot.client.name], ['Dog', `${snapshot.dog.name} / ${snapshot.dog.breed}`], ['Service', snapshot.service.name], ['Status', completed ? 'Simulation completed' : progress.completed ? 'In progress' : 'Not started']]),
    node('div', { class: 'agreement-progress' },
      node('label', { for: 'agreement-progress' }, `${progress.completed} of ${progress.required} required acknowledgments recorded`),
      node('progress', { id: 'agreement-progress', max: Math.max(1, progress.required), value: progress.completed })),
    node('div', { class: 'agreement-toolbar' },
      node('p', { role: 'status', 'aria-live': 'polite', 'data-save-status': '' }, state.savedAt ? `Last saved ${new Date(state.savedAt).toLocaleString()}` : 'No acknowledgments recorded yet'),
      !completed ? button('Save draft', save, { id: 'save-draft', 'data-action': '' }) : null),
    node('div', { class: 'agreement-sections' }, ...snapshot.sections.map(sectionView)));
    if (snapshot.optionalConsents.length) root.append(node('section', { class: 'agreement-band', 'aria-labelledby': 'optional-title' },
      node('h2', { id: 'optional-title' }, 'Optional consents'),
      node('p', { class: 'muted' }, 'Separate from required contract acknowledgments.'),
      ...snapshot.optionalConsents.map(item => node('div', { class: 'agreement-optional' }, node('h3', {}, item.heading),
        node('p', { class: 'agreement-text' }, item.content),
        completed ? node('p', {}, state.optionalConsents[item.consentId]?.accepted ? 'Selected in simulation' : 'Not selected') :
          checkbox(`optional-${item.consentId}`, 'Select this optional consent (simulation only)', Boolean(state.optionalConsents[item.consentId]?.accepted),
            accepted => perform(() => transport.setOptionalConsent(item.consentId, accepted), 'Optional choice saved.'))))));
    if (completed) {
      const receipt = state.completion;
      root.append(node('section', { class: 'agreement-band agreement-completion' },
        node('h2', { id: 'completion-title', tabindex: '-1' }, 'Simulation completed'),
        node('p', {}, 'This is not an executed legal agreement. No real contract was signed or email sent.'),
        facts([['Printed name', receipt.printedName], ['Typed signature', receipt.signature], ['Demo completion time', receipt.completedAt], ['Version', snapshot.version]]),
        button('Download simulated agreement PDF', () => {
          Promise.resolve(onDownload?.(snapshot, state)).catch(error => announce(`Download failed: ${error.message}`));
        }, { class: 'agreement-download' }),
        node('details', { class: 'agreement-audit' }, node('summary', {}, 'Simulation activity record'),
          node('ol', {}, ...state.events.map(event => node('li', {}, `${event.action}${event.sectionId ? ` / ${event.sectionId}` : ''} / ${event.recordedAt}`))))));
    } else {
      const errors = node('div', { id: 'agreement-errors', class: 'notice error', role: 'alert', tabindex: '-1', hidden: '' });
      const form = node('form', { class: 'agreement-final', novalidate: '' },
        node('fieldset', {}, node('legend', {}, 'Electronic-signing consent'),
          node('p', { class: 'agreement-text', id: 'legal-review', tabindex: '-1' }, snapshot.electronicDisclosure?.content ?? 'Approved disclosure is not configured.'),
          checkbox('electronic-consent', simulation ? 'Confirm simulated electronic-signing consent. No real consent is given.' : 'I consent to electronic signing under the disclosures above.', consent, checked => { consent = checked; })),
        node('fieldset', {}, node('legend', {}, 'Final review and signature'),
          node('p', { class: 'muted' }, `${progress.completed} of ${progress.required} required acknowledgments recorded. The entire document remains available above.`),
          inputField('printed-name', 'Final printed name', printedName, value => { printedName = value; }),
          inputField('final-signature', 'Final typed signature', signature, value => { signature = value; }),
          checkbox('signing-intent', simulation ? 'I intend to complete this simulation only, not sign a legal agreement.' : 'I intend to sign and accept the complete agreement.', intent, checked => { intent = checked; })),
        errors, node('button', { type: 'submit', 'data-action': '', class: 'agreement-final-button' }, simulation ? 'Complete signing simulation' : 'Sign and accept the complete agreement'),
        node('p', { class: 'help' }, simulation ? 'Real signing is disabled. This preview cannot execute a contract.' : 'Your completed agreement will be locked after signing.'));
      form.addEventListener('submit', finalSubmit);
      root.append(node('section', { class: 'agreement-band' }, node('h2', {}, 'Review the complete agreement'), form));
    }
    if (liveBlocked) {
      root.prepend(node('p', { class: 'notice error', role: 'alert' }, 'Real signing is blocked: approved contract text and electronic disclosures are not configured.'));
      root.querySelectorAll('input, button').forEach(element => { element.disabled = true; });
    }
  }
  render();
  return { dispose() { window.removeEventListener('beforeunload', beforeUnload); }, hasUnsavedChanges: () => dirty };
}