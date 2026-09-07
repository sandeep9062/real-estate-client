"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Home,
  Building2,
  Warehouse,
  BedDouble,
  MapPin,
  Handshake,
  FileText,
  Sparkles,
  Megaphone,
  TrendingUp,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────
// Tokens — matches AboutHero / AboutPropertyBulbulToday / GetStarted
// ─────────────────────────────────────────────
const BRAND = "#4161df";
const BRAND_DARK = "#2b3f9e";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const CITIES = [
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Zirakpur",
  "Kharar",
  "New Chandigarh",
];

// ─────────────────────────────────────────────
// Shared bits (same pattern as AboutHero)
// ─────────────────────────────────────────────
function Eyebrow({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700 ${className}`}
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
      {label}
    </span>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        className="w-8 h-[3px] rounded-full"
        style={{ background: BRAND }}
      />
      <span className="text-sm font-medium" style={{ color: BRAND }}>
        {label}
      </span>
    </div>
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4161df]";

function PrimaryLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] ${focusRing}`}
      style={{ background: BRAND }}
    >
      {icon}
      {children}
    </Link>
  );
}

function SecondaryLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-[#4161df]/40 hover:bg-blue-50/50 hover:-translate-y-0.5 active:scale-[0.98] ${focusRing}`}
    >
      {children}
      {icon}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
interface Service {
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
}

const liveServices: Service[] = [
  {
    icon: <Building2 className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Rent a home",
    desc: "Verified flats and builder floors, zero brokerage for Pro Seeker members.",
  },
  {
    icon: <Sparkles className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "AI property search",
    desc: "Describe what you want in plain English and get matched instantly.",
  },
  {
    icon: <Home className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Buy a property",
    desc: "Verified resale and new listings with the agent's contact on the page.",
  },
  {
    icon: <Megaphone className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Sell a property",
    desc: "List for free, get a shareable page and PDF brochure, take leads on WhatsApp.",
  },
  {
    icon: <MapPin className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Plots & land",
    desc: "Residential plots in Kharar, New Chandigarh and Mullanpur.",
  },
  {
    icon: <BedDouble className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "PG & co-living",
    desc: "Verified rooms near Chandigarh University, PU, PGIMER and Mohali IT Park.",
  },
  {
    icon: <Warehouse className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Commercial spaces",
    desc: "Shops, offices and showrooms with transparent pricing.",
  },
  {
    icon: <FileText className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Instant brochures",
    desc: "One-click branded PDF brochures, auto-filled from any listing.",
  },
  {
    icon: <Handshake className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Live",
    title: "Agent partnership",
    desc: "A verified profile, lead analytics and featured placement. Free to start.",
  },
];

const buildingServices: Service[] = [
  {
    icon: <MessageCircle className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Soon",
    title: "Social auto-posting",
    desc: "Send a listing to Facebook, Instagram and WhatsApp Status in one click.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Soon",
    title: "Investment insights",
    desc: "Local appreciation trends and rental yields by sector.",
  },
  {
    icon: <FileText className="w-5 h-5" strokeWidth={1.8} />,
    tag: "Soon",
    title: "Rent agreement builder",
    desc: "Fill in details, generate a valid agreement, send it to registration.",
  },
];

const differentiators = [
  {
    icon: ShieldCheck,
    tag: "Verified",
    title: "Every listing",
    desc: "Re-checked as active before it's shown — nothing stale.",
  },
  {
    icon: Sparkles,
    tag: "AI-powered",
    title: "Natural search",
    desc: "Say what you want in plain English, no filter-guessing.",
  },
  {
    icon: MessageCircle,
    tag: "Zero spam",
    title: "You go first",
    desc: "Agents don't call you — you message them, when ready.",
  },
  {
    icon: Users,
    tag: "Local",
    title: "Built here",
    desc: "By a Panchkula engineer who lives in the sectors he lists.",
  },
];

const faqs = [
  {
    q: "Is PropertyBulbul free to use?",
    a: "Searching and messaging agents costs nothing, always. Agents can list up to 5 properties free. Pro plans start at ₹499/month for agents and ₹299/month for seekers wanting direct, brokerage-free landlord access.",
  },
  {
    q: "What kinds of properties are listed?",
    a: "Rentals, resale and new-build homes, plots and land, PG and co-living, and commercial space — all inside Chandigarh, Mohali, Panchkula, Zirakpur, Kharar and New Chandigarh.",
  },
  {
    q: "How do you verify listings?",
    a: "Every listing is confirmed available and re-checked periodically. If a property's been let or sold, it comes down.",
  },
  {
    q: "How is this different from a national portal?",
    a: "Every listing is one you could actually visit today. That focus is what makes the AI search and brochure tools useful — built for six cities, not fifty.",
  },
  {
    q: "I'm an agent — how do I start listing?",
    a: "Click 'Add Property' in the navbar. The free plan covers 5 listings with brochure generation and WhatsApp leads; Pro Agent removes the cap and adds featured placement and lead analytics.",
  },
];

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Eyebrow
              label="Tricity's property intelligence platform"
              className="justify-center"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-4 font-bold leading-[1.1] tracking-tight text-slate-900 text-3xl sm:text-4xl md:text-5xl"
          >
            Every property service Tricity needs,
            <br />
            <span className="relative inline-block" style={{ color: BRAND }}>
              in one place
              <svg
                viewBox="0 0 220 12"
                className="absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8.5C40 3 100 2 218 7.5"
                  stroke={BRAND}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.35"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base"
          >
            Buy, rent, sell or invest — no hidden fees, no spam calls, no fake
            listings. Built with verified data and smart search for buyers,
            sellers, investors and NRIs.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-4 text-sm text-slate-500"
          >
            <span className="font-semibold text-slate-700">Now live in </span>
            {CITIES.slice(0, -1).join(", ")} and {CITIES[CITIES.length - 1]}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <PrimaryLink
              href="/properties"
              icon={<Search className="h-4 w-4" />}
            >
              Explore properties
            </PrimaryLink>
            <SecondaryLink
              href="/contact"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Talk to our team
            </SecondaryLink>
          </motion.div>
        </div>
      </section>

      {/* SERVICES — fact-card grid, same technique as AboutPropertyBulbulToday */}
      <section
        className="px-4 py-16 sm:py-20 md:py-24"
        style={{ background: "#f8f9ff" }}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionTag label="What we offer" />
            <h2
              className="mb-4 text-2xl font-bold leading-[1.15] sm:text-3xl md:text-[38px]"
              style={{ color: INK }}
            >
              Complete real estate solutions
            </h2>
            <p
              className="mb-10 max-w-[52ch] text-[15px] leading-relaxed sm:text-base"
              style={{ color: INK_SOFT }}
            >
              Everything organized the way a growing intelligence layer should
              be — verified, current, and easy to act on.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: "#E5E7F2" }}
          >
            {[...liveServices, ...buildingServices].map((s) => (
              <ServiceCell key={s.title} service={s} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* DIFFERENTIATORS — same split layout as AboutPropertyBulbulToday */}
      <section className="px-4 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionTag label="Why PropertyBulbul" />
              <h2
                className="mb-6 text-2xl font-bold leading-[1.15] sm:text-3xl md:text-[38px]"
                style={{ color: INK }}
              >
                Not a 50-city portal guessing at Tricity
              </h2>
              <div
                className="max-w-[52ch] space-y-4 text-[15px] leading-relaxed sm:text-base"
                style={{ color: INK_SOFT }}
              >
                <p>
                  National platforms spread the same listing engine across fifty
                  cities. We built one thing for six — Chandigarh, Mohali,
                  Panchkula, Zirakpur, Kharar and New Chandigarh — and it shows
                  in the search results and the pricing.
                </p>
                <p>
                  Every listing is checked before it goes live, every search
                  understands plain English, and every conversation starts on
                  your terms, on WhatsApp.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2"
              style={{ background: "#E5E7F2" }}
            >
              {differentiators.map((item) => (
                <div key={item.title} className="bg-white p-6 sm:p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
                    >
                      <item.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ background: TINT_BG, color: BRAND }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <h3
                    className="mb-1.5 text-base font-semibold sm:text-lg"
                    style={{ color: INK }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed sm:text-sm"
                    style={{ color: INK_SOFT }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="px-4 py-16 sm:py-20 md:py-24"
        style={{ background: "#f8f9ff" }}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-xl"
          >
            <SectionTag label="Our process" />
            <h2
              className="text-2xl font-bold leading-[1.15] sm:text-3xl md:text-[38px]"
              style={{ color: INK }}
            >
              Three steps, start to WhatsApp
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Search in plain English",
                desc: "Say what you want. The AI does the filtering.",
              },
              {
                icon: ShieldCheck,
                title: "Browse what's verified",
                desc: "Real photos, honest pricing, downloadable brochures.",
              },
              {
                icon: MessageCircle,
                title: "Message the agent",
                desc: "One tap into WhatsApp. No form, no callback queue.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
                >
                  <step.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3
                  className="text-base font-semibold sm:text-lg"
                  style={{ color: INK }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed sm:text-sm"
                  style={{ color: INK_SOFT }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <SectionTag label="FAQ" />
            <h2
              className="text-2xl font-bold leading-[1.15] sm:text-3xl md:text-[38px]"
              style={{ color: INK }}
            >
              Common questions
            </h2>
          </motion.div>
          <FAQList />
        </div>
      </section>

      {/* CTA — same gradient panel + dot pattern as GetStarted */}
      <div className="px-4 pb-16 sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-10 shadow-xl sm:px-10 md:px-14 md:py-14"
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative flex flex-col items-center gap-5 text-center sm:gap-6">
              <h2 className="max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Ready to find your perfect property?
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Verified listings, AI search that understands what you need,
                zero brokerage for Pro Seeker members.
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-3">
                <Link
                  href="/properties?deal=Rent"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold shadow-lg transition-transform duration-200 hover:scale-[1.03] sm:px-7"
                  style={{ color: INK }}
                >
                  Browse rentals
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:px-7"
                >
                  See pricing plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ServiceCell
// ─────────────────────────────────────────────
function ServiceCell({ service }: { service: Service }) {
  const isLive = service.tag === "Live";
  return (
    <div className="bg-white p-6 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            border: `1.5px solid ${isLive ? BRAND : "#C7CAD9"}`,
            color: isLive ? BRAND : "#9096AC",
          }}
        >
          {service.icon}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            background: isLive ? TINT_BG : "#F1F2F6",
            color: isLive ? BRAND : "#8A8FA3",
          }}
        >
          {service.tag}
        </span>
      </div>
      <h3
        className="mb-1.5 text-base font-semibold sm:text-lg"
        style={{ color: INK }}
      >
        {service.title}
      </h3>
      <p
        className="text-[13px] leading-relaxed sm:text-sm"
        style={{ color: INK_SOFT }}
      >
        {service.desc}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
function FAQList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div
      className="divide-y overflow-hidden rounded-2xl border"
      style={{ borderColor: "#E5E7F2" }}
    >
      {faqs.map((item, i) => (
        <div key={item.q} style={{ borderColor: "#E5E7F2" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <span
              className="text-sm font-semibold sm:text-base"
              style={{ color: INK }}
            >
              {item.q}
            </span>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm transition-transform duration-300"
              style={{
                background: TINT_BG,
                color: BRAND,
                transform: open === i ? "rotate(45deg)" : "none",
              }}
            >
              +
            </span>
          </button>
          <motion.div
            initial={false}
            animate={{
              height: open === i ? "auto" : 0,
              opacity: open === i ? 1 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p
              className="px-5 pb-4 text-[13px] leading-relaxed sm:px-6 sm:text-sm"
              style={{ color: INK_SOFT }}
            >
              {item.a}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
