import { Router } from "express";
import { z } from "zod";
import { getAllPets } from "../db.js";
import { generateMatchNote, scorePets } from "../ai/matcher.js";

export const matchRouter = Router();

const prefsSchema = z.object({
  species: z.enum(["dog", "cat", "rabbit", "any"]),
  homeSize: z.enum(["apartment", "house"]),
  activityLevel: z.enum(["low", "medium", "high"]),
  hasKids: z.boolean(),
  hasOtherPets: z.boolean(),
  needsHypoallergenic: z.boolean()
});

matchRouter.post("/", async (req, res) => {
  const parsed = prefsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid preferences", details: parsed.error.flatten() });
    return;
  }

  const ranked = scorePets(getAllPets(), parsed.data);
  const top = ranked.slice(0, 3);

  let aiNote: string | null = null;
  if (top.length > 0) {
    aiNote = await generateMatchNote(top[0], parsed.data);
  }

  res.json({
    matches: top,
    aiNote,
    engine: aiNote ? "llm-enriched" : "local"
  });
});
