"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

/* ══════════════════════════════════════
   TYPES
══════════════════════════════════════ */
export interface Agent {
  _id?: string;
  id: number;
  slug: string;
  name: string;
  title: string;
  avatar: string;
  initials: string;
  avatarColor: string;
  rating: number;
  reviews: number;
  experience: number;
  deals: number;
  locations: string[];
  specialisations: string[];
  languages: string[];
  responseTime: string;
  verified: boolean;
  topAgent: boolean;
  bio: string;
  phone: string;
  whatsapp: string;
}

/* ══════════════════════════════════════
   AVATAR
══════════════════════════════════════ */
export function Avatar({
  agent,
  size = "md",
}: {
  agent: Agent;
  size?: "sm" | "md" | "lg";
}) {
  const s =
    size === "lg"
      ? "w-20 h-20 text-2xl"
      : size === "sm"
        ? "w-9 h-9 text-sm"
        : "w-14 h-14 text-lg";
  return (
    <div
      className={`${s} rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${agent.avatarColor}, ${agent.avatarColor}aa)`,
      }}
    >
      {agent.initials}
    </div>
  );
}

/* ══════════════════════════════════════
   AGENT CARD
══════════════════════════════════════ */
export default function AgentCard({
  agent,
  onBook,
  idx,
}: {
  agent: Agent;
  onBook: (a: Agent) => void;
  idx: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top colour bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${agent.avatarColor}, ${agent.avatarColor}60)`,
        }}
      />

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar agent={agent} />
            {agent.verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <BadgeCheck
                  size={14}
                  className="text-[#4161df]"
                  fill="#eef1fd"
                />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/agents/${agent.slug}`}
                className="font-black text-gray-900 text-base leading-tight truncate hover:text-[#4161df] transition-colors"
              >
                {agent.name}
              </Link>
              {agent.topAgent && (
                <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                  <Sparkles size={9} /> TOP
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {agent.title}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-800">
                {agent.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({agent.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: <TrendingUp size={13} />,
              val: `${agent.deals}+`,
              lab: "Deals",
            },
            {
              icon: <Clock size={13} />,
              val: `${agent.experience}yr`,
              lab: "Exp.",
            },
            {
              icon: <Zap size={13} />,
              val: agent.responseTime,
              lab: "Response",
            },
          ].map((s) => (
            <div
              key={s.lab}
              className="flex flex-col items-center bg-gray-50 rounded-2xl py-2.5 px-1"
            >
              <span className="text-[#4161df] mb-0.5">{s.icon}</span>
              <span className="text-xs font-black text-gray-800 leading-tight">
                {s.val}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">
                {s.lab}
              </span>
            </div>
          ))}
        </div>

        {/* Locations */}
        <div className="flex flex-wrap gap-1.5">
          {agent.locations.map((l) => (
            <span
              key={l}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#eef1fd] text-[#4161df] px-2 py-1 rounded-full"
            >
              <MapPin size={9} />
              {l}
            </span>
          ))}
        </div>

        {/* Specialisations */}
        <div className="flex flex-wrap gap-1.5">
          {agent.specialisations.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bio — expandable */}
        <div>
          <p
            className={`text-xs text-gray-500 leading-relaxed transition-all ${expanded ? "" : "line-clamp-2"}`}
          >
            {agent.bio}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-bold text-[#4161df] mt-1 hover:underline"
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 font-semibold">
            Speaks:
          </span>
          {agent.languages.map((l) => (
            <span
              key={l}
              className="text-[11px] font-semibold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* View Profile link */}
      <Link
        href={`/agents/${agent.slug}`}
        className="text-center text-xs font-bold text-[#4161df] hover:underline pt-1 mt-auto"
      >
        View Full Profile →
      </Link>

      {/* CTA footer */}
      <div className="px-5 pb-5 flex gap-2 mt-auto">
        <button
          onClick={() => onBook(agent)}
          className="flex-1 py-3 rounded-2xl bg-[#4161df] text-white font-bold text-xs shadow-md shadow-[#4161df]/20 hover:bg-[#3456df] hover:shadow-[#4161df]/40 transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <Calendar size={13} /> Book Consultation
        </button>
        <a
          href={`https://wa.me/${agent.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="w-11 h-11 rounded-2xl bg-[#25D366] flex items-center justify-center hover:bg-[#1ebe5d] transition-colors flex-shrink-0 shadow-md shadow-green-200"
        >
          <MessageCircle size={16} className="text-white" />
        </a>
        <a
          href={`tel:${agent.phone}`}
          className="w-11 h-11 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <Phone size={15} className="text-gray-600" />
        </a>
      </div>
    </div>
  );
}
