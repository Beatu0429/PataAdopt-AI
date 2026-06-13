import assert from "node:assert/strict";
import { test } from "node:test";
import { scorePets } from "./matcher.js";
import type { MatchPreferences, Pet } from "../types.js";

const pets: Pet[] = [
  {
    id: 1,
    name: "Pepper",
    species: "dog",
    breed: "Poodle",
    age: 2,
    size: "small",
    energy: "medium",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    description: "",
    photoUrl: "",
    adopted: false
  },
  {
    id: 2,
    name: "Rex",
    species: "dog",
    breed: "Labrador",
    age: 5,
    size: "large",
    energy: "high",
    goodWithKids: false,
    goodWithPets: false,
    hypoallergenic: false,
    description: "",
    photoUrl: "",
    adopted: false
  },
  {
    id: 3,
    name: "Adopted",
    species: "cat",
    breed: "Tabby",
    age: 3,
    size: "small",
    energy: "low",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    description: "",
    photoUrl: "",
    adopted: true
  }
];

const apartmentFamily: MatchPreferences = {
  species: "dog",
  homeSize: "apartment",
  activityLevel: "medium",
  hasKids: true,
  hasOtherPets: true,
  needsHypoallergenic: true
};

test("excludes already-adopted pets", () => {
  const results = scorePets(pets, apartmentFamily);
  assert.equal(results.length, 2);
  assert.ok(!results.some((r) => r.pet.adopted));
});

test("ranks the better-fitting pet first", () => {
  const results = scorePets(pets, apartmentFamily);
  assert.equal(results[0].pet.name, "Pepper");
  assert.ok(results[0].score > results[1].score);
});

test("scores are clamped between 0 and 100", () => {
  const results = scorePets(pets, apartmentFamily);
  for (const r of results) {
    assert.ok(r.score >= 0 && r.score <= 100);
  }
});

test("produces at least one reason per match", () => {
  const results = scorePets(pets, apartmentFamily);
  for (const r of results) {
    assert.ok(r.reasons.length > 0);
  }
});
