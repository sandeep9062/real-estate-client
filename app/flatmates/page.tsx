import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Search,
  Repeat,
  Clock,
  CalendarClock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowLeftRight,
  MessagesSquare,
  UserPlus,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Flatmates & Shared Rooms in Tricity",
  description:
    "Find a flatmate or list your spare room in Chandigarh, Mohali, Panchkula and Zirakpur. Compatibility matching, verified profiles, swaps and short-term stays.",
};

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const BORDER = "#E5E7F2";

const INTENTS = [
  {
    key: "has_room",
    icon: Users,
    tag: "List a room",
    title: "I have a room, need a flatmate",
    description: "List your spare room or flat and find someone who fits.",
    accent: "#059669",
    accentBg: "#ECFDF5",
    popular: true,
  },
  {
    key: "seeking_room",
    icon: Search,
    tag: "Search rooms",
    title: "I'm looking for a room",
    description:
      "Search rooms and flats near you, filtered by budget and lifestyle.",
    accent: BRAND,
    accentBg: TINT_BG,
    popular: true,
  },
  {
    key: "swap",
    icon: Repeat,
    tag: "Swap",
    title: "I want to swap flats",
    description:
      "Trade places with someone whose location works better for you.",
    accent: "#7C3AED",
    accentBg: "#F5F3FF",
  },
  {
    key: "temporary_offer",
    icon: Clock,
    tag: "Short-term",
    title: "I have a place for temporary stay",
    description: "Offer your room or flat for a short-term stay.",
    accent: "#D97706",
    accentBg: "#FFFBEB",
  },
  {
    key: "temporary_seek",
    icon: CalendarClock,
    tag: "Short-term",
    title: "I need a temporary stay",
    description:
      "Find a short-term room while you sort out something longer-term.",
    accent: "#E11D48",
    accentBg: "#FFF1F2",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Tell us your budget, habits, sleep schedule and what you're looking for. It takes a couple of minutes.",
  },
  {
    icon: Sparkles,
    title: "Get matched",
    description:
      "We score compatibility between profiles so you see the flatmates you're most likely to get along with first.",
  },
  {
    icon: MessagesSquare,
    title: "Connect and move in",
    description:
      "Send a connection request with a short note, chat, then decide — no middlemen involved.",
  },
];

const CITIES = ["Chandigarh", "Mohali", "Panchkula", "Zirakpur"];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified profiles" },
  { icon: Sparkles, label: "Compatibility matching" },
  { icon: IndianRupee, label: "Connect directly, no middlemen" },
  { icon: MapPin, label: "Tricity-wide" },
];

const BANNER_STATS = [
  { value: "2,400+", label: "Verified profiles" },
  { value: "1,100+", label: "Successful matches" },
];

function Eyebrow() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-[13px] font-semibold shadow-sm"
      style={{ borderColor: BORDER, color: INK }}
    >
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
      Flatmates &amp; shared rooms in Tricity
    </span>
  );
}

/**
 * Hero showcase: a real photo (swap the `src` for your own asset) with a
 * few floating UI cards layered on top for a "product in context" feel.
 * On small screens the floating cards are hidden and only the photo shows;
 * from `sm:` up they reappear, anchored to the image's corners.
 */
