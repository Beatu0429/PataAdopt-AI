import type { MatchPreferences, MatchResult, Pet } from "../types.js";

/**
 * Local, deterministic matching engine. Scores each pet against the adopter's
 * lifestyle preferences. Runs with zero external dependencies or API keys so the
 * product works out of the box.
 */
export function scorePets(pets: Pet[], prefs: MatchPreferences): MatchResult[] {
  const available = pets.filter((p) => !p.adopted);
  const results = available.map((pet) => scoreOne(pet, prefs));
  return results.sort((a, b) => b.score - a.score);
}

function scoreOne(pet: Pet, prefs: MatchPreferences): MatchResult {
  let score = 50;
  const reasons: string[] = [];

  if (prefs.species !== "any") {
    if (pet.species === prefs.species) {
      score += 20;
      reasons.push(`Matches your preferred companion type (${pet.species}).`);
    } else {
      score -= 25;
    }
  }

  if (pet.energy === prefs.activityLevel) {
    score += 15;
    reasons.push(`Energy level fits your ${prefs.activityLevel}-activity lifestyle.`);
  } else if (
    (prefs.activityLevel === "low" && pet.energy === "high") ||
    (prefs.activityLevel === "high" && pet.energy === "low")
  ) {
    score -= 15;
  }

  if (prefs.homeSize === "apartment") {
    if (pet.size === "small") {
      score += 12;
      reasons.push("Compact size is ideal for apartment living.");
    } else if (pet.size === "large") {
      score -= 12;
    }
  } else {
    if (pet.size === "large") {
      score += 6;
      reasons.push("Has plenty of room to thrive in a house with space.");
    }
  }

  if (prefs.hasKids) {
    if (pet.goodWithKids) {
      score += 12;
      reasons.push("Great with children.");
    } else {
      score -= 20;
    }
  }

  if (prefs.hasOtherPets) {
    if (pet.goodWithPets) {
      score += 10;
      reasons.push("Gets along well with other pets.");
    } else {
      score -= 18;
    }
  }

  if (prefs.needsHypoallergenic) {
    if (pet.hypoallergenic) {
      score += 15;
      reasons.push("Hypoallergenic coat — friendlier for allergy sufferers.");
    } else {
      score -= 30;
    }
  }

  const clamped = Math.max(0, Math.min(100, score));
  if (reasons.length === 0) {
    reasons.push("A solid all-around companion worth meeting.");
  }
  return { pet, score: clamped, reasons };
}

/**
 * Optional LLM enrichment. If OPENAI_API_KEY is set, generate a warm,
 * personalized one-line note for the top match. Falls back gracefully.
 */
export async function generateMatchNote(
  top: MatchResult,
  prefs: MatchPreferences
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a warm adoption counselor. Write ONE short, friendly sentence (max 25 words)."
          },
          {
            role: "user",
            content: `Adopter prefs: ${JSON.stringify(prefs)}. Top match: ${top.pet.name}, a ${top.pet.age}yo ${top.pet.breed} (${top.pet.species}). Why they'd be a great fit:`
          }
        ],
        temperature: 0.7,
        max_tokens: 60
      })
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}
