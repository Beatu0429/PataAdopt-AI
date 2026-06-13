import { useState } from "react";
import { requestMatches } from "../api";
import type { MatchPreferences, MatchResponse, Pet } from "../types";

interface Props {
  onClose: () => void;
  onAdopt: (pet: Pet) => void;
}

const defaultPrefs: MatchPreferences = {
  species: "any",
  homeSize: "apartment",
  activityLevel: "medium",
  hasKids: false,
  hasOtherPets: false,
  needsHypoallergenic: false
};

export function MatchQuiz({ onClose, onAdopt }: Props) {
  const [prefs, setPrefs] = useState<MatchPreferences>(defaultPrefs);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runMatch() {
    setLoading(true);
    setError(null);
    try {
      setResult(await requestMatches(prefs));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof MatchPreferences>(key: K, value: MatchPreferences[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">🐾 Find your match</h2>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-700">
            ×
          </button>
        </div>
        <p className="mt-1 text-slate-500">
          Answer a few questions and our AI matcher ranks the best companions for you.
        </p>

        {!result ? (
          <div className="mt-6 space-y-5">
            <Field label="Which companion are you looking for?">
              <Select
                value={prefs.species}
                onChange={(v) => update("species", v as MatchPreferences["species"])}
                options={[
                  ["any", "Open to any"],
                  ["dog", "Dog 🐕"],
                  ["cat", "Cat 🐈"],
                  ["rabbit", "Rabbit 🐇"]
                ]}
              />
            </Field>
            <Field label="Where will they live?">
              <Select
                value={prefs.homeSize}
                onChange={(v) => update("homeSize", v as MatchPreferences["homeSize"])}
                options={[
                  ["apartment", "Apartment"],
                  ["house", "House with space"]
                ]}
              />
            </Field>
            <Field label="Your activity level">
              <Select
                value={prefs.activityLevel}
                onChange={(v) => update("activityLevel", v as MatchPreferences["activityLevel"])}
                options={[
                  ["low", "Low — calm & cozy"],
                  ["medium", "Medium — some walks & play"],
                  ["high", "High — very active"]
                ]}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Toggle
                label="Kids at home"
                checked={prefs.hasKids}
                onChange={(v) => update("hasKids", v)}
              />
              <Toggle
                label="Other pets"
                checked={prefs.hasOtherPets}
                onChange={(v) => update("hasOtherPets", v)}
              />
              <Toggle
                label="Need hypoallergenic"
                checked={prefs.needsHypoallergenic}
                onChange={(v) => update("needsHypoallergenic", v)}
              />
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button
              onClick={runMatch}
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Matching…" : "✨ Find my matches"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {result.aiNote && (
              <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
                <span className="font-semibold">AI counselor:</span> {result.aiNote}
              </div>
            )}
            {result.matches.map((m, i) => (
              <div
                key={m.pet.id}
                className="flex gap-4 rounded-2xl border border-slate-100 p-4 shadow-sm"
              >
                <img
                  src={m.pet.photoUrl}
                  alt={m.pet.name}
                  className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">
                      {i === 0 && "🏆 "}
                      {m.pet.name}{" "}
                      <span className="font-normal text-slate-500">· {m.pet.breed}</span>
                    </h3>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700">
                      {m.score}% match
                    </span>
                  </div>
                  <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                    {m.reasons.slice(0, 3).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onAdopt(m.pet)}
                    className="mt-2 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600"
                  >
                    Adopt {m.pet.name}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setResult(null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
            >
              ↺ Adjust answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
        checked
          ? "border-brand-400 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      {checked ? "✓ " : ""}
      {label}
    </button>
  );
}
