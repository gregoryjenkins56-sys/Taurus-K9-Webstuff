# Production launch blockers

**Phase 2 implements a foundation, not production readiness. All unchecked items block the
corresponding production feature. No deployment is authorized by this checklist.**

Phase 2 acceptance was approved by the owner on October 19, 2026. That acceptance
is not deployment approval. Actual Auth0 sign-in and staff MFA remain unchecked
here because individual test results/configuration evidence were not supplied.

## Identity and client isolation (Phase 2)

- [x] Real authentication implementation, secure sessions, CSRF, input validation, and rate limits.
- [ ] Validate actual Auth0 tenant sign-in and enforce staff MFA.
- [x] Protected operator-only role assignment.
- [x] Tests prove clients cannot access another household's dogs/contact data
  or grant themselves staff roles.
- [ ] Extend isolation tests to records, agreements, payments and storage URLs
  when those features exist.
- [x] Phase 2 database migrations, atomic account/dog mutations, and attributable audit records.

## Private records (Phase 3)

- [ ] Authenticated uploads with random keys, size/extension/MIME/signature checks.
- [ ] Quarantine and real malware scanning; missing scan configuration fails closed.
- [ ] Unvalidated files cannot be downloaded normally.
- [ ] Review approval/rejection reason, replacements, expiration, and retention.
- [ ] Authorized private downloads with safe attachment behavior.

## Payments and signing (Phases 4-5)

- [ ] Verified subscriptions/scopes, isolated provider adapters, and secret storage.
- [ ] Hosted payments; no card fields or card data storage.
- [ ] Provider-confirmed payment ledger, correct refunds/disputes, stable
  enrollment association, and duplicate/excess-request prevention.
- [ ] Authenticated, replay-safe webhook processing and reconciliation.
- [ ] Payment redirects and client input cannot change confirmed statuses.
- [ ] Agreement initials/signature recorded by Adobe, pinned template/version,
  exact completed PDF and provider audit report retrieved privately.
- [ ] Independent readiness requirements enforced server-side; ordering and
  payment requirements configurable by authorized staff.

## Reliability, privacy, accessibility (Phase 6)

- [ ] Missing integrations fail explicitly without fake successful results.
- [ ] Development/preview cannot send real contracts or collect payments by default.
- [ ] Production rejects demo/test bypasses and excludes demo data/test assets.
- [ ] Safe headers, no sensitive logs, secret scanning, dependency checks,
  monitoring, retry policy, and incident response.
- [ ] Tested backups/restores and retention/deletion, including backup and audit
  treatment. No destructive restore/delete without explicit authorization.
- [ ] Mobile, keyboard, screen-reader, contrast, error, and loading-state checks.
- [ ] Public pages/branding/navigation/SEO and actual integrations regression-tested.
- [ ] Updated privacy/legal/accessibility policies; electronic consent and
  agreement wording reviewed by appropriate counsel.
- [ ] Verified costs, quotas, account limitations, setup instructions, and ownership.
- [ ] Explicit approval of deployment and any DNS/live-service changes.

Phase 2 tests exercise real local D1 with a signed test OIDC provider, not your
actual tenant. They do not establish production readiness or future integration behavior.
