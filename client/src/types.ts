export type Species = "dog" | "cat" | "rabbit";
export type Size = "small" | "medium" | "large";
export type Energy = "low" | "medium" | "high";

export interface Pet {
  id: number;
  name: string;
  species: Species;
  breed: string;
  age: number;
  size: Size;
  energy: Energy;
  goodWithKids: boolean;
  goodWithPets: boolean;
  hypoallergenic: boolean;
  description: string;
  photoUrl: string;
  adopted: boolean;
}

export interface MatchPreferences {
  species: Species | "any";
  homeSize: "apartment" | "house";
  activityLevel: Energy;
  hasKids: boolean;
  hasOtherPets: boolean;
  needsHypoallergenic: boolean;
}

export interface MatchResult {
  pet: Pet;
  score: number;
  reasons: string[];
}

export interface MatchResponse {
  matches: MatchResult[];
  aiNote: string | null;
  engine: "local" | "llm-enriched";
}

export interface ApplicationResponse {
  application: {
    id: number;
    petId: number;
    applicantName: string;
    email: string;
    message: string;
    createdAt: string;
  };
  message: string;
}
