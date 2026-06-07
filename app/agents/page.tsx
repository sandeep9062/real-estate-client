"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Award,
  BadgeCheck,
  SlidersHorizontal,
  X,
  Calendar,
  Clock,
  ChevronDown,
  Home,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import AgentCard, { Avatar, type Agent } from "@/components/AgentCard";

/* ══════════════════════════════════════
   MOCK DATA  (replace with API)
══════════════════════════════════════ */
const AGENTS: Agent[] = [
  {
    id: 1,
    slug: "priyanka-sharma",
    name: "Priyanka Sharma",
    title: "Senior Property Advisor",
    avatar: "",
    initials: "PS",
    avatarColor: "#4161df",
    rating: 4.9,
    reviews: 128,
    experience: 12,
    deals: 340,
    locations: ["Chandigarh", "Mohali"],
    specialisations: ["Luxury Villas", "Residential"],
    languages: ["Hindi", "English", "Punjabi"],
    responseTime: "< 1 hr",
    verified: true,
    topAgent: true,
    bio: "Chandigarh's top-rated advisor with 12 years of market expertise. Specialises in premium residential properties and NRI investments.",
    phone: "+91 98765 00001",
    whatsapp: "919876500001",
  },
  {
    id: 2,
    slug: "neha-verma",
    name: "Neha Verma",
    title: "Luxury Property Specialist",
    avatar: "",
    initials: "NV",
    avatarColor: "#7c3aed",
    rating: 4.8,
    reviews: 97,
    experience: 8,
    deals: 215,
    locations: ["Mohali", "Panchkula"],
    specialisations: ["Luxury Apartments", "Commercial"],
    languages: ["Hindi", "English"],
    responseTime: "< 2 hrs",
    verified: true,
    topAgent: true,
    bio: "500+ families settled across Mohali and Panchkula. Expert in luxury high-rises and commercial investments.",
    phone: "+91 98765 00002",
    whatsapp: "919876500002",
  },
  {
    id: 3,
    slug: "amit-bhatia",
    name: "Amit Bhatia",
    title: "Commercial Real Estate Expert",
    avatar: "",
    initials: "AB",
    avatarColor: "#059669",
    rating: 4.7,
    reviews: 84,
    experience: 10,
    deals: 180,
    locations: ["Chandigarh", "Zirakpur"],
    specialisations: ["Commercial", "Office Spaces", "SCO Plots"],
    languages: ["Hindi", "English", "Punjabi"],
    responseTime: "< 3 hrs",
    verified: true,
    topAgent: false,
    bio: "Commercial property specialist with deep knowledge of IT park corridors, SCO plots, and industrial zones in Tricity.",
    phone: "+91 98765 00003",
    whatsapp: "919876500003",
  },
  {
    id: 4,
    slug: "sunita-kapoor",
    name: "Sunita Kapoor",
    title: "Affordable Housing Advisor",
    avatar: "",
    initials: "SK",
    avatarColor: "#dc2626",
    rating: 4.6,
    reviews: 61,
    experience: 6,
    deals: 142,
    locations: ["Kharar", "Mohali", "New Chandigarh"],
    specialisations: ["2-3 BHK Flats", "Affordable Housing", "Plots"],
    languages: ["Hindi", "Punjabi"],
    responseTime: "< 4 hrs",
    verified: true,
    topAgent: false,
    bio: "First-time home buyer specialist. Helped 140+ families secure government scheme homes and affordable flats in Mohali.",
    phone: "+91 98765 00004",
    whatsapp: "919876500004",
  },
  {
    id: 5,
    slug: "rajesh-malhotra",
    name: "Rajesh Malhotra",
    title: "NRI Investment Specialist",
    avatar: "",
    initials: "RM",
    avatarColor: "#d97706",
    rating: 4.8,
    reviews: 73,
    experience: 15,
    deals: 290,
    locations: ["Chandigarh", "Panchkula", "Mohali"],
    specialisations: ["NRI Investments", "Luxury", "Land"],
    languages: ["Hindi", "English", "Punjabi"],
    responseTime: "< 1 hr",
    verified: true,
    topAgent: true,
    bio: "15 years helping NRIs invest in Tricity real estate remotely. Full documentation, virtual tours, and registration handled end-to-end.",
    phone: "+91 98765 00005",
    whatsapp: "919876500005",
  },
  {
    id: 6,
    slug: "ritika-anand",
    name: "Ritika Anand",
    title: "New Launches Expert",
    avatar: "",
    initials: "RA",
    avatarColor: "#0891b2",
    rating: 4.5,
    reviews: 45,
    experience: 5,
    deals: 98,
    locations: ["Zirakpur", "Kharar", "New Chandigarh"],
    specialisations: ["New Projects", "Pre-launch", "Apartments"],
    languages: ["Hindi", "English"],
    responseTime: "< 2 hrs",
    verified: true,
    topAgent: false,
    bio: "Specialises in new launches and pre-launch bookings. Direct builder tie-ups with Sushma, Godrej, and Emaar.",
    phone: "+91 98765 00006",
    whatsapp: "919876500006",
  },
];

