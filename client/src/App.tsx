import { useEffect, useState } from "react";
import { fetchPets } from "./api";
import { PetCard } from "./components/PetCard";
import { MatchQuiz } from "./components/MatchQuiz";
import { AdoptModal } from "./components/AdoptModal";
import type { Pet } from "./types";

export default function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [adopting, setAdopting] = useState<Pet | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    try {
      setPets(await fetchPets());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleAdopted(message: string) {
    setAdopting(null);
    setQuizOpen(false);
    setToast(message);
    load();
    setTimeout(() => setToast(null), 6000);
  }

  const availableCount = pets.filter((p) => !p.adopted).length;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <span className="text-2xl">🐾</span> PataAdopt
            <span className="text-brand-500">-AI</span>
          </div>
          <button
            onClick={() => setQuizOpen(true)}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            ✨ Find my match
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
            AI-powered pet matching
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
            Find your perfect <span className="text-brand-500">furever</span> friend
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Tell us about your home and lifestyle, and our matching engine finds the companions who'll
            thrive with you. {availableCount} pets waiting for a home.
          </p>
          <button
            onClick={() => setQuizOpen(true)}
            className="mt-8 rounded-2xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-200 transition hover:-translate-y-0.5 hover:bg-brand-600"
          >
            Start matching 🐾
          </button>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-extrabold text-slate-900">Meet our pets</h2>

        {loading && <p className="text-slate-500">Loading pets…</p>}
        {error && (
          <p className="rounded-xl bg-red-50 p-4 font-medium text-red-700">⚠️ {error}</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onAdopt={setAdopting} />
          ))}
        </div>
      </main>

      <footer className="border-t border-orange-100 bg-white py-8 text-center text-sm text-slate-500">
        Made with 💛 by PataAdopt-AI · Every pet deserves a loving home.
      </footer>

      {quizOpen && <MatchQuiz onClose={() => setQuizOpen(false)} onAdopt={setAdopting} />}
      {adopting && (
        <AdoptModal
          pet={adopting}
          onClose={() => setAdopting(null)}
          onSuccess={handleAdopted}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
