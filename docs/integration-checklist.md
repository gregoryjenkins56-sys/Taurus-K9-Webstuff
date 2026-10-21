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
