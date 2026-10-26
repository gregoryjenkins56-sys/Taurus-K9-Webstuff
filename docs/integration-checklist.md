# Integration and configuration decisions

Phase 2 implements the Worker/D1/auth foundation; account configuration and live
provider entitlements below still need verification. Provision secrets only through
approved server-side secret storage. Never share tokens, client records, or
documents in chat, fixtures, or GitHub.

## Cloudflare and database

- [ ] Confirm current live hosting and approve any later hosting transition.
- [x] Select Workers + Static Assets; preserve existing public frontend/hash routes.
- [x] Stage an explicit public asset allowlist; never serve the whole repository
  in production.
- [ ] Provision separate development, preview, and production D1 databases and
  private R2 buckets. Keep public bucket URLs disabled.
- [x] Define Phase 2 migrations, foreign keys, ownership indexes, and UTC timestamps.
- [ ] Add provider/financial/event schema and atomic reconciliation in later phases.
- [ ] Choose upload limits, quarantine/scanning provider, safe attachment
  downloads, rate limits, and retention policies in Phase 3.
- [ ] Define and test backup exports, restore drills, D1 recovery limits,
  R2 recovery, deletion in backups, and audit-record retention.

## Authentication

- [x] Implement Auth0 OIDC using maintained oauth4webapi with database-backed sessions.
- [ ] Configure and verify actual Auth0 account, subscription, MFA and callback settings.
- [ ] Configure issuer, client, callback/logout URLs, and allowed environments.
- [x] New validated identities self-provision a least-privileged client user and
  their own household at first sign-in; staff roles stay operator-provisioned.
- [ ] Decide which Auth0 connections allow public sign-up (and email verification)
  for each environment.
- [x] Define protected operator provisioning, reviewer/admin permissions, revocation,
  cookie sessions, CSRF protection, and rate limits.
- [ ] Enforce and validate staff MFA in the actual identity-provider account.
- [x] Test Phase 2 dog/household authorization server-side. A client-editable
  role field or hidden staff link must never grant access.
- [ ] Extend object-level tests to records, agreements and payments when implemented.

## HubSpot

- [x] Implement preview-only household contact outbox, unique-ID upsert, retries,
  scheduled processing, and admin diagnostics (setup below).
- [ ] Confirm subscription, account region, processor, supported currencies,
  hosted invoices/payment-link availability, and API permissions.
- [ ] Verify contact/deal schema and consent handling; do not assume proposed
  custom properties exist or create them without approval.
- [ ] Verify request creation, provider record associations, read scopes,
  payment status semantics, refunds, disputes, pagination, and API limits.
- [ ] Verify webhook availability for the exact app/account and use its
  documented authenticity checks. Do not assume a payment event exists.
- [ ] Where events are missing, define authenticated scheduled reconciliation,
  with stable enrollment identifiers, retries, idempotency, and unresolved states.
  Block launch if required payment evidence cannot be obtained.
- [ ] Prevent duplicate/excess requests, including concurrent requests and
  reusable hosted links; do not claim portal checks alone prevent overpayment.
- [ ] Keep an append-only transaction history. Redirects, manually supplied
  statuses, and CRM summary fields are not confirmed payment evidence.
- [ ] Configure real program prices, currency, deposits, and refund policies
  through authorized staff workflows, not the sample fixtures.

### Preview contact sync setup

This phase sends **D1 → HubSpot Contacts**, and saves HubSpot contact IDs and sync
timestamps back in D1. It does **not** import HubSpot edits, accept webhooks, or
sync email, dogs, payments, auth identities, sessions, or permissions. D1 remains
the system of record. Auth still matches only the validated issuer + subject.
Use synthetic clients in an approved test HubSpot account; approve consent,
retention, and processor access before sending real client information.

1. Verify the preview Worker, Cloudflare account, and distinct D1 database using
   the [D1 setup runbook](phase2-setup.md). Do not copy the legacy/default or
   production database into preview. Apply migrations, including
   `migrations/0002_hubspot_sync.sql`, **before** enabling the flag:

   ```bash
   node scripts/validate-d1.mjs preview && npx wrangler d1 migrations apply DB --remote --env preview
   ```

2. In the approved HubSpot test account, create a contact property with internal
   name **`tk9_preview_household_id`**, type `string`, field type `text`, and
   **`hasUniqueValue: true`**. Confirm the account supports unique custom
   properties and Contacts batch upsert with this property as `idProperty`.
   Uniqueness is required for replay safety; a normal text property is not enough.
   The Worker never creates properties or falls back to email matching.
   Create the property in HubSpot settings or with a separate operator credential
   holding `crm.schemas.contacts.write`; do not give that scope to the runtime app.
