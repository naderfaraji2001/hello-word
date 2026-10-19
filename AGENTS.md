# Utopia website

Build and verify the complete local English website. Communicate handoff in Persian. Source authority: user's latest instruction, then ../files/01 (content), 02 (technical), 03 (skills), 04 (design), then supporting ../docs, then skills. Never modify original files/docs. No deployment or external messages without a new user request.

Use Node 22, pnpm 11.25.0, Next App Router, strict TypeScript, Tailwind 4, scoped GSAP. Current Next docs are in node_modules/next/dist/docs; read relevant API docs before unfamiliar changes. Build uses webpack because Turbopack tracing encountered private venv symlinks; inputs, skills, docs and test files are excluded from deployment traces.

Commands: pnpm setup; pnpm dev; pnpm lint; pnpm typecheck; pnpm content:check; pnpm test; pnpm test:e2e; pnpm build; pnpm start. Browser tests expect development server on localhost:3000. Local lead storage is development-only; data/local and .env.local must remain ignored and private. Never move source evidence, raw mobile boards or lead records into public.

All case attribution pending; quantitative metrics withheld. Products in development. No fabricated proof, prices, people or guarantees. Content source is src/content/pages.json plus site.ts; repository interface in src/lib/content. Local adapter complete; CMS boundary requires a real adapter to connect later.

Preserve exact palette and Funnel fonts. Reduced-motion and mobile variants must retain business content. Forms must only confirm after actual persistence. Google Sheets requires server credentials and durable Redis state before production. Do not claim external writes were verified without testing the owner's configured sheet.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
