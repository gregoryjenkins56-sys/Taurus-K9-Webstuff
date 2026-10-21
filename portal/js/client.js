const main = document.getElementById('content');
const announcement = document.getElementById('route-status');
const householdSelect = document.getElementById('household');
let account;
let sequence = 0;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  for (const child of children.flat(Infinity)) {
    if (child !== null && child !== undefined) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
const notice = message => el('div', { class: 'notice' }, message);
const card = (title, ...children) => el('section', { class: 'card' }, el('h2', {}, title), ...children);
const link = (path, title) => el('a', { href: `#${path}` }, title);

class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
async function api(path, method = 'GET', body) {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(method !== 'GET' ? { 'x-csrf-token': account.csrfToken } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new ApiError(response.status, data.error || 'The request could not be completed.');
  return data;
}

function unavailable() {
  return [notice('This feature is not configured. Veterinary uploads, agreement downloads, signing, and payments are unavailable. No sample data is used.'),
    el('p', {}, 'Contact Taurus K9 if you need assistance. No provider actions can be submitted here.')];
}
function field(label, name, value = '', required = false, maxLength = 120, type = 'text') {
  const input = el('input', { name, type, maxlength: String(maxLength), value, autocomplete: 'off' });
  if (required) input.required = true;
  return el('label', {}, label, input);
}
function editor(fields, submitLabel, save) {
  const form = el('form', { method: 'post', action: '/api/unavailable' }, fields);
  const result = el('p', { role: 'status' });
  const button = el('button', { type: 'submit' }, submitLabel);
  form.append(button, result);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    button.disabled = true;
    result.textContent = 'Saving...';
    try {
      await save(Object.fromEntries(new FormData(form)));
      result.textContent = 'Saved.';
      await loadAccount();
      await render();
    } catch (error) {
      result.textContent = error instanceof ApiError ? error.message : 'Unable to save. Please try again.';
      if (!(error instanceof ApiError)) console.error('portal_save_failed');
    } finally { button.disabled = false; }
  });
  return form;
}
function table(title, headers, rows) {
  return el('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': title },
    el('table', {}, el('caption', {}, title),
      el('thead', {}, el('tr', {}, headers.map(label => el('th', { scope: 'col' }, label)))),
      el('tbody', {}, rows.map(row => el('tr', {}, row.map(value => el('td', {}, value)))))));
}

const routes = {
  '/dashboard': { title: 'Your dashboard', async view(household) {
    const data = household ? await api(`/api/households/${household.id}/dogs`) : { dogs: [] };
    return [el('p', {}, `Welcome, ${account.user.name}.`),
      household ? notice(`Household: ${household.contact_name}`) : notice('No household is assigned. Contact Taurus K9 to arrange access.'),
      household && !household.phone && !household.city
        ? notice('Welcome to Taurus K9! Finish setting up your account: add your contact details under Owner information, then add your dogs.')
        : null,
      el('div', { class: 'grid' },
        card('My Dogs', el('p', {}, `${data.dogs.length} dogs in the selected household.`), link('/dogs', 'Manage dogs')),
        card('Owner information', link('/profile', 'Manage contact information')),
        ...['Veterinary Records', 'My Agreement', 'Payments', 'Completed Documents'].map(title => card(title, el('span', { class: 'status status-unavailable' }, 'Unavailable')))),
      notice('Training readiness is unavailable until records, agreements, and payments have verified backend workflows.')];
  } },
  '/profile': { title: 'Owner information', async view(household) {
    if (!household) return [notice('No household is assigned. Contact Taurus K9.')];
    return [editor([
      field('Contact name', 'contactName', household.contact_name, true),
      field('Phone (optional)', 'phone', household.phone, false, 40, 'tel'),
      field('City (optional)', 'city', household.city)
    ], 'Save household information', data => api(`/api/households/${household.id}`, 'PATCH', data))];
  } },
  '/dogs': { title: 'My Dogs', async view(household) {
    if (!household) return [notice('No household is assigned. Contact Taurus K9.')];
    const { dogs } = await api(`/api/households/${household.id}/dogs`);
    return [
      dogs.length ? el('div', { class: 'grid' }, dogs.map(dog => card(dog.name,
        el('p', {}, dog.breed || 'Breed not provided'),
        el('p', {}, dog.birth_date ? `Birth date: ${dog.birth_date}` : `Approximate age: ${dog.approximate_age}`))))
        : notice('No dogs yet. Add your first dog below.'),
      card('Add a dog', el('p', {}, 'Enter either a birth date or an approximate age, not both.'),
        editor([field('Dog name', 'name', '', true, 100), field('Breed / mix (optional)', 'breed'),
          field('Birth date (optional)', 'birthDate', '', false, 10, 'date'),
          field('Approximate age (if birth date is unknown)', 'approximateAge', '', false, 80)],
        'Add dog', data => api(`/api/households/${household.id}/dogs`, 'POST', data)))
    ];
  } },
  '/records': { title: 'Veterinary Records', view: unavailable },
  '/agreement': { title: 'My Agreement', view: unavailable },
  '/payments': { title: 'Payments', view: unavailable },
  '/documents': { title: 'Completed Documents', view: unavailable },
  '/admin/clients': { title: 'Client directory', role: 'admin', async view() {
    const { clients } = await api('/api/admin/clients');
    return [notice('Showing up to 100 households. Clients create their own account and household when they first sign in; staff roles are assigned only by the database operator.'),
      clients.length ? table('Client households', ['Contact name', 'Phone', 'City'], clients.map(row => [row.contact_name, row.phone, row.city])) : notice('No client households yet.')];
  } },
  '/admin/reviews': { title: 'Record reviews', role: 'reviewer', view: unavailable },
  '/admin/audit': { title: 'Audit history', role: 'admin', async view() {
    const { events } = await api('/api/admin/audit');
    return [notice('Showing up to 100 most recent events. No contact details or tokens are recorded in these events.'),
      events.length ? table('Administrative and account audit', ['Timestamp (UTC)', 'Actor ID', 'Action', 'Resource ID'],
        events.map(row => [row.created_at, row.actor_id, row.action, row.resource_id])) : notice('No audit events yet.')];
  } }
};
function permitted(route) {
  return !route.role || account.user.role === 'admin' || (route.role === 'reviewer' && account.user.role === 'reviewer');
}
async function loadAccount() {
  const selected = householdSelect.value;
  account = await api('/api/me');
  householdSelect.replaceChildren(...account.households.map(household => el('option', { value: household.id }, household.contact_name)));
  if (account.households.some(household => household.id === selected)) householdSelect.value = selected;
  householdSelect.hidden = account.households.length < 2;
  document.querySelector('label[for="household"]').hidden = householdSelect.hidden;
  document.getElementById('logout').hidden = false;
  const staff = document.querySelector('.staff-preview');
  staff.hidden = !account.user.role;
  for (const id of ['portal-nav', 'staff-nav']) document.getElementById(id).replaceChildren();
  for (const [path, route] of Object.entries(routes)) {
    if (permitted(route)) document.getElementById(route.role ? 'staff-nav' : 'portal-nav').append(link(path, route.title));
  }
}

