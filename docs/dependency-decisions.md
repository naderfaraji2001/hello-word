# Dependency decisions
Exact versions in package.json and pnpm-lock.yaml. Node 22 LTS; verified binary `/opt/homebrew/bin/node` v22.23.1. Package manager pnpm 11.25.0 (bundled launcher itself uses a newer runtime; application checks explicitly run Node 22).

Next.js 16.4.2, compatible React 19.3.1; Tailwind 4.3.3; GSAP 3.15.0. Official documentation checked during build:
- https://nextjs.org/docs/app/getting-started/installation
- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://gsap.com/resources/React/
- https://developers.google.com/workspace/sheets/api/guides/values

TypeScript 7 was current but unsupported by the installed typescript-eslint; compatible stable TypeScript 6.0.3 selected. ESLint 9.39.5 retained for compatibility, despite its upstream support warning; this is a development tool and should be upgraded with the Next lint toolchain. Build explicitly uses webpack after Turbopack tracing failed on a private Python venv symlink. Private working directories excluded from tracing. No framework runtime source changed.

Local Python venv in inputs used only for evidence extraction (PyMuPDF, openpyxl, Pillow, python-docx and python-pptx). Not part of application runtime. The original docs directory remains unchanged. No paid services created.

Development uses `.next-dev` and production `.next` to prevent cross-contamination during concurrent local development/build. Node package is kept in default CommonJS mode because Playwright's loader requires JSON import attributes in ESM mode; the CSV CLI wraps asynchronous work in main(), and Vitest config uses .mts for a clean ESM config boundary.

- October 18 revision: added exact `@phosphor-icons/react@2.1.10`, removed `lucide-react` after eliminating all imports. Verified actual installed exports (`ArrowUpRight`, `CaretDown`, `ArrowsHorizontal`, etc.) and SSR entrypoints. Per-icon SSR imports avoid eagerly traversing the whole icon barrel in development. Official reference: https://github.com/phosphor-icons/react#react-server-components-and-ssr . No other dependency upgrades.
