import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { seedPets } from "./seed.js";
import type { AdoptionApplication, Pet } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const DB_PATH = process.env.DB_PATH ?? join(DATA_DIR, "pataadopt.db");

mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER NOT NULL,
    size TEXT NOT NULL,
    energy TEXT NOT NULL,
    goodWithKids INTEGER NOT NULL,
    goodWithPets INTEGER NOT NULL,
    hypoallergenic INTEGER NOT NULL,
    description TEXT NOT NULL,
    photoUrl TEXT NOT NULL,
    adopted INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    petId INTEGER NOT NULL,
    applicantName TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (petId) REFERENCES pets(id)
  );
`);

const petCount = (db.prepare("SELECT COUNT(*) AS c FROM pets").get() as { c: number }).c;
if (petCount === 0) {
  const insert = db.prepare(`
    INSERT INTO pets (name, species, breed, age, size, energy, goodWithKids, goodWithPets, hypoallergenic, description, photoUrl, adopted)
    VALUES (@name, @species, @breed, @age, @size, @energy, @goodWithKids, @goodWithPets, @hypoallergenic, @description, @photoUrl, @adopted)
  `);
  const insertMany = db.transaction((pets: Omit<Pet, "id">[]) => {
    for (const p of pets) {
      insert.run({
        ...p,
        goodWithKids: p.goodWithKids ? 1 : 0,
        goodWithPets: p.goodWithPets ? 1 : 0,
        hypoallergenic: p.hypoallergenic ? 1 : 0,
        adopted: p.adopted ? 1 : 0
      });
    }
  });
  insertMany(seedPets);
}

interface PetRow {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  size: string;
  energy: string;
  goodWithKids: number;
  goodWithPets: number;
  hypoallergenic: number;
  description: string;
  photoUrl: string;
  adopted: number;
}

function rowToPet(row: PetRow): Pet {
  return {
    id: row.id,
    name: row.name,
    species: row.species as Pet["species"],
    breed: row.breed,
    age: row.age,
    size: row.size as Pet["size"],
    energy: row.energy as Pet["energy"],
    goodWithKids: Boolean(row.goodWithKids),
    goodWithPets: Boolean(row.goodWithPets),
    hypoallergenic: Boolean(row.hypoallergenic),
    description: row.description,
    photoUrl: row.photoUrl,
    adopted: Boolean(row.adopted)
  };
}

export function getAllPets(): Pet[] {
  const rows = db.prepare("SELECT * FROM pets ORDER BY id").all() as PetRow[];
  return rows.map(rowToPet);
}

export function getPetById(id: number): Pet | undefined {
  const row = db.prepare("SELECT * FROM pets WHERE id = ?").get(id) as PetRow | undefined;
  return row ? rowToPet(row) : undefined;
}

export function markAdopted(id: number): void {
  db.prepare("UPDATE pets SET adopted = 1 WHERE id = ?").run(id);
}

export function createApplication(
  input: Omit<AdoptionApplication, "id" | "createdAt">
): AdoptionApplication {
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO applications (petId, applicantName, email, message, createdAt)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(input.petId, input.applicantName, input.email, input.message, createdAt);
  return {
    id: Number(result.lastInsertRowid),
    createdAt,
    ...input
  };
}

export function getApplications(): AdoptionApplication[] {
  return db
    .prepare("SELECT * FROM applications ORDER BY createdAt DESC")
    .all() as AdoptionApplication[];
}

export default db;
