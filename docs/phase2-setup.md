# Phase 2: protected portal foundation

## Implemented versus blocked

Implemented: a Cloudflare Worker serving the existing public site and portal,
Auth0/OIDC authorization-code sign-in with PKCE, state, browser binding, nonce and
ID-token signature validation through maintained `oauth4webapi`; hashed random
session tokens in D1; eight-hour absolute expiry; logout revocation; CSRF and
Origin checks; database-backed rate limits; household authorization; protected
staff roles; self-service client account provisioning at first sign-in; contact
updates; dog creation/listing; and audit records.

The portal has no demo adapter or synthetic fallback. An unconfigured provider
fails explicitly. Unauthenticated requests to the portal (including its assets)
redirect to login; protected APIs return 401. Clients cannot read staff APIs or
write role/membership fields. Reviewer access is distinct from administrator
access. Staff roles and user activation are checked against D1 on every request.

Not implemented:
Veterinary uploads/review, private storage, malware scanning, HubSpot, Adobe,
payments, contract completion, photo uploads, dog editing/deletion,
staff role-management UI, automated invitations, password reset
UI, deployment, or production readiness certification. Staff directory/audit
lists are capped at 100 entries; pagination is future work. Readiness is unavailable.
The unavailable record-review route is protected for reviewers/admins.

Authentication and the database are real code, not a live-configured service.
End-to-end sign-in against your actual Auth0 tenant requires your configuration.
Tests use a test-only signed OIDC provider and real local D1/SQLite; there is no
test login route or bypass in the Worker.

## Prerequisites and commands

Use Node.js 22.14+ and npm. From the repository root:

```sh
npm ci
npm run db:migrate:local
cp .env.example .dev.vars
# Fill .dev.vars with DEVELOPMENT Auth0 values, as described below.
npm run dev
```

Open <http://localhost:8787/> and choose Client Login, or open
<http://localhost:8787/portal/>. Keep the exact hostname consistent: `127.0.0.1`
and `localhost` are different origins/cookie hosts. Stop with Ctrl+C.
`npm run dev` builds the frontend allowlist/type-checks, then starts Wrangler
locally. Restart after edits to refresh copied static assets.
Phase 2 local D1 state uses Wrangler's default ignored `.wrangler/state/` directory.
For independent review, use a fresh external directory consistently:
```sh
npm run db:migrate:local -- --persist-to /absolute/private/phase2-review-state
npx wrangler d1 execute DB --local \
  --persist-to /absolute/private/phase2-review-state \
  --file /absolute/private/path/development-account.sql
npm run dev -- --persist-to /absolute/private/phase2-review-state
```
Use that same `--persist-to` directory for every operator D1 command.
Do not reuse or downgrade a database already migrated for later phases.

**Use the Worker, not Python's file server or GitHub Pages, for this portal.**
Static-only serving cannot enforce server-side route protection. Never publish the
repository root: it contains backend source, migrations, and development files.
The build outputs only explicit public assets to ignored `dist/`; the Worker runs
before static assets, including portal HTML, JavaScript, and CSS.
The old demo modules/tests are removed from both source and packaged assets.

## Auth0 development application

1. Create a **Regular Web Application** in a separate development tenant/app.
2. Configure client authentication as **POST** and ID token signing as **RS256**.
3. Register exactly `http://localhost:8787/api/auth/callback` as an allowed callback
   and exactly `http://localhost:8787/` as an **Allowed Logout URL**.
4. Populate `.dev.vars` using the actual issuer (HTTPS, trailing slash, no path),
   client ID and client secret. No real secrets belong in Git or chat.
5. To let clients create their own accounts, enable sign-up on the Auth0
   connection(s) the application uses (Authentication → Database → your
   connection → *Disable Sign Ups* off, and/or enable a social connection such as
   Google for this application). To stop public sign-ups, turn sign-up off there.
