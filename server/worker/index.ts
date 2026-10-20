import { appConfig, finishLogin, HttpError, logout, rateLimit, requireCsrf, requireIdentity, requireStaff, startLogin } from './auth.ts';
import type { Env, Identity } from './auth.ts';

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

async function input(request: Request, allowed: string[]): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new HttpError(415, 'Send a JSON request.');
  }
  const limit = 8192;
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, `File or request exceeds the ${limit}-byte limit.`);
  if (!request.body) throw new HttpError(400, 'Request body is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new HttpError(413, `File or request exceeds the ${limit}-byte limit.`); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let data: unknown;
  try { data = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, 'Request must contain valid JSON.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      Object.keys(data).some(key => !allowed.includes(key))) {
    throw new HttpError(400, 'Request contains unsupported fields.');
  }
  return Object.fromEntries(Object.entries(data));
}

function text(value: unknown, name: string, max = 120, required = true) {
  if (typeof value !== 'string' || value.length > max ||
      Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || (required && !value.trim())) {
    throw new HttpError(400, `Enter a valid ${name}.`);
  }
  return value.trim();
}

function audit(env: Env, user: string, action: string, resource: string) {
  return env.DB.prepare('INSERT INTO audit_logs(id, actor_id, action, resource_id) VALUES (?, ?, ?, ?)')
    .bind(crypto.randomUUID(), user, action, resource);
}

async function household(env: Env, identity: Identity, id: string) {
  const row = await env.DB.prepare(
    `SELECT h.id, h.contact_name, h.phone, h.city FROM households h
     JOIN memberships m ON m.household_id = h.id WHERE h.id = ? AND m.user_id = ?`
  ).bind(id, identity.id).first();
  if (!row) throw new HttpError(404, 'Household not found.');
  return row;
}

