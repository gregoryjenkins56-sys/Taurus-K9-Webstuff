# Taurus K9 Website

Single-page site for Taurus K9 LLC (Aransas Pass, TX): dog training, board and train, working K9 programs.

## Structure
- `index.html` page shell, SEO meta, schema markup
- `css/style.css` all styling
- `js/script.js` content, hash router, page rendering

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

To debug the website in VS Code, select **Website: Chrome** in Run and Debug,
then press F5. This opens the local page using VS Code's built-in JavaScript
debugger and requires Google Chrome to be installed.

## Publish
GitHub Pages: Settings > Pages > Deploy from branch `main` / root.

## Contact form

`#/contact` renders the original Taurus K9 custom form using the existing
`.form`, `.frow`, fieldset, radio and consent styles. It does not load HubSpot's
embedded UI. `wireForm()` validates locally and posts JSON directly to
`https://api.hsforms.com/submissions/v3/integration/submit/242184033/9b37a135-9b1f-47bd-889c-3bbec3ed780f`.
No private API key is required or exposed.

| Form input name | HubSpot property | Mapping basis |
| --- | --- | --- |
| `firstName` | `firstname` | Required First Name input, trimmed without splitting |
| `lastName` | `lastname` | Required Last Name input, trimmed without splitting |
| `email` | `email` | Standard contact property |
| `phone` | `phone` | Standard contact property; accepts 10 US digits or leading `1` |
| `city` | `city` | Standard contact property |
| `state` | `state` | Standard contact property |
| `service` | `training_service_interest` | Internal property name; verify property and enum values |
| `dogName` | `dogs_name` | Contact property documented in Verified property mappings below |
| `dogAge` | `dog_age` | Optional age input, trimmed and omitted when blank |
| `dogBreed` | Not submitted | No verified HubSpot property mapping |
| `timeline` | `preferred_start_timeline` | Task-supplied internal name; verify enum values |
| `message` | `training_goals` | Task-supplied internal name |
| `heard` | `lead_source_detail` | Internal property name; verify property and enum values |
| `consentEmail` | `consent_email_inquiry` | Explicit `true`/`false`; verify property |
| `consentSms` | `consent_sms_inquiry` | Explicit `true`/`false`; verify property |
| `tk9_check` | Not submitted | Off-screen honeypot; populated value prevents the API request and displays an explicit error |

**Before production use:** verify these properties belong to the target form,
including enumeration internal values and any additional required fields.
The public HubSpot form definition could not be retrieved from the development
environment (DNS lookup failed), so the custom mappings above are assumptions
where noted. The consent fields record the visitor's choices; they do not
configure HubSpot subscription types or replace `legalConsentOptions` if the
target form requires them. Confirm those settings with the form owner before
enabling automated follow-up.

The request includes `context.pageUri` and `context.pageName` when available.
Blank optional fields are omitted. Analytics use the existing consent-aware
`track()` hook: `form_submit` on attempt, `form_error` on validation or delivery
failure (including blocked spam checks), and `form_success` only after a successful
HTTP response. Failure diagnostics use fixed `error_type` categories:
`honeypot` (no request), `validation` (no request, with `error_count`), `client`
(request preparation failed), `network` (delivery unknown), `timeout` (delivery
unknown), and `http` (non-2xx response, with numeric `http_status` when available).
Delivery categories/status also appear in the existing form status area, even
without analytics consent. No field values, exception messages, or provider
response bodies/status text are included in diagnostics.

While posting, the button is disabled and repeat submit events are ignored.
A successful response routes to `#/thank-you`. A failed or 20-second timed-out
request leaves entries intact, announces an error, and enables manual retry.
There are no automatic retries: a lost response may mean HubSpot already
received the inquiry, so checking HubSpot before retrying avoids that ambiguity.
The old `company` honeypot could route to thank-you without posting anything:
this is a confirmed false-success path, not proof of what happened to any
particular inquiry. The trap now uses a nonstandard name to reduce company
autofill collisions. A populated trap stays on contact, explicitly says nothing
was sent, and suggests reloading with autofill disabled or calling instead.
Autofill can still populate hidden fields; no client-only trap guarantees spam
prevention. Wiring the same form repeatedly does not add duplicate handlers.
No server-side spam prevention or idempotency guarantee is implied.

Offline regression tests establish these behaviors, not live HubSpot acceptance.
The public form-definition lookup remains DNS-blocked in this environment.
The form owner must still verify the mapping table, required fields, enum values,
and consent configuration, then correlate an authorized test's HTTP status with
the submission/contact in HubSpot. No live test contacts or settings changes
were made. The public form remains independent of preview-only worker CRM sync
in `server/worker/hubspot.ts`.