function HeroShowcase() {
  return (
    <div className="relative mt-10 lg:mt-0">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-xl shadow-indigo-100/70 sm:aspect-[16/11] lg:aspect-auto lg:h-[440px]"
        style={{ borderColor: BORDER }}
      >
        {/* Replace with your own photo — e.g. flatmates in a shared living room */}
        <Image
          src="/flatmates-hero.png"
          alt="Flatmates relaxing together in a shared living room"
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        {/* Swap chip — sits directly on the photo, glass effect */}
        <div
          className="animate-fade-in-up absolute left-4 top-4 hidden items-center gap-2 rounded-full border bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-sm sm:flex"
          style={{ borderColor: BORDER, animationDelay: "240ms" }}
        >
          <ArrowLeftRight
            className="h-3.5 w-3.5"
            style={{ color: "#7C3AED" }}
          />
          <span className="text-xs font-semibold" style={{ color: INK }}>
            Flat swap matched
          </span>
        </div>
      </div>

      {/* Floating match card */}
      <div
        className="animate-fade-in-up absolute -right-3 -top-6 hidden w-64 rotate-2 rounded-2xl border bg-white p-4 shadow-lg shadow-indigo-100 sm:block sm:-right-6"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#4161df,#2b3f9e)" }}
          >
            AV
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: INK }}>
              Working professional
            </p>
            <p className="text-xs" style={{ color: INK_SOFT }}>
              Looking in Mohali
            </p>
          </div>
          <ShieldCheck className="ml-auto h-4 w-4 text-emerald-600" />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span style={{ color: INK_SOFT }}>Compatibility</span>
            <span style={{ color: BRAND }}>92%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full w-[92%] rounded-full"
              style={{ background: "linear-gradient(90deg,#4161df,#7C3AED)" }}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Veg", "Non-smoker", "Early bird"].map((chip) => (
            <span
              key={chip}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ background: TINT_BG, color: "#2b3f9e" }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Floating listing card */}
      <div
        className="animate-fade-in-up absolute -bottom-6 -left-3 hidden w-60 -rotate-2 rounded-2xl border bg-white p-4 shadow-lg shadow-indigo-100 sm:block sm:-left-6"
        style={{ borderColor: BORDER, animationDelay: "120ms" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: TINT_BG, color: BRAND }}
          >
            Private room
          </span>
          <span className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
            Sector 62
          </span>
        </div>
        <p className="mt-2 text-lg font-bold" style={{ color: INK }}>
          ₹9,500
          <span className="text-xs font-medium" style={{ color: INK_SOFT }}>
            /month
          </span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
          <CheckCircle2 className="h-3 w-3" />3 people interested this week
        </p>
      </div>
    </div>
  );
}

