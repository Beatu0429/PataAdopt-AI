import "dotenv/config";
import cors from "cors";
import express from "express";
import { petsRouter } from "./routes/pets.js";
import { matchRouter } from "./routes/match.js";
import { applicationsRouter } from "./routes/applications.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "pataadopt-ai", time: new Date().toISOString() });
});

app.use("/api/pets", petsRouter);
app.use("/api/match", matchRouter);
app.use("/api/applications", applicationsRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🐾 PataAdopt-AI API listening on http://localhost:${PORT}`);
});

export default app;
