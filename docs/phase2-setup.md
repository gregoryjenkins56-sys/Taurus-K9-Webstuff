# Phase 2: protected portal foundation

## Implemented versus blocked

Implemented: a Cloudflare Worker serving the existing public site and portal,
Auth0/OIDC authorization-code sign-in with PKCE, state, browser binding, nonce and
ID-token signature validation through maintained `oauth4webapi`; hashed random
session tokens in D1; eight-hour absolute expiry; logout revocation; CSRF and
Origin checks; database-backed rate limits; household authorization; protected
staff roles; contact updates; dog creation/listing; and audit records.

The portal has no demo adapter or synthetic fallback. An unconfigured provider
fails explicitly. Unauthenticated requests to the portal (including its assets)
redirect to login; protected APIs return 401. Clients cannot read staff APIs or
write role/membership fields. Reviewer access is distinct from administrator
access. Staff roles and user activation are checked against D1 on every request.

Not implemented:
Veterinary uploads/review, private storage, malware scanning, HubSpot, Adobe,
payments, contract completion, photo uploads, dog editing/deletion,
staff role-management UI, self-registration, automated invitations, password reset
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
3. Register exactly `http://localhost:8787/api/auth/callback` as an allowed callback.
4. Populate `.dev.vars` using the actual issuer (HTTPS, trailing slash, no path),
   client ID and client secret. No real secrets belong in Git or chat.
5. Create the intended user in the identity provider and securely obtain its
   stable subject (`sub` / Auth0 user ID). Do not use email as the authorization key.
6. Provision the matching local D1 identity/household/membership below.

No public registration grants a household or staff role. Unknown provider
identities receive a 403 explaining that provisioning is required.
The callback URL is always derived from `APP_ORIGIN`, not browser input.
Provider access/ID tokens are validated then discarded; none are exposed to the
browser or stored. Provider logout/password/MFA policies remain Auth0-managed.
App sign-out revokes the portal session, not the Auth0 single-sign-on session;
signing in again may reuse Auth0 SSO.

The local app uses HttpOnly, SameSite=Lax cookies without Secure **only** when
APP_ENV is development and APP_ORIGIN is loopback. All other environments
require HTTPS and use Secure `__Host-` cookies. Never use development configuration
for a deployed Worker. Separate preview/prod tenants, origins, databases, and secrets.
Workers.dev and preview URLs are disabled by default; deployment is not performed.
The runtime must supply a trusted connecting IP (Cloudflare's platform header);
do not put an untrusted proxy in front of it that lets clients forge this header.

## Local provisioning (trusted operator only)

The only role/membership assignment process in Phase 2 is direct D1 operator
provisioning, protected by local machine access or Cloudflare IAM. There is no
public role assignment endpoint or client-editable role field.

Create a private SQL file **outside this repository**; use synthetic development
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

For a verified staff identity, provision a separate `users` record, then explicitly
insert its approved role in a private operator SQL file:

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
rejection, session expiry/revocation, CSRF, household isolation, staff-role changes,
invalid/oversized input, rate limits and unconfigured features. The provider is
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
8. Sign out; prior session token no longer works.
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
