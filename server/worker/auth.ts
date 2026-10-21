import * as oauth from 'oauth4webapi';

export interface Env {
  DB: D1Database | D1DatabaseSession;
  ASSETS: Fetcher;
  APP_ENV: string;
  APP_ORIGIN: string;
  AUTH_ISSUER: string;
  AUTH_CLIENT_ID: string;
  AUTH_CLIENT_SECRET?: string;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export interface Identity {
  id: string;
  display_name: string;
  csrf_token: string;
  role: 'admin' | 'reviewer' | null;
}

export function appConfig(env: Env) {
  let origin: URL;
  try { origin = new URL(env.APP_ORIGIN); }
  catch { throw new HttpError(503, 'Portal origin is not configured.'); }
  const local = env.APP_ENV === 'development' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
  if (origin.origin !== env.APP_ORIGIN || origin.username || origin.password ||
      (!local && origin.protocol !== 'https:') ||
      !['development', 'preview', 'production'].includes(env.APP_ENV)) {
    throw new HttpError(503, 'Portal origin is not configured safely.');
  }
  return { origin: origin.origin, local };
}

function providerConfig(env: Env) {
  const config = appConfig(env);
  if (!env.AUTH_CLIENT_ID || !env.AUTH_CLIENT_SECRET || !env.AUTH_ISSUER) {
    throw new HttpError(503, 'Sign-in is not configured. Contact Taurus K9.');
  }
  return { ...config, issuer: trustedIssuer(env), client: { client_id: env.AUTH_CLIENT_ID }, secret: env.AUTH_CLIENT_SECRET };
}

function trustedIssuer(env: Env) {
  let issuer: URL;
  try { issuer = new URL(env.AUTH_ISSUER); }
  catch { throw new HttpError(503, 'Sign-in provider configuration is invalid.'); }
  if (issuer.protocol !== 'https:' || issuer.username || issuer.password ||
      issuer.search || issuer.hash || issuer.pathname !== '/' ||
      issuer.href !== env.AUTH_ISSUER) {
    throw new HttpError(503, 'Sign-in provider configuration is invalid.');
  }
  return issuer;
}

// Auth0 ends its single-sign-on session at /v2/logout and then redirects only to a URL
// listed in the application's Allowed Logout URLs. The return target is always the
// public site at the configured APP_ORIGIN; no browser-supplied value is used and no
// token is included. If the provider is not configured, only the app session ends.
function federatedLogoutUrl(env: Env) {
  const returnTo = `${appConfig(env).origin}/`;
  if (!env.AUTH_CLIENT_ID) return returnTo;
  let issuer: URL;
  try { issuer = trustedIssuer(env); }
  catch { return returnTo; }
  const target = new URL('v2/logout', issuer);
  target.search = new URLSearchParams({ client_id: env.AUTH_CLIENT_ID, returnTo }).toString();
  return target.href;
}

export async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

function cookieName(env: Env, kind: 'session' | 'login') {
  return `${appConfig(env).local ? '' : '__Host-'}tk9_${kind}`;
}

function readCookie(request: Request, name: string) {
  const matches = (request.headers.get('cookie') || '').split(';')
    .map(part => part.trim()).filter(part => part.startsWith(`${name}=`));
  if (matches.length !== 1) return '';
  const value = matches[0].slice(name.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : '';
}

export function cookie(env: Env, kind: 'session' | 'login', value: string, maxAge: number) {
  return `${cookieName(env, kind)}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${appConfig(env).local ? '' : '; Secure'}`;
}

export async function rateLimit(request: Request, env: Env, scope: string, limit: number, seconds = 60) {
  const now = Math.floor(Date.now() / 1000);
  const ip = request.headers.get('CF-Connecting-IP') || (appConfig(env).local ? 'local' : null);
  if (!ip) throw new HttpError(503, 'Request verification is unavailable.');
  const bucket = await hash(`${env.APP_ORIGIN}|${scope}|${ip}|${Math.floor(now / seconds)}`);
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits(bucket_hash, count, reset_at) VALUES (?, 1, ?)
     ON CONFLICT(bucket_hash) DO UPDATE SET count = count + 1 RETURNING count`
  ).bind(bucket, now + seconds).first<{ count: number }>();
  if (!row || row.count > limit) throw new HttpError(429, 'Too many requests. Please try again shortly.');
}

export async function requireIdentity(request: Request, env: Env): Promise<Identity> {
  const token = readCookie(request, cookieName(env, 'session'));
  if (!token) throw new HttpError(401, 'Sign in to access the portal.');
  const identity = await env.DB.prepare(
    `SELECT u.id, u.display_name, s.csrf_token, r.role
     FROM sessions s JOIN users u ON u.id = s.user_id
     LEFT JOIN staff_roles r ON r.user_id = u.id
     WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1`
  ).bind(await hash(token), Math.floor(Date.now() / 1000)).first<Identity>();
  if (!identity) throw new HttpError(401, 'Your session has expired. Please sign in again.');
  return identity;
}

export function requireStaff(identity: Identity, adminOnly = false) {
  if (identity.role !== 'admin' && (adminOnly || identity.role !== 'reviewer')) {
    throw new HttpError(403, 'You do not have permission to access this area.');
  }
}

export function requireCsrf(request: Request, env: Env, identity: Identity) {
  if (request.headers.get('origin') !== appConfig(env).origin ||
      request.headers.get('x-csrf-token') !== identity.csrf_token) {
    throw new HttpError(403, 'Request verification failed. Refresh the portal and try again.');
  }
}

export async function startLogin(env: Env, signup = false) {
  const config = providerConfig(env);
  const server = await oauth.processDiscoveryResponse(config.issuer,
    await oauth.discoveryRequest(config.issuer, { signal: AbortSignal.timeout(10000) }));
  if (!server.authorization_endpoint) throw new HttpError(503, 'Sign-in provider is unavailable.');
  const target = new URL(server.authorization_endpoint);
  if (target.protocol !== 'https:') throw new HttpError(503, 'Sign-in provider is unavailable.');
  const state = oauth.generateRandomState();
  const browser = oauth.generateRandomState();
  const nonce = oauth.generateRandomNonce();
  const verifier = oauth.generateRandomCodeVerifier();
  const now = Math.floor(Date.now() / 1000);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM auth_transactions WHERE expires_at <= ?').bind(now),
    env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now),
    env.DB.prepare('DELETE FROM rate_limits WHERE reset_at <= ?').bind(now),
    env.DB.prepare('INSERT INTO auth_transactions(state_hash, browser_hash, verifier, nonce, expires_at) VALUES (?, ?, ?, ?, ?)')
      .bind(await hash(state), await hash(browser), verifier, nonce, now + 600)
  ]);
  target.search = new URLSearchParams({
    client_id: config.client.client_id,
    response_type: 'code',
    scope: 'openid profile',
    redirect_uri: `${config.origin}/api/auth/callback`,
    state, nonce,
    code_challenge: await oauth.calculatePKCECodeChallenge(verifier),
    code_challenge_method: 'S256',
    // Auth0 Universal Login opens its sign-up screen; the account is still provisioned only at the callback.
    ...(signup ? { screen_hint: 'signup' } : {})
  }).toString();
  return new Response(null, { status: 302, headers: { location: target.href, 'set-cookie': cookie(env, 'login', browser, 600) } });
}

const CLIENT_FALLBACK_NAME = 'Taurus K9 client';

function safeDisplayName(value: unknown) {
  if (typeof value !== 'string') return CLIENT_FALLBACK_NAME;
  const chars = Array.from(value.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ').replace(/\s+/g, ' ').trim());
  while (chars.join('').length > 120) chars.pop();
  return chars.join('').trim() || CLIENT_FALLBACK_NAME;
}

// Returns the active user for a validated issuer + subject. A genuinely new identity is
// provisioned as a least-privileged client (user + own household + membership) in one
// atomic batch; staff roles are never created here. Existing identities are never
// modified, re-created or reactivated.
async function findOrProvisionClient(env: Env, issuer: string, subject: string, name: unknown) {
  const lookup = () => env.DB.prepare('SELECT id, active FROM users WHERE issuer = ? AND subject = ?')
    .bind(issuer, subject).first<{ id: string; active: number }>();
  let user = await lookup();
  if (!user) {
    const userId = crypto.randomUUID();
    const householdId = crypto.randomUUID();
    const displayName = safeDisplayName(name);
    // Every dependent insert is conditional on this attempt's user row existing, so a
    // concurrent callback that loses the UNIQUE(issuer, subject) race writes nothing.
    const created = 'EXISTS (SELECT 1 FROM users WHERE id = ? AND issuer = ? AND subject = ?)';
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO users(id, issuer, subject, display_name, active) VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(issuer, subject) DO NOTHING`).bind(userId, issuer, subject, displayName),
      env.DB.prepare(`INSERT INTO households(id, contact_name) SELECT ?, ? WHERE ${created}`)
        .bind(householdId, displayName, userId, issuer, subject),
      env.DB.prepare(`INSERT INTO memberships(user_id, household_id) SELECT ?, ? WHERE ${created}`)
        .bind(userId, householdId, userId, issuer, subject),
      env.DB.prepare(`INSERT INTO audit_logs(id, actor_id, action, resource_id) SELECT ?, ?, ?, ? WHERE ${created}`)
        .bind(crypto.randomUUID(), userId, 'account.self_registered', userId, userId, issuer, subject),
      env.DB.prepare(`INSERT INTO audit_logs(id, actor_id, action, resource_id) SELECT ?, ?, ?, ? WHERE ${created}`)
        .bind(crypto.randomUUID(), userId, 'household.created', householdId, userId, issuer, subject)
    ]);
    user = await lookup();
    if (!user) throw new HttpError(503, 'Your portal account could not be created. Please try again.');
  }
  if (user.active !== 1) throw new HttpError(403, 'Your portal account is disabled. Contact Taurus K9.');
  return { id: user.id };
}

