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
  Eye,
  MessageCircle,
  ThumbsUp,
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
            fontFamily: "var(--font-heading), var(--font-inter), system-ui, sans-serif",
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
   STYLE TOKENS
══════════════════════════════════════════════════════════════ */
const CARD_W = 342;

const t = {
  bg: "#F8FAFC",
  bgCard: "#FFFFFF",
  bgRaised: "#F1F5F9",
  blue: "#4161DF",
  blueLt: "#EEF1FD",
  blueGlow: "rgba(65,97,223,0.15)",
  white: "#FFFFFF",
  ink: "#0F172A",
  ink2: "#475569",
  ink3: "#64748B",
  ink4: "#94A3B8",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",
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
            color: s <= Math.round(rating) ? t.amber : t.border,
            fill: s <= Math.round(rating) ? t.amber : "none",
          }}
        />
      ))}
    </div>
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
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
        fontSize: 17,
        fontWeight: 800,
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
        color: t.ink4,
        letterSpacing: "0.08em",
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
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(65,97,223,0.15); }
          50% { box-shadow: 0 0 0 6px rgba(65,97,223,0); }
        }
        .ac-agent-card {
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .ac-agent-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px -8px rgba(15,23,42,0.12), 0 4px 8px -4px rgba(15,23,42,0.08) !important;
        }
        .ac-book-btn {
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .ac-book-btn:hover {
          filter: brightness(1.08);
          transform: scale(1.015);
        }
        .ac-wa-btn {
          transition: all 0.2s ease;
        }
        .ac-wa-btn:hover {
          background: rgba(16,185,129,0.18) !important;
          border-color: rgba(16,185,129,0.35) !important;
        }
        .ac-ph-btn {
          transition: all 0.2s ease;
        }
        .ac-ph-btn:hover {
          background: rgba(65,97,223,0.18) !important;
          border-color: rgba(65,97,223,0.35) !important;
        }
        .ac-view-btn {
          transition: all 0.2s ease;
        }
        .ac-view-btn:hover {
          background: ${t.ink} !important;
          border-color: ${t.ink} !important;
          color: #fff !important;
        }
        .ac-save-btn {
          transition: all 0.2s ease;
        }
        .ac-save-btn:hover {
          transform: scale(1.15);
        }
        .ac-spec-chip {
          transition: all 0.2s ease;
        }
        .ac-spec-chip:hover {
          background: ${t.blue} !important;
          color: #fff !important;
          border-color: ${t.blue} !important;
        }
      `}</style>

      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="ac-agent-card"
        style={{
          width: CARD_W,
          background: t.bgCard,
          borderRadius: 22,
          border: `1px solid ${hovered ? t.borderHover : t.border}`,
          boxShadow: hovered
            ? `0 8px 20px -6px rgba(15,23,42,0.1), 0 2px 4px -2px rgba(15,23,42,0.06)`
            : `0 1px 3px 0 rgba(15,23,42,0.05), 0 1px 2px -1px rgba(15,23,42,0.03)`,
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
            width: 3.5,
            background: `linear-gradient(180deg, ${t.blue} 0%, ${agent.avatarColor} 60%, ${t.blue}88 100%)`,
            zIndex: 4,
            opacity: hovered ? 1 : 0.7,
            transition: "opacity 0.3s",
          }}
        />

        {/* ── Header section ── */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(160deg, ${agent.avatarColor}14 0%, ${agent.avatarColor}06 50%, transparent 100%)`,
            borderBottom: `1px solid ${t.border}`,
            padding: "20px 18px 0 24px",
          }}
        >
          {/* Subtle dot-grid texture */}
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
          {/* Gradient glow on hover */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `${agent.avatarColor}18`,
              filter: "blur(40px)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.5s",
              zIndex: 0,
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
            <div style={{ display: "flex", gap: 5 }}>
              {agent.verified && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.22)",
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: t.green,
                    letterSpacing: "0.03em",
                  }}
                >
                  <Shield size={9} style={{ color: t.green }} />
                  RERA
                </span>
              )}
              {agent.topAgent && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.22)",
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: t.amber,
                    letterSpacing: "0.03em",
                  }}
                >
                  <Award size={9} style={{ color: t.amber }} />
                  TOP
                </span>
              )}
              {/* Rating badge */}
              {agent.rating >= 4.7 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.18)",
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#D97706",
                    letterSpacing: "0.03em",
                  }}
                >
                  <ThumbsUp size={8} style={{ color: "#D97706" }} />
                  TOP RATED
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
            {/* Avatar with animated border on hover */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {agent.avatar ? (
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 18,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: hovered
                      ? `0 0 0 3px ${agent.avatarColor}55, 0 6px 16px rgba(15,23,42,0.12)`
                      : `0 0 0 2px ${agent.avatarColor}33, 0 4px 12px rgba(15,23,42,0.08)`,
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    sizes="74px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 18,
                    background: `linear-gradient(145deg, ${agent.avatarColor} 0%, ${agent.avatarColor}99 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading), var(--font-inter), system-ui, sans-serif",
                    fontSize: 28,
                    color: "#fff",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    boxShadow: hovered
                      ? `0 0 0 3px ${agent.avatarColor}55, 0 6px 16px rgba(15,23,42,0.12)`
                      : `0 0 0 2px ${agent.avatarColor}33, 0 4px 12px rgba(15,23,42,0.08)`,
                    transition: "box-shadow 0.3s",
                  }}
                >
                  {agent.initials}
                </div>
              )}
              {/* Animated online dot */}
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: t.green,
                  border: `2.5px solid ${t.bgCard}`,
                  boxShadow: hovered
                    ? `0 0 0 2px ${t.green}44, 0 0 10px ${t.green}66`
                    : `0 0 8px ${t.green}55`,
                  transition: "box-shadow 0.3s",
                }}
              />
            </div>

            {/* Name / title / rating */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.15,
                  fontStyle: "italic",
                  color: t.ink,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 700,
                }}
              >
                {agent.name}
              </h3>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 11.5,
                  color: t.ink2,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {agent.title}
              </p>
              <div style={{ marginTop: 7 }}>
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
            background: `linear-gradient(180deg, ${t.bgRaised} 0%, ${t.bgCard} 100%)`,
            borderBottom: `1px solid ${t.border}`,
            padding: "13px 0",
          }}
        >
          <Stat
            value={`${agent.experience}y`}
            label="Experience"
            accent={t.blue}
          />
          <div
            style={{
              background: `linear-gradient(180deg, transparent, ${t.border}, transparent)`,
              width: 1,
            }}
          />
          <Stat value={displayDeals} label="Deals Closed" />
          <div
            style={{
              background: `linear-gradient(180deg, transparent, ${t.border}, transparent)`,
              width: 1,
            }}
          />
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
                  fontWeight: 700,
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
                color: t.ink4,
                letterSpacing: "0.08em",
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
            padding: "14px 18px 0 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 11,
          }}
        >
          {/* Bio */}
          {agent.bio && (
            <p
              style={{
                margin: 0,
                fontSize: 11.5,
                color: t.ink2,
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontWeight: 400,
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
                  className="ac-spec-chip"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.blue,
                    background: "rgba(65,97,223,0.08)",
                    border: "1px solid rgba(65,97,223,0.16)",
                    borderRadius: 7,
                    padding: "3px 9px",
                    letterSpacing: "0.01em",
                    cursor: "default",
                  }}
                >
                  {s}
                </span>
              ))}
              {agent.specialisations.length > 3 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.ink3,
                    background: t.bgRaised,
                    border: `1px solid ${t.border}`,
                    borderRadius: 7,
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
                <MapPin size={11} style={{ color: t.ink4, flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 11,
                    color: t.ink2,
                    fontWeight: 500,
                  }}
                >
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
                      fontSize: 9,
                      fontWeight: 600,
                      color: t.ink3,
                      background: t.bgRaised,
                      border: `1px solid ${t.border}`,
                      borderRadius: 5,
                      padding: "2px 7px",
                      letterSpacing: "0.02em",
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
            margin: "14px 18px 0 24px",
            height: 1,
            background: `linear-gradient(90deg, ${t.border}, ${agent.avatarColor}33, ${t.border})`,
            opacity: 0.7,
          }}
        />

        {/* ── Action footer ── */}
        <div
          style={{
            padding: "12px 18px 18px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
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
              fontWeight: 700,
              letterSpacing: "0.01em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: `0 4px 16px ${t.blueGlow}`,
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
                border: "1px solid rgba(16,185,129,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: t.green,
                fontSize: 11.5,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <MessageCircle size={13} />
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
                border: "1px solid rgba(65,97,223,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: t.blue,
                fontSize: 11.5,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Phone size={13} />
              Call Now
            </a>

            {/* View Details button */}
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
                gap: 4,
                color: t.ink2,
                fontSize: 11,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
              title="View full profile"
            >
              <Eye size={13} />
            </Link>
          </div>
        </div>

        {/* ── Bottom accent line ── */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${t.blue} 0%, ${agent.avatarColor} 50%, ${t.blue} 100%)`,
            opacity: hovered ? 1 : 0.3,
            transition: "opacity 0.35s",
          }}
        />
      </article>
    </>
  );
}
