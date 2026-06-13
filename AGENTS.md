# AGENTS.md

PataAdopt-AI is an npm-workspaces monorepo:

- `server/` — Express + TypeScript REST API, SQLite via `better-sqlite3`.
- `client/` — React + Vite + TypeScript + Tailwind SPA.

Standard commands are documented in `README.md` (root scripts: `dev`, `build`, `lint`,
`typecheck`, `test`). Run them from the repo root.

## Cursor Cloud specific instructions

- Dependencies install with a single root `npm install` (npm workspaces hoist both `server/` and
  `client/`). This is already handled by the startup update script — do not reinstall unless
  `package.json` changed.
- `better-sqlite3` is a native module; it installs via prebuilt binaries on Node 22 here. If a
  Node version change ever forces a source build, `make`/`gcc`/`g++`/`python3` are available.
- Run both services together with `npm run dev` from the repo root (uses `concurrently`). The API
  listens on `:4000` and the Vite client on `:5173`. The client dev server proxies `/api/*` to the
  API, so start the API (or just use `npm run dev`) before exercising the UI.
- The SQLite file is created and seeded automatically at `server/data/pataadopt.db` on first run;
  it is gitignored. Delete it to reset to the seeded catalog. Submitting an adoption application
  marks that pet as `adopted`, so re-seeding may be needed to repeat the full flow on a fresh state.
- AI matching works with no secrets (local deterministic engine). Setting `OPENAI_API_KEY` (and
  optionally `OPENAI_MODEL`) only adds an extra LLM-generated note for the top match; absence or
  failure falls back to the local engine.
