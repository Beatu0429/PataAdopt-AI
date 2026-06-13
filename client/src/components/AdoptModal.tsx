import { useState } from "react";
import { submitApplication } from "../api";
import type { Pet } from "../types";

interface Props {
  pet: Pet;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function AdoptModal({ pet, onClose, onSuccess }: Props) {
  const [applicantName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await submitApplication({ petId: pet.id, applicantName, email, message });
      onSuccess(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">Adopt {pet.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>
        <p className="mt-1 text-slate-500">
          Tell us a bit about you and we'll reach out about meeting {pet.name}.
        </p>

        <div className="mt-5 space-y-4">
          <Input label="Your name" value={applicantName} onChange={setName} required />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Why are you a great fit? (optional)
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Submitting…" : `Submit adoption application 💛`}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