export async function finishLogin(request: Request, env: Env) {
  const config = providerConfig(env);
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  const browser = readCookie(request, cookieName(env, 'login'));
  if (!/^[A-Za-z0-9_-]{43}$/.test(state) || !browser || url.searchParams.getAll('state').length !== 1) {
    throw new HttpError(400, 'Sign-in verification failed. Start sign-in again.');
  }
  const transaction = await env.DB.prepare(
    'DELETE FROM auth_transactions WHERE state_hash = ? AND browser_hash = ? AND expires_at > ? RETURNING verifier, nonce'
  ).bind(await hash(state), await hash(browser), Math.floor(Date.now() / 1000))
    .first<{ verifier: string; nonce: string }>();
  if (!transaction) throw new HttpError(400, 'Sign-in request expired or was already used. Start again.');
  const server = await oauth.processDiscoveryResponse(config.issuer,
    await oauth.discoveryRequest(config.issuer, { signal: AbortSignal.timeout(10000) }));
  const parameters = oauth.validateAuthResponse(server, config.client, url, state);
  const response = await oauth.authorizationCodeGrantRequest(server, config.client,
    oauth.ClientSecretPost(config.secret), parameters, `${config.origin}/api/auth/callback`,
    transaction.verifier, { signal: AbortSignal.timeout(10000) });
  const tokens = await oauth.processAuthorizationCodeResponse(server, config.client, response, {
    expectedNonce: transaction.nonce, requireIdToken: true
  });
  await oauth.validateApplicationLevelSignature(server, response, { signal: AbortSignal.timeout(10000) });
  const claims = oauth.getValidatedIdTokenClaims(tokens);
  if (!claims?.sub) throw new HttpError(400, 'Sign-in verification failed.');
  // Identity is matched only by validated issuer + subject, never an email or provider role claim.
  const user = await findOrProvisionClient(env, config.issuer.href, claims.sub, claims.name);
  const token = oauth.generateRandomState();
  const csrf = oauth.generateRandomState();
  const previous = readCookie(request, cookieName(env, 'session'));
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hash(previous)),
    env.DB.prepare('INSERT INTO sessions(token_hash, user_id, csrf_token, expires_at) VALUES (?, ?, ?, ?)')
      .bind(await hash(token), user.id, csrf, Math.floor(Date.now() / 1000) + 28800),
    env.DB.prepare('INSERT INTO audit_logs(id, actor_id, action, resource_id) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), user.id, 'session.created', user.id)
  ]);
  const headers = new Headers({ location: `${config.origin}/portal/` });
  headers.append('set-cookie', cookie(env, 'session', token, 28800));
  headers.append('set-cookie', cookie(env, 'login', '', 0));
  return new Response(null, { status: 302, headers });
}

export async function logout(request: Request, env: Env, identity: Identity) {
  const token = readCookie(request, cookieName(env, 'session'));
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hash(token)),
    env.DB.prepare('INSERT INTO audit_logs(id, actor_id, action, resource_id) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), identity.id, 'session.revoked', identity.id)
  ]);
  return new Response(JSON.stringify({ redirect: federatedLogoutUrl(env) }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'set-cookie': cookie(env, 'session', '', 0) }
  });
}