3. Create a private app scoped to that test account. Grant
   **`crm.objects.contacts.write`** for batch upsert; no read, schema, delete,
   marketing, or commerce scope is needed by the implemented requests. Verify the
   current HubSpot endpoint/account requirements before enabling. If the account
   cannot support unique-property upsert, leave sync disabled rather than
   substituting a search-by-name/email implementation.
4. Store its token only as a **preview Worker secret**:

   ```bash
   npx wrangler secret put HUBSPOT_ACCESS_TOKEN --env preview
   ```

   Never put the value in Wrangler vars, source, browser code, shell arguments,
   logs, screenshots, tickets, or fixtures. The token selects the HubSpot account;
   no `HUBSPOT_PORTAL_ID` is needed. Limit private-app membership/access and rotate
   the token if exposed. Revoke it when preview testing ends.
5. Set `env.preview.vars.HUBSPOT_SYNC_ENABLED` to the exact string `"true"` in
   `wrangler.jsonc`, then build and deploy:

   ```bash
   npm ci && npm run build
   npx wrangler deploy --config ./wrangler.jsonc --env preview
   ```

   With Cloudflare Builds use `npm ci && npm run build` as the build command;
   `npm ci` alone does not create `dist`. The deploy command remains the command
   above. `APP_ENV` must be exactly `preview`, the flag exactly `true`, and the
   secret nonempty. Defaults remain disabled. Production/development cannot
   enable this integration even with the flag and token; production has no sync
   cron configured. Do not change production's `APP_ENV` to bypass this guard.

#### Field mapping and delivery

One HubSpot contact represents **one household**, not one login. Multiple members
of a household share that contact; different households remain distinct even if
names/phone numbers match. The immutable D1 household ID is linked to users through
memberships; no raw issuer, subject, or mutable email is exported.

| D1 / source | HubSpot Contact property |
| --- | --- |
| `"preview:" + households.id` | `tk9_preview_household_id` (unique; upsert identifier) |
| `households.contact_name` | `firstname` (complete name, deliberately not guessed/split) |
| `households.phone` | `phone` |
| `households.city` | `city` |

Empty phone/city strings clear those properties. HubSpot edits to mapped fields
can be overwritten by the next D1 change. There is no automatic backfill of
existing households: save their owner information once after enabling.

Signup and owner-information updates commit the outbox in the **same D1 batch**
as the source write. `hubspot_sync_jobs` retains at most one row per household:
identical mapped values preserve the idempotency key and retry state; changed
values replace the desired payload, generate a new key, and reset attempts.
The row also stores the HubSpot contact ID and last successful timestamp.
No historical payload log is kept.

Preview cron runs every five minutes and processes at most five due households
per invocation. Admins can process a batch immediately (below). Atomic two-minute
leases prevent overlapping processors from claiming the same household; each
HTTP call has a ten-second timeout and redirects are refused. If the Worker
crashes, the lease expires and delivery is retried. Unique-property upsert makes
delivery **at least once**, not exactly once: a successful API call followed by
a lost response/DB write still targets the same contact on replay.
An edit arriving during delivery stays pending and is not acknowledged by the
older response; the next batch sends the latest values. After an ambiguous
timeout, a subsequent successful retry reasserts the desired state.

Failures (including schema/configuration errors) retry after **60, 120, 240, 480,
960 seconds**, up to **six total attempts**. The five-minute polling interval may
delay retries further. Exhausted jobs become `failed` and remain inspectable;
identical saves do not restart them. After fixing configuration, an authorized
operator can reset failed jobs using the verified preview DB:

```bash
node scripts/validate-d1.mjs preview && npx wrangler d1 execute DB --remote --env preview --command "UPDATE hubspot_sync_jobs SET status='pending', attempt_count=0, next_attempt_at=0, last_error=NULL, lease_token=NULL, lease_until=0 WHERE status='failed'"
```

Do not reset active leases or change unique IDs to retry. Queue payloads contain
contact PII: restrict D1 access, include them in retention/deletion procedures,
and never export queue contents to public logs or GitHub. Deletion from D1 does
not delete the HubSpot contact; handle both under the approved retention policy.

#### Admin diagnostics and verification

Both endpoints require an active **admin** session (reviewers are denied):

- `GET /api/admin/integrations/hubspot`: enabled state, counts by status, latest
  successful timestamp, up to 20 recent errors, and 20 recent success timestamps.
  Times are UTC Unix seconds. Output contains opaque job keys, not contact
  names/phone/city, payloads, contact IDs, auth identifiers, or tokens.
  Disabled configurations return only `{ "enabled": false }` without reading the
  queue (so production does not require this migration to keep serving).
