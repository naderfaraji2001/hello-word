# Utopia Tech website

Complete English local marketing website in `/Users/hamedsattarian/Utopia/website`. Original specifications remain in `../files/01-UTOPIA-WEBSITE-CONTENT-EN.md` through `04-REFERENCE-DESIGN-AND-MOTION-SPEC.md`; source evidence remains in `../docs`. They are authoritative, not copied into a competing brief.

## Run locally

Use Node **22.x** (verified 22.23.1) and **pnpm 11.25.0**.

```sh
cd /Users/hamedsattarian/Utopia/website
pnpm install --frozen-lockfile
pnpm setup
pnpm dev
```

Open http://localhost:3000. If that port belongs to another process, use `pnpm dev --port 3002` and update both `ALLOWED_ORIGINS` and `NEXT_PUBLIC_SITE_URL` in `.env.local`. Do not terminate another application's process.

`pnpm setup` preserves existing `.env.local` and creates a random signing secret when the file is absent. It never overwrites an existing configuration. Existing blank signing secrets need a random value of at least 32 characters. Secrets never belong in `NEXT_PUBLIC_` values. Do not commit .env.local.

The bundled pnpm launcher may use Node 24 for itself. To ensure this Mac runs the application with Node 22, the direct equivalents are:

```sh
/opt/homebrew/bin/node node_modules/next/dist/bin/next dev --webpack -p 3000
/opt/homebrew/bin/node node_modules/next/dist/bin/next build --webpack
/opt/homebrew/bin/node node_modules/next/dist/bin/next start -p 3001
```

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm content:check
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm start --port 3001
```

Browser tests expect a development server on port 3000 and use synthetic business data. They exercise actual local storage. Build uses webpack because Turbopack traced a private extraction-environment symlink. No Next runtime files were modified. Production pages can be previewed locally on 3001; production intentionally rejects local lead writes.

## Content and architecture

30 inventory records (29 routes plus real not-found), 14 home modules, five service details, three industry details, four anonymous case studies, three complete articles, company/approach/partner pages and policy drafts. Server components render content; client islands handle menu, GSAP, accordion, comparison and forms. Fonts self-host via Next/font. Local and preview indexing is disabled. `robots.ts` and metadata must be intentionally changed only for an approved public launch.

Content lives in `src/content/pages.json` and `src/content/site.ts`. `ContentRepository` in `src/lib/content/repository.ts` is the CMS contract. A future Sanity implementation supplies the same typed methods; schema fields are declared there. No CMS editor, account or paid subscription is required. Never expose `docs/evidence` or a future private client association in the browser.

The original content import script is a provenance/initial-import tool, not an automatic publishing pipeline: running it again requires repeating the recorded editorial cleanup. Approved public records are the current JSON/TS files. Supporting evidence conflicts are documented in `docs/evidence/claims.md`.

## Local leads

Default `LEAD_STORAGE=local` writes normalized JSONL privately to:

- `data/local/assessment-submissions.jsonl`
- `data/local/contact-submissions.jsonl`

Each row has server UTC time, payload hash and exact spreadsheet column mapping. In-process serialization plus disk reload protects local duplicates; it is explicitly single-process. A successful local receipt proves a private file write; it does not mean an email or Google Sheets row was sent. Drafts remain in same-tab sessionStorage; Clear draft removes the unfinished assessment. No patient information should be entered.

```sh
pnpm leads:export
pnpm leads:export contact
```

Exports are written beside the private JSONL files. CSV quotes are escaped and formula prefixes neutralized. No public lead listing endpoint exists. Keep exports private and delete synthetic QA records under your own retention process when no longer needed.

## Google Sheets through Apps Script

This connection uses a spreadsheet-bound Apps Script Web app and its deploying Google account. The default Cloud project is managed by Google. The website sends signed requests from the server and confirms receipt only after the script verifies a saved row. Assessment confirmation appears in place of the form on the same page.

Verified on 2026-11-11 against the owner's configured spreadsheet through the local website. Synthetic assessment and contact submissions both returned a confirmed save and were found again through the signed status endpoint. Same-ID retries returned the existing receipt, and changed assessment answers with the same ID returned a conflict. The in-page assessment confirmation was checked at desktop and mobile sizes. Two records labeled `UTOPIA TEST - safe to delete` remain in the intended tabs. Private settings and verification references are retained only in ignored local files. Public-host configuration and production Redis setup remain outstanding.

1. Copy `scripts/google-apps-script/Code.gs` into the spreadsheet's **Extensions → Apps Script** editor. Set `SPREADSHEET_ID` and a random shared secret of at least 32 characters. A prepared, private copy may be kept under ignored `data/setup/` with matching settings in `.env.local`.
2. Save, select `setup`, click **Run**, and authorize access with an account that can edit the intended sheet. Setup creates **Assessment Requests** and **Contact Requests**, checks existing column headers, and adds a hidden `payload_hash` column after the established business columns. Existing tabs and records are preserved.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone** so the website server can reach it. Requests require an HMAC signature and expire after five minutes. Organizational settings must permit this deployment option. Share the spreadsheet itself only with the intended team.
4. Put the resulting `/exec` URL in the server-only `GOOGLE_APPS_SCRIPT_URL` setting and the matching secret in `GOOGLE_APPS_SCRIPT_SECRET`. Set `LEAD_STORAGE=google_apps_script` only when deployment is ready. Restart the local server or apply the settings to the site's hosting environment.
5. Send a marked synthetic assessment and contact request and verify the rows in the owner's sheet. Check same-ID retries and the recovery screen before considering the integration connected. External writes remain unverified until this check is completed.

This mode uses Apps Script's script lock and persisted pending-write reservations for write coordination. Development rate limits use persisted Apps Script counters. Production retains the project's durable Redis requirement for rate limits, configured with `REDIS_REST_URL` and `REDIS_REST_TOKEN`. A row's hidden hash preserves duplicate/conflict checks after server restarts. Pending reservations retain their row numbers so later submissions cannot reuse a row whose write is uncertain. If a write remains uncertain and no matching ID is found, it requires operator review before retrying. Do not delete pending reservations to force another append. Keep one writer deployment for these tabs, and preserve the technical hash column when sorting or editing rows. This is conservative delivery with reconciliation, subject to Apps Script quotas, rather than a transactional delivery guarantee.

After changing the script, use **Deploy → Manage deployments → Edit → New version** to update the existing Web app. Its secret and URL belong only in server settings. A deployment executing as a personal account depends on that account retaining edit access. Use a company-managed deploying account for the production handoff.

## Google Sheets through a service account

1. In your own Google Cloud project enable Sheets API and create a dedicated service account. Obtain credentials through the normal Google owner workflow.
2. Create a private spreadsheet and tabs exactly named **Assessment Requests** and **Contact Requests**. Share only with the service-account email as editor.
3. Use headers in `docs/sheets-headers.json` (31 columns A:AE and 15 columns A:O). Header setup is an explicit owner operation, never a visitor request side effect.
4. In `.env.local` set `LEAD_STORAGE=google_sheets`, `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` (escaped `\n` normalized server-side). Tab defaults are documented in `.env.example`.
5. Configure a durable Redis REST service with `REDIS_REST_URL` and `REDIS_REST_TOKEN` supporting GET, SET NX, INCR and EXPIRE. These settings are required even for Sheets development to keep one reliable connected-mode policy. No external service was created during this task.
6. Set a unique random `RECEIPT_SIGNING_SECRET`, exact `ALLOWED_ORIGINS` and canonical site URL. Never expose credentials to client code.
7. Send one clearly marked synthetic request and personally verify one row in the correct worksheet before calling the integration connected. Test contact separately. Verify access ownership and rotation procedure with your team.

The server appends RAW values with INSERT_ROWS and confirms `updatedRows === 1`. It disables automatic retries of append. A durable per-ID lock binds form type and payload hash. Unknown results remain uncertain; reconciliation reads only the ID column and never blindly appends again. Unresolved states require operator review of the ID, provider logs and sheet. Never expire/clear an uncertain lock merely to force a retry. This is conservative at-most-one append attempt with reconciliation, not a transactional exactly-once guarantee. For stronger delivery guarantees later use a durable database/outbox as the source of truth.

Rate limiting uses normalized email plus origin rather than trusting forwarded IP. Local state is memory only; connected state uses Redis. For a public launch, review abuse protection against expected traffic and configure infrastructure-level limits as appropriate. Status tokens are HMAC signed, one hour, and reveal state/reference only. Receipts are not proof of calendar booking.

Rotate service account keys through Google Cloud, replace the secret in server environment settings, verify a synthetic write, revoke the prior key, and review spreadsheet sharing. Rotating signing secrets invalidates existing receipt/status links. Never print keys, form payloads or receipt tokens in logs.

## Vercel later (no deployment performed)

- Create/import this application only after an explicit deployment request. Project root is `website`; use pnpm lockfile and Node 22.
- Set build `pnpm build`, Next.js preset. Keep source evidence/inputs/lead files out of the repository/deployment.
- Set production environment to a verified Apps Script deployment or Google Sheets service-account connection, durable Redis, a random signing secret, exact public site URL and allowed origins. Local filesystem storage is rejected in production by code.
- Run synthetic assessment/contact writes in the intended private worksheets; verify duplicate/conflict and uncertain recovery. Ensure the durable store has backups and owner access.
- Confirm contact details, policy fit, asset permissions, product status and case attribution. Keep anonymous labels and qualitative claims until approvals exist. Review public indexing and canonical/OG settings.
- Optional calendar renders only with a public `NEXT_PUBLIC_CALENDAR_URL`. Analytics remain off; no automatic inquiry email is implemented.
- Run production QA and performance on the actual host before DNS/public indexing. Do not infer field Core Web Vitals from local Lighthouse.

## Evidence and QA

`docs/source-asset-register.json`, `docs/asset-provenance.md`, `docs/skills.lock.json`, `docs/dependency-decisions.md`, `docs/qa/` and `docs/implementation-status.md` record actual work and limitations. Generated hero is an illustration of a healthcare environment, not a client photograph. Original source files remain private. Public product boards preserve the supplied interface artwork with identifying sample fields obscured; see asset provenance for exact derivatives. Policies need owner review before public release.

The dev output is `.next-dev`; production output is `.next`. Both are ignored. Do not point both server modes at the same output directory. Successful assessment confirmation uses a short-lived signed HttpOnly SameSite cookie with no contact data; the status API uses a signed token. The developer server may log ordinary request URLs, but normal success URLs contain no receipt token.

## October 18 design revision

Services and Products are separate collections. `/products` and `/products/behavioral-health-application` are canonical product pages; `/solutions/patient-engagement` permanently redirects to the product. The fifth service now lives at `/solutions/engagement-workflows`. Integration work remains at `/solutions/integrations`.

The original Care Sentry interface boards are displayed in contained horizontal viewers with an accessible modal. A single generated device photograph contains an exact uniformly scaled crop of the original non-emergency progress screen. `scripts/prepare-product-assets.py` records field-only redactions and deterministic compositing coordinates; original sources are preserved.

Phosphor React 2.1.10 replaces Lucide. Server-compatible icons are imported explicitly from per-icon `@phosphor-icons/react/dist/ssr/<Icon>` modules, verified against the official package documentation. The comparison uses Pointer Events and a 0–100 ARIA slider. Process rows and funnel layers receive one shared cumulative ScrollTrigger state; reduced motion shows all four stages reached.
