// Vercel Serverless Function entrypoint for the PataAdopt-AI API.
//
// This is a catch-all function: Vercel's file-system routing maps every
// `/api/*` request to this file and invokes it with the ORIGINAL request URL
// (e.g. `/api/pets`), which Express then routes internally. Using a catch-all
// (instead of `api/index.ts` + a rewrite) is important: Vercel `rewrites` drop
// the matched sub-path into the query string, so the Express app would only
// ever see `/api` and return 404 for `/api/pets`, `/api/match`, etc.
//
// The Express app is built from the `server` workspace (compiled to
// `server/dist` by the root `build` script, which Vercel runs as its
// buildCommand before bundling functions).
import app from "../server/dist/app.js";

export default app;