Run offline regression coverage with `node --test tests/contact-form.test.js`
(also included in `npm test`). For manual verification:

1. Serve the site locally and open `#/contact` at desktop and mobile widths.
   Confirm the original two-column/three-column rows collapse to one on mobile.
2. Submit empty/invalid values. Check inline errors, screen-reader announcements,
   summary focus, and summary links focusing fields without changing routes.
3. With approved test details and permission from the HubSpot owner, submit a
   valid inquiry. Inspect the JSON POST, confirm the thank-you route, and verify
   the submission and field values in the target HubSpot form/contact record.
4. Delay the request and rapidly click/press Enter: expect one request. Simulate
   HTTP 400/429/500, offline mode and timeout: expect retained entries, a retryable
   error and an enabled button. Restore the connection and retry.
5. Populate `tk9_check`: expect no request, an explicit spam-check error, and no
   thank-you redirect. Navigate among all site routes,
   return to contact, and check for JavaScript exceptions or embedded-form scripts.

Rollback: revert the contact-form restoration commit and redeploy the static
site. This restores the previous embedded form and thank-you copy; there are no
database migrations, new dependencies or HubSpot schema changes to undo.
Existing HubSpot submissions are not removed by rollback.

## Offline agreement mapping (development only)

`server/agreement-mapping.cjs` is an isolated, server-side-intended CommonJS module.
It is **not imported by the website**. Public HTML, CSS, routing, branding and scripts
are unchanged. It has no dependencies, network calls, credentials or side effects.
This change must remain a development PR: do not merge or deploy it as part of this
work, change DNS, create CRM properties, modify HubSpot records, send contracts,
collect payments or contact live integration services.

This is **not authentication, a backend integration, Adobe field configuration, or
a live connection**. Caller-supplied confirmations are review assertions, not proof
of identity, association, signer authority, approval authority or payment.

### Setup and checks

Use Node.js 22 or newer with full ICU data (no package installation needed).
From the repository root, run:

```sh
node --check server/agreement-mapping.cjs
node --test server/agreement-mapping.test.cjs
node --check js/script.js
git diff --check
```

The tests use only fabricated records and `example.invalid` addresses; never add
credentials, real personal data, private documents or provider exports as fixtures.
There is no existing lint/build/test configuration; the new tests use Node's
built-in test runner. They run entirely offline.

### Input and review contract

```js
const { prepareReview, issueSnapshot } = require('./server/agreement-mapping.cjs');
const review = prepareReview(confirmedInput);
// Display errors, conflicts, warnings and all review.data to an authorized reviewer.
// Every error blocks issuance; do not discard conflicts or auto-approve.
const snapshot = issueSnapshot(review, {
  approved: true,
  templateId: 'example-template',
  templateVersion: 'v1'
});
```

See `server/agreement-mapping.test.cjs`'s `fixture()` for a complete synthetic input.
The API accepts one explicitly selected contact, dog, deal and enrollment, not
arrays of associations. No "first contact" signer selection is implemented.

| Input | Required meaning |
| --- | --- |
| `contact: { id, properties }`, `deal: { id, properties }` | Explicitly selected CRM records; IDs are nonempty strings, properties use the exact names below. |
| `dog: { id, name, breed, ageAtIssue, color, sexStatus, microchipNumber, weight: { value, unit } }` | Separately confirmed selected dog, not an automatic contact intake fallback. Name, breed, age, sex and positive weight required; color/microchip may be blank. |
| `enrollment: { id, dogId, dealId }` | Explicit enrollment with matching selected dog and deal IDs. Portal IDs are caller-provided, **not** assumed HubSpot properties. |
| `confirmation: { contactId, dealId, dogId, enrollmentId, signer, dog, enrollment }` | IDs must exactly match the selected records and all three flags must be `true`. Explicit signer confirmation is required even with only one associated contact. |
| `endDateTimeZone` | Explicit valid IANA display zone, such as `America/Chicago`; no default or browser timezone. |
| `requiredDeposit: { amount, currency }` | Independently reviewed requirement in the deal currency; explicitly supply zero if none is required. Never derive it from received-deposit summaries. |

All owner fields in the mapping table, program, start date, end datetime, amount
and currency are required. Optional color/microchip blanks remain visible to the
reviewer. `prepareReview()` returns a frozen `{ errors, conflicts, warnings, data }`.
`issueSnapshot()` accepts only a genuine, error-free review from this module instance,
explicit approval of **all** its data (including price, currency and deposit), and a
nonempty template ID/version.

