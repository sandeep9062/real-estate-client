"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  BadgeCheck,
  Calendar,
  Clock,
  Shield,
  Award,
  Home,
  ChevronRight,
  Quote,
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  Share2,
  Heart,
  Languages,
  ThumbsUp,
} from "lucide-react";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface Review {
  id: number;
  name: string;
  initials: string;
  color: string;
  rating: number;
  date: string;
  text: string;
  propertyType: string;
  verified: boolean;
  helpful: number;
}

interface Listing {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  tag: string;
  tagColor: string;
  image: string;
}

interface AgentData {
  id: number;
  slug: string;
  name: string;
  title: string;
  avatar: string; // Profile image URL
  initials: string;
  avatarColor: string;
  coverColor: string;
  rating: number;
  reviews: number;
  experience: number;
  deals: number;
  responseTime: string;
  responseRate: string;
  verified: boolean;
  topAgent: boolean;
  rera: string;
  locations: string[];
  specialisations: string[];
  languages: string[];
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  longBio: string;
  achievements: string[];
  stats: { label: string; value: string; icon: string }[];
  listings: Listing[];
  reviews_data: Review[];
}

/* ══════════════════════════════════════════════
   MOCK — replace with `fetch(`/api/agents/${slug}`)`
══════════════════════════════════════════════ */
const MOCK_AGENT: AgentData = {
  id: 1,
  slug: "priyanka-sharma",
  name: "Priyanka Sharma",
  title: "Senior Property Advisor",
  avatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  initials: "PS",
  avatarColor: "#4161df",
  coverColor: "#0d1640",
  rating: 4.9,
  reviews: 128,
  experience: 12,
  deals: 340,
  responseTime: "< 1 hr",
  responseRate: "98%",
  verified: true,
  topAgent: true,
  rera: "PBRERA-SAS79-AA0123",
  locations: ["Chandigarh", "Mohali", "Panchkula"],
  specialisations: [
    "Luxury Villas",
    "Residential",
    "NRI Investments",
    "New Projects",
  ],
  languages: ["Hindi", "English", "Punjabi"],
  phone: "+91 98765 00001",
  whatsapp: "919876500001",
  email: "priyanka@propertybulbul.com",
  bio: "Chandigarh's top-rated advisor with 12 years of market expertise.",
  longBio: `I've spent 12 years in Tricity's real estate market and there's nothing I love more than matching the right family to the right home. What started as a passion for architecture turned into a full-time mission to make property buying honest and stress-free.\n\nI specialise in premium residential properties, NRI investments, and new launches by builders like Sushma, Godrej, and BPTP. Every client gets my personal attention — from the first site visit to the day you get your keys.\n\nMy promise: zero hidden charges, full legal verification, and a team you can actually trust.`,
  achievements: [
    "Top Agent — PropertyBulbul 2023 & 2024",
    "500+ families settled across Tricity",
    "NRI Investment Specialist",
    "RERA Certified Advisor",
    "4.9★ rating across 128 verified reviews",
  ],
  stats: [
    { label: "Deals Closed", value: "340+", icon: "🤝" },
    { label: "Happy Clients", value: "500+", icon: "😊" },
    { label: "Years Active", value: "12", icon: "📅" },
    { label: "Response Rate", value: "98%", icon: "⚡" },
    { label: "Cities Covered", value: "3", icon: "🏙️" },
    { label: "Avg. Deal Size", value: "₹1.8Cr", icon: "💰" },
  ],
  listings: [
    {
      id: 1,
      title: "3 BHK Premium Apartment",
      location: "Sector 67, Mohali",
      price: "₹85 Lakh",
      beds: 3,
      baths: 2,
      area: "1,450 sq.ft",
      tag: "RERA Verified",
      tagColor: "#4161df",
      image: "",
    },
    {
      id: 2,
      title: "4 BHK Luxury Villa",
      location: "Sector 10, Panchkula",
      price: "₹2.2 Crore",
      beds: 4,
      baths: 4,
      area: "3,200 sq.ft",
      tag: "Exclusive",
      tagColor: "#7c3aed",
      image: "",
    },
    {
      id: 3,
      title: "2 BHK Ready to Move",
      location: "Zirakpur, Punjab",
      price: "₹52 Lakh",
      beds: 2,
      baths: 2,
      area: "1,050 sq.ft",
      tag: "Ready to Move",
      tagColor: "#059669",
      image: "",
    },
  ],
  reviews_data: [
    {
      id: 1,
      name: "Rohit Khanna",
      initials: "RK",
      color: "#7c3aed",
      rating: 5,
      date: "March 2024",
      text: "Priyanka helped us find our dream 3BHK in Sector 67 Mohali within 2 weeks. Her market knowledge is unmatched — she knew about listings before they even went public. Completely transparent, zero surprises at registration.",
      propertyType: "3 BHK Apartment",
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      name: "Simran Kaur",
      initials: "SK",
      color: "#059669",
      rating: 5,
      date: "January 2024",
      text: "As an NRI based in Canada, I was nervous about investing remotely. Priyanka arranged virtual tours, handled all paperwork, and gave me honest advice even when it meant steering me away from a bad deal. Exceptional.",
      propertyType: "Villa Investment",
      verified: true,
      helpful: 19,
    },
    {
      id: 3,
      name: "Mandeep Singh",
      initials: "MS",
      color: "#dc2626",
      rating: 5,
      date: "November 2023",
      text: "She sold our old flat in Chandigarh within 3 weeks at a price above market value. Her negotiation skills are exceptional. Already referred her to 3 friends.",
      propertyType: "2 BHK (Sale)",
      verified: true,
      helpful: 15,
    },
    {
      id: 4,
      name: "Anita Sharma",
      initials: "AS",
      color: "#d97706",
      rating: 4,
      date: "October 2023",
      text: "Very professional and knowledgeable. Helped us compare 8 properties before making our decision. Would have been 5 stars but took slightly longer than expected for documentation.",
      propertyType: "Independent House",
      verified: true,
      helpful: 8,
    },
  ],
};

