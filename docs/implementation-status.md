# Implementation status — complete local handoff

App: /Users/hamedsattarian/Utopia/website. English public website implemented from all four original briefs. Existing files/docs preserved. 31 public routes plus 404, H01–H14, five services, three industries, four anonymous cases, three articles, company/approach/partnership/policies, advanced assessment and contact.

Verified: local JSONL persistence, CSV exports, drafts/conditional normalization, signed receipts/status, duplicates/conflicts/rate limits, production local-storage rejection. Server-only Sheets/Redis adapter implemented and mocked; no real external write without credentials.

Current QA: lint/typecheck/content and final build pass; 13 unit and 13 browser tests pass (`qa/revision-full-results.json`); 20 final production route/viewport combinations pass without console errors, failed requests or page overflow. Production build and three-route browser smoke pass without errors/failed requests. Final serial Lighthouse mobile: home 95 performance/100 accessibility, assessment 94/100. LCP 2.9s/2.8s; CLS 0/0.096. These are local lab measurements.

Servers: development http://localhost:3000 (.next-dev), production preview http://localhost:3001 (.next), both using Node 22.23.1. Do not kill unrelated processes.

14 selected project skills installed with pinned refs, sources/hashes and explicit-read/discovery limitations recorded. All source types inventoried/extracted, representative media/embedded diagrams reviewed. Generated hero retained. Original Care Sentry boards preserved with field-only sanitation and a finished single-device image using exact source UI. No reference MP4, source ZIP or original form screenshot present; live reference inspected desktop/mobile and file04 applied.

Outstanding external/owner work: Google Sheets + Redis configuration and verified real synthetic rows, contact/policy/media/product review, optional official logo, case name/metric approvals. No deployment, paid service creation, authentication, portal or email integration. See README, QA report, asset provenance and unresolved-decisions.

## October 18 revision

Five visible server-rendered bento cards replace the service accordion. Integration service has its own source-led branched architecture feature and detail content. Product has separate collection/navigation, canonical overview and detail routes, full original boards and an accessible modal viewer. Legacy product URL permanently redirects; patient engagement workflow services have a distinct route. Phosphor replaces Lucide across UI. Comparison supports exact 0–100 Pointer Events, touch and keyboard endpoints; source-specific after layouts distinguish branches from serial flows. One ScrollTrigger cumulative state synchronizes process rows and funnel; reduced motion is static and complete.

Revised verification and screenshots: `docs/qa/revision-report.md`. Prior Lighthouse measurements below describe the previous build, not a new measurement of this revision.
