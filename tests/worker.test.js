import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import * as oauth from 'oauth4webapi';
import worker from '../server/worker/index.ts';
import { cookie, hash } from '../server/worker/auth.ts';

const origin = 'http://localhost:8787';
const issuer = 'https://identity.example.invalid/';
let mf;
let db;
let env;
let sessions;
const realFetch = globalThis.fetch;
const now = () => Math.floor(Date.now() / 1000);

before(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    script: 'export default { fetch() { return new Response("test database"); } }',
    compatibilityDate: '2026-10-19',
    d1Databases: ['DB']
  }));
  db = await mf.getD1Database('DB');
  for (const file of ['0001_foundation.sql']) {
    const schema = await readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8');
    for (const sql of schema.split(';').map(sql => sql.trim()).filter(Boolean)) await db.prepare(sql).run();
  }
  env = {
    DB: db,
    ASSETS: { fetch: async request => new Response(new URL(request.url).pathname.startsWith('/portal/') ? 'protected portal' : 'public site') },
    APP_ENV: 'development', APP_ORIGIN: origin,
    AUTH_ISSUER: issuer, AUTH_CLIENT_ID: 'test-client', AUTH_CLIENT_SECRET: 'test-only-secret'
  };
});
after(async () => { globalThis.fetch = realFetch; await mf?.dispose(); });
beforeEach(async () => {
  globalThis.fetch = realFetch;
  for (const table of ['audit_logs', 'sessions', 'auth_transactions', 'rate_limits', 'enrollments', 'training_programs', 'dogs', 'staff_roles', 'memberships', 'households', 'users']) {
    await db.prepare(`DELETE FROM ${table}`).run();
  }
  sessions = {};
  for (const user of ['client-a', 'client-b', 'reviewer', 'admin']) {
    await db.prepare('INSERT INTO users(id, issuer, subject, display_name) VALUES (?, ?, ?, ?)')
      .bind(user, issuer, `subject-${user}`, `Test ${user}`).run();
    const token = oauth.generateRandomState();
    const csrf = oauth.generateRandomState();
    await db.prepare('INSERT INTO sessions(token_hash, user_id, csrf_token, expires_at) VALUES (?, ?, ?, ?)')
      .bind(await hash(token), user, csrf, now() + 3600).run();
    sessions[user] = { token, csrf };
  }
  for (const suffix of ['a', 'b']) {
    await db.prepare('INSERT INTO households(id, contact_name) VALUES (?, ?)').bind(`house-${suffix}`, `Test household ${suffix}`).run();
    await db.prepare('INSERT INTO memberships(user_id, household_id) VALUES (?, ?)').bind(`client-${suffix}`, `house-${suffix}`).run();
    await db.prepare('INSERT INTO dogs(id, household_id, name, approximate_age) VALUES (?, ?, ?, ?)')
      .bind(`dog-${suffix}`, `house-${suffix}`, `Dog ${suffix}`, '2 years').run();
  }
  await db.prepare("INSERT INTO staff_roles(user_id, role) VALUES ('reviewer', 'reviewer'), ('admin', 'admin')").run();
});

function request(path, user, options = {}, bindings = env) {
  const headers = new Headers(options.headers);
  if (user) headers.set('cookie', `tk9_session=${sessions[user].token}`);
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  return worker.fetch(new Request(`${origin}${path}`, { ...options, headers }), bindings);
}
function mutation(path, user, body, method = 'POST', headers = {}) {
  return request(path, user, { method, body: JSON.stringify(body),
    headers: { origin, 'x-csrf-token': sessions[user].csrf, ...headers } });
}

