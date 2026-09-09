import Link from "next/link";
import {
  Users,
  Search,
  Repeat,
  Clock,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const INTENTS = [
  {
    key: "has_room",
    icon: Users,
    tag: "List a room",
    title: "I have a room, need a flatmate",
    description: "List your spare room or flat and find someone who fits.",
  },
  {
    key: "seeking_room",
    icon: Search,
    tag: "Search rooms",
    title: "I'm looking for a room",
    description:
      "Search rooms and flats near you, filtered by budget and lifestyle.",
  },
  {
    key: "swap",
    icon: Repeat,
    tag: "Swap",
    title: "I want to swap flats",
    description:
      "Trade places with someone whose location works better for you.",
  },
  {
    key: "temporary_offer",
    icon: Clock,
    tag: "Short-term",
    title: "I have a place for temporary stay",
    description: "Offer your room or flat for a short-term stay.",
  },
  {
    key: "temporary_seek",
    icon: CalendarClock,
    tag: "Short-term",
    title: "I need a temporary stay",
    description:
      "Find a short-term room while you sort out something longer-term.",
  },
];

function Eyebrow() {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700">
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ background: BRAND }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: BRAND }}
        />
      </span>
      Five ways to start
    </span>
  );
}

export default function FlatmatesLanding() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
      <Eyebrow />
      <h1
        className="mt-4 font-bold leading-[1.1] tracking-tight text-3xl sm:text-4xl"
        style={{ color: INK }}
      >
        Find a flatmate
      </h1>
      <p
        className="mt-3 text-[15px] sm:text-base max-w-lg"
        style={{ color: INK_SOFT }}
      >
        Tell us what you're here for — this decides what we ask you next.
      </p>

      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px rounded-2xl overflow-hidden"
        style={{ background: "#E5E7F2" }}
      >
        {INTENTS.map((intent) => (
          <Link
            key={intent.key}
            href={`/flatmates/onboarding?intent=${intent.key}`}
            className="group bg-white p-6 transition-colors hover:bg-[#FAFBFF]"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full transition-colors group-hover:bg-[#4161df] group-hover:text-white"
                style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
              >
                <intent.icon className="w-5 h-5" strokeWidth={1.8} />
              </span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: TINT_BG, color: BRAND }}
              >
                {intent.tag}
              </span>
            </div>

            <h2
              className="text-base font-semibold mb-1.5"
              style={{ color: INK }}
            >
              {intent.title}
            </h2>
            <p
              className="text-[13px] sm:text-sm leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              {intent.description}
            </p>

            <span
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
              style={{ color: BRAND }}
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link
          href="/flatmates/browse"
          className="rounded-full border px-5 py-2.5 font-medium transition-colors hover:bg-[#EEF1FC]"
          style={{ borderColor: "#E5E7F2", color: INK }}
        >
          Browse rooms without creating a profile
        </Link>
        <Link
          href="/flatmates/connections"
          className="rounded-full border px-5 py-2.5 font-medium transition-colors hover:bg-[#EEF1FC]"
          style={{ borderColor: "#E5E7F2", color: INK }}
        >
          My connection requests
        </Link>
      </div>
    </main>
  );
}
