import { Router } from "express";
import { z } from "zod";
import { createApplication, getApplications, getPetById, markAdopted } from "../db.js";

export const applicationsRouter = Router();

const applicationSchema = z.object({
  petId: z.number().int().positive(),
  applicantName: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().max(2000).optional().default("")
});

applicationsRouter.get("/", (_req, res) => {
  res.json(getApplications());
});

applicationsRouter.post("/", (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application", details: parsed.error.flatten() });
    return;
  }

  const pet = getPetById(parsed.data.petId);
  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
    return;
  }
  if (pet.adopted) {
    res.status(409).json({ error: `${pet.name} has already found a home.` });
    return;
  }

  const application = createApplication(parsed.data);
  markAdopted(parsed.data.petId);

  res.status(201).json({
    application,
    message: `Thank you, ${application.applicantName}! Your application to adopt ${pet.name} has been received.`
  });
});
