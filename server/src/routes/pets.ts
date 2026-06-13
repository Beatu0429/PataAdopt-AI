import { Router } from "express";
import { getAllPets, getPetById } from "../db.js";

export const petsRouter = Router();

petsRouter.get("/", (_req, res) => {
  res.json(getAllPets());
});

petsRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid pet id" });
    return;
  }
  const pet = getPetById(id);
  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
    return;
  }
  res.json(pet);
});
