# Initial-build QA report — 18 October 2026

Environment: macOS, Node 22.23.1, pnpm 11.25.0, Next 16.4.2, Chromium 156 / Playwright 1.64.1. Local development at localhost:3000, production preview at localhost:3001. All submissions use synthetic business data, never patient data.

## Implemented checks
- Strict TypeScript and ESLint pass.
- Content check: 30 inventory records, five service details, three industry details, four anonymous cases and three complete articles; all required selected media exist. Original evidence and pending financial claims remain private.
- 13 unit tests pass: validation, hidden answers, limits, CSV mapping/escaping, process serialization/restart, conflict detection, Sheets RAW append and ambiguous reconciliation, signed receipt tampering/expiry.
- Browser suite final results are recorded in playwright-results.json. It exercises every route and real 404, responsive home, menu keyboard behavior, services, case tabs/range, FAQ, draft restore/conditional assessment through actual storage and signed confirmation, contact storage and failure recovery, reduced motion, axe, security status codes, duplicates/conflicts/rate limiting, production local-storage rejection, all internal links and representative interior layouts.
- Screenshots: hero at 360, 390, 768, 1024, 1366 and 1440; services, cases, assessment and footer. Inspected and refined type/highlight spacing, service proportions, contrast and form layout. No pixel-perfect/video-parity claim.
- CSV export executed for both local streams; files stay private under ignored data/local.
- Public assets/client bundles checked for raw source names and private key configuration; no matching private evidence content found.

## Performance
Final serial Lighthouse measurements are appended below. Earlier files named lighthouse-home.json, lighthouse-home-optimized.json and lighthouse-assessment.json are development diagnostics; the latter parallel runs were affected by competing browser/build workload. They are not claimed as final performance. No field Core Web Vitals or accessibility certification is implied by a local lab result.

## Boundaries
Google Sheets and Redis adapter behavior is mocked in unit tests, not verified against an external account. Owner credentials plus a real synthetic row check are required. Local receipts confirm private JSONL persistence only; no automatic email or calendar booking is implemented. Production refuses local lead storage. No deployment performed.

The local reference MP4/ZIP/form screenshot was absent. Live reference inspected on desktop and at a mobile viewport; file 04 supplied the detailed motion/layout target. Product boards are safe fictional HTML reconstructions. Original screenshot boards containing personal/clinical data were excluded. Silent event derivatives have descriptive captions/posters; original spoken audio needs transcript review before public use. Contact details, media permissions, product naming/status, policy fit and named attribution need owner approval before public release.

## Final results

- Full browser suite: **9 passed, 0 failed, 0 flaky** (48.5 seconds); preserved in `playwright-full-results.json`. After the final hero crop and article-link changes, the focused responsive/links suite passed again (2/2).
- Production build passed using Node 22.23.1. Production browser smoke: three routes, no console errors, no failed requests; `production-smoke.json`.
- Both local CSV commands executed successfully. Unit suite: 13/13; lint, typecheck and content checks passed.

| Route | Performance | Accessibility | LCP | CLS | TBT | Script transfer |
|---|---:|---:|---:|---:|---:|---:|
| Home | 95 | 100 | 2.9 s | 0 | 50 ms | 264.8 KiB |
| Assessment | 94 | 100 | 2.8 s | 0.096 | 20 ms | 264.8 KiB |

Lighthouse 13.5.0, Chromium 156, mobile simulation (412×823), simulated Slow 4G / 4× CPU slowdown, local production server on this Mac. Runs performed serially after tests/build completed. Script transfer includes framework chunks and browser-visible scripts; it is not a field measurement. LCP remains above the 2.5-second implementation target in this simulated lab run despite reaching the score target. Assessment CLS 0.096 is close to the 0.1 budget; monitor the real deployment. No INP measurement or field percentile is claimed.

The later design revision and its final checks are recorded in [revision-report.md](revision-report.md). Earlier counts and Lighthouse measurements above refer to the initial build.
