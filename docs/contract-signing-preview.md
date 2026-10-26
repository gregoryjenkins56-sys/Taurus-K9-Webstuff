# Contract Signing: Simulation Milestone

This milestone implements a **local simulation**, not real contract execution.
The existing application, authentication, database, and live signing routes are
unchanged. No migrations, deployments, provider calls, or production data changes
are part of this work. The local checkout may differ from the virtual GitHub
workspace; all preview commands run from the local project root.

## Inspect the Preview

Use Node >=22.14:

```sh
npm ci
npm run preview:contract
```

Open the actual `http://127.0.0.1:PORT/` URL printed by the server. It starts at
4173 and tries another port if necessary. It binds only to loopback, validates
the Host header, serves an explicit file allowlist, and has no production APIs.
Do not use a generic static server to publish the repository or its private files.

The preview has fictional client Alex Morgan, dog Scout, and a Private Lessons
service. It uses the existing portal layout/styles and a separate local shell.
The production asset build excludes the preview fixtures, server-side draft
template, preview scripts, and backend source. Shared renderer modules are not
added to the production allowlist until live integration is implemented.

## Try the Client Flow

1. Read all four placeholder sections; nothing is hidden behind an action.
2. Type initials below sections 02 and 03 and explicitly record each one.
3. Type and record the section 04 signature. Each action shows a demo timestamp.
4. Change a recorded value and choose Update, or remove its acknowledgment.
5. Enter an unrecorded draft value, choose Save draft, and reload. Saved draft
   values resume without becoming acknowledgments. Final consent and intent
   restart unchecked after reopening.
6. Leave optional consent unchecked. It never blocks completion.
7. Try final completion with missing fields to inspect linked validation errors.
8. Fill final printed name/signature and explicitly check the simulated consent
   and intent controls. Complete the simulation.
9. Inspect the locked simulated completion, activity record, and sample PDF.
   Completed Documents also links to the result and download.
10. Use Reset simulation to start again.

Only this fictional demo stores values in a namespaced localStorage key. Its
timestamps, snapshot hashes, history, and final state are not trusted evidence.
Do not enter real personal information, signatures, or contract terms into the
demo. Other tabs are not synchronized; use one preview tab at a time. Real
signing will require server persistence, authorization, and server timestamps.

## Provider Draft Templates

The local server provides the selected Adobe Acrobat Sign client portal preview
at `/adobe/`. Try Overview, My Agreement, the Adobe signing handoff, save/resume,
and Documents. Reset this demo only clears the Adobe portal's state. The original
simulation remains available at `/`. Other signing-provider previews have been
removed; their old URLs return 404.

Adobe uses an illustrative hosted-review concept, not an exact vendor interface.
No provider API, SDK, real sending, authentication, webhook, or billing is connected.

Before live integration, trial Adobe with the approved contract and verify mobile signing, initials,
recipient authentication, email delivery, reminders, audit export, completed PDF
retrieval, support, and pricing at expected monthly volume. Confirm that the quoted
plan includes the required API and embedded-signing permissions. Live integration
requires an Adobe sandbox account and provider configuration; do not enter real
signatures or personal information in the local demo.

The Adobe portal includes responsive icon navigation, enrollment milestones,
local activity history, a keyboard-accessible document outline with live recorded
states, explicit empty/completed document states, download feedback, and reset
confirmation. Reduced-motion preferences are respected. Browser checks cover
overview, agreement handoff, and documents accessibility in addition to signing,
320/390/1440px layouts, section focus, acknowledgment progress, and reset cancellation.

Open `#/templates` in the local preview for Adobe Acrobat Sign draft PDF and
JSON field-map downloads. These use the same ordered
contract source below, with blank client, dog, service, section acknowledgment,
optional consent, electronic consent, final signature, and provider date fields.
Exports do not contain simulation signatures, completion timestamps, or client data.

Upload the selected PDF in that provider's template editor. Use its JSON map to
place **native provider fields**, assign the Client recipient role, and configure
required flags. Coordinates are PDF points from the bottom-left; pages are
1-based. PDF form controls are placement guides, not native signing fields.
Automatic conversion is not guaranteed.
Optional consents must remain optional and unchecked. Signing dates must come
from the provider, not prefilled values. Verify every field and page in a sandbox.

These are draft setup artifacts, not provider API payloads or live integrations.
Do not send placeholder terms. Approved wording, electronic-consent review,
provider account access, authenticated sending, verified completion events, and
private signed-document/audit retrieval are still required for production use.

## Authenticated Portal Integration

