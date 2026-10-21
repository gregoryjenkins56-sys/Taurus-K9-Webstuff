import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import * as oauth from 'oauth4webapi';
import ts from 'typescript';
import worker from '../server/worker/index.ts';
import { cookie, hash } from '../server/worker/auth.ts';
import { validateD1 } from '../scripts/validate-d1.mjs';

const origin = 'http://localhost:8787';
const issuer = 'https://identity.example.invalid/';
let mf;
let db;
let env;
let sessions;
const realFetch = globalThis.fetch;
const now = () => Math.floor(Date.now() / 1000);

test('Wrangler JSONC keeps default, preview and production D1 mappings distinct', async () => {
  const source = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
  const { config, error } = ts.parseConfigFileTextToJson('wrangler.jsonc', source);
  assert.equal(error, undefined);
  const mappings = [config, config.env.preview, config.env.production];
  const databases = mappings.map(mapping => {
    assert.equal(mapping.d1_databases.length, 1);
    const database = mapping.d1_databases[0];
    assert.equal(database.binding, 'DB');
    assert.equal(database.migrations_dir, 'migrations');
    assert.ok(database.database_id);
    assert.ok(database.database_name);
    return database;
  });
  assert.deepEqual(
    databases.map(({ database_name, database_id }) => [database_name, database_id]),
    [
      ['taurus-k9-webstuff', '1a11389d-19cd-4777-9ed7-f397aa6ceb86'],
      ['taurus-k9-webstuff-preview', '78379cab-5c63-4618-a8b6-f51b866ebc2f'],
      ['taurus-k9-webstuff-production', 'a895aff3-d273-46b6-b60f-6ef4096d91cd']
    ]
  );
  assert.equal(new Set(databases.map(database => database.database_id)).size, 3);
  assert.equal(new Set(databases.map(database => database.database_name)).size, 3);
});

test('remote D1 validation rejects placeholders, defaults and live database aliases', async () => {
  const source = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
  const { config } = ts.parseConfigFileTextToJson('wrangler.jsonc', source);
  assert.equal(config.build.command, 'node scripts/validate-d1.mjs');
  for (const environment of ['preview', 'production']) {
    assert.equal(config.env[environment].build.command, `node scripts/validate-d1.mjs ${environment}`);
    config.env[environment].d1_databases[0].database_id = `REPLACE_WITH_${environment.toUpperCase()}_D1_DATABASE_ID`;
  }
  for (const environment of ['preview', 'production']) {
    assert.throws(() => validateD1(config, environment), /Provision a verified/);
  }
  for (const environment of [undefined, '', 'default', 'staging']) {
    assert.throws(() => validateD1(config, environment), /require --env/);
  }
  // Synthetic UUIDs are test-only; they are not remote database identities.
  const previewId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const productionId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  config.env.preview.d1_databases[0].database_id = previewId;
  assert.doesNotThrow(() => validateD1(config, 'preview'));
  assert.throws(() => validateD1(config, 'production'), /Provision a verified/);
  config.env.production.d1_databases[0].database_id = productionId;
  assert.doesNotThrow(() => validateD1(config, 'production'));
  for (const environment of ['preview', 'production']) {
    const mapping = config.env[environment].d1_databases[0];
    const original = structuredClone(mapping);
    for (const value of ['', '00000000-0000-0000-0000-000000000000', 'not-a-uuid']) {
      mapping.database_id = value;
      assert.throws(() => validateD1(config, environment));
    }
    mapping.database_id = config.d1_databases[0].database_id.toUpperCase();
    assert.throws(() => validateD1(config, environment), /must be distinct/);
    Object.assign(mapping, original);
    mapping.database_name = config.d1_databases[0].database_name;
    assert.throws(() => validateD1(config, environment), /must be distinct/);
    Object.assign(mapping, original);
    mapping.binding = 'OTHER';
    assert.throws(() => validateD1(config, environment), /exactly one DB/);
    Object.assign(mapping, original);
  }
  config.env.production.d1_databases[0].database_id = previewId.toUpperCase();
  assert.throws(() => validateD1(config, 'production'), /must be distinct/);
});

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
  for (const path of ['/portal/', '/portal/index.html', '/portal/js/client.js', '/portal/admin', '/admin', '/admin/reviews']) {
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
  const originalNow = Date.now;
  Date.now = () => 1_800_000_000_000;
  try {
    let last;
    for (let i = 0; i < 121; i++) last = await request('/api/me', 'client-a');
    assert.equal(last.status, 429);
    assert.equal(last.headers.get('retry-after'), '60');
    assert.equal(last.headers.get('cache-control'), 'no-store');
    assert.equal(last.headers.get('x-frame-options'), 'DENY');
    assert.match(last.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  } finally {
    Date.now = originalNow;
  }
});
test('production session cookies require HTTPS and no configuration can enable a login bypass', async () => {
  assert.match(cookie({ ...env, APP_ENV: 'production', APP_ORIGIN: 'https://portal.example.invalid' }, 'session', 'value', 10), /^__Host-tk9_session=.*Secure$/);
  assert.equal((await request('/api/me', null, {}, { ...env, APP_ENV: 'production' })).status, 503);
  assert.equal((await request('/api/me', null, {}, { ...env, APP_ENV: 'preview' })).status, 503);
});

async function provider({ badSignature = false, subject = 'subject-client-a', nonceOverride, claimsOverride = {}, count = 1 } = {}) {
  const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...await crypto.subtle.exportKey('jwk', pair.publicKey), kid: crypto.randomUUID(), alg: 'RS256', use: 'sig' };
  const logins = [];
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
      const challenge = await oauth.calculatePKCECodeChallenge(params.get('code_verifier'));
      const login = logins.find(candidate => candidate.searchParams.get('code_challenge') === challenge);
      assert.ok(login);
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
  const flows = [];
  for (let i = 0; i < count; i++) {
    const response = await request('/api/auth/login');
    assert.equal(response.status, 302);
    const login = new URL(response.headers.get('location'));
    logins.push(login);
    const browserCookie = response.headers.get('set-cookie').split(';')[0];
    flows.push({ login, browserCookie, callback: `/api/auth/callback?code=test-code&state=${login.searchParams.get('state')}` });
  }
  return { ...flows[0], flows };
}
async function complete(flow, bindings = env) {
  return request(flow.callback, null, { headers: { cookie: flow.browserCookie } }, bindings);
}
function sessionFrom(response) {
  return response.headers.getSetCookie().find(value => value.startsWith('tk9_session=')).split(';')[0];
}
async function counts() {
  const row = await db.prepare(`SELECT (SELECT count(*) FROM users) AS users, (SELECT count(*) FROM households) AS households,
    (SELECT count(*) FROM memberships) AS memberships, (SELECT count(*) FROM staff_roles) AS roles,
    (SELECT count(*) FROM sessions) AS sessions`).first();
  return { ...row };
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
test('signup route requests the Auth0 sign-up screen with the same PKCE/state/nonce protections', async () => {
  await provider();
  const response = await request('/api/auth/signup');
  assert.equal(response.status, 302);
  const target = new URL(response.headers.get('location'));
  assert.equal(target.searchParams.get('screen_hint'), 'signup');
  for (const name of ['state', 'nonce', 'code_challenge']) assert.ok(target.searchParams.get(name));
  assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
  assert.match(response.headers.get('set-cookie'), /^tk9_login=/);
  assert.equal((await request('/api/auth/login')).headers.get('location').includes('screen_hint'), false);
});
test('new identity self-provisions a least-privileged client with its own household; email and role claims are ignored', async () => {
  const before = await counts();
  const flow = await provider({ subject: 'google-oauth2|synthetic-new-client', claimsOverride: {
    name: ' New\u202e Client\n ', email: 'client-a@example.invalid', role: 'admin', household_id: 'house-a' } });
  const response = await complete(flow);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), `${origin}/portal/`);
  const cookieHeader = { headers: { cookie: sessionFrom(response) } };
  const me = await (await request('/api/me', null, cookieHeader)).json();
  assert.ok(!['client-a', 'client-b', 'reviewer', 'admin'].includes(me.user.id));
  assert.equal(me.user.role, null);
  assert.equal(me.user.name, 'New Client');
  assert.equal(me.households.length, 1);
  const house = me.households[0];
  assert.ok(!['house-a', 'house-b'].includes(house.id));
  assert.deepEqual({ ...house, id: undefined }, { id: undefined, contact_name: 'New Client', phone: '', city: '' });
  const user = await db.prepare('SELECT issuer, subject, active FROM users WHERE id=?').bind(me.user.id).first();
  assert.deepEqual({ ...user }, { issuer, subject: 'google-oauth2|synthetic-new-client', active: 1 });
  assert.equal(await db.prepare('SELECT role FROM staff_roles WHERE user_id=?').bind(me.user.id).first(), null);
  assert.deepEqual(await counts(), { ...before, users: before.users + 1, households: before.households + 1,
    memberships: before.memberships + 1, sessions: before.sessions + 1 });
  const { results } = await db.prepare('SELECT action, resource_id FROM audit_logs WHERE actor_id=? ORDER BY action').bind(me.user.id).all();
  assert.deepEqual(results.map(row => [row.action, row.resource_id]), [
    ['account.self_registered', me.user.id], ['household.created', house.id], ['session.created', me.user.id]]);
  // The new client is isolated from other households and staff areas.
  assert.equal((await request('/api/households/house-a/dogs', null, cookieHeader)).status, 404);
  assert.equal((await request('/api/dogs/dog-a', null, cookieHeader)).status, 404);
  assert.equal((await request('/api/admin/clients', null, cookieHeader)).status, 403);
  assert.equal((await request('/api/admin/audit', null, cookieHeader)).status, 403);
  assert.equal((await request('/admin/reviews', null, cookieHeader)).status, 403);
  // Onboarding: the client completes their own household details and adds a dog without staff help.
  const write = (path, body, method = 'POST') => request(path, null, { method, body: JSON.stringify(body),
    headers: { ...cookieHeader.headers, origin, 'x-csrf-token': me.csrfToken } });
  assert.equal((await write(`/api/households/${house.id}`, { contactName: 'New Client', phone: '555-0100', city: 'Rockport' }, 'PATCH')).status, 200);
  assert.equal((await write(`/api/households/${house.id}/dogs`, { name: 'Scout', breed: '', birthDate: '', approximateAge: '1 year' })).status, 201);
  assert.equal((await write(`/api/households/${house.id}`, { contactName: 'x', phone: '', city: '', householdId: 'house-a' }, 'PATCH')).status, 400);
  assert.equal((await request('/api/households/house-a/dogs', 'client-a').then(r => r.json())).dogs.length, 1);
  assert.equal((await db.prepare("SELECT contact_name FROM households WHERE id='house-a'").first()).contact_name, 'Test household a');
});
test('display name falls back safely when the validated profile has no usable name', async () => {
  for (const [index, name] of [undefined, 42, '   ', '\u0000\u0007'].entries()) {
    const flow = await provider({ subject: `synthetic-fallback-${index}`, claimsOverride: name === undefined ? {} : { name } });
    const me = await (await request('/api/me', null, { headers: { cookie: sessionFrom(await complete(flow)) } })).json();
    assert.equal(me.user.name, 'Taurus K9 client');
    assert.equal(me.households[0].contact_name, 'Taurus K9 client');
  }
  const flow = await provider({ subject: 'synthetic-long-name', claimsOverride: { name: '\u{1F415}'.repeat(200) } });
  const me = await (await request('/api/me', null, { headers: { cookie: sessionFrom(await complete(flow)) } })).json();
  assert.ok(me.user.name.length <= 120 && me.user.name.length > 0);
});
test('repeated sign-in for a self-provisioned or existing client is idempotent and keeps memberships', async () => {
  const subject = 'synthetic-repeat-client';
  const first = await (await request('/api/me', null, { headers: { cookie: sessionFrom(await complete(await provider({ subject }))) } })).json();
  const before = await counts();
  const second = await (await request('/api/me', null, { headers: { cookie: sessionFrom(await complete(await provider({ subject, claimsOverride: { name: 'Renamed' } }))) } })).json();
  assert.equal(second.user.id, first.user.id);
  assert.equal(second.user.name, first.user.name);
  assert.deepEqual(second.households, first.households);
  assert.deepEqual(await counts(), { ...before, sessions: before.sessions + 1 });
  for (const user of ['client-a', 'admin']) {
    const existing = await counts();
    const me = await (await request('/api/me', null, { headers: { cookie: sessionFrom(await complete(await provider({ subject: `subject-${user}` }))) } })).json();
    assert.equal(me.user.id, user);
    assert.deepEqual(me.households.map(house => house.id), user === 'client-a' ? ['house-a'] : []);
    assert.equal(me.user.role, user === 'admin' ? 'admin' : null);
    assert.deepEqual(await counts(), { ...existing, sessions: existing.sessions + 1 });
  }
});
test('inactive identities stay blocked and are never re-created or reactivated', async () => {
  await db.prepare("UPDATE users SET active = 0 WHERE id = 'client-b'").run();
  const before = await counts();
  const response = await complete(await provider({ subject: 'subject-client-b' }));
  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /disabled/);
  assert.equal(response.headers.getSetCookie().some(value => value.startsWith('tk9_session=') && !/Max-Age=0/.test(value)), false);
  assert.deepEqual(await counts(), before);
  assert.equal((await db.prepare("SELECT active FROM users WHERE id='client-b'").first()).active, 0);
});
test('provisioning failure is atomic: no partial user, household or membership is left behind', async () => {
  const before = await counts();
  await db.prepare("CREATE TRIGGER test_membership_failure BEFORE INSERT ON memberships BEGIN SELECT RAISE(ABORT,'test-only membership failure'); END").run();
  try {
    const response = await complete(await provider({ subject: 'synthetic-atomic-client' }));
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /test-only|SQL|D1/);
    assert.deepEqual(await counts(), before);
  } finally {
    await db.prepare('DROP TRIGGER test_membership_failure').run();
  }
  assert.equal((await complete(await provider({ subject: 'synthetic-atomic-client' }))).status, 302);
  assert.deepEqual(await counts(), { ...before, users: before.users + 1, households: before.households + 1,
    memberships: before.memberships + 1, sessions: before.sessions + 1 });
});
test('concurrent first sign-ins for one identity create exactly one user and household', async () => {
  const subject = 'synthetic-concurrent-client';
  const before = await counts();
  const { flows } = await provider({ subject, count: 3 });
  const responses = await Promise.all(flows.map(flow => complete(flow)));
  assert.deepEqual(responses.map(response => response.status), [302, 302, 302]);
  const ids = await Promise.all(responses.map(async response =>
    (await (await request('/api/me', null, { headers: { cookie: sessionFrom(response) } })).json()).user.id));
  assert.equal(new Set(ids).size, 1);
  assert.deepEqual(await counts(), { ...before, users: before.users + 1, households: before.households + 1,
    memberships: before.memberships + 1, sessions: before.sessions + 3 });
});
test('a callback that loses the provisioning race writes no orphan household and joins the winner', async () => {
  const subject = 'synthetic-race-client';
  const flow = await provider({ subject });
  let raced = false;
  const racingDb = {
    prepare: sql => db.prepare(sql),
    async batch(statements) {
      if (!raced && statements.length === 5) {
        raced = true;
        // Simulates another callback committing between this callback's lookup and its batch.
        await db.prepare('INSERT INTO users(id, issuer, subject, display_name) VALUES (?, ?, ?, ?)').bind('race-winner', issuer, subject, 'Winner').run();
        await db.prepare("INSERT INTO households(id, contact_name) VALUES ('race-house', 'Winner')").run();
        await db.prepare("INSERT INTO memberships(user_id, household_id) VALUES ('race-winner', 'race-house')").run();
      }
      return db.batch(statements);
    }
  };
  const before = await counts();
  const response = await complete(flow, { ...env, DB: racingDb });
  assert.equal(raced, true);
  assert.equal(response.status, 302);
  const me = await (await request('/api/me', null, { headers: { cookie: sessionFrom(response) } })).json();
  assert.equal(me.user.id, 'race-winner');
  assert.deepEqual(me.households.map(house => house.id), ['race-house']);
  assert.deepEqual(await counts(), { ...before, users: before.users + 1, households: before.households + 1,
    memberships: before.memberships + 1, sessions: before.sessions + 1 });
  assert.equal((await db.prepare("SELECT count(*) AS count FROM audit_logs WHERE action IN ('account.self_registered', 'household.created')").first()).count, 0);
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
