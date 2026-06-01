"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  TrendingUp,
  Users,
  Home,
  Building2,
  ChevronRight,
  Quote,
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  Share2,
  Heart,
  Eye,
  BedDouble,
  Bath,
  Maximize2,
  IndianRupee,
  Languages,
  ThumbsUp,
  ChevronLeft,
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
    // POST to /api/bookings
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(5,10,30,0.75)", backdropFilter: "blur(10px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-[2rem] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-black text-gray-900">Book Free Consultation</h3>
            <p className="text-xs text-gray-400">with {agent.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X size={14} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {!done ? (
            <form onSubmit={submit} className="p-6 flex flex-col gap-6">
              {/* Date */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#4161df]" /> Select Date
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d.iso}
                      onClick={() => setDate(d.iso)}
                      className={`snap-start flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-2xl border-2 transition-all duration-150 ${
                        date === d.iso
                          ? "border-[#4161df] bg-[#4161df] text-white shadow-lg shadow-[#4161df]/30"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-[#4161df]/40"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-semibold ${date === d.iso ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {d.day}
                      </span>
                      <span className="text-xl font-black leading-tight">
                        {d.date}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${date === d.iso ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {d.month}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              {date && (
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#4161df]" /> Select Time
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTime(t)}
                        className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-150 ${
                          time === t
                            ? "border-[#4161df] bg-[#eef1fd] text-[#4161df]"
                            : "border-gray-100 bg-gray-50 text-gray-500 hover:border-[#4161df]/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-800">Your Details</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full name"
                  className={iCls}
                />
                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  required
                  placeholder="Mobile number"
                  inputMode="numeric"
                  className={iCls}
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="What are you looking for? (optional)"
                  className={`${iCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={!date || !time || !name || !phone}
                className="w-full py-4 rounded-2xl bg-[#4161df] text-white font-black text-sm shadow-lg shadow-[#4161df]/25 hover:bg-[#3456df] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                Confirm Booking →
              </button>

              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                <Shield size={11} /> 100% free · No spam · Your details stay
                private
              </p>
            </form>
          ) : (
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4 text-4xl">
                🎉
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Booked!
              </h3>
              <p className="text-gray-500 text-sm mb-1">
                {agent.name} will call you on
              </p>
              <p className="font-black text-[#4161df] text-lg mb-6">
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
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition"
                >
                  <MessageCircle size={16} /> Message on WhatsApp now
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
                >
                  <Phone size={16} /> Call {agent.phone}
                </a>
              </div>
              <button
                onClick={onClose}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition"
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

const iCls =
  "w-full px-4 py-3 text-sm bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#4161df] focus:bg-white transition placeholder-gray-400";

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
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════
   LISTING CARD
══════════════════════════════════════════════ */
function ListingCard({ listing }: { listing: Listing }) {
  const gradients = [
    "from-[#1a2a6c] to-[#4161df]",
    "from-[#2d1b6b] to-[#7c3aed]",
    "from-[#064e3b] to-[#059669]",
  ];
  const g = gradients[listing.id % gradients.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      {/* Image placeholder */}
      <div
        className={`relative h-44 bg-gradient-to-br ${g} flex items-center justify-center`}
      >
        <Building2 size={40} className="text-white/30" />
        <span
          className="absolute top-3 left-3 text-[11px] font-bold text-white px-2.5 py-1 rounded-full"
          style={{ background: listing.tagColor }}
        >
          {listing.tag}
        </span>
        <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition">
          <Heart size={13} className="text-white" />
        </button>
      </div>
      <div className="p-4">
        <p className="font-black text-gray-900 text-sm leading-tight mb-1">
          {listing.title}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <MapPin size={10} />
          {listing.location}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <BedDouble size={11} />
            {listing.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={11} />
            {listing.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={11} />
            {listing.area}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-black text-[#4161df] text-base">
            {listing.price}
          </span>
          <button className="text-[11px] font-bold text-[#4161df] hover:underline flex items-center gap-0.5">
            View <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE  — `params.slug` injected by Next.js
══════════════════════════════════════════════ */
interface PageProps {
  params: { slug: string };
}

export default function AgentProfilePage({ params }: PageProps) {
  // In production: const agent = await fetchAgent(params.slug);
  const agent = MOCK_AGENT;

  const [booking, setBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "listings" | "reviews">(
    "about",
  );
  const [liked, setLiked] = useState(false);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Show sticky CTA after hero scrolls out
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
    <div
      className="min-h-screen bg-[#f8f9ff] pt-[72px]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── STICKY TOP CTA ── */}
      {stickyCtaVisible && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg,${agent.avatarColor},${agent.avatarColor}90)`,
                }}
              >
                {agent.initials}
              </div>
              <div className="hidden sm:block">
                <p className="font-black text-gray-900 text-sm leading-none">
                  {agent.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Stars rating={agent.rating} size={11} />
                  <span className="text-xs text-gray-400">
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
                className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1ebe5d] transition"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              <button
                onClick={() => setBooking(true)}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#4161df] text-white text-xs font-bold shadow-md shadow-[#4161df]/25 hover:bg-[#3456df] transition"
              >
                <Calendar size={13} /> Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BACK LINK ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#4161df] transition group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />{" "}
          All Agents
        </Link>
      </div>

      {/* ══════════════════════════════════════
          HERO PROFILE CARD
      ══════════════════════════════════════ */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover bar */}
          <div
            className="relative h-28 sm:h-36 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${agent.coverColor} 0%, #1e3080 60%, ${agent.avatarColor} 100%)`,
            }}
          >
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            {/* Diagonal swoosh */}
            <svg
              className="absolute bottom-0 right-0 w-64 h-full opacity-10"
              viewBox="0 0 200 100"
              fill="none"
            >
              <path d="M200 0 L200 100 L0 100 Z" fill="white" />
            </svg>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all border ${liked ? "bg-red-50 border-red-200" : "bg-white/20 border-white/30 hover:bg-white/30"}`}
              >
                <Heart
                  size={15}
                  className={liked ? "text-red-500 fill-red-500" : "text-white"}
                />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition">
                <Share2 size={15} className="text-white" />
              </button>
            </div>
          </div>

          {/* Profile section */}
          <div className="px-5 sm:px-8 pb-6">
            {/* Avatar — overlaps cover */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12 mb-5">
              <div className="relative flex-shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-black text-white text-2xl sm:text-3xl border-4 border-white shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${agent.avatarColor}, ${agent.avatarColor}90)`,
                  }}
                >
                  {agent.initials}
                </div>
                {agent.verified && (
                  <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
                    <BadgeCheck
                      size={18}
                      className="text-[#4161df]"
                      fill="#eef1fd"
                    />
                  </span>
                )}
              </div>

              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    {agent.name}
                  </h1>
                  {agent.topAgent && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      <Sparkles size={10} /> Top Agent
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-0.5">{agent.title}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Stars rating={agent.rating} size={14} />
                    <span className="font-black text-gray-900 text-sm">
                      {agent.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({agent.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                    <Zap size={12} className="text-[#4161df]" /> Responds{" "}
                    {agent.responseTime}
                  </span>
                </div>
              </div>

              {/* Desktop CTAs inline */}
              <div className="hidden sm:flex gap-2 pb-1 flex-shrink-0">
                <a
                  href={`https://wa.me/${agent.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition shadow-sm"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <button
                  onClick={() => setBooking(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4161df] text-white font-bold text-sm hover:bg-[#3456df] transition shadow-md shadow-[#4161df]/25"
                >
                  <Calendar size={15} /> Book Consultation
                </button>
              </div>
            </div>

            {/* Info chips row */}
            <div className="flex flex-wrap gap-2 mb-5">
              {agent.locations.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-[#eef1fd] text-[#4161df] px-3 py-1.5 rounded-full border border-[#c9d4fb]"
                >
                  <MapPin size={10} />
                  {l}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                <Shield size={10} className="text-green-600" /> RERA:{" "}
                {agent.rera}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                <Languages size={10} /> {agent.languages.join(" · ")}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {agent.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center bg-gray-50 rounded-2xl py-3 px-2 border border-gray-100"
                >
                  <span className="text-xl mb-1">{s.icon}</span>
                  <span className="text-sm font-black text-gray-900 leading-none">
                    {s.value}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5 text-center leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="flex gap-2 sm:hidden mt-5">
              <button
                onClick={() => setBooking(true)}
                className="flex-1 py-3 rounded-2xl bg-[#4161df] text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#4161df]/25"
              >
                <Calendar size={14} /> Book Consultation
              </button>
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-sm"
              >
                <MessageCircle size={18} className="text-white" />
              </a>
              <a
                href={`tel:${agent.phone}`}
                className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center"
              >
                <Phone size={16} className="text-gray-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT  (two-col on desktop)
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── LEFT  (tabs) ─── */}
          <div className="flex-1 min-w-0">
            {/* Tab bar */}
            <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6">
              {(["about", "listings", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[#4161df] text-white shadow-md shadow-[#4161df]/25"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-black text-gray-900 mb-4">
                    About {agent.name}
                  </h2>
                  <div className="relative pl-5 border-l-2 border-[#4161df]/20">
                    <Quote
                      size={24}
                      className="absolute -top-1 -left-3 text-[#4161df]/15 fill-[#4161df]/15"
                    />
                    {agent.longBio.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> Awards &
                    Achievements
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {agent.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          size={16}
                          className="text-[#4161df] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {a}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialisations */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-black text-gray-900 mb-4">
                    Specialisations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialisations.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold bg-[#eef1fd] text-[#4161df] px-4 py-2 rounded-full border border-[#c9d4fb]"
                      >
                        <Home size={12} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── LISTINGS TAB ── */}
            {activeTab === "listings" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-gray-900">
                    {agent.listings.length} Active Listings
                  </h2>
                  <Link
                    href="/properties"
                    className="text-xs font-bold text-[#4161df] hover:underline flex items-center gap-0.5"
                  >
                    View all <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agent.listings.map((l, i) => (
                    <div key={l.id}>
                      <ListingCard listing={l} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REVIEWS TAB ── */}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-5">
                {/* Rating summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex gap-6 items-center">
                    <div className="text-center flex-shrink-0">
                      <div className="text-5xl font-black text-gray-900">
                        {agent.rating}
                      </div>
                      <Stars rating={agent.rating} size={16} />
                      <p className="text-xs text-gray-400 mt-1">
                        {agent.reviews} reviews
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      {ratingDist.map((r) => (
                        <div key={r.star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-4">
                            {r.star}
                          </span>
                          <Star
                            size={10}
                            className="text-amber-400 fill-amber-400 flex-shrink-0"
                          />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${r.pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-6 text-right">
                            {r.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review cards */}
                {agent.reviews_data.map((r, i) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                        style={{ background: r.color }}
                      >
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">
                                {r.name}
                              </span>
                              {r.verified && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                                  <BadgeCheck size={9} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {r.propertyType} · {r.date}
                            </p>
                          </div>
                          <Stars rating={r.rating} size={12} />
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mt-2">
                          {r.text}
                        </p>
                        <button className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-[#4161df] transition font-semibold">
                          <ThumbsUp size={11} /> Helpful ({r.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT STICKY SIDEBAR ─── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-20 flex flex-col gap-4">
              {/* Quick contact card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-black text-gray-900 text-sm mb-4">
                  Get in Touch
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setBooking(true)}
                    className="w-full py-3.5 rounded-2xl bg-[#4161df] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#4161df]/25 hover:bg-[#3456df] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Calendar size={15} /> Book Free Consultation
                  </button>
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition"
                  >
                    <MessageCircle size={15} /> Chat on WhatsApp
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="w-full py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                  >
                    <Phone size={15} /> {agent.phone}
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-500 font-semibold">
                    Usually responds in {agent.responseTime}
                  </span>
                </div>
              </div>

              {/* Trust signals */}
              <div className="bg-[#eef1fd] rounded-2xl border border-[#c9d4fb] p-5">
                <h3 className="font-black text-[#4161df] text-sm mb-3 flex items-center gap-1.5">
                  <Shield size={14} /> Why you can trust{" "}
                  {agent.name.split(" ")[0]}
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "Identity verified by PropertyBulbul",
                    "RERA certified — " + agent.rera,
                    "Background checked ✓",
                    "All reviews from real clients",
                    "Zero commission from buyer",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-xs text-[#2a4bc4] font-medium leading-snug"
                    >
                      <CheckCircle2
                        size={13}
                        className="flex-shrink-0 mt-0.5 text-[#4161df]"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Similar agents teaser */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-black text-gray-900 text-sm mb-3">
                  Other Top Agents
                </h3>
                <div className="flex flex-col gap-2.5">
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
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs flex-shrink-0"
                        style={{ background: a.color }}
                      >
                        {a.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {a.n}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {a.t}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star
                          size={10}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          {a.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/agents"
                  className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-[#4161df] hover:underline"
                >
                  View all agents <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOOKING MODAL ── */}
      {booking && (
        <BookingModal agent={agent} onClose={() => setBooking(false)} />
      )}
    </div>
  );
}

/* ── Metadata helper (keep in a separate server component if needed) ──
export async function generateMetadata({ params }: PageProps) {
  const agent = await fetchAgent(params.slug);
  return {
    title: `${agent.name} — PropertyBulbul Agent`,
    description: agent.bio,
  };
}
*/
