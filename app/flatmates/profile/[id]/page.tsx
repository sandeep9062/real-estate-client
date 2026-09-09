"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetPublicProfileQuery,
  useSendConnectionRequestMutation,
} from "@/services/roommatesApi";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useGetPublicProfileQuery(id, { skip: !id });

  const [sendConnectionRequest, { isLoading: sending }] =
    useSendConnectionRequestMutation();

  const error = submitError || getErrorMessage(profileError);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    try {
      await sendConnectionRequest({ toProfileId: id, message }).unwrap();
      setSent(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  if (error && !profile) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (isLoading || !profile) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {profile.gender ? humanize(profile.gender) + " · " : ""}
          {profile.occupation && humanize(profile.occupation)}
        </h1>
        {profile.idVerified && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
            ID verified
          </span>
        )}
      </div>

      {profile.bio && <p className="mt-3 text-slate-700">{profile.bio}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {profile.habits &&
          Object.entries(profile.habits)
            .filter(([, v]) => v)
            .map(([key, value]) => (
              <div key={key}>
                <dt className="text-slate-500">{humanize(key)}</dt>
                <dd className="text-slate-900">{humanize(String(value))}</dd>
              </div>
            ))}
      </dl>

      <div className="mt-8 border-t border-slate-200 pt-6">
        {sent ? (
          <p className="text-sm text-emerald-700">Connection request sent.</p>
        ) : (
          <form onSubmit={handleConnect} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say a bit about why you'd be a good fit (optional)"
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
              rows={3}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {sending ? "Sending…" : "Connect"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function humanize(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return (
    e.data?.message || e.error || e.message || "Something went wrong. Please try again."
  );
}