Contact dog fields are intake only. The selected dog's explicit values are compared
against every populated applicable contact/deal value. Any discrepancy blocks
issuance and reports source/selected values in `conflicts`; values are never merged
or silently preferred. Resolve discrepancies in an authorized upstream review and
prepare a new review with corrected inputs; there is no conflict-bypass switch.
Do not drop populated intake values simply to bypass a conflict.

### Verified property mappings

Property names/types below are supplied schema facts, not a live schema lookup.
Adobe names are **proposals**, not fields configured or verified in an Adobe template.

| Verified HubSpot source | Canonical snapshot path | Proposed Adobe field |
| --- | --- | --- |
| CONTACT `firstname` (string) | `owner.firstName` | `owner_first_name` |
| CONTACT `lastname` (string) | `owner.lastName` | `owner_last_name` |
| CONTACT `email` (string) | `owner.email` | `owner_email` |
| CONTACT `phone` (string) | `owner.phone` | `owner_phone` |
| CONTACT `address` (string) | `owner.address.street` | `owner_address` |
| CONTACT `city` (string) | `owner.address.city` | `owner_city` |
| CONTACT `state` (string) | `owner.address.state` | `owner_state` |
| CONTACT `zip` (string) | `owner.address.postalCode` | `owner_zip` |
| CONTACT `dogs_name` (string, intake only) + confirmed dog | `dog.name` | `dog_name` |
| DEAL `dog_breed_contract` (string); CONTACT `dog_breed` (string, intake check) + confirmed dog | `dog.breed` | `dog_breed` |
| DEAL `dog_age__cloned_` (string); CONTACT `dog_age` (string, intake check) + confirmed age | `agreement.dogAgeAtIssue` | `dog_age` |
| DEAL `dog_color` (string) + confirmed dog | `dog.color` | `dog_color` |
| DEAL `dog_weight` (number) + explicitly confirmed value/unit | `dog.weight` (`{ value, unit }`) | `dog_weight` (includes unit) |
| CONTACT `dog_sex` (enumeration, intake only) + confirmed dog | `dog.sexStatus` | `dog_sex` |
| DEAL `microchip_number` (string) + confirmed dog | `dog.microchipNumber` | `dog_microchip_number` |
| DEAL `program_type` (enumeration); CONTACT `training_program` (string, intake conflict check only) | `enrollment.programType` | `training_program` |
| DEAL `program_start_date` (date) | `enrollment.startDate` | `program_start_date` |
| DEAL `program_end_date` (datetime) | `enrollment.endDateTime` (original), explicit zone/display alongside | `program_end_date` (explicitly zoned display) |
| DEAL `amount` (number), `deal_currency_code` (existing) | Approved `enrollment.priceMinor`, `enrollment.currency` | No amount/currency Adobe field assumed |
| DEAL `deposit_paid_amount`, `balance_due` (numbers) | `payment.crmSummaryMinor` (unverified only) | None |
| DEAL `pipeline`, `dealstage` (existing) | `crmContext` (context only, never signing/payment evidence) | None |
| CONTACT `vet_info` (string) | Intake only, deliberately not copied | None |

Dog selection is authoritative only after explicit confirmation and successful
conflict checks; missing deal/contact dog fields do not authorize intake fallback.
`dog_sex` accepts exactly `Male (Intact)`, `Male (Neutered)`, `Female (Intact)`,
`Female (Spayed)`. `program_type` accepts exactly:

- `Board & Train – 2 Week`
- `Board & Train – 4 Week`
- `Board & Train – 6 Week`
- `Private Lessons`
- `Group Class`
- `Detection Dog Training`
- `Personal Protection`
- `Police K9 Program`

### Proposed MISSING deal properties — never assumed available

These are **not created, fetched, or consumed** by this module:

| Proposed missing property | Intended future purpose |
| --- | --- |
| `tk9_dog_name` | Enrollment-specific dog name |
| `tk9_dog_sex_status` | Enrollment-specific sex/status |
| `tk9_portal_dog_id` | Stable portal dog association |
| `tk9_portal_enrollment_id` | Stable enrollment association |
| `tk9_deposit_required_amount` | Required deposit, not received deposit |
| `tk9_agreement_id` | Provider agreement identity |
| `tk9_agreement_version` | Issued agreement version |
| `tk9_agreement_status` | Provider signing status |
| `tk9_agreement_completed_at` | Verified provider completion event |
| `tk9_archive_status` | Independent archive status |
| `tk9_signed_pdf_drive_id` | Private exact signed-PDF archive file ID |
| `tk9_audit_report_drive_id` | Private exact provider audit-report archive file ID |