- `POST /api/admin/integrations/hubspot/process`: processes at most five due jobs;
  existing same-origin, CSRF-token, rate-limit, and no-store protections apply.
  Returns `{ "enabled": true, "processed": N }`; this counts attempts, not
  necessarily successes. Disabled configurations return 503.

Example from the **preview portal's browser console**, signed in as admin
(never paste secrets or session cookies):

```javascript
const me = await fetch('/api/me').then(r => r.json());
await fetch('/api/admin/integrations/hubspot/process', {
  method: 'POST', headers: { 'x-csrf-token': me.csrfToken }
}).then(r => r.json());
await fetch('/api/admin/integrations/hubspot').then(r => r.json());
```

- [ ] Sign up with a synthetic new identity; confirm one pending job, then one
  HubSpot contact after a cron tick or admin processing. Verify all mapped fields.
- [ ] Edit phone/city/name; confirm the **same** HubSpot contact changes. Save the
  identical profile repeatedly and confirm no additional contact/job is created.
- [ ] With an invalid test token, process a new change: diagnostics show a
  sanitized `hubspot_http_401` (not the provider response). Restore the token and
  process after the due time; confirm success and a last-success timestamp.
- [ ] Verify anonymous requests return 401 and clients/reviewers return 403 on
  both endpoints. Verify processing without the correct CSRF token returns 403.
- [ ] Verify production still returns disabled, has no sync cron, and does not
  enqueue or call HubSpot, even if a flag/token is accidentally supplied.
- [ ] Run `npm run check` locally (tests mock HubSpot and use local Miniflare D1;
  no private token or real CRM access is needed).

Troubleshooting: `401`/`403` means verify token/account/scopes; `400`/`409` means
verify the unique property, its internal name, and field constraints; `429`/`5xx`
or `hubspot_network_or_response_error` are retryable availability failures.
`hubspot_invalid_response` means the response did not confirm one completed
upsert; it is retried safely. `hubspot_attempts_exhausted` means the last leased
attempt expired without acknowledgment. Provider bodies/exception text are
deliberately discarded; investigate through restricted HubSpot tooling without
adding raw payload/token logging. Pending jobs with future `next_attempt_at`
are not due yet; check cron deployment and the admin trigger for overdue jobs.
If the oldest request failed at configuration, fix the configuration before
resetting failures. Account limits/entitlements must be verified with HubSpot.

**Disable / rollback:** set the preview flag back to `"false"` and redeploy,
or delete the preview secret with
`npx wrangler secret delete HUBSPOT_ACCESS_TOKEN --env preview`. All enqueue,
cron, and admin processing paths then stop (an already in-flight request may
finish). Existing jobs/contacts are retained; re-enabling resumes pending work.
Changes made while disabled are not queued: save affected owner information
after re-enabling. To roll back code, deploy the prior Worker build while keeping
the additive queue table; do not drop source tables or migrate production.
Revoke the private-app token and remove synthetic contacts per test-account policy.

## Adobe Acrobat Sign

- [ ] Confirm the exact product/subscription, production API entitlement,
  developer account, OAuth scopes, API region/base URI, and signing quota.
  Creating PDFs in Acrobat does not establish Sign API access.
- [ ] Verify current REST API behavior; legacy examples are not a v6 contract.
- [ ] Configure the owned template/version, recipient role, required initials,
  signature/date, prefill fields, electronic consent, and full-document access.
- [ ] Start with supported provider-hosted signing. Verify licensing and
  supported authentication/embedding behavior before adding embedded signing.
- [ ] Verify event authenticity and authenticated reconciliation before
  accepting completion. Preserve provider IDs and immutable issued versions.
- [ ] Retrieve the exact provider-completed PDF and separate audit report
  privately; test authorized downloads.
- [ ] Resolve the existing offline mapping module's Google Drive archive
  terminology against this project's R2 requirement before integrating it.
- [ ] Obtain legal review of contract wording, consent, and retention.

## Costs to confirm (no prices assumed)

Cloudflare compute, D1 operations/storage, R2 storage/operations, authentication
users/MFA/email delivery, malware scanning, monitoring, backups, HubSpot commerce
subscription/processor fees, and Adobe signing/API quotas. Confirm actual account
entitlements, limits, regional availability, and recurring costs.

## Official starting references

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [D1](https://developers.cloudflare.com/d1/)
- [R2 bucket privacy](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [Auth0 authorization-code flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)
- [HubSpot Payments API](https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/commerce-payments/guide.md)
- [Adobe Acrobat Sign developer documentation](https://opensource.adobe.com/acrobat-sign/)

References establish documentation locations, not your account's access.
Reverify current capabilities during each integration phase.