const ALL_LOCATIONS = [
  "All",
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Kharar",
  "Zirakpur",
  "New Chandigarh",
];
const ALL_SPECS = [
  "All",
  "Residential",
  "Luxury Villas",
  "Luxury Apartments",
  "Commercial",
  "Affordable Housing",
  "NRI Investments",
  "New Projects",
  "Plots",
];

/* ══════════════════════════════════════
   BOOKING MODAL
══════════════════════════════════════ */
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

function BookingModal({
  agent,
  onClose,
}: {
  agent: Agent;
  onClose: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phone) return;
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(10,18,50,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{ animation: "fadeSlideUp 0.3s ease-out" }}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar agent={agent} size="sm" />
            <div>
              <p className="font-black text-gray-900 text-sm leading-tight">
                {agent.name}
              </p>
              <p className="text-xs text-gray-400">{agent.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Book a Free Consultation
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                No commitment · 100% free · Expert advice
              </p>
            </div>

            {/* Date picker */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#4161df]" /> Choose a Date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {dates.map((d) => (
                  <button
                    type="button"
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-2xl border-2 text-xs font-bold transition-all duration-150 ${
                      selectedDate === d.iso
                        ? "border-[#4161df] bg-[#4161df] text-white shadow-md"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#4161df]/40"
                    }`}
                  >
                    <span className="text-[10px] font-semibold opacity-70">
                      {d.label.split(" ")[0]}
                    </span>
                    <span className="text-base font-black leading-none">
                      {d.label.split(" ")[1]}
                    </span>
                    <span className="text-[10px]">{d.label.split(" ")[2]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#4161df]" /> Pick a Time
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-150 ${
                        selectedTime === t
                          ? "border-[#4161df] bg-[#eef1fd] text-[#4161df]"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#4161df]/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-700">
                Your Contact Details
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className={inputCls}
              />
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                required
                placeholder="10-digit mobile number"
                inputMode="numeric"
                className={inputCls}
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="What are you looking for? (optional)"
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !name || !phone}
              className="w-full py-4 rounded-2xl bg-[#4161df] text-white font-black text-sm shadow-lg shadow-[#4161df]/30 hover:bg-[#3456df] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              Confirm Consultation →
            </button>

            <p className="text-center text-xs text-gray-400">
              🔒 Your details are private. No spam calls.
            </p>
          </form>
        ) : (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              You're Booked!
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              <strong className="text-gray-800">{agent.name}</strong> will call
              you on{" "}
              <strong className="text-[#4161df]">
                {new Date(selectedDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>{" "}
              at <strong className="text-[#4161df]">{selectedTime}</strong>.
            </p>
            <div className="flex flex-col gap-2 w-full mb-6">
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition"
              >
                <MessageCircle size={16} /> Message on WhatsApp
              </a>
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
              >
                <Phone size={16} /> Call {agent.phone}
              </a>
            </div>
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SHARED INPUT CLASS
══════════════════════════════════════ */
const inputCls =
  "w-full px-4 py-3 text-sm bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#4161df] focus:bg-white transition placeholder-gray-400";

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [spec, setSpec] = useState("All");
  const [topOnly, setTopOnly] = useState(false);
  const [booking, setBooking] = useState<Agent | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return AGENTS.filter((a) => {
      if (topOnly && !a.topAgent) return false;
      if (location !== "All" && !a.locations.includes(location)) return false;
      if (
        spec !== "All" &&
        !a.specialisations.some((s) =>
          s.toLowerCase().includes(spec.toLowerCase()),
        )
      )
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.specialisations.some((s) => s.toLowerCase().includes(q)) ||
          a.locations.some((l) => l.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, location, spec, topOnly]);

  return (
    <div
      className="min-h-screen bg-[#f9fafb]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #4161df 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Decorative circles */}
        {[
          { size: 300, top: -100, left: -80, op: 0.06 },
          { size: 200, top: 20, right: -60, op: 0.08 },
          { size: 150, bottom: -60, left: "40%", op: 0.05 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              background: "white",
              opacity: c.op,
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
            }}
          />
        ))}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {/* Eyebrow */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.1em",
              }}
            >
              <Shield size={12} style={{ color: "rgba(255,255,255,0.8)" }} />{" "}
              Verified by PropertyBulbul
            </span>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4">
            Meet Tricity's{" "}
            <span className="relative">
              <span style={{ color: "#93a8f8" }}>Top Agents</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 10"
                fill="none"
                style={{ height: "8px" }}
              >
                <path
                  d="M2 6 Q75 2 150 6 Q225 9 298 4"
                  stroke="#4161df"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h1>

          <p
            className="text-center text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Every agent is background-checked, RERA-compliant, and rated by real
            buyers. Book a free consultation in seconds.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: <Users size={18} />, val: "50+", lab: "Verified Agents" },
              { icon: <Star size={18} />, val: "4.8★", lab: "Avg. Rating" },
              {
                icon: <BadgeCheck size={18} />,
                val: "100%",
                lab: "RERA Compliant",
              },
              { icon: <Zap size={18} />, val: "< 2hr", lab: "Avg. Response" },
            ].map((s) => (
              <div key={s.lab} className="flex items-center gap-2.5">
                <span style={{ color: "rgba(255,255,255,0.8)" }}>{s.icon}</span>
                <div>
                  <p className="text-white font-black text-lg leading-none">
                    {s.val}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.lab}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location or specialisation…"
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white text-sm text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#4161df]/40 placeholder-gray-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="w-full h-8 fill-[#f9fafb]"
          >
            <path d="M0,24 C480,40 960,8 1440,24 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Top agents toggle */}
          <button
            onClick={() => setTopOnly(!topOnly)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-150 ${
              topOnly
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-amber-300"
            }`}
          >
            <Sparkles size={13} /> Top Agents Only
          </button>

          {/* Location filter */}
          <div className="relative">
            <MapPin
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[#4161df] appearance-none cursor-pointer"
            >
              {ALL_LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Specialisation filter */}
          <div className="relative">
            <Home
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[#4161df] appearance-none cursor-pointer"
            >
              {ALL_SPECS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Results count */}
          <span className="ml-auto text-sm text-gray-400 font-semibold">
            {filtered.length} agent{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* ── AGENT GRID ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                idx={i}
                onBook={setBooking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              No agents match your filters
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Try broadening your location or specialisation filter
            </p>
            <button
              onClick={() => {
                setSearch("");
                setLocation("All");
                setSpec("All");
                setTopOnly(false);
              }}
              className="px-6 py-3 rounded-2xl bg-[#4161df] text-white font-bold text-sm hover:bg-[#3456df] transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── JOIN CTA BANNER ── */}
      <div
        className="py-14 px-4"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #4161df 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Are you a property agent in Tricity?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Join 50+ verified agents on PropertyBulbul. Get a public profile,
            direct buyer leads, and grow your business — free to join.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#4161df] font-black text-sm px-8 py-4 rounded-2xl shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            >
              Apply as an Agent <ArrowRight size={16} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border-2 border-white/30 text-white font-bold text-sm px-8 py-4 rounded-2xl hover:bg-white/25 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* ── BOOKING MODAL ── */}
      {booking && (
        <BookingModal agent={booking} onClose={() => setBooking(null)} />
      )}
    </div>
  );
}
