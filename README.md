# PataAdopt-AI 🐾

An AI-powered pet adoption platform. Tell PataAdopt-AI about your home and lifestyle, and its
matching engine ranks the adoptable pets that will thrive with you. Browse pets, get personalized
matches, and submit an adoption application — all in a clean, modern web app.

## Tech stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS                    |
| Backend  | Node.js, Express, TypeScript                                |
| Storage  | Portable in-memory store, seeded on boot, best-effort JSON persistence (no native deps) |
| AI       | Local deterministic matching engine + optional OpenAI notes |
| Tooling  | npm workspaces, ESLint 9 (flat config), `tsx`, Node test runner |
| Deploy   | Vercel (static client + serverless API) — see [Deploy to Vercel](#deploy-to-vercel) |

This is an **npm workspaces monorepo**:

- [`server/`](server) — Express REST API (`/api/pets`, `/api/match`, `/api/applications`).
- [`client/`](client) — React single-page app.

## Prerequisites

- Node.js >= 20 (a `.nvmrc` pins Node 22).
- npm (ships with Node).

## Getting started

```bash
# 1. Install all workspace dependencies
npm install

# 2. (Optional) configure environment
cp .env.example .env   # all values have sensible defaults

# 3. Run both API + client in development mode (hot reload)
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000 (health check at `/api/health`)

The Vite dev server proxies `/api/*` to the backend, so no extra config is needed.

## Available scripts (run from the repo root)

| Command             | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Run API + client together with hot reload                 |
| `npm run dev:server`| Run only the API (`tsx watch`)                            |
| `npm run dev:client`| Run only the client (`vite`)                              |
| `npm run build`     | Type-check + build server (`tsc`) and client (`vite build`) |
| `npm run lint`      | Lint both workspaces with ESLint                          |
| `npm run typecheck` | Type-check both workspaces without emitting               |
| `npm test`          | Run the backend matching-engine unit tests                |

## AI matching

The matching engine ([`server/src/ai/matcher.ts`](server/src/ai/matcher.ts)) is **local and
deterministic** — it scores each available pet against the adopter's preferences (species, home
size, activity level, kids, other pets, hypoallergenic needs) and returns the top matches with
human-readable reasons. No API key is required.

If `OPENAI_API_KEY` is set, the API additionally generates a short, warm note for the top match.
If the key is absent or the call fails, the app falls back to the local engine seamlessly.

## API reference

| Method | Endpoint             | Description                                |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/api/health`        | Service health check                       |
| GET    | `/api/pets`          | List all pets                              |
| GET    | `/api/pets/:id`      | Get a single pet                           |
| POST   | `/api/match`         | Rank pets by adopter preferences           |
| GET    | `/api/applications`  | List submitted adoption applications       |
| POST   | `/api/applications`  | Submit an adoption application             |

Data is seeded in memory on boot and best-effort persisted to `server/data/state.json` locally
(`/tmp/pataadopt-state.json` on serverless). No external database or native module is required.

## Deploy to Vercel

The repo ships a [`vercel.json`](vercel.json) so the monorepo deploys as a single Vercel project:

- **Static frontend** — `npm run build` produces `client/dist`, served as the site (`outputDirectory`).
- **Serverless API** — [`api/index.ts`](api/index.ts) wraps the Express app; the rewrite
  `/(api/:path*)` routes all `/api/*` requests to it on the same origin.

```jsonc
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",      // builds server (tsc) + client (vite)
  "outputDirectory": "client/dist",
  "rewrites": [{ "source": "/api/:path*", "destination": "/api" }]
}
```

Importing the project into Vercel needs no manual settings — `vercel.json` overrides the framework
preset (this is what resolves the `No Output Directory named "build"` error). The frontend calls the
API at the same origin (`/api/...`), so no `VITE_API_URL` is needed in production. Set
`OPENAI_API_KEY` in the Vercel project to enable LLM-enriched match notes.

> Persistence on Vercel is per-instance and ephemeral (writes go to `/tmp`), which is expected for a
> serverless demo — adoption submissions reset on cold starts.