### Dates, units and money

- Date-only input must be a valid `YYYY-MM-DD` string and is copied unchanged,
  never converted through local time. Datetimes require full ISO seconds with `Z`
  or an explicit offset. The original datetime is preserved, and the proposed Adobe
  display is formatted in the required `endDateTimeZone`. End's calendar date in
  that zone must not precede start. A future HubSpot adapter must explicitly convert
  raw API epoch values to these contracts; epoch values are not guessed here.
- Weight requires an explicitly confirmed `kg` or `lb`; the deal has no verified unit
  property. Confirmation must establish that the selected value/unit also describes
  the deal's numeric weight. No default units or implicit conversions.
- Currency must be an uppercase ISO currency supported by Node's ICU currency list.
  `moneyToMinorUnits()` uses its ISO fraction digits (e.g. USD 2, JPY 0, KWD 3),
  decimal parsing and integer arithmetic, returning only safe integer minor units.
  Supply decimal strings where possible; plain JSON numbers are accepted only if
  their decimal representation fits currency precision. Excess precision, floating
  arithmetic artifacts, negative values, exponents, separators and overflow fail
  rather than rounding. Required deposit must share currency and not exceed price.
- `deposit_paid_amount` and `balance_due` are only unverified summaries. They never
  establish payment, satisfy the required deposit or unlock signing/archive status.
  `receivedDepositMinor` remains `null`; verified payment-ledger integration is absent.

### Issuance and lifecycle boundaries

Issuance copies only allowlisted data plus the template ID/version into a deeply
frozen snapshot. Later CRM/input edits cannot mutate it. Template content/version
verification is an external responsibility; a version string is not such proof.
Never prefill signatures, initials, signing timestamps or optional consent: none are
emitted. Adobe field roles, required/optional flags and consent configuration still
need separate authorized setup and testing.

`statuses.review`, `statuses.providerSigning`, `statuses.payment` and
`statuses.googleDriveArchive` are independent (`approved`, `not_sent`, `unverified`,
`not_started` at issuance). No external transitions or webhooks are implemented.
`archiveReferences` starts empty: no signed artifact exists at issuance.
A future archive event must reference the **exact downloaded provider signed PDF
and separate provider audit report**, each with provider agreement/document identity,
content hash and private Google Drive file ID. Never regenerate a "signed" document,
use a public link as an archive, or overwrite the issued data to track lifecycle.

Freeze protects this process's objects, not a database or edited serialized JSON.
A future backend must persist snapshots append-only with access controls/integrity
checks, retain the pinned template, and store later signing/payment/archive events
separately. No private files belong in this public static repository.

### Validation findings and blockers

- PASS: module syntax check and 14 offline Node tests for missing required data,
  ambiguous selection/signer choice, conflicting intake/deal values, exact enums,
  dates/timezones, unknown units, currency/precision, independent deposit/payment
  meaning, approval/template gating and deep snapshot immutability. All 14 also
  pass with host `TZ=Pacific/Honolulu` and `TZ=Asia/Tokyo`. Manual currency and
  invalid-issuance CLI smoke checks, whitespace checks and secret scanning passed.
- FAIL (pre-existing, unchanged): `node --check js/script.js` reports
  `SyntaxError: Unexpected token '{'` at line 132. FAQ entries at lines 131–141
  lack separating commas before the next entry. No unrelated public-script rewrite
  or repair is included.
- GitHub Actions inspection: latest completed Pages run `39181826148` succeeded;
  log lookup reported no failed jobs (three jobs total). Pages success does not
  validate browser JavaScript syntax. No workflow was triggered or deployment made
  by this task.
- REVIEW LIMITATIONS: the automated review tool could not load its configured
  model; a separate read-only code-review agent found no significant issues.
  CodeQL reported no supported-language changes detected and performed no analysis.
  This is not a clean CodeQL scan or proof of production security.
- UNTESTED: actual browser flows (existing script parse blocker), live CRM schema/API
  behavior, signer identity/authorization, Adobe templates/signing, payment evidence,
  webhook security/idempotency, persistence, Google Drive permissions/artifact retrieval.
- BLOCKERS before any production integration: authorized backend/authentication,
  verified record associations and unit policy, approval/persistence controls,
  template/field configuration, real provider/payment/archive adapters and credentials
  stored outside this repository. Missing proposed properties require a separate
  authorized schema decision; this module never assumes or creates them.