6. Use Auth0's **New Universal Login** so `/api/auth/signup` (which sends
   `screen_hint=signup`) opens the sign-up screen; `/api/auth/login` shows the
   login screen, which links to sign-up when it is enabled.

## Client sign-up and account provisioning

There are two separate steps:

1. **Auth0 identity sign-up** (Auth0-managed): the person creates an Auth0
   identity (email/password or social login). Password, email verification and
   MFA policy are configured in Auth0, not in this application.
2. **Application provisioning** (this Worker, `/api/auth/callback`): after the
   authorization code, PKCE, state, browser binding, nonce and ID-token signature
   are validated, the Worker looks up `users` by the configured issuer and the
   validated `sub` claim only.
   - **New identity:** in one atomic D1 batch it creates an active client `users`
     row (random UUID, display name from the validated `name` claim with control
     characters removed, max 120 characters, otherwise `Taurus K9 client`), a new
     household for that client, the membership linking them, and
     `account.self_registered`/`household.created` audit events. No
     `staff_roles` row is ever created. Email, role, household or any other
     client-supplied value is never used to link accounts or grant access.
   - **Existing active identity:** signs in unchanged; existing memberships,
     roles and display name are kept and no household is added.
   - **Existing inactive identity** (`active = 0`): receives a 403 "account is
     disabled" response; it is never re-created or reactivated.
   - Concurrent first callbacks are safe: `UNIQUE(issuer, subject)` decides the
     single winner and every dependent insert is conditional on that attempt's
     user row, so a losing attempt writes nothing and signs in as the winner.

