"use client";
import React from "react";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Key,
  Home,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const agentBenefits = [
  { icon: TrendingUp, text: "Increase property visibility" },
  { icon: Users, text: "Attract qualified leads" },
  { icon: ShieldCheck, text: "Verified agent profile" },
  { icon: Key, text: "Full dashboard access" },
];

const landlordBenefits = [
  { icon: Home, text: "List your properties directly" },
  { icon: Users, text: "Connect with verified buyers" },
  { icon: ShieldCheck, text: "Owner-verified badge" },
  { icon: Key, text: "Dedicated owner dashboard" },
];

const stats = [
  { value: "12K+", label: "Active Listings" },
  { value: "4.8★", label: "Avg. Rating" },
  { value: "98%", label: "Response Rate" },
];

export default function AgentLandlordCTA() {
  return (
    <section className="w-full px-3 sm:px-4 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4161df]/10 border border-[#4161df]/20 px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#4161df] mb-5">
            <Sparkles size={12} />
            Grow with PropertyBulbul
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[Poppins] font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
            Are you an{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#4161df]">Agent</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-[#4161df]/12 rounded-sm -z-10" />
            </span>{" "}
            or{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-slate-900 dark:text-white">
                Landlord?
              </span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-slate-900/8 dark:bg-white/10 rounded-sm -z-10" />
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Join Tricity's most trusted platform and connect with thousands of
            buyers, tenants, and sellers every day.
          </p>

          {/* Stats strip */}
          {/* <div className="mt-8 inline-flex items-center gap-6 sm:gap-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 sm:px-8 py-3 shadow-sm">
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold font-[Poppins] text-slate-900 dark:text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 tracking-wide">
                    {s.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div> */}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {/* ─── Agent Card ─── */}
          <div className="group relative">
            {/* Glow ring */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-[#4161df] to-[#7b93f0] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

            <div className="relative h-full rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden flex flex-col shadow-md group-hover:shadow-xl transition-shadow duration-300">
              {/* Top color band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#4161df] via-[#6b87f5] to-[#4161df]" />

              {/* Decorative background blob */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#4161df]/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

              <div className="relative p-6 sm:p-8 flex flex-col flex-1">
                {/* Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#4161df]/10 ring-1 ring-[#4161df]/20">
                    <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 text-[#4161df]" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#4161df] bg-[#4161df]/10 border border-[#4161df]/20 rounded-full px-3 py-1">
                    <BadgeCheck size={12} />
                    Most Popular
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-[Poppins] font-bold text-slate-900 dark:text-white mb-1.5">
                  Register as Agent
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  List client properties, manage enquiries, and close deals with
                  powerful dashboard tools built for real estate professionals.
                </p>

                {/* Benefits */}
                <ul className="space-y-3 mb-7 flex-1">
                  {agentBenefits.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#4161df]/10 ring-1 ring-[#4161df]/15 group-hover:bg-[#4161df]/15 transition-colors">
                        <Icon size={13} className="text-[#4161df]" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/agents/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4161df] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#3451c7] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 w-full"
                >
                  Get Started as Agent
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* ─── Landlord Card ─── */}
          <div className="group relative">
            {/* Glow ring */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-300" />

            <div className="relative h-full rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden flex flex-col shadow-md group-hover:shadow-xl transition-shadow duration-300">
              {/* Top color band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />

              {/* Decorative background blob */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-slate-900/4 dark:bg-white/3 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

              <div className="relative p-6 sm:p-8 flex flex-col flex-1">
                {/* Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900/8 dark:bg-white/8 ring-1 ring-slate-900/10 dark:ring-white/10">
                    <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-slate-800 dark:text-slate-200" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1">
                    <Home size={11} />
                    For Owners
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-[Poppins] font-bold text-slate-900 dark:text-white mb-1.5">
                  Register as Landlord
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  List your own properties, connect directly with verified
                  buyers and tenants, and manage everything from a single
                  dashboard.
                </p>

                {/* Benefits */}
                <ul className="space-y-3 mb-7 flex-1">
                  {landlordBenefits.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900/8 dark:bg-white/8 ring-1 ring-slate-900/10 dark:ring-white/10 group-hover:bg-slate-900/12 transition-colors">
                        <Icon
                          size={13}
                          className="text-slate-800 dark:text-slate-300"
                        />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/landlords/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 shadow-md hover:bg-slate-800 dark:hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 w-full"
                >
                  Get Started as Landlord
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer trust note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-7 flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-green-500" />
          Free to register · No credit card required · Verified profiles only
        </p>
      </div>
    </section>
  );
}