async function api(request: Request, env: Env, path: string) {
  if (path === '/api/auth/login' && request.method === 'GET') {
    await rateLimit(request, env, 'login', 10);
    return startLogin(env);
  }
  if (path === '/api/auth/callback' && request.method === 'GET') {
    await rateLimit(request, env, 'callback', 20);
    return finishLogin(request, env);
  }
  await rateLimit(request, env, 'api', 120);
  const identity = await requireIdentity(request, env);
  if (path.startsWith('/api/admin/')) requireStaff(identity);
  if (!['GET', 'HEAD'].includes(request.method)) {
    requireCsrf(request, env, identity);
    await rateLimit(request, env, `mutation:${identity.id}`, 30);
  }
  if (path === '/api/auth/logout' && request.method === 'POST') return logout(request, env, identity);
  if (path === '/api/me' && request.method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT h.id, h.contact_name, h.phone, h.city FROM households h
       JOIN memberships m ON m.household_id = h.id WHERE m.user_id = ? ORDER BY h.created_at, h.id`
    ).bind(identity.id).all();
    return json({ user: { id: identity.id, name: identity.display_name, role: identity.role }, households: results, csrfToken: identity.csrf_token });
  }
  const householdMatch = path.match(/^\/api\/households\/([A-Za-z0-9_-]{1,80})$/);
  if (householdMatch && request.method === 'PATCH') {
    const id = householdMatch[1];
    await household(env, identity, id);
    const data = await input(request, ['contactName', 'phone', 'city']);
    const name = text(data.contactName, 'contact name');
    const phone = text(data.phone, 'phone', 40, false);
    const city = text(data.city, 'city', 120, false);
    await env.DB.batch([
      env.DB.prepare('UPDATE households SET contact_name = ?, phone = ?, city = ? WHERE id = ?')
        .bind(name, phone, city, id),
      audit(env, identity.id, 'household.updated', id)
    ]);
    return json({ updated: true });
  }
  const dogsMatch = path.match(/^\/api\/households\/([A-Za-z0-9_-]{1,80})\/dogs$/);
  if (dogsMatch) {
    const id = dogsMatch[1];
    await household(env, identity, id);
    if (request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT id, name, breed, birth_date, approximate_age FROM dogs WHERE household_id = ? ORDER BY created_at, id'
      ).bind(id).all();
      return json({ dogs: results });
    }
    if (request.method === 'POST') {
      const data = await input(request, ['name', 'breed', 'birthDate', 'approximateAge']);
      const name = text(data.name, 'dog name', 100);
      const breed = text(data.breed, 'breed', 120, false);
      const age = text(data.approximateAge, 'approximate age', 80, false);
      const date = text(data.birthDate, 'birth date', 10, false);
      if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
          Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
          new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date ||
          date > new Date().toISOString().slice(0, 10))) {
        throw new HttpError(400, 'Enter a valid past birth date.');
      }
      if ((!date && !age) || (date && age)) throw new HttpError(400, 'Enter either a birth date or an approximate age.');
      const dogId = crypto.randomUUID();
      await env.DB.batch([
        env.DB.prepare('INSERT INTO dogs(id, household_id, name, breed, birth_date, approximate_age) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(dogId, id, name, breed, date || null, age),
        audit(env, identity.id, 'dog.created', dogId)
      ]);
      return json({ id: dogId }, 201);
    }
  }
  const dogMatch = path.match(/^\/api\/dogs\/([A-Za-z0-9_-]{1,80})$/);
  if (dogMatch && request.method === 'GET') {
    const dog = await env.DB.prepare(
      `SELECT d.id, d.name, d.breed, d.birth_date, d.approximate_age FROM dogs d
       JOIN memberships m ON m.household_id = d.household_id WHERE d.id = ? AND m.user_id = ?`
    ).bind(dogMatch[1], identity.id).first();
    if (!dog) throw new HttpError(404, 'Dog not found.');
    return json({ dog });
  }
  if (path === '/api/admin/clients' && request.method === 'GET') {
    requireStaff(identity, true);
    const { results } = await env.DB.prepare(
      'SELECT id, contact_name, phone, city FROM households ORDER BY created_at DESC, id LIMIT 100'
    ).all();
    return json({ clients: results, limit: 100 });
  }
  if (path === '/api/admin/audit' && request.method === 'GET') {
    requireStaff(identity, true);
    const { results } = await env.DB.prepare(
      'SELECT id, actor_id, action, resource_id, created_at FROM audit_logs ORDER BY created_at DESC, id LIMIT 100'
    ).all();
    return json({ events: results, limit: 100 });
  }
  if (['/api/records', '/api/admin/reviews', '/api/agreements', '/api/payments', '/api/documents'].includes(path)) {
    throw new HttpError(503, 'This feature is not configured. Uploads, contracts and payments are unavailable.');
  }
  throw new HttpError(404, 'Endpoint not found.');
}

function secure(response: Response, portal: boolean) {
  const headers = new Headers(response.headers);
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', portal ? 'no-referrer' : 'strict-origin-when-cross-origin');
  if (portal) {
    headers.set('cache-control', 'no-store');
    headers.set('x-frame-options', 'DENY');
    headers.set('content-security-policy', "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'none'");
    headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
  }
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request, bindings: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const protectedSurface = path.startsWith('/api/') || path === '/portal' || path.startsWith('/portal/') || path === '/admin' || path.startsWith('/admin/');
    try {
      if (path.includes('%') || path.includes('\\')) throw new HttpError(400, 'Invalid request path.');
      const config = appConfig(bindings);
      if (url.origin !== config.origin) throw new HttpError(400, 'Use the configured portal address.');
      const env = { ...bindings, DB: 'withSession' in bindings.DB ? bindings.DB.withSession('first-primary') : bindings.DB };
      let response: Response;
      if (path.startsWith('/api/')) response = await api(request, env, path);
      else if (path === '/portal' || path.startsWith('/portal/') || path === '/admin' || path.startsWith('/admin/')) {
        await rateLimit(request, env, 'portal', 120);
        const identity = await requireIdentity(request, env);
        if (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/portal/admin')) requireStaff(identity);
        if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Method not allowed.');
        if (path === '/portal' || path === '/admin' || path.startsWith('/admin/') || path.startsWith('/portal/admin')) {
          response = new Response(null, { status: 302, headers: { location: '/portal/' } });
        } else response = await env.ASSETS.fetch(request);
      } else {
        if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Method not allowed.');
        response = await env.ASSETS.fetch(request);
      }
      return secure(response, protectedSurface);
    } catch (error) {
      const known = error instanceof HttpError;
      if (!known) console.error('portal_request_failed', { category: path.startsWith('/api/auth/') ? 'authentication_or_storage' : 'backend', name: error instanceof Error ? error.name : 'UnknownError' });
      const status = known ? error.status : 503;
      const message = known ? error.message : 'The portal is temporarily unavailable. Please try again later.';
      if (!path.startsWith('/api/') && status === 401) {
        return secure(new Response(null, { status: 302, headers: { location: '/api/auth/login' } }), true);
      }
      const response = json({ error: message }, status);
      if (status === 429) response.headers.set('retry-after', '60');
      return secure(response, protectedSurface);
    }
  }
};
