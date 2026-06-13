// Vercel Serverless Function entrypoint for the PataAdopt-AI API.
//
// The Express app is built from the `server` workspace (compiled to
// `server/dist` by the root `build` script, which Vercel runs as its
// buildCommand before bundling functions). All `/api/*` requests are routed
// here via the rewrite in `vercel.json`, and Express handles the sub-routing.
import app from "../server/dist/app.js";

export default app;