/** Full-width photo banner with a headline and stat chips over it. */
function ShowcaseBanner() {
  return (
    <section className="mt-14">
      <div
        className="relative overflow-hidden rounded-3xl border shadow-xl shadow-indigo-100/70"
        style={{ borderColor: BORDER }}
      >
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          {/* Replace with your own photo — e.g. flatmates cooking or moving in together */}
          <Image
            src="/flatmates-banner.png"
            alt="Group of flatmates cooking together in a shared kitchen"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/0" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-0 md:px-14">
          <div className="max-w-md">
            <span className="mb-4 block h-[3px] w-10 rounded-full bg-white" />
            <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
              Real people, real move-ins — every week
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/85 sm:text-base">
              Verified, compatibility-scored profiles turn into flatmate matches
              across the Tricity every month.
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 hidden gap-3 sm:flex">
          {BANNER_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur"
            >
              <p className="text-base font-bold" style={{ color: INK }}>
                {stat.value}
              </p>
              <p
                className="text-[11px] font-medium"
                style={{ color: INK_SOFT }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FlatmatesLanding() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 md:px-10">
      {/* ---------- Hero ---------- */}
      <section
        className="relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-14"
        style={{
          borderColor: BORDER,
          background:
            "linear-gradient(135deg,#EEF1FC 0%,#FAFBFF 55%,#F3F0FF 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle,#4161df33,transparent 70%)",
          }}
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow />
            <h1
              className="mt-5 max-w-xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-[2.75rem]"
              style={{ color: INK }}
            >
              Find a flatmate who{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#4161df,#7C3AED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                actually fits
              </span>{" "}
              your lifestyle
            </h1>
            <p
              className="mt-4 max-w-lg text-[15px] leading-relaxed sm:text-base"
              style={{ color: INK_SOFT }}
            >
              Rooms, flat-shares, swaps and short-term stays across Chandigarh,
              Mohali, Panchkula and Zirakpur — matched by budget, habits and
              schedule, not just location.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/flatmates/onboarding"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg,${BRAND},#2b3f9e)`,
                }}
              >
                <UserPlus className="h-4 w-4" />
                Create your free profile
              </Link>
              <Link
                href="/flatmates/browse"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#EEF1FC]"
                style={{ borderColor: BORDER, color: INK }}
              >
                <Search className="h-4 w-4" style={{ color: BRAND }} />
                Browse rooms first
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point.label}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium"
                  style={{ color: INK_SOFT }}
                >
                  <point.icon className="h-4 w-4" style={{ color: BRAND }} />
                  {point.label}
                </span>
              ))}
            </div>
          </div>

          <HeroShowcase />
        </div>
      </section>
      {/* ---------- Popular cities ---------- */}
      <section className="mt-8 flex flex-wrap items-center gap-2">
        <span
          className="mr-1 inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: INK_SOFT }}
        >
          <MapPin className="h-4 w-4" style={{ color: BRAND }} />
          Popular right now:
        </span>
        {CITIES.map((city) => (
          <Link
            key={city}
            href={`/flatmates/browse?city=${encodeURIComponent(city)}`}
            className="rounded-full border bg-white px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-[#EEF1FC]"
            style={{ borderColor: BORDER, color: INK }}
          >
            {city}
          </Link>
        ))}
      </section>
      {/* ---------- Intents ---------- */}
      <section className="mt-14">
        <Eyebrow />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: INK }}
            >
              What brings you here?
            </h2>
            <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
              Pick a path — this decides what we ask you next.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTENTS.map((intent) => (
            <Link
              key={intent.key}
              href={`/flatmates/onboarding?intent=${intent.key}`}
              className="group relative flex flex-col rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100/70"
              style={{ borderColor: BORDER }}
            >
              {intent.popular && (
                <span
                  className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: TINT_BG, color: BRAND }}
                >
                  Popular
                </span>
              )}
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                style={{ background: intent.accentBg, color: intent.accent }}
              >
                <intent.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <span
                className="mt-4 w-fit rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: intent.accentBg, color: intent.accent }}
              >
                {intent.tag}
              </span>
              <h3
                className="mt-2 text-[15px] font-semibold leading-snug"
                style={{ color: INK }}
              >
                {intent.title}
              </h3>
              <p
                className="mt-1.5 flex-1 text-[13px] leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                {intent.description}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all group-hover:gap-2.5"
                style={{ color: intent.accent }}
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}

          {/* 6th card — browse without a profile */}
          <Link
            href="/flatmates/browse"
            className="group flex flex-col items-start justify-center rounded-2xl border-2 border-dashed p-5 transition-colors hover:bg-[#FAFBFF]"
            style={{ borderColor: BORDER }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "#F8FAFC", color: INK_SOFT }}
            >
              <Search className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <h3
              className="mt-4 text-[15px] font-semibold"
              style={{ color: INK }}
            >
              Just looking around?
            </h3>
            <p
              className="mt-1.5 flex-1 text-[13px] leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              Browse rooms and flat-shares without creating a profile.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all group-hover:gap-2.5"
              style={{ color: INK }}
            >
              Open browse
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
      {/* ---------- Showcase banner ---------- */}
      <ShowcaseBanner />
      {/* ---------- How it works ---------- */}
      <section className="mt-14">
        <h2
          className="text-xl font-bold tracking-tight sm:text-2xl"
          style={{ color: INK }}
        >
          How it works
        </h2>
        <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
          Three steps between you and a flatmate who gets your routine.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: TINT_BG, color: BRAND }}
                >
                  <step.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <span
                  className="text-3xl font-bold opacity-15"
                  style={{ color: BRAND }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                className="mt-4 text-[15px] font-semibold"
                style={{ color: INK }}
              >
                {step.title}
              </h3>
              <p
                className="mt-1.5 text-[13px] leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* ---------- Quick links ---------- */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href="/flatmates/swap"
          className="group flex items-center gap-4 rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100/70"
          style={{ borderColor: BORDER }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "#F5F3FF", color: "#7C3AED" }}
          >
            <ArrowLeftRight className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold" style={{ color: INK }}>
              Swap matches
            </h3>
            <p className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
              Mutual fits where both sides&apos; locations work.
            </p>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            style={{ color: "#7C3AED" }}
          />
        </Link>

        <Link
          href="/flatmates/connections"
          className="group flex items-center gap-4 rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100/70"
          style={{ borderColor: BORDER }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: TINT_BG, color: BRAND }}
          >
            <MessagesSquare className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold" style={{ color: INK }}>
              My connection requests
            </h3>
            <p className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
              Track requests you&apos;ve sent and received.
            </p>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            style={{ color: BRAND }}
          />
        </Link>
      </section>
    </main>
  );
}
