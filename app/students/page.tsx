"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────
interface Locality {
  name: string;
  avg: string;
  commute: string;
  tag: string;
  color: string;
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FAQ {
  q: string;
  a: string;
}

// ── Static data ────────────────────────────────────────────
const LOCALITIES: Locality[] = [
  {
    name: "Zirakpur",
    avg: "₹12,000–18,000",
    commute: "20 min to IT Park",
    tag: "Best for IT employees",
    color: "#4161df",
  },
  {
    name: "Mohali Sector 70–82",
    avg: "₹14,000–22,000",
    commute: "10 min to IT Park",
    tag: "Closest to offices",
    color: "#059669",
  },
  {
    name: "Panchkula Sectors",
    avg: "₹10,000–16,000",
    commute: "30 min to IT Park",
    tag: "Most affordable",
    color: "#d97706",
  },
  {
    name: "Chandigarh Sectors",
    avg: "₹15,000–30,000",
    commute: "25 min to IT Park",
    tag: "Near PU & PGIMER",
    color: "#7c3aed",
  },
  {
    name: "Kharar",
    avg: "₹8,000–14,000",
    commute: "15 min to CU",
    tag: "Near Chandigarh Univ",
    color: "#dc2626",
  },
  {
    name: "Aerocity Mohali",
    avg: "₹16,000–28,000",
    commute: "5 min to airport",
    tag: "Premium location",
    color: "#0891b2",
  },
];

const FEATURES: Feature[] = [
  {
    icon: "🤖",
    title: "AI-Powered Search",
    desc: "Type exactly what you need in plain English — 'furnished 1BHK near Infosys Mohali under ₹15,000' — and get perfectly matched results instantly.",
  },
  {
    icon: "🚫",
    title: "Zero Spam Calls",
    desc: "You initiate contact. No agent calls you randomly. No spam WhatsApp messages at midnight. You stay in control at all times.",
  },
  {
    icon: "🏠",
    title: "Direct Owner Access",
    desc: "Pro Seeker members connect directly with landlords — no broker middleman taking commission. Save ₹15,000–25,000 on every move.",
  },
  {
    icon: "👥",
    title: "Roommate Matching",
    desc: "Looking for a compatible flatmate? Our matching system connects you with people with similar profiles, budgets, and lifestyles.",
  },
  {
    icon: "📍",
    title: "Commute Distance Filter",
    desc: "Filter properties by commute time to your office or university. Never end up in a flat that's 2 hours from work.",
  },
  {
    icon: "✅",
    title: "Verified Listings Only",
    desc: "Every listing is verified as active before going live. No fake listings. No already-rented properties still showing up.",
  },
];

const FAQS: FAQ[] = [
  {
    q: "Is PropertyBulbul completely free for students?",
    a: "Yes — searching, saving properties, and contacting agents is completely free forever. Pro Seeker at ₹299/month gives you direct landlord access and zero brokerage properties.",
  },
  {
    q: "How is this different from OLX or 99acres?",
    a: "We are 100% Tricity-focused with verified listings only. OLX has fake listings and spam. 99acres is built for all of India and gives poor results for Tricity specifically. We have AI search that understands plain English queries.",
  },
  {
    q: "Can I really avoid paying brokerage?",
    a: "Yes — Pro Seeker members get exclusive access to owner-direct listings where there is zero brokerage. Students relocating to Mohali typically save ₹15,000–25,000 per move with this feature.",
  },
  {
    q: "I'm relocating from another city — can I search remotely?",
    a: "Absolutely. Use our AI search to find matching properties, download PDF brochures, and connect with landlords via WhatsApp — all before you arrive in Tricity.",
  },
  {
    q: "How do I find a roommate?",
    a: "Post your requirement with your budget, preferred area, and lifestyle preferences. Our system matches you with compatible profiles looking in the same area.",
  },
  {
    q: "What areas are covered?",
    a: "Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar — all of Tricity. Every listing is location-verified.",
  },
];

const INSTITUTIONS = [
  "Chandigarh University",
  "Panjab University",
  "PGIMER",
  "GGDSD College",
  "Infosys Mohali",
  "Quark City",
  "DLF Cybercity",
  "Wipro Mohali",
  "Concentrix",
];

// ── Component ──────────────────────────────────────────────
export default function StudentEmployeePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"student" | "employee">("student");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "var(--font-inter), system-ui, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0f1d40 0%, #1a3270 40%, #4161df 100%)",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        {[
          { w: 400, h: 400, top: -120, right: -100, op: 0.06 },
          { w: 250, h: 250, bottom: -80, left: -60, op: 0.08 },
          { w: 180, h: 180, top: 60, left: "35%", op: 0.04 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: b.w,
              height: b.h,
              borderRadius: "50%",
              background: "white",
              opacity: b.op,
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
            }}
          />
        ))}

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          {/* Tab switcher */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 100,
              padding: 4,
              marginBottom: 28,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {(["student", "employee"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  border: "none",
                  background: activeTab === t ? "white" : "transparent",
                  color: activeTab === t ? "#1a3270" : "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {t === "student" ? "🎓 Students" : "💼 Employees"}
              </button>
            ))}
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            {activeTab === "student" ? (
              <>
                Find Your Perfect Flat
                <br />
                <span style={{ color: "#93c5fd" }}>
                  Near Your University in Tricity
                </span>
              </>
            ) : (
              <>
                Find Your Perfect Home
                <br />
                <span style={{ color: "#93c5fd" }}>
                  Near Your Office in Tricity
                </span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.75,
              maxWidth: 560,
              marginBottom: 32,
            }}
          >
            {activeTab === "student"
              ? "Zero brokerage. Direct landlord contact. AI-powered search that finds flats near Chandigarh University, Panjab University, PGIMER and more — completely free."
              : "No spam calls. No fake listings. AI search finds verified flats near your Mohali or Chandigarh office with commute filters — save ₹15,000–25,000 in brokerage."}
          </p>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              background: "white",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              maxWidth: 620,
            }}
          >
            <div
              style={{
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                flex: 1,
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>📍</span>
              <input
                placeholder={
                  activeTab === "student"
                    ? "Flat near Chandigarh University under ₹12,000..."
                    : "2BHK near IT Park Mohali under ₹20,000..."
                }
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "#111827",
                  background: "transparent",
                  flex: 1,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <Link
              href="/properties"
              style={{
                background: "#4161df",
                color: "white",
                padding: "16px 24px",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              Search with AI →
            </Link>
          </div>

          {/* Institution pills */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                alignSelf: "center",
              }}
            >
              Near:
            </span>
            {INSTITUTIONS.filter((_, i) =>
              activeTab === "student" ? i < 5 : i >= 5,
            ).map((inst) => (
              <span
                key={inst}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 100,
                  padding: "4px 12px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                }}
              >
                {inst}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #f3f4f6",
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          {[
            ["₹0", "Brokerage for Pro Seekers"],
            ["0", "Spam calls ever"],
            ["200+", "Verified listings"],
            ["5", "Tricity cities"],
            ["AI", "Powered search"],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#4161df",
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  marginTop: 3,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOCALITY GUIDE ────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1000,
          margin: "60px auto",
          padding: "0 24px",
        }}
      >
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "#eef1fd",
              color: "#4161df",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: "0.05em",
            }}
          >
            LOCALITY GUIDE
          </div>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 34px)",
              fontWeight: 700,
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Where to live in Tricity
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#6b7280",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Honest breakdown of every major area — average rent, commute time,
            and who it suits best.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {LOCALITIES.map((loc) => (
            <div
              key={loc.name}
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid #f3f4f6",
                padding: "20px 22px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                borderTop: `3px solid ${loc.color}`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: `${loc.color}18`,
                  color: loc.color,
                  borderRadius: 100,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {loc.tag}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "#111827",
                }}
              >
                {loc.name}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Avg 2BHK rent</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    {loc.avg}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Commute</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    {loc.commute}
                  </span>
                </div>
              </div>
              <Link
                href={`/properties?city=${loc.name.split(" ")[0].toLowerCase()}&deal=Rent`}
                style={{
                  display: "block",
                  marginTop: 16,
                  padding: "9px 0",
                  textAlign: "center",
                  background: `${loc.color}12`,
                  color: loc.color,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: `1px solid ${loc.color}30`,
                }}
              >
                Browse {loc.name.split(" ")[0]} listings →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY PROPERTYBULBUL ────────────────────────────── */}
      <section
        style={{
          background: "#f8faff",
          padding: "60px 24px",
          borderTop: "1px solid #eef2ff",
          borderBottom: "1px solid #eef2ff",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "inline-block",
                background: "#eef1fd",
                color: "#4161df",
                borderRadius: 100,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              WHY PROPERTYBULBUL
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 3.5vw, 34px)",
                fontWeight: 700,
                margin: "0 0 10px",
                letterSpacing: "-0.01em",
              }}
            >
              Built for Tricity — not for all of India
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
                maxWidth: 460,
                margin: "0 auto",
              }}
            >
              99acres and NoBroker are national platforms. We are the only
              platform built exclusively for Chandigarh, Mohali, Panchkula,
              Zirakpur and Kharar.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  borderRadius: 16,
                  border: "1px solid #eef2ff",
                  padding: "22px 22px",
                  boxShadow: "0 2px 12px rgba(65,97,223,0.06)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: "#111827",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROKERAGE SAVINGS CALCULATOR ──────────────────── */}
      <section
        style={{ maxWidth: 760, margin: "60px auto", padding: "0 24px" }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f1d40, #4161df)",
            borderRadius: 24,
            padding: "36px 40px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "white",
              opacity: 0.04,
              top: -100,
              right: -80,
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              The brokerage math
            </div>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 700,
                marginBottom: 24,
                lineHeight: 1.3,
              }}
            >
              How much does a broker actually cost you?
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Typical brokerage (1 month rent)",
                  value: "₹15,000–25,000",
                  sub: "Per move",
                },
                {
                  label: "Average moves in 4 years",
                  value: "3–4 times",
                  sub: "Students & IT employees",
                },
                {
                  label: "Total brokerage paid in 4 years",
                  value: "₹60,000–1,00,000",
                  sub: "Complete waste",
                },
                {
                  label: "Pro Seeker cost for 4 years",
                  value: "₹14,400",
                  sub: "₹299/month × 48 months",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "white",
                      marginBottom: 2,
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "14px 18px",
                border: "1px solid rgba(255,255,255,0.2)",
                marginBottom: 20,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              💡 <strong>Net saving with Pro Seeker:</strong> ₹45,600–85,600
              over 4 years. That's a new laptop, a Europe trip, or 3 months
              salary saved.
            </div>
            <Link
              href="/pricing"
              style={{
                display: "inline-block",
                background: "white",
                color: "#1a3270",
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Get Pro Seeker — ₹299/month →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section
        style={{ maxWidth: 800, margin: "60px auto", padding: "0 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-block",
              background: "#eef1fd",
              color: "#4161df",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: "0.05em",
            }}
          >
            HOW IT WORKS
          </div>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Find your flat in 3 steps
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            {
              num: "01",
              title: "Search with AI",
              desc: "Type exactly what you want — area, budget, furnishing, commute distance. Our AI understands plain English and filters perfectly matched properties instantly.",
              icon: "🔍",
              color: "#4161df",
            },
            {
              num: "02",
              title: "Browse verified listings",
              desc: "Every listing is verified as active. See real photos, accurate prices, and honest descriptions. No fake listings. No bait-and-switch.",
              icon: "📋",
              color: "#059669",
            },
            {
              num: "03",
              title: "Connect directly",
              desc: "WhatsApp the agent or landlord directly. No form submissions. No waiting for callbacks. No middleman taking your number and spamming you.",
              icon: "💬",
              color: "#7c3aed",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                gap: 20,
                padding: "24px 0",
                borderBottom: i < 2 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `${step.color}12`,
                  border: `1.5px solid ${step.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: step.color,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  STEP {step.num}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: "#111827",
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65 }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section
        style={{
          background: "white",
          padding: "60px 24px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "inline-block",
                background: "#eef1fd",
                color: "#4161df",
                borderRadius: 100,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              FAQ
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Common questions
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #f3f4f6",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: openFaq === i ? "#f8faff" : "white",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: "#4161df",
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 20px 18px",
                      fontSize: 14,
                      color: "#6b7280",
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f1d40 0%, #4161df 100%)",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 38px)",
              fontWeight: 800,
              color: "white",
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}
          >
            Start searching for free today
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            200+ verified listings across Tricity. AI search that actually
            understands what you need. Zero spam. Zero brokerage for Pro
            members.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/properties?deal=Rent"
              style={{
                background: "white",
                color: "#1a3270",
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              Browse Rentals — Free →
            </Link>
            <Link
              href="/pricing"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              See Pro Seeker Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