async function render() {
  const current = ++sequence;
  const path = location.hash.slice(1) || '/dashboard';
  const route = Object.hasOwn(routes, path) ? routes[path] : null;
  const title = route ? route.title : 'Page not found';
  document.title = `${title} | Taurus K9`;
  main.setAttribute('aria-busy', 'true');
  main.replaceChildren(el('h1', {}, title), el('p', { role: 'status' }, 'Loading...'));
  try {
    if (!account) await loadAccount();
    if (route && !permitted(route)) throw new ApiError(403, 'You do not have permission to access this area.');
    const household = account.households.find(household => household.id === householdSelect.value);
    const body = route ? await route.view(household) : [link('/dashboard', 'Back to dashboard')];
    if (current !== sequence) return;
    main.replaceChildren(el('h1', {}, title), ...body);
    document.querySelectorAll('.sidebar nav a').forEach(anchor => {
      if (anchor.getAttribute('href') === `#${path}`) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    });
    if (path.startsWith('/admin/') && route) document.querySelector('.staff-preview').open = true;
  } catch (error) {
    if (current !== sequence) return;
    const message = error instanceof ApiError ? error.message : 'The portal is unavailable. Please try again later.';
    if (!(error instanceof ApiError)) console.error('portal_load_failed');
    main.replaceChildren(el('h1', {}, title), el('p', { role: 'alert' }, message));
    if (error instanceof ApiError && error.status === 401) {
      account = null;
      document.getElementById('portal-nav').replaceChildren();
      document.getElementById('staff-nav').replaceChildren();
      document.querySelector('.staff-preview').hidden = true;
      document.getElementById('logout').hidden = true;
      main.append(el('a', { href: '/api/auth/login', class: 'button' }, 'Sign in'), ' ',
        el('a', { href: '/api/auth/signup', class: 'button' }, 'Create a client account'));
    }
  } finally {
    if (current === sequence) {
      main.setAttribute('aria-busy', 'false');
      announcement.textContent = `${title}.`;
      if (document.activeElement !== householdSelect) main.focus({ preventScroll: true });
    }
  }
}
document.getElementById('logout').addEventListener('click', async () => {
  try {
    const data = await api('/api/auth/logout', 'POST');
    account = null;
    // The server ends the app session, then supplies the identity-provider logout URL
    // (which returns to the public site) so the provider's sign-in session ends too.
    location.replace(data && typeof data.redirect === 'string' ? data.redirect : '/');
  } catch (error) {
    announcement.textContent = error instanceof ApiError ? error.message : 'Unable to sign out. Try again.';
  }
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); });
householdSelect.addEventListener('change', render);
window.addEventListener('hashchange', render);
render();