The selected Adobe design is also integrated into the real `/portal/` shell,
not only the local `/adobe/` prototype. Dashboard agreement links, My Agreement,
read-only per-agreement review, and Completed Documents use the existing protected
`/api/agreements`, `/api/agreements/:id`, and `/api/documents` endpoints. They do
not load fictional snapshots or simulation localStorage. Server-side assignment
and membership checks remain authoritative; the selected household does not grant
access to another client's agreements. Agreement lists are account-wide.

`CONTRACT_SIGNING_ENABLED` still gates the existing contract record APIs, and the
contract migration must be provisioned before enabling those APIs. The UI separates
disabled APIs, genuinely empty lists, expired sessions, and inaccessible agreements.
The deployed asset build includes the new portal stylesheet but excludes all demo
fixtures. No remote migration, deployment, or configuration change is performed.

**Live Adobe sending/signing and signed-PDF downloads are not implemented or
enabled by this UI integration.** The Adobe action is disabled and contract review
is read-only. Existing native acknowledgment endpoints are not called or presented
as Adobe signatures. Completion records do not imply provider-verified execution.
Before enabling signing, implement and test the Adobe server-side adapter with
the correct regional API endpoint and securely stored credentials, verified signer
and issued-version binding, authenticated signing URL creation, authenticated
completion verification, and private signed-PDF/audit retrieval. Supply approved
contract/disclosure wording and confirm the account's API access first. Never put
Adobe credentials or provider signing URLs into public JavaScript or localStorage.

## Approved Text and Section Configuration

`server/contracts/training-contract.draft.json` is the insertion scaffold. Replace
the placeholder headings and content with the approved contract **verbatim**, in
its original order. Add as many sections as the contract requires. Preserve the
original text; do not treat demonstration headings as legal clauses.

Every section has:

```json
{
  "sectionId": "section-02",
  "heading": "[Exact approved heading]",
  "content": "[Exact approved section text]",
  "order": 2,
  "acknowledgmentType": "initials",
  "required": true
}
```

Use `none` with `required: false` for read-only sections, `initials` or `signature`
for deliberate individual acknowledgment, and `required: false` for an optional
acknowledgment. Keep IDs stable within a version and orders unique. Optional
consents belong in the separate `optionalConsents` collection, not required
acknowledgment progress. Electronic disclosures are separately versioned under
`electronicDisclosure`; no approved wording is supplied by this implementation.

Leave `isPlaceholder: true` and both approval flags false. Changing this file or
flags does **not** publish a contract or enable a live endpoint. The eventual
server publishing process must independently enforce legal approval, immutable
version issuance, ownership, and configuration gates. Editing the fixture changes
its snapshot hash and starts a fresh simulation with no carried acknowledgments.

## Verification

```sh
npm run test:contracts
npx playwright install chromium
npm run test:portal
npm run check
```

Contract tests cover missing initials/final fields, optional consent, snapshot
fidelity, evidence/version/hash matching, save/resume, correction/removal,
duplicate completion, simulated persistence failure, and locked completion.
PDF tests extract multi-page content and check section/acknowledgment order,
page bounds, final signature, timestamps, snapshot hash, and draft watermark.
Browser tests cover keyboard acknowledgment, field errors, consent defaults,
resume, completion, actual PDF download, axe scans, and 1440/390/320px layouts.
Screenshots are in ignored `test-results/`. Current browser tests exercise only
the synthetic demo, not future authenticated agreement APIs.

The sample PDF uses Helvetica for the ASCII draft fixture. Full Unicode font
embedding/glyph verification is a required production PDF gate. Unsupported
characters may produce a visible sample-download error; never substitute or
silently remove approved text to make a PDF render.

## Remaining Production Work

- Add an additive D1 migration for templates, immutable versions and per-client
  snapshots, frozen sections, acknowledgment revisions, consent records, final
  signature receipts, append-only events, and private document references.
  No migration has been created or applied in this simulation milestone.
- Implement and test assigned-signer authorization on every agreement operation,
  existing admin-role access, CSRF, concurrency/revision checks, idempotency,
  commit-time final validation, immutable execution, and atomic audit writes.
- Configure private R2 storage. Generate from the immutable signing snapshot,
  stage privately, and atomically bind document metadata with D1 execution.
  Test upload/render/database failures and lost-response retries. R2 and D1 are
  not a distributed transaction; uncommitted objects remain inaccessible.
- Add authenticated client agreement/document views and admin publishing,
  assignment, progress, and audit views. Do not replace Auth0 or D1, infer CRM
  identity, or add a development authentication bypass.
- Supply approved contract and electronic disclosures, native typed-signature
  legal review, retention/backups/orphan-cleanup policy, and a production font.
  No signature-provider integration or legal-compliance guarantee is implied.
- Keep signing IP/user-agent collection disabled pending privacy-policy approval.
  Do not add location tracking or fingerprinting.
- Completion email is unconfigured. The simulation sends nothing and never
  reports successful email delivery.