After first sign-in, the client finishes onboarding in the portal: the dashboard
prompts them to add phone/city under **Owner information** and to add dogs. These
are the existing household-scoped, CSRF-protected endpoints; no staff action is
needed. Users created manually before this change keep whatever memberships they
had; a user with no membership sees "No household is assigned" until an operator
adds one (see below).
The callback URL is always derived from `APP_ORIGIN`, not browser input.
Provider access/ID tokens are validated then discarded; none are exposed to the
browser or stored. Provider password/MFA policies remain Auth0-managed.
Sign-out ends both the portal session and the Auth0 single-sign-on session (see
[Sign-out and Auth0 logout](#sign-out-and-auth0-logout)).

The local app uses HttpOnly, SameSite=Lax cookies without Secure **only** when
APP_ENV is development and APP_ORIGIN is loopback. All other environments
require HTTPS and use Secure `__Host-` cookies. Never use development configuration
for a deployed Worker. Separate preview/prod tenants, origins, databases, and secrets.
Workers.dev and preview URLs are disabled by default; deployment is not performed.
The runtime must supply a trusted connecting IP (Cloudflare's platform header);
do not put an untrusted proxy in front of it that lets clients forge this header.

## Sign-out and Auth0 logout

The portal and Auth0 keep **separate** sessions. Clicking **Sign out**:

1. Sends a CSRF-protected `POST /api/auth/logout` (exact `Origin` and
   `x-csrf-token` required). The Worker deletes the server-side session row,
   records a `session.revoked` audit event in the same D1 batch, and clears the
   session cookie (`Max-Age=0`, same `HttpOnly`/`SameSite=Lax`/`Secure`/`__Host-`
   attributes as sign-in).
2. Returns JSON `{ "redirect": "<url>" }`. The Worker builds this URL itself:
   `<AUTH_ISSUER>v2/logout?client_id=<AUTH_CLIENT_ID>&returnTo=<APP_ORIGIN>/`.
   The return target is always the public homepage of the configured
   `APP_ORIGIN`; query strings, request bodies, `Referer` and other browser
   input are ignored, so there is no open redirect. No ID/access token or secret
   is included (none is stored).
3. The portal navigates to that URL. Auth0 ends its SSO session and returns the
   browser to the public site. The next Client Login shows the Auth0 login screen.

If `AUTH_CLIENT_ID` or a valid HTTPS `AUTH_ISSUER` is missing, the portal session
is still revoked and the browser returns to the public site, but the Auth0
session cannot be ended (sign-in is unavailable in that state anyway).
The `federated` parameter is intentionally not sent, so users are **not** signed
out of Google or other upstream social providers.

### Auth0 dashboard settings (per environment)

In **Auth0 Dashboard → Applications → Applications → *your Regular Web
Application* → Settings → Application URIs**, set **Allowed Logout URLs** to the
exact `APP_ORIGIN` followed by `/` for every environment that uses that
application (comma-separated). It must match character for character
(scheme, host, port and trailing slash). Then click **Save Changes**.

| Environment | `APP_ORIGIN` (from `.dev.vars` / `wrangler.jsonc`) | Allowed Logout URL | Allowed Callback URL |
| --- | --- | --- | --- |
| Local development | `http://localhost:8787` | `http://localhost:8787/` | `http://localhost:8787/api/auth/callback` |
| Preview (`--env preview`) | `https://taurus-k9-webstuff.taurusk9tx.workers.dev` | `https://taurus-k9-webstuff.taurusk9tx.workers.dev/` | `https://taurus-k9-webstuff.taurusk9tx.workers.dev/api/auth/callback` |
| Production (`--env production`) | value of `env.production.vars.APP_ORIGIN` (currently `https://taurus-k9-webstuff-production.workers.dev`) | that origin + `/` | that origin + `/api/auth/callback` |

If production moves to a custom domain, change `APP_ORIGIN` and replace the
production Allowed Logout/Callback URLs with the new origin. Note: the checked-in
production `APP_ORIGIN` has no account subdomain (workers.dev addresses normally
look like `<worker>.<account-subdomain>.workers.dev`) and production has
workers.dev disabled; set the real production origin in `APP_ORIGIN` before
launch and register exactly that value in Auth0. Prefer separate
Auth0 applications (or tenants) for preview and production; register each
environment's URLs only on its own application. Only origins/URLs go here — never
paste the client secret into these fields, Git, or chat.

### Verifying end-to-end logout

1. Sign in to the client portal of the environment being tested.
2. Click **Sign out**. The browser briefly visits `…auth0.com/v2/logout` and lands
   on the public homepage of the same origin.
3. Open `<APP_ORIGIN>/api/me`: it must return 401.
4. Click **Client Login** (or open `/portal/`): the Auth0 login screen must ask
   for credentials or an account choice instead of opening the portal directly.

### Troubleshooting

- **Auth0 shows an error page saying the `returnTo` parameter is not defined
  in "Allowed Logout URLs"** after Sign out: the logout URL is not in Allowed Logout URLs for this
  application. Add the exact origin with trailing slash shown in the table.
- **Client Login still opens the portal without prompting:** confirm the address
  bar passed through `/v2/logout` after Sign out. If not, the deployed Worker or
  cached `portal/js/client.js` predates this change — redeploy with the correct
  `--env` and hard-refresh. Also confirm the deployed `AUTH_ISSUER` and
  `AUTH_CLIENT_ID` match the Auth0 application whose settings you edited.
- **Google (or another social provider) signs you in with one click:** Auth0 did
  log out, but the upstream provider session remains, so Auth0 may only show an
  account chooser. This is expected; sign out of that provider separately if
  needed.
- **Sign out reports "Your session has expired":** the portal session was
  already gone, so the logout URL could not be issued. Close the browser or sign
  in and sign out again to end the Auth0 session.

## Operator provisioning (staff roles and exceptions only)

Clients no longer need manual SQL. Staff roles, deactivation and repairs to
manually created accounts remain direct D1 operator actions, protected by local
machine access or Cloudflare IAM. There is no public role assignment endpoint or
client-editable role field.

To pre-create an account manually (optional), create a private SQL file **outside this repository**; use synthetic development
identity data only. Replace the example issuer/subject below with the exact
development identity provider values. Never commit the completed file.

```sql
INSERT INTO users(id, issuer, subject, display_name)
VALUES ('local-client', 'https://YOUR-TENANT.auth0.com/',
        'REPLACE_WITH_VERIFIED_SUBJECT', 'Development client');
INSERT INTO households(id, contact_name) VALUES ('local-household', 'Development household');
INSERT INTO memberships(user_id, household_id) VALUES ('local-client', 'local-household');
```

Apply to the **local** database only:

```sh
npx wrangler d1 execute DB --local --file /absolute/private/path/development-account.sql
```

For a verified staff identity, provision a separate `users` record (or let the
staff member sign in once, which creates an ordinary client account and household,
and look up its `users.id` by issuer and subject), then explicitly insert its
approved role in a private operator SQL file:

```sql
INSERT INTO staff_roles(user_id, role) VALUES ('VERIFIED_STAFF_USER_ID', 'reviewer');
-- Or 'admin' after explicit authorization, never based on email domain or user claims.
```

Reviewer can access the protected, unavailable record review area; only
admin can list client households and audit events. Staff do not implicitly become
household members. To revoke access, delete the staff-role row; to disable an
account, set `users.active = 0` and delete its sessions in an approved operator
transaction. Checks read fresh primary D1 state per request.

Restrict Cloudflare database/secret access to trusted operators; direct SQL has
privileges beyond application roles. Protect and record operator actions through
your administrative change-control process. Application writes and login/logout
events are audited atomically with their mutations. No database export containing
client data belongs in this repository.

## Configuration actually consumed

| Setting | Purpose |
| --- | --- |
| `APP_ENV` | `development`, `preview`, or `production`; loopback-only HTTP exception |
| `APP_ORIGIN` | Exact scheme/host/port, no trailing slash |
| `AUTH_ISSUER` | Actual HTTPS OIDC issuer with trailing slash |
| `AUTH_CLIENT_ID` | Auth0 Regular Web Application ID |
| `AUTH_CLIENT_SECRET` | Server secret; `.dev.vars` locally, Worker secret storage later |
| `DB` | D1 binding defined in `wrangler.jsonc` |
| `ASSETS` | Build output binding defined in `wrangler.jsonc` |

Cloudflare build-command variables are not Worker runtime bindings. The Worker
reads the `AUTH_*` names above; configure `AUTH_CLIENT_SECRET` as a Worker secret
for each environment, not as a build variable or in source control. Build/deploy
commands must select the intended environment explicitly (`--env preview` or
`--env production`).

Use the matching deploy command in each Cloudflare build configuration:

```sh
# Previews Base
npm run build && npx wrangler deploy --env preview

# Production
npm run build && npx wrangler deploy --env production
```

The GitHub Actions workflow runs checks only; it does not deploy to Cloudflare.

### D1 environment mapping and remote migration runbook

| Wrangler selection | D1 database name | Database ID |
| --- | --- | --- |
| No `--env` (legacy/default) | `taurus-k9-webstuff` | Existing `1a11389d-19cd-4777-9ed7-f397aa6ceb86`, retained for compatibility |
| `--env preview` | `taurus-k9-webstuff-preview` | `78379cab-5c63-4618-a8b6-f51b866ebc2f` |
| `--env production` | `taurus-k9-webstuff-production` | `a895aff3-d273-46b6-b60f-6ef4096d91cd` |

The default is **not** an alias for either named environment. Use it only with
`--local` for local work (`.dev.vars` supplies development settings); the checked-in
default runtime vars are production settings. Never deploy or migrate remotely
without an explicit `--env`. Local D1 state is separate from remote D1.
The preview and production IDs above are the intended operator-supplied values,
but this repository cannot verify that they exist in or belong to the approved
Cloudflare account. Before any remote use, verify account access and each ID
with `wrangler whoami` and `wrangler d1 list`. The preflight validates UUID
format and distinct mappings, not database ownership or existence. Database
names alone do not isolate databases; IDs must be distinct across all three
mappings. Do not copy the legacy ID into either block.

Wrangler's custom build runs `scripts/validate-d1.mjs` before deployment (including
`deploy --dry-run` and version uploads). It rejects the default environment,
placeholders/non-UUIDs in the selected named environment, and shared IDs or names.
A UUID's format is not proof of ownership: operators must still verify it against
the approved Cloudflare account. The other named environment may remain
unprovisioned, but must never share the selected or legacy database.
Local `wrangler dev` skips this deployment preflight so local development still
works; use local mode only, not remote development against the legacy mapping.
Do not bypass the custom build with `--ignore-custom-build` or alternate configs.
D1 migration/execute commands do not run custom builds, so the commands below
explicitly chain the same preflight with `&&` to stop on failure.

Before remote operations, obtain deployment/migration approval and confirm the
Cloudflare account with `npx wrangler whoami`. Run `npx wrangler d1 list` to inspect
existing databases and verify their names and UUIDs. If the intended databases
do not exist, create them in the approved account:

```sh
npx wrangler d1 create taurus-k9-webstuff-preview
npx wrangler d1 create taurus-k9-webstuff-production
```

If an intended database has a different verified ID, update only the
corresponding `env.preview.d1_databases[0].database_id` or
`env.production.d1_databases[0].database_id` in `wrangler.jsonc`. If an existing
database has a different name, update its `database_name` too. Stop if the IDs
are shared or the account/ownership is unclear.
Provisioning a new database does not transfer existing users or other data;
plan any required data migration separately. Review backups/restore and pending
SQL before applying migrations, especially in production.

From the repository root, use binding `DB` with the explicit environment so
Wrangler selects the same mapping for migrations and the deployed Worker:

```sh
# Preview: review, apply, then verify.
node scripts/validate-d1.mjs preview &&
npx wrangler d1 migrations list DB --env preview --remote
node scripts/validate-d1.mjs preview &&
npx wrangler d1 migrations apply DB --env preview --remote
node scripts/validate-d1.mjs preview &&
npx wrangler d1 execute DB --env preview --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name='rate_limits';"

# Production: repeat only after preview verification and production approval.
node scripts/validate-d1.mjs production &&
npx wrangler d1 migrations list DB --env production --remote
node scripts/validate-d1.mjs production &&
npx wrangler d1 migrations apply DB --env production --remote
node scripts/validate-d1.mjs production &&
npx wrangler d1 execute DB --env production --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name='rate_limits';"
```

Each verification must return one row named `rate_limits`, created by
`migrations/0001_foundation.sql`. An empty result means the table is still absent:
stop and recheck the account, environment, UUID and migration history. Do not
delete migration history or blindly replay SQL against a populated database.
If the table exists but preview still reports `no such table`, verify that the
deployed Worker's `DB` binding uses that same UUID, and redeploy the reviewed
configuration with `npx wrangler deploy --env preview` (or `--env production`
for the approved production deployment) after `npm run check` passes.
Cloudflare build/deploy settings must likewise select the intended named
environment; a deployment tagged "preview" alone does not prove D1 isolation.

Remote restore, backup, retention, regional requirements, and production Auth0
entitlements/MFA remain launch blockers. Verify origins, Auth0 settings and
environment-specific secrets separately before deployment.
Preview enables a stable workers.dev address; version URLs remain disabled because
the application requires one exact origin and version URLs do not isolate D1 state.
Production has no route and both workers.dev and version URLs are disabled.
These configuration edits do not create any remote database, secret, deployment,
or domain, and do not apply remote migrations.

The migration also defines relational training-program/enrollment tables for the
portal model; no pricing management, assignment UI, or payment behavior is enabled.

## Validation

### Acceptance review status

The owner approved Phase 2 acceptance on October 19, 2026, after receiving the
manual acceptance checklist. Individual manual test results and Auth0/MFA
configuration evidence were not supplied in the session, so this approval is
recorded separately from independently verified checks below. Do not interpret
it as production certification or confirmation of every provider setting.

The current review state remains Phase 2 only. Acceptance does not authorize
switching to Phase 3, deploying, or changing live identity-provider settings.

```sh
npm run build   # explicit asset packaging and strict TypeScript checks
npm run lint    # ESLint on new Worker, frontend, scripts and tests
npm test       # existing agreement mapping + D1-backed Worker tests
npm run check  # all three above
git diff --check
```

Tests cover signed OIDC login, PKCE, browser-bound single-use state, nonce/signature
rejection, session expiry/revocation, logout (cookie clearing, Auth0 logout URL
bound to `APP_ORIGIN`, no open redirect, access blocked afterward), CSRF, household isolation, staff-role changes,
invalid/oversized input, rate limits and unconfigured features, plus self-service
provisioning: new client sign-up, idempotent repeat sign-in, inactive denial, no
staff-role grant, atomic rollback on failure, and concurrent/racing callbacks. The provider is
mocked only in the test process; application routes use the real OIDC library.
No integration test is proof that your actual tenant configuration works.

### Verification performed at the end of Phase 2

- Independent review reconstruction: clean `npm ci`, build/strict TypeScript,
  ESLint, and 36 tests passed. Tests initialize isolated D1 from migration 0001 only.
- Migration 0001 applied to a newly created external local D1 directory; schema
  inspection confirmed no veterinary document/review tables or later migrations.
- 22 live Worker smoke assertions passed against that fresh database, including
  disabled record APIs, absent upload/download handlers, session gates, reviewer/
  admin separation and exclusion of private source assets. Temporary synthetic
  validation identities/sessions were removed; existing later-phase state was untouched.
- Build/strict TypeScript, ESLint, and all 36 tests passed (14 existing mapping
  tests plus 22 Worker/D1/authentication tests).
- The migration was applied successfully to local D1 only.
- Browser checks used temporary synthetic, operator-provisioned local identities:
  profile save, dog creation and persistence after reload, staff restrictions,
  admin directory/audit display, unavailable review workflow, and logout.
  Temporary validation records/sessions were removed afterward.
- Dog/profile UI had no page-level horizontal overflow at 320, 375, 768 and 1280px.
- All 17 public routes rendered without browser JavaScript errors.
- Requests for backend source, environment examples, tests and removed demo
  fixtures were not served by the Worker.
- The unconfigured login endpoint returned an explicit 503, not a demo session.
- Actual Auth0 tenant login, staff MFA, preview/production environments,
  accessibility certification, and deployment remain unverified.

After configuring Auth0 locally, validate manually using two distinct clients
and a staff account:

1. Unauthenticated `/portal/` redirects; `/api/me` returns 401.
2. Client sees only assigned households/dogs, can save profile and add a dog.
3. Changing a dog/household ID to another client's ID returns 404.
4. Cross-origin or missing-CSRF mutations return 403.
5. Client cannot access `/admin/` or `/api/admin/clients`.
6. Reviewer cannot access admin-only directory/audit endpoints.
7. Revoking staff role or deactivating user takes effect on the next request.
8. Sign out; prior session token no longer works, and opening the client portal
   again shows the Auth0 login screen instead of signing in silently.
9. Veterinary uploads/review, agreement, payment, and completed-agreement
   document areas remain unavailable.

Rate limits: 10 login starts/minute/IP, 20 callbacks/minute/IP, 120 API or portal
requests/minute/IP, and 30 mutations/minute/IP/user. IPs are hashed into time-window
buckets, never logged; Cloudflare supplies the trusted connecting IP in deployment.
Local requests share a local bucket. Expired sessions, login transactions and rate
buckets are cleaned up at login. Production traffic may need scheduled cleanup
and tuned shared-household limits before launch.

This branch is the independent Phase 2 review state. Records implementation is
preserved separately on the safety snapshot and Phase 3 review branches.
Payments, signing, and deployment still require later approval.
