import type { Pet } from "../types";

const speciesEmoji: Record<Pet["species"], string> = {
  dog: "🐕",
  cat: "🐈",
  rabbit: "🐇"
};

interface Props {
  pet: Pet;
  onAdopt: (pet: Pet) => void;
}

export function PetCard({ pet, onAdopt }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <img
          src={pet.photoUrl}
          alt={pet.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {pet.adopted && (
          <span className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-lg font-bold text-white">
            Adopted 💛
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow">
          {speciesEmoji[pet.species]} {pet.breed}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold text-slate-900">{pet.name}</h3>
          <span className="text-sm text-slate-500">
            {pet.age} {pet.age === 1 ? "yr" : "yrs"}
          </span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-slate-600">{pet.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {pet.hypoallergenic && <Tag>Hypoallergenic</Tag>}
          {pet.goodWithKids && <Tag>Good with kids</Tag>}
          {pet.goodWithPets && <Tag>Good with pets</Tag>}
          <Tag>{pet.energy} energy</Tag>
        </div>
        <button
          disabled={pet.adopted}
          onClick={() => onAdopt(pet)}
          className="mt-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pet.adopted ? "Already home" : `Adopt ${pet.name}`}
        </button>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium capitalize text-brand-700">
      {children}
    </span>
  );
}