test('public site is preserved while portal, portal assets, and staff URLs require a session', async () => {
  assert.equal((await request('/')).status, 200);
  for (const path of ['/portal/', '/portal/index.html', '/portal/js/client.js', '/portal/css/adobe.css', '/portal/admin', '/admin', '/admin/reviews']) {
    const response = await request(path);
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/api/auth/login');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal((await request('/%70ortal/index.html')).status, 400);
});
test('unauthenticated and fabricated sessions cannot access protected endpoints', async () => {
  for (const path of ['/api/me', '/api/households/house-a/dogs', '/api/admin/clients', '/api/records']) {
    assert.equal((await request(path)).status, 401);
  }
  assert.equal((await request('/api/me', null, { headers: { cookie: `tk9_session=${oauth.generateRandomState()}` } })).status, 401);
});
test('session requires active user, unexpired token, and a single unambiguous cookie', async () => {
  await db.prepare("UPDATE sessions SET expires_at = ? WHERE user_id = 'client-a'").bind(now() - 1).run();
  assert.equal((await request('/api/me', 'client-a')).status, 401);
  await db.prepare("UPDATE users SET active = 0 WHERE id = 'client-b'").run();
  assert.equal((await request('/api/me', 'client-b')).status, 401);
  const token = sessions.admin.token;
  assert.equal((await request('/api/me', null, { headers: { cookie: `tk9_session=${token}; tk9_session=${token}` } })).status, 401);
});
test('me and dog listings are household-scoped, with no other clients data', async () => {
  const me = await (await request('/api/me', 'client-a')).json();
  assert.deepEqual(me.households.map(house => house.id), ['house-a']);
  assert.equal(me.csrfToken, sessions['client-a'].csrf);
  const dogs = await (await request('/api/households/house-a/dogs', 'client-a')).json();
  assert.deepEqual(dogs.dogs.map(dog => dog.id), ['dog-a']);
  assert.equal((await request('/api/households/house-b/dogs', 'client-a')).status, 404);
  assert.equal((await request('/api/dogs/dog-b', 'client-a')).status, 404);
  assert.equal((await request('/api/dogs/dog-a', 'client-a')).status, 200);
});
test('client cannot write another household or add a dog to it', async () => {
  assert.equal((await mutation('/api/households/house-b', 'client-a', { contactName: 'Changed', phone: '', city: '' }, 'PATCH')).status, 404);
  assert.equal((await mutation('/api/households/house-b/dogs', 'client-a', { name: 'Changed', breed: '', birthDate: '', approximateAge: '1 year' })).status, 404);
  assert.equal((await db.prepare("SELECT contact_name FROM households WHERE id='house-b'").first()).contact_name, 'Test household b');
});
test('CSRF token and exact origin are mandatory on mutations', async () => {
  const body = { contactName: 'New name', phone: '', city: '' };
  assert.equal((await request('/api/households/house-a', 'client-a', { method: 'PATCH', body: JSON.stringify(body) })).status, 403);
  assert.equal((await mutation('/api/households/house-a', 'client-a', body, 'PATCH', { origin: 'https://attacker.example.invalid' })).status, 403);
  assert.equal((await mutation('/api/households/house-a', 'client-a', body, 'PATCH', { 'x-csrf-token': sessions['client-b'].csrf })).status, 403);
  assert.equal((await mutation('/api/households/house-a', 'client-a', body, 'PATCH')).status, 200);
});
test('profile fields cannot grant roles or change membership and invalid JSON is explicit', async () => {
  assert.equal((await mutation('/api/households/house-a', 'client-a', { contactName: 'New', phone: '', city: '', role: 'admin' }, 'PATCH')).status, 400);
  assert.equal((await mutation('/api/households/house-a', 'client-a', { householdId: 'house-b' }, 'PATCH')).status, 400);
  assert.equal((await request('/api/admin/clients', 'client-a')).status, 403);
  assert.equal((await mutation('/api/admin/roles', 'client-a', { role: 'admin' })).status, 403);
  const response = await request('/api/households/house-a', 'client-a', {
    method: 'PATCH', body: '{', headers: { origin, 'x-csrf-token': sessions['client-a'].csrf }
  });
  assert.equal(response.status, 400);
});
test('dog creation persists and audits with strict server-side input validation', async () => {
  const dog = { name: 'River', breed: 'Mix', birthDate: '', approximateAge: '2 years' };
  const response = await mutation('/api/households/house-a/dogs', 'client-a', dog);
  assert.equal(response.status, 201);
  const { id } = await response.json();
  assert.equal((await db.prepare('SELECT household_id FROM dogs WHERE id=?').bind(id).first()).household_id, 'house-a');
  assert.equal((await db.prepare('SELECT action FROM audit_logs WHERE resource_id=?').bind(id).first()).action, 'dog.created');
  for (const invalid of [
    { ...dog, name: '' }, { ...dog, name: 'x'.repeat(101) },
    { ...dog, birthDate: '2026-02-30', approximateAge: '' },
    { ...dog, birthDate: '2999-01-01', approximateAge: '' },
    { ...dog, birthDate: '2020-01-01' }, { ...dog, approximateAge: '' },
    { ...dog, name: 'bad\nname' }
  ]) assert.equal((await mutation('/api/households/house-a/dogs', 'client-a', invalid)).status, 400);
});
test('oversized, wrong-content-type, and unsupported profile fields are rejected', async () => {
  assert.equal((await mutation('/api/households/house-a', 'client-a', { contactName: 'x'.repeat(9000), phone: '', city: '' }, 'PATCH')).status, 413);
  assert.equal((await mutation('/api/households/house-a', 'client-a', {}, 'PATCH', { 'content-type': 'text/plain' })).status, 415);
});
test('admin and reviewer capabilities are separate and checked on every request', async () => {
  assert.equal((await request('/api/admin/clients', 'admin')).status, 200);
  assert.equal((await request('/api/admin/audit', 'admin')).status, 200);
  assert.equal((await request('/api/admin/clients', 'reviewer')).status, 403);
  assert.equal((await request('/api/admin/reviews', 'reviewer')).status, 503);
  assert.equal((await request('/api/admin/reviews', 'client-a')).status, 403);
  assert.equal((await request('/admin/reviews', 'client-a')).status, 403);
  await db.prepare("DELETE FROM staff_roles WHERE user_id='admin'").run();
  assert.equal((await request('/api/admin/clients', 'admin')).status, 403);
});
test('logout requires CSRF and revokes the actual server-side session', async () => {
  assert.equal((await request('/api/auth/logout', 'client-a', { method: 'POST' })).status, 403);
  const response = await mutation('/api/auth/logout', 'client-a', {});
  assert.equal(response.status, 204);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('/api/me', 'client-a')).status, 401);
});
test('unconfigured integrations never return demo data or successful operations', async () => {
  for (const path of ['/api/records', '/api/agreements', '/api/payments', '/api/documents']) {
    assert.equal((await request(path, 'client-a')).status, 503);
    assert.equal((await mutation(path, 'client-a', {})).status, 503);
  }
  const response = await request('/api/auth/login', null, {}, { ...env, AUTH_CLIENT_SECRET: '' });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /not configured/);
});
test('rate limits are database-backed, and security headers prevent protected caching/framing', async () => {
  let last;
  for (let i = 0; i < 121; i++) last = await request('/api/me', 'client-a');
  assert.equal(last.status, 429);
  assert.equal(last.headers.get('retry-after'), '60');
  assert.equal(last.headers.get('cache-control'), 'no-store');
  assert.equal(last.headers.get('x-frame-options'), 'DENY');
  assert.match(last.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});
test('production session cookies require HTTPS and no configuration can enable a login bypass', async () => {
  assert.match(cookie({ ...env, APP_ENV: 'production', APP_ORIGIN: 'https://portal.example.invalid' }, 'session', 'value', 10), /^__Host-tk9_session=.*Secure$/);
  assert.equal((await request('/api/me', null, {}, { ...env, APP_ENV: 'production' })).status, 503);
  assert.equal((await request('/api/me', null, {}, { ...env, APP_ENV: 'preview' })).status, 503);
});

async function provider({ badSignature = false, subject = 'subject-client-a', nonceOverride, claimsOverride = {} } = {}) {
  const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...await crypto.subtle.exportKey('jwk', pair.publicKey), kid: crypto.randomUUID(), alg: 'RS256', use: 'sig' };
  let login;
  globalThis.fetch = async (url, options) => {
    const target = new URL(url instanceof Request ? url.url : url);
    if (target.hostname !== 'identity.example.invalid') throw new Error('Unexpected external test request');
    if (target.pathname === '/.well-known/openid-configuration') return Response.json({
      issuer, authorization_endpoint: `${issuer}authorize`, token_endpoint: `${issuer}token`,
      jwks_uri: `${issuer}jwks`, response_types_supported: ['code'], subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256']
    });
    if (target.pathname === '/jwks') return Response.json({ keys: [jwk] });
    if (target.pathname === '/token') {
      const params = new URLSearchParams(options.body);
      assert.equal(await oauth.calculatePKCECodeChallenge(params.get('code_verifier')), login.searchParams.get('code_challenge'));
      assert.equal(params.get('client_secret'), 'test-only-secret');
      const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
      const payload = `${encode({ alg: 'RS256', kid: jwk.kid })}.${encode({
        iss: issuer, sub: subject, aud: 'test-client', exp: now() + 300, iat: now(),
        nonce: nonceOverride || login.searchParams.get('nonce'), ...claimsOverride
      })}`;
      const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(payload)));
      if (badSignature) signature[0] ^= 1;
      return Response.json({ access_token: 'test-only-access-token', token_type: 'Bearer',
        id_token: `${payload}.${Buffer.from(signature).toString('base64url')}` });
    }
    throw new Error('Unexpected provider endpoint');
  };
  const response = await request('/api/auth/login');
  assert.equal(response.status, 302);
  login = new URL(response.headers.get('location'));
  const browserCookie = response.headers.get('set-cookie').split(';')[0];
  return { login, browserCookie, callback: `/api/auth/callback?code=test-code&state=${login.searchParams.get('state')}` };
}
test('real OIDC flow uses PKCE/state/nonce/signature, then creates a hashed, revocable session', async () => {
  const flow = await provider();
  assert.equal(flow.login.searchParams.get('scope'), 'openid profile');
  const response = await request(flow.callback, null, { headers: { cookie: flow.browserCookie } });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), `${origin}/portal/`);
  const sessionCookie = response.headers.getSetCookie().find(value => value.startsWith('tk9_session=')).split(';')[0];
  const me = await request('/api/me', null, { headers: { cookie: sessionCookie } });
  assert.equal((await me.json()).user.id, 'client-a');
  const token = sessionCookie.split('=')[1];
  assert.equal(await db.prepare('SELECT token_hash FROM sessions WHERE token_hash=?').bind(token).first(), null);
  assert.ok(await db.prepare('SELECT token_hash FROM sessions WHERE token_hash=?').bind(await hash(token)).first());
  assert.equal((await request(flow.callback, null, { headers: { cookie: flow.browserCookie } })).status, 400);
});
test('OIDC callback rejects mismatched browser and expired state', async () => {
  const flow = await provider();
  assert.equal((await request(flow.callback, null, { headers: { cookie: `tk9_login=${oauth.generateRandomState()}` } })).status, 400);
  await db.prepare('UPDATE auth_transactions SET expires_at=?').bind(now() - 1).run();
  assert.equal((await request(flow.callback, null, { headers: { cookie: flow.browserCookie } })).status, 400);
});
test('OIDC bad signatures and wrong nonce fail closed without creating a session', async () => {
  for (const options of [{ badSignature: true }, { nonceOverride: 'wrong-nonce' }]) {
    const flow = await provider(options);
    const response = await request(flow.callback, null, { headers: { cookie: flow.browserCookie } });
    assert.equal(response.status, 503);
    assert.equal((await db.prepare('SELECT count(*) AS count FROM sessions').first()).count, 4);
    assert.doesNotMatch(await response.text(), /access.token|secret|nonce|signature/i);
  }
});
test('provider identity must be provisioned; matching email or self-assigned roles never grants access', async () => {
  const flow = await provider({ subject: 'not-provisioned', claimsOverride: { email: 'client-a@example.invalid', role: 'admin' } });
  const response = await request(flow.callback, null, { headers: { cookie: flow.browserCookie } });
  assert.equal(response.status, 403);
  assert.equal((await db.prepare('SELECT count(*) AS count FROM sessions').first()).count, 4);
});
test('signed tokens with wrong audience, issuer, or expired lifetime fail closed', async () => {
  for (const claimsOverride of [{ aud: 'another-client' }, { iss: 'https://other.example.invalid/' }, { exp: now() - 300 }]) {
    const flow = await provider({ claimsOverride });
    assert.equal((await request(flow.callback, null, { headers: { cookie: flow.browserCookie } })).status, 503);
  }
  assert.equal((await db.prepare('SELECT count(*) AS count FROM sessions').first()).count, 4);
});
test('authentication rotates an existing browser session rather than reusing it', async () => {
  const flow = await provider();
  const response = await request(flow.callback, null, {
    headers: { cookie: `${flow.browserCookie}; tk9_session=${sessions['client-a'].token}` }
  });
  assert.equal(response.status, 302);
  assert.equal((await request('/api/me', 'client-a')).status, 401);
});
test('database constraints reject invalid memberships and unsupported staff roles', async () => {
  await assert.rejects(db.prepare("INSERT INTO memberships(user_id,household_id) VALUES ('missing-user','house-a')").run());
  await assert.rejects(db.prepare("INSERT INTO staff_roles(user_id,role) VALUES ('client-a','superadmin')").run());
});
test('audit failure rolls back the account mutation rather than reporting partial success', async () => {
  await db.prepare("CREATE TRIGGER test_audit_failure BEFORE INSERT ON audit_logs BEGIN SELECT RAISE(ABORT,'test-only audit failure'); END").run();
  try {
    const response = await mutation('/api/households/house-a', 'client-a', { contactName: 'Must roll back', phone: '', city: '' }, 'PATCH');
    assert.equal(response.status, 503);
    assert.equal((await db.prepare("SELECT contact_name FROM households WHERE id='house-a'").first()).contact_name, 'Test household a');
    assert.doesNotMatch(await response.text(), /test-only|SQL|D1/);
  } finally {
    await db.prepare('DROP TRIGGER test_audit_failure').run();
  }
});
