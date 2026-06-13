import type { Pet } from "./types.js";

export const seedPets: Omit<Pet, "id">[] = [
  {
    name: "Luna",
    species: "dog",
    breed: "Border Collie",
    age: 2,
    size: "medium",
    energy: "high",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    description:
      "Luna is a brilliant, athletic Border Collie who lives for frisbee and long hikes. She thrives with an active family.",
    photoUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&q=80",
    adopted: false
  },
  {
    name: "Milo",
    species: "cat",
    breed: "Tabby",
    age: 4,
    size: "small",
    energy: "low",
    goodWithKids: true,
    goodWithPets: false,
    hypoallergenic: false,
    description:
      "Milo is a mellow lap cat who enjoys sunny windowsills and quiet afternoons. Perfect for a calm apartment.",
    photoUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80",
    adopted: false
  },
  {
    name: "Coco",
    species: "rabbit",
    breed: "Mini Lop",
    age: 1,
    size: "small",
    energy: "medium",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    description:
      "Coco is a curious Mini Lop who loves leafy greens and gentle head scratches. Great first pet for families.",
    photoUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80",
    adopted: false
  },
  {
    name: "Rex",
    species: "dog",
    breed: "Labrador Retriever",
    age: 5,
    size: "large",
    energy: "medium",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    description:
      "Rex is a gentle giant and a devoted family companion. He's house-trained, calm indoors, and adores kids.",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
    adopted: false
  },
  {
    name: "Bella",
    species: "cat",
    breed: "Siberian",
    age: 3,
    size: "medium",
    energy: "medium",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    description:
      "Bella is a playful Siberian with a hypoallergenic coat. She's social, affectionate, and loves other animals.",
    photoUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
    adopted: false
  },
  {
    name: "Pepper",
    species: "dog",
    breed: "Poodle",
    age: 2,
    size: "small",
    energy: "medium",
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    description:
      "Pepper is a smart, hypoallergenic Poodle who learns tricks fast and fits beautifully into apartment living.",
    photoUrl: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=800&q=80",
    adopted: false
  }
];
