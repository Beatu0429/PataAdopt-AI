# AGENTS.md

PataAdopt-AI is an npm-workspaces monorepo:

- `server/` — Express + TypeScript REST API with a portable in-memory store (no native deps).
- `client/` — React + Vite + TypeScript + Tailwind SPA.
- `api/[...path].ts` — Vercel catch-all serverless entrypoint that re-exports the compiled Express
  app (`server/dist/app.js`); only used by Vercel, not local dev.

Standard commands are documented in `README.md` (root scripts: `dev`, `build`, `lint`,
`typecheck`, `test`). Run them from the repo root.

## Cursor Cloud specific instructions

- Dependencies install with a single root `npm install` (npm workspaces hoist both `server/` and
  `client/`). This is already handled by the startup update script — do not reinstall unless
  `package.json` changed.
- Run both services together with `npm run dev` from the repo root (uses `concurrently`). The API
  listens on `:4000` and the Vite client on `:5173`. The client dev server proxies `/api/*` to the
  API, so start the API (or just use `npm run dev`) before exercising the UI.
- Storage is an in-memory store seeded on boot, best-effort persisted to `server/data/state.json`
  (gitignored) locally and `/tmp/pataadopt-state.json` on serverless. Delete the file to reset to
  the seeded catalog. Submitting an adoption marks that pet `adopted`, so reset to repeat the full
  flow from scratch. There is no native dependency (no `better-sqlite3`).
- AI matching works with no secrets (local deterministic engine). Setting `OPENAI_API_KEY` (and
  optionally `OPENAI_MODEL`) only adds an extra LLM-generated note for the top match; absence or
  failure falls back to the local engine.

### Vercel deployment

- `vercel.json` drives the deploy: `buildCommand` runs `npm run build` (compiles `server/` to
  `server/dist` AND builds the client to `client/dist`); `outputDirectory` is `client/dist`.
- API routing uses the catch-all function `api/[...path].ts` (NOT `api/index.ts` + a rewrite).
  Vercel `rewrites` drop the matched sub-path into the query string, so an `api/index.ts` would only
  see `/api` and 404 every `/api/pets` etc.; the catch-all gets the full original URL. Don't
  reintroduce a `/api/:path*` rewrite.
- `api/[...path].ts` imports `../server/dist/app.js`, so the server MUST be compiled before the
  function is bundled — guaranteed because Vercel runs `buildCommand` before building `/api`. If you
  change the server build output dir, update that import path.
- If a deployed site shows an empty pet grid, check Vercel **Deployment Protection** isn't blocking
  `/api/*` for visitors (the frontend fetches pets client-side from the same origin).
- Local dev does NOT use `api/` or `vercel.json`; only the Vercel build does. To reproduce the
  exact production routing locally (static `client/dist` + same-origin `/api`), build first
  (`npm run build`) then serve `client/dist` statically while mounting the compiled Express app for
  `/api/*` on the same port.