/* ══════════════════════════════════════════════
   SHARED STYLE TOKENS
══════════════════════════════════════════════ */
const cardStyle = {
  background: "#fff",
  border: "1px solid #e8eaf0",
  boxShadow: "0 2px 12px rgba(15,23,42,.05)",
};
const serif = { fontFamily: "'Instrument Serif', serif" };
const inputCls =
  "w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4161df] focus:bg-white transition placeholder-slate-400";

/* ══════════════════════════════════════════════
   BOOKING MODAL
══════════════════════════════════════════════ */
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
  agent: AgentData;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name || !phone) return;
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(10px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-[17px] text-slate-900" style={serif}>
              Book Free Consultation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">with {agent.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {!done ? (
            <form onSubmit={submit} className="p-6 flex flex-col gap-5">
              <div>
                <p className="text-[13px] font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: "#4161df" }} /> Select
                  date
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d.iso}
                      onClick={() => setDate(d.iso)}
                      className="snap-start flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-xl border transition-all duration-150"
                      style={
                        date === d.iso
                          ? {
                              borderColor: "#4161df",
                              background: "#4161df",
                              color: "#fff",
                            }
                          : {
                              borderColor: "#e2e8f0",
                              background: "#f8fafc",
                              color: "#475569",
                            }
                      }
                    >
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: date === d.iso ? "#c7d4f9" : "#94a3b8",
                        }}
                      >
                        {d.day}
                      </span>
                      <span className="text-xl font-bold leading-tight">
                        {d.date}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: date === d.iso ? "#c7d4f9" : "#94a3b8",
                        }}
                      >
                        {d.month}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {date && (
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                    <Clock size={14} style={{ color: "#4161df" }} /> Select time
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTime(t)}
                        className="py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150"
                        style={
                          time === t
                            ? {
                                borderColor: "#4161df",
                                background: "rgba(65,97,223,.08)",
                                color: "#4161df",
                              }
                            : {
                                borderColor: "#e2e8f0",
                                background: "#f8fafc",
                                color: "#64748b",
                              }
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold text-slate-800">
                  Your details
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full name"
                  className={inputCls}
                />
                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  required
                  placeholder="Mobile number"
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
                disabled={!date || !time || !name || !phone}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{ background: "#0f172a" }}
              >
                Confirm booking <ChevronRight size={14} className="inline" />
              </button>
              <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Shield size={11} /> 100% free · No spam · Your details stay
                private
              </p>
            </form>
          ) : (
            <div className="p-10 flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(22,163,74,.10)" }}
              >
                <CheckCircle2 size={28} style={{ color: "#16a34a" }} />
              </div>
              <h3 className="text-[22px] text-slate-900 mb-2" style={serif}>
                Booked!
              </h3>
              <p className="text-slate-500 text-sm mb-1">
                {agent.name} will call you on
              </p>
              <p
                className="font-semibold text-[15px] mb-6"
                style={{ color: "#4161df" }}
              >
                {new Date(date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                at {time}
              </p>
              <div className="flex flex-col gap-2.5 w-full">
                <a
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle size={16} /> Message on WhatsApp now
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
                >
                  <Phone size={16} /> Call {agent.phone}
                </a>
              </div>
              <button
                onClick={onClose}
                className="mt-6 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STAR RATING
══════════════════════════════════════════════ */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════
   HELPER: transform mock listing → PropertyCard card prop
══════════════════════════════════════════════ */
const parsePrice = (s: string): number => {
  const num = parseFloat(s.replace(/[₹,LakhsCrore]/g, "").trim());
  if (s.includes("Crore")) return num * 1e7;
  if (s.includes("Lakh")) return num * 1e5;
  return num;
};

function toPropertyCard(listing: Listing) {
  return {
    _id: String(listing.id),
    slug: `property-${listing.id}`,
    title: listing.title,
    price: parsePrice(listing.price),
    image: listing.image ? [listing.image] : [],
    deal: "Sale" as const,
    type: listing.tag,
    facilities: {
      bedrooms: listing.beds,
      bathrooms: listing.baths,
    },
    location: {
      address: listing.location,
      city: listing.location.split(",")[0] || listing.location,
      state: "",
    },
    area: {
      value: listing.area,
      unit: "sqft",
    },
    listingAvailability: "Available" as const,
    isFeatured: false,
    postedBy: "Agent" as const,
  };
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
interface PageProps {
  params: { slug: string };
}

export default function AgentProfilePage({ params }: PageProps) {
  const agent = MOCK_AGENT;
  const [booking, setBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "listings" | "reviews">(
    "about",
  );
  const [liked, setLiked] = useState(false);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyCtaVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: agent.reviews_data.filter((r) => r.rating === s).length,
    pct: Math.round(
      (agent.reviews_data.filter((r) => r.rating === s).length /
        agent.reviews_data.length) *
        100,
    ),
  }));

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      <div className="min-h-screen mt-20" style={{ background: "#f7f5f0" }}>
        {/* ── STICKY TOP CTA ── */}
        {stickyCtaVisible && (
          <div
            className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,.96)",
              borderColor: "#e8eaf0",
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Sticky avatar */}
                {agent.avatar ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      fill
                      sizes="36px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg,${agent.avatarColor},${agent.avatarColor}90)`,
                    }}
                  >
                    {agent.initials}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="font-semibold text-slate-900 text-sm leading-none">
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Stars rating={agent.rating} size={11} />
                    <span className="text-xs text-slate-400">
                      {agent.rating} ({agent.reviews})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-white text-xs font-semibold transition"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <button
                  onClick={() => setBooking(true)}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-white text-xs font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
                  style={{ background: "#0f172a" }}
                >
                  <Calendar size={13} /> Book Free Consultation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BACK LINK ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-4">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-[#4161df]"
          >
            <ArrowLeft size={13} /> All agents
          </Link>
        </div>

        {/* ══════════ HERO PROFILE CARD ══════════ */}
        <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            <div
              className="relative h-28 sm:h-36 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${agent.coverColor} 0%, #1e3080 60%, ${agent.avatarColor} 100%)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all border"
                  style={
                    liked
                      ? {
                          background: "rgba(254,242,242,.95)",
                          borderColor: "rgba(254,202,202,.6)",
                        }
                      : {
                          background: "rgba(255,255,255,.18)",
                          borderColor: "rgba(255,255,255,.2)",
                        }
                  }
                >
                  <Heart
                    size={15}
                    className={
                      liked ? "text-red-500 fill-red-500" : "text-white"
                    }
                  />
                </button>
                <button
                  className="w-9 h-9 rounded-xl backdrop-blur-sm border flex items-center justify-center transition"
                  style={{
                    background: "rgba(255,255,255,.18)",
                    borderColor: "rgba(255,255,255,.2)",
                  }}
                >
                  <Share2 size={15} className="text-white" />
                </button>
              </div>
            </div>

            <div className="px-5 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-24 mb-5">
                {/* Avatar - image or initials */}
                <div className="relative flex-shrink-0">
                  {agent.avatar ? (
                    <>
                      <div
                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-[4px] border-white shadow-lg relative"
                        style={{ borderRadius: "1.25rem" }}
                      >
                        <Image
                          src={agent.avatar}
                          alt={agent.name}
                          fill
                          sizes="192px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      {agent.verified && (
                        <span
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
                          style={{ boxShadow: "0 0 0 2px #e2e8f0" }}
                        >
                          <BadgeCheck
                            size={20}
                            style={{ color: "#4161df" }}
                            fill="#eef1fd"
                          />
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl flex items-center justify-center font-bold text-white text-4xl sm:text-5xl border-[4px] border-white shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${agent.avatarColor}, ${agent.avatarColor}90)`,
                        }}
                      >
                        {agent.initials}
                      </div>
                      {agent.verified && (
                        <span
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
                          style={{ boxShadow: "0 0 0 2px #e2e8f0" }}
                        >
                          <BadgeCheck
                            size={20}
                            style={{ color: "#4161df" }}
                            fill="#eef1fd"
                          />
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1
                      className="text-[28px] sm:text-[34px] text-slate-900 leading-tight"
                      style={serif}
                    >
                      {agent.name}
                    </h1>
                    {agent.topAgent && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(251,191,36,.12)",
                          border: "1px solid rgba(251,191,36,.35)",
                          color: "#b45309",
                        }}
                      >
                        <Sparkles size={9} /> Top Agent
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{agent.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Stars rating={agent.rating} size={14} />
                      <span className="font-semibold text-slate-800 text-sm">
                        {agent.rating}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({agent.reviews} reviews)
                      </span>
                    </div>
                    <span className="text-slate-200">·</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Zap size={12} style={{ color: "#4161df" }} /> Responds{" "}
                      {agent.responseTime}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex gap-2 pb-1 flex-shrink-0">
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <button
                    onClick={() => setBooking(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all duration-200 active:scale-[0.98]"
                    style={{ background: "#0f172a" }}
                  >
                    <Calendar size={15} /> Book Consultation
                  </button>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {agent.locations.map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(65,97,223,.08)",
                      color: "#4161df",
                      border: "1px solid rgba(65,97,223,.15)",
                    }}
                  >
                    <MapPin size={10} />
                    {l}
                  </span>
                ))}
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg"
                  style={{ background: "#f4f6f9", border: "1px solid #eaecf0" }}
                >
                  <Shield size={10} className="text-green-600" /> RERA:{" "}
                  {agent.rera}
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg"
                  style={{ background: "#f4f6f9", border: "1px solid #eaecf0" }}
                >
                  <Languages size={10} /> {agent.languages.join(" · ")}
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {agent.stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-xl py-3 px-1"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <span className="text-lg mb-1">{s.icon}</span>
                    <span className="text-sm font-semibold text-slate-800 leading-none">
                      {s.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 text-center leading-tight">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile CTAs */}
              <div className="flex gap-2 sm:hidden mt-5">
                <button
                  onClick={() => setBooking(true)}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm"
                  style={{ background: "#0f172a" }}
                >
                  <Calendar size={14} /> Book Consultation
                </button>
                <a
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle size={18} className="text-white" />
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100"
                >
                  <Phone size={16} className="text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ─── LEFT ─── */}
            <div className="flex-1 min-w-0">
              {/* Tab bar */}
              <div className="flex rounded-2xl p-1 mb-6" style={cardStyle}>
                {(["about", "listings", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200"
                    style={
                      activeTab === tab
                        ? { background: "#4161df", color: "#fff" }
                        : { color: "#64748b" }
                    }
                  >
                    {tab === "reviews"
                      ? `Reviews (${agent.reviews_data.length})`
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "about" && (
                <div className="flex flex-col gap-5">
                  {/* Bio */}
                  <div className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                    <h2
                      className="text-[19px] text-slate-900 mb-4"
                      style={serif}
                    >
                      About {agent.name}
                    </h2>
                    <div
                      className="relative pl-4"
                      style={{ borderLeft: "2px solid rgba(65,97,223,.18)" }}
                    >
                      <Quote
                        size={22}
                        className="absolute -top-0.5 -left-2.5"
                        style={{ color: "rgba(65,97,223,.10)" }}
                      />
                      {agent.longBio.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          className="text-[13.5px] text-slate-600 leading-relaxed mb-3 last:mb-0"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                    <h2
                      className="text-[19px] text-slate-900 mb-4 flex items-center gap-2"
                      style={serif}
                    >
                      <Award size={17} className="text-amber-500" /> Awards &
                      achievements
                    </h2>
                    <ul className="flex flex-col gap-2.5">
                      {agent.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2
                            size={16}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: "#4161df" }}
                          />
                          <span className="text-[13.5px] text-slate-700 font-medium">
                            {a}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specialisations */}
                  <div className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                    <h2
                      className="text-[19px] text-slate-900 mb-4"
                      style={serif}
                    >
                      Specialisations
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialisations.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-lg"
                          style={{
                            background: "rgba(65,97,223,.08)",
                            color: "#4161df",
                            border: "1px solid rgba(65,97,223,.15)",
                          }}
                        >
                          <Home size={12} />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LISTINGS TAB */}
              {activeTab === "listings" && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[19px] text-slate-900" style={serif}>
                      {agent.listings.length} active listings
                    </h2>
                    <Link
                      href="/properties"
                      className="text-xs font-semibold flex items-center gap-0.5 hover:underline"
                      style={{ color: "#4161df" }}
                    >
                      View all <ChevronRight size={12} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {agent.listings.map((l) => (
                      <PropertyCard key={l.id} card={toPropertyCard(l)} />
                    ))}
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl p-5 sm:p-6" style={cardStyle}>
                    <div className="flex gap-6 items-center">
                      <div className="text-center flex-shrink-0">
                        <div
                          className="text-[34px] text-slate-900"
                          style={serif}
                        >
                          {agent.rating}
                        </div>
                        <Stars rating={agent.rating} size={14} />
                        <p className="text-xs text-slate-400 mt-1">
                          {agent.reviews} reviews
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        {ratingDist.map((r) => (
                          <div key={r.star} className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 w-4">
                              {r.star}
                            </span>
                            <Star
                              size={10}
                              className="text-amber-400 fill-amber-400 flex-shrink-0"
                            />
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-amber-400"
                                style={{ width: `${r.pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-6 text-right">
                              {r.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {agent.reviews_data.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl p-5"
                      style={cardStyle}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                          style={{ background: r.color }}
                        >
                          {r.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 text-sm">
                                  {r.name}
                                </span>
                                {r.verified && (
                                  <span
                                    className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                                    style={{
                                      color: "#16a34a",
                                      background: "rgba(22,163,74,.08)",
                                      border: "1px solid rgba(22,163,74,.2)",
                                    }}
                                  >
                                    <BadgeCheck size={9} /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {r.propertyType} · {r.date}
                              </p>
                            </div>
                            <Stars rating={r.rating} size={12} />
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mt-2">
                            {r.text}
                          </p>
                          <button className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-medium transition hover:text-[#4161df]">
                            <ThumbsUp size={11} /> Helpful ({r.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT SIDEBAR ─── */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-20 flex flex-col gap-4">
                <div className="rounded-2xl p-5" style={cardStyle}>
                  <h3 className="text-[15px] text-slate-900 mb-4" style={serif}>
                    Get in touch
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => setBooking(true)}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
                      style={{ background: "#0f172a" }}
                    >
                      <Calendar size={14} /> Book free consultation
                    </button>
                    <a
                      href={`https://wa.me/${agent.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle size={14} /> Chat on WhatsApp
                    </a>
                    <a
                      href={`tel:${agent.phone}`}
                      className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition"
                    >
                      <Phone size={14} /> {agent.phone}
                    </a>
                  </div>
                  <div
                    className="mt-4 pt-4 flex items-center gap-2"
                    style={{ borderTop: "1px solid #f1f5f9" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-slate-500 font-medium">
                      Usually responds in {agent.responseTime}
                    </span>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(65,97,223,.06)",
                    border: "1px solid rgba(65,97,223,.16)",
                  }}
                >
                  <h3
                    className="text-[15px] mb-3 flex items-center gap-1.5"
                    style={{ ...serif, color: "#2a3ebf" }}
                  >
                    <Shield size={15} /> Why you can trust{" "}
                    {agent.name.split(" ")[0]}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Identity verified by PropertyBulbul",
                      "RERA certified — " + agent.rera,
                      "Background checked",
                      "All reviews from real clients",
                      "Zero commission from buyer",
                    ].map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2 text-xs font-medium leading-snug"
                        style={{ color: "#2a4bc4" }}
                      >
                        <CheckCircle2
                          size={13}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: "#4161df" }}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl p-5" style={cardStyle}>
                  <h3 className="text-[15px] text-slate-900 mb-3" style={serif}>
                    Other top agents
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {[
                      {
                        n: "Neha Verma",
                        t: "Luxury Specialist",
                        rating: 4.8,
                        color: "#7c3aed",
                        initials: "NV",
                      },
                      {
                        n: "Rajesh Malhotra",
                        t: "NRI Investments",
                        rating: 4.8,
                        color: "#d97706",
                        initials: "RM",
                      },
                    ].map((a) => (
                      <Link
                        key={a.n}
                        href={`/agents/${a.n.toLowerCase().replace(" ", "-")}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                          style={{ background: a.color }}
                        >
                          {a.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {a.n}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {a.t}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star
                            size={10}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            {a.rating}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/agents"
                    className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: "#4161df" }}
                  >
                    View all agents <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {booking && (
          <BookingModal agent={agent} onClose={() => setBooking(false)} />
        )}
      </div>
    </>
  );
}
