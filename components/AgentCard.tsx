"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Calendar,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Award,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   AVATAR EXPORT  (used elsewhere in the app)
══════════════════════════════════════════════════════════════ */
export function Avatar({
  agent,
  size = "md",
}: {
  agent: Agent;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? 80 : size === "sm" ? 40 : 64;
  const radius = 12;

  return (
    <div
      style={{ position: "relative", flexShrink: 0, width: dim, height: dim }}
    >
      {agent.avatar ? (
        <div
          style={{
            width: dim,
            height: dim,
            borderRadius: radius,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            sizes={`${dim}px`}
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: dim,
            height: dim,
            borderRadius: radius,
            background: `linear-gradient(135deg, ${agent.avatarColor}, ${agent.avatarColor}bb)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Instrument Serif', serif",
            fontSize: dim * 0.32,
            color: "#fff",
            fontWeight: 400,
          }}
        >
          {agent.initials}
        </div>
      )}
      {agent.verified && (
        <div
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#10B981",
            border: "2.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4l3 3 5-5"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INLINE STYLES  (all design tokens in one place)
   — Light / slate palette matching PropertyCard exactly
══════════════════════════════════════════════════════════════ */
const CARD_W = 340;

const t = {
  /* palette — matches PropertyCard's Tailwind slate classes */
  bg: "#F8FAFC",
  bgCard: "#FFFFFF",
  bgRaised: "#F1F5F9",
  blue: "#4161DF",
  blueLt: "#EEF1FD",
  blueGlow: "rgba(65,97,223,0.15)",
  white: "#FFFFFF",
  ink: "#0F172A" /* slate-900 – main headings, prices */,
  ink2: "#475569" /* slate-600 – secondary text, location (matches PropertyCard) */,
  ink3: "#64748B" /* slate-500 – muted labels (matches PropertyCard) */,
  border: "#E2E8F0",
  green: "#10B981",
  amber: "#F59E0B",
  rail: "#4161DF",
};

/* ══════════════════════════════════════════════════════════════
   STAR ROW
══════════════════════════════════════════════════════════════ */
const StarRow = ({ rating, reviews }: { rating: number; reviews: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          style={{
            color: s <= Math.round(rating) ? t.amber : t.ink3,
            fill: s <= Math.round(rating) ? t.amber : "none",
          }}
        />
      ))}
    </div>
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: t.ink,
      }}
    >
      {rating.toFixed(1)}
    </span>
    <span style={{ fontSize: 11, color: t.ink3 }}>({reviews})</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   STAT CELL
══════════════════════════════════════════════════════════════ */
const Stat = ({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    <span
      style={{
        fontSize: 18,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color: accent || t.ink,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        color: t.ink3,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN CARD
══════════════════════════════════════════════════════════════ */
export default function AgentCard({
  agent,
  onBook,
  idx = 0,
}: {
  agent: Agent;
  onBook: (a: Agent) => void;
  idx?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  const displayDeals =
    agent.deals >= 100
      ? `${(agent.deals / 100).toFixed(0)}00+`
      : `${agent.deals}+`;

  return (
    <>
      <style>{`
        @keyframes agentFadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .ac-book-btn:hover { filter: brightness(1.08); }
        .ac-wa-btn:hover   { background: rgba(16,185,129,0.18) !important; }
        .ac-ph-btn:hover   { background: rgba(65,97,223,0.18) !important; }
        .ac-view-btn:hover { background: rgba(15,23,42,0.06) !important; }
        .ac-save-btn:hover { transform: scale(1.12); }
      `}</style>

      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: CARD_W,
          background: t.bgCard,
          borderRadius: 20,
          border: `1px solid ${hovered ? t.blue : t.border}`,
          boxShadow: hovered
            ? `0 12px 32px rgba(15,23,42,0.12), 0 0 0 1px ${t.blue}22, inset 0 1px 0 rgba(255,255,255,0.8)`
            : `0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: `agentFadeUp 0.5s ease both`,
          animationDelay: `${idx * 70}ms`,
          position: "relative",
        }}
      >
        {/* ── Left accent rail ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(180deg, ${t.blue} 0%, rgba(65,97,223,0.2) 60%, transparent 100%)`,
            zIndex: 4,
          }}
        />

        {/* ── Header band ── */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(160deg, ${agent.avatarColor}12 0%, ${agent.avatarColor}06 50%, transparent 100%)`,
            borderBottom: `1px solid ${t.border}`,
            padding: "20px 18px 0 22px",
          }}
        >
          {/* Subtle texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.025) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Top row: badges + save */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {agent.verified && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 8,
                    padding: "4px 9px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.green,
                    letterSpacing: "0.04em",
                  }}
                >
                  <Shield size={9} style={{ color: t.green }} />
                  RERA Verified
                </span>
              )}
              {agent.topAgent && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: 8,
                    padding: "4px 9px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.amber,
                    letterSpacing: "0.04em",
                  }}
                >
                  <Award size={9} style={{ color: t.amber }} />
                  Top Agent
                </span>
              )}
            </div>

            {/* Save button */}
            <button
              className="ac-save-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSaved((s) => !s);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: saved ? "rgba(239,68,68,0.12)" : t.bgRaised,
                border: `1px solid ${saved ? "rgba(239,68,68,0.3)" : t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                color: saved ? "#EF4444" : t.ink3,
              }}
              aria-label={saved ? "Unsave agent" : "Save agent"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          {/* Avatar + identity row */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              paddingBottom: 18,
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {agent.avatar ? (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: `0 0 0 2px ${agent.avatarColor}33, 0 4px 12px rgba(15,23,42,0.1)`,
                  }}
                >
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    background: `linear-gradient(145deg, ${agent.avatarColor} 0%, ${agent.avatarColor}99 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color: "#fff",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    boxShadow: `0 0 0 2px ${agent.avatarColor}33, 0 4px 12px rgba(15,23,42,0.1)`,
                  }}
                >
                  {agent.initials}
                </div>
              )}
              {/* Online dot */}
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: t.green,
                  border: `2px solid ${t.bgCard}`,
                  boxShadow: `0 0 8px ${t.green}66`,
                }}
              />
            </div>

            {/* Name / title / rating */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                  color: t.ink,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {agent.name}
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 11.5,
                  color: t.ink2,
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {agent.title}
              </p>
              <div style={{ marginTop: 8 }}>
                <StarRow rating={agent.rating} reviews={agent.reviews} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            background: t.bgRaised,
            borderBottom: `1px solid ${t.border}`,
            padding: "14px 0",
          }}
        >
          <Stat
            value={`${agent.experience}y`}
            label="Experience"
            accent={t.blue}
          />
          <div style={{ background: t.border }} />
          <Stat value={displayDeals} label="Deals" />
          <div style={{ background: t.border }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={12} style={{ color: t.green }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: t.green,
                }}
              >
                {agent.responseTime || "Fast"}
              </span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: t.ink3,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Response
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: "16px 18px 0 22px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Bio */}
          {agent.bio && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: t.ink2,
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontWeight: 300,
              }}
            >
              {agent.bio}
            </p>
          )}

          {/* Specialisations */}
          {agent.specialisations?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {agent.specialisations.slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: t.blue,
                    background: "rgba(65,97,223,0.08)",
                    border: "1px solid rgba(65,97,223,0.18)",
                    borderRadius: 6,
                    padding: "3px 9px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s}
                </span>
              ))}
              {agent.specialisations.length > 3 && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: t.ink3,
                    background: t.bgRaised,
                    border: `1px solid ${t.border}`,
                    borderRadius: 6,
                    padding: "3px 9px",
                  }}
                >
                  +{agent.specialisations.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Location + languages row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {agent.locations?.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin size={11} style={{ color: t.ink3, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: t.ink2, fontWeight: 400 }}>
                  {agent.locations.slice(0, 2).join(" · ")}
                  {agent.locations.length > 2 && (
                    <span style={{ color: t.ink3 }}>
                      {" "}
                      +{agent.locations.length - 2}
                    </span>
                  )}
                </span>
              </div>
            )}
            {agent.languages?.length > 0 && (
              <div style={{ display: "flex", gap: 4 }}>
                {agent.languages.slice(0, 2).map((l, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 9.5,
                      fontWeight: 500,
                      color: t.ink3,
                      background: t.bgRaised,
                      border: `1px solid ${t.border}`,
                      borderRadius: 5,
                      padding: "2px 7px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            margin: "16px 18px 0 22px",
            height: 1,
            background: t.border,
          }}
        />

        {/* ── Action footer ── */}
        <div
          style={{
            padding: "14px 18px 18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {/* Primary CTA — Book consultation */}
          <button
            className="ac-book-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBook(agent);
            }}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(95deg, ${t.blue} 0%, #5573F5 100%)`,
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: "0.01em",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `0 4px 16px rgba(65,97,223,0.35)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
                animation: hovered ? "shimmer 1.8s linear infinite" : "none",
              }}
            />
            <Calendar size={15} style={{ position: "relative", zIndex: 1 }} />
            <span style={{ position: "relative", zIndex: 1 }}>
              Book Free Consultation
            </span>
          </button>

          {/* Secondary row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 40px",
              gap: 7,
            }}
          >
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${agent.whatsapp?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ac-wa-btn"
              style={{
                height: 38,
                borderRadius: 10,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: t.green,
                fontSize: 11.5,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.18s",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>

            {/* Call */}
            <a
              href={`tel:${agent.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="ac-ph-btn"
              style={{
                height: 38,
                borderRadius: 10,
                background: "rgba(65,97,223,0.08)",
                border: "1px solid rgba(65,97,223,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: t.blue,
                fontSize: 11.5,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.18s",
              }}
            >
              <Phone size={13} />
              Call Now
            </a>

            {/* Profile link */}
            <Link
              href={`/agents/${agent.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="ac-view-btn"
              style={{
                height: 38,
                borderRadius: 10,
                background: t.bgRaised,
                border: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.ink2,
                transition: "background 0.18s",
              }}
              title="View full profile"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── Bottom accent line ── */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, ${t.blue} 0%, ${agent.avatarColor} 50%, transparent 100%)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        />
      </article>
    </>
  );
}
