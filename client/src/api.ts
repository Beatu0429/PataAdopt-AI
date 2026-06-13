import type {
  ApplicationResponse,
  MatchPreferences,
  MatchResponse,
  Pet
} from "./types";

const BASE = import.meta.env.VITE_API_URL ?? "";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchPets(): Promise<Pet[]> {
  return fetch(`${BASE}/api/pets`).then((r) => handle<Pet[]>(r));
}

export function requestMatches(prefs: MatchPreferences): Promise<MatchResponse> {
  return fetch(`${BASE}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs)
  }).then((r) => handle<MatchResponse>(r));
}

export function submitApplication(input: {
  petId: number;
  applicantName: string;
  email: string;
  message: string;
}): Promise<ApplicationResponse> {
  return fetch(`${BASE}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  }).then((r) => handle<ApplicationResponse>(r));
}
