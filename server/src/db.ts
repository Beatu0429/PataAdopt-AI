import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { seedPets } from "./seed.js";
import type { AdoptionApplication, Pet } from "./types.js";

/**
 * Portable persistence layer.
 *
 * Data lives in memory (seeded on boot) and is best-effort persisted to a JSON
 * file so local development survives restarts. On read-only/serverless
 * filesystems the file write simply no-ops and the app keeps working from
 * memory. This avoids native dependencies (e.g. better-sqlite3), which makes the
 * API trivially deployable to serverless platforms such as Vercel.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveDataFile(): string {
  if (process.env.DATA_FILE) return process.env.DATA_FILE;
  // Serverless filesystems are read-only except for /tmp.
  if (process.env.VERCEL) return "/tmp/pataadopt-state.json";
  return join(__dirname, "..", "data", "state.json");
}

const DATA_FILE = resolveDataFile();

interface PersistedState {
  pets: Pet[];
  applications: AdoptionApplication[];
  nextApplicationId: number;
}

function freshState(): PersistedState {
  return {
    pets: seedPets.map((p, i) => ({ ...p, id: i + 1 })),
    applications: [],
    nextApplicationId: 1
  };
}

function load(): PersistedState {
  try {
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as PersistedState;
    if (Array.isArray(parsed.pets) && parsed.pets.length > 0) {
      return parsed;
    }
  } catch {
    // No existing state (or unreadable) — start from seed.
  }
  return freshState();
}

const state: PersistedState = load();

function persist(): void {
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // Read-only filesystem (e.g. serverless) — keep operating from memory.
  }
}

export function getAllPets(): Pet[] {
  return state.pets.map((p) => ({ ...p }));
}

export function getPetById(id: number): Pet | undefined {
  const pet = state.pets.find((p) => p.id === id);
  return pet ? { ...pet } : undefined;
}

export function markAdopted(id: number): void {
  const pet = state.pets.find((p) => p.id === id);
  if (pet) {
    pet.adopted = true;
    persist();
  }
}

export function createApplication(
  input: Omit<AdoptionApplication, "id" | "createdAt">
): AdoptionApplication {
  const application: AdoptionApplication = {
    id: state.nextApplicationId++,
    createdAt: new Date().toISOString(),
    ...input
  };
  state.applications.push(application);
  persist();
  return application;
}

export function getApplications(): AdoptionApplication[] {
  return [...state.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
