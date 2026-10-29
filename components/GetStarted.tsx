"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { ArrowRight, BellRing, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import page from "@/app/student/[city]/[locality]/page";

const BRAND = "#4161df";
const BRAND_DARK = "#2b3f9e";

const GetStarted = () => {
  const router = useRouter();
  const [sector, setSector] = useState("");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // Defer the auth-based redirect until hydration is complete so a signed-in
  // user isn't briefly bounced to /login on the very first render.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({ intent: "sector-alert" });
    if (sector.trim()) params.set("sector", sector.trim());

    // Wait for auth state to hydrate before deciding where to send the user.
    if (!mounted) return;

    if (!isAuthenticated) {
      // Not logged in — send to login, preserving the sector-alert intent so
      // the user is returned to the sector-alert flow after signing in.
      router.push(`/login?${params.toString()}`);
      return;
    }

    // Logged in — go straight to the saved-searches (alerts) hub with the
    // sector pre-filled.
    router.push(`/saved-searches?${params.toString()}`);
  };

  return (
    <div id="get-started" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
          }}
        >
          {/* Decorative accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/10"
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

          <div className="relative flex flex-col items-center text-center gap-5 sm:gap-6">
            <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl leading-tight max-w-xl">
              Never miss the right property
            </h2>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md">
              Tell us your preferred sector and we'll alert you the moment new,
              verified listings go live there — before they're gone.
            </p>

            {/* Inline sector-alert form — makes the promise above something you can actually act on right here */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2 mt-1"
            >
              <label htmlFor="sector-alert-input" className="sr-only">
                Preferred sector or locality
              </label>
              <input
                id="sector-alert-input"
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. Sector 22, Mohali"
                className="flex-1 min-w-0 rounded-xl px-4 py-3 text-sm sm:text-base text-[#161A2E] placeholder:text-slate-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/70"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-[#161A2E] text-white font-semibold px-5 sm:px-6 py-3 rounded-xl shadow-lg transition-transform duration-200 hover:scale-[1.03] text-sm sm:text-base whitespace-nowrap"
              >
                Notify me
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </form>

            <a
              href="/properties"
              className="text-white/80 text-xs sm:text-sm font-medium underline underline-offset-4 hover:text-white transition-colors"
            >
              Or just browse all listings
            </a>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-white/75 text-xs sm:text-[13px]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified listings only
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />
                Alerts you can turn off anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
