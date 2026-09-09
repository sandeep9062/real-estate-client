import Link from "next/link";

const INTENTS = [
  {
    key: "has_room",
    title: "I have a room, need a flatmate",
    description: "List your spare room or flat and find someone who fits.",
  },
  {
    key: "seeking_room",
    title: "I'm looking for a room",
    description: "Search rooms and flats near you, filtered by budget and lifestyle.",
  },
  {
    key: "swap",
    title: "I want to swap flats",
    description: "Trade places with someone whose location works better for you.",
  },
  {
    key: "temporary_offer",
    title: "I have a place for temporary stay",
    description: "Offer your room or flat for a short-term stay.",
  },
  {
    key: "temporary_seek",
    title: "I need a temporary stay",
    description: "Find a short-term room while you sort out something longer-term.",
  },
];

export default function FlatmatesLanding() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Find a flatmate</h1>
      <p className="mt-2 text-slate-600">
        Tell us what you're here for — this decides what we ask you next.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {INTENTS.map((intent) => (
          <Link
            key={intent.key}
            href={`/flatmates/onboarding?intent=${intent.key}`}
            className="block rounded-lg border border-slate-200 p-5 transition hover:border-slate-400 hover:shadow-sm"
          >
            <h2 className="font-medium text-slate-900">{intent.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{intent.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex gap-6 text-sm text-slate-600">
        <Link href="/flatmates/browse" className="underline underline-offset-2">
          Browse rooms without creating a profile
        </Link>
        <Link href="/flatmates/connections" className="underline underline-offset-2">
          My connection requests
        </Link>
      </div>
    </main>
  );
}