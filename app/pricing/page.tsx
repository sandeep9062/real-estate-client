"use client";
import { useState } from "react";

const plans = {
  seekers: [
    {
      name: "Free Seeker",
      tag: "Students & Job Seekers",
      price: 0,
      period: "forever",
      color: "#4161df",
      highlight: false,
      description:
        "Perfect for students, freshers, and employees relocating to Tricity.",
      features: [
        { text: "Unlimited property search", included: true },
        { text: "AI-powered smart search", included: true },
        { text: "Save up to 5 properties", included: true },
        { text: "View agent contact details", included: true },
        { text: "Download property brochures", included: true },
        { text: "Post 1 requirement", included: true },
        { text: "Email alerts for new listings", included: false },
        { text: "Priority support", included: false },
        { text: "Properties listed by direct landowners", included: false },
        { text: "Zero brokerage properties only", included: false },
      ],
      cta: "Start for Free",
      badge: null,
    },
    {
      name: "Pro Seeker",
      tag: "Serious Buyers & Tenants",
      price: 299,
      period: "month",
      color: "#4161df",
      highlight: true,
      description:
        "For serious buyers and tenants who want the best properties first.",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Unlimited saved properties", included: true },
        { text: "Instant WhatsApp alerts", included: true },
        { text: "Priority listing visibility", included: true },
        { text: "Post unlimited requirements", included: true },
        { text: "AI property comparison tool", included: true },
        { text: "Early access to new listings", included: true },
        {
          text: "Direct landlord contact — no agent middleman",
          included: true,
        },
        { text: "Zero brokerage properties only", included: true },
        { text: "WhatsApp directly to property owner", included: true },
        { text: "Priority support", included: true },

        {
          text: "Filter 'Flat Ready' 48-Hour Guaranteed Move-In Listings",
          included: true,
        },
        {
          text: "Instant WhatsApp Notification Alerts for Price Drops",
          included: true,
        },
      ],
      cta: "Get Pro Access",
      badge: "Most Popular",
    },
  ],
  agents: [
    {
      name: "Starter Agent",
      tag: "New Agents",
      price: 0,
      period: "forever",
      color: "#059669",
      highlight: false,
      description:
        "Get started and prove the platform works for your business.",
      features: [
        { text: "List up to 5 properties", included: true },
        { text: "Basic listing page", included: true },
        { text: "PDF brochure generation", included: true },
        { text: "Direct WhatsApp leads", included: true },
        { text: "Agent profile page", included: false },
        { text: "Featured in search results", included: false },
        { text: "Lead analytics dashboard", included: false },
        { text: "Social media auto-post", included: false },
      ],
      cta: "List for Free",
      badge: null,
    },
    {
      name: "Pro Agent",
      tag: "Active Agents",
      price: 1499,
      period: "month",
      color: "#059669",
      highlight: false,
      description:
        "For agents serious about growing their client base in Tricity.",
      features: [
        { text: "List up to 50 property listings", included: true },
        { text: "Featured in search results", included: true },
        { text: "Professional agent profile", included: true },
        { text: "PDF brochure for every listing", included: true },
        { text: "Lead analytics dashboard", included: true },
        { text: "View count per listing", included: true },
        { text: "Priority listing placement", included: true },
        { text: "Dedicated support", included: true },
      ],
      cta: "Grow My Business",
      badge: null,
    },
    {
      name: "Power Agent",
      tag: "Top Performers",
      price: 3499,
      period: "month",
      color: "#059669",
      highlight: true,
      description:
        "Maximum visibility and automated marketing engine for top performers.",
      features: [
        { text: "Unlimited property listings", included: true },
        { text: "Top of search results & high visibility", included: true },
        { text: "Social media auto-posting (Meta & LinkedIn)", included: true },
        { text: "AI-generated listing descriptions", included: true },
        { text: "Hot lead scoring & immediate alerts", included: true },
        {
          text: "Direct Routing of High-Intent Yield Investors & NRI Leads",
          included: true,
        },
        {
          text: "Priority Placement in Mega-Project (Trident Hills/Omaxe) Landing Pages",
          included: true,
        },
        { text: "Verified Agent trust badge", included: true },
        { text: "Monthly performance report", included: true },
        { text: "1-on-1 growth consultation", included: true },
      ],
      cta: "Become Top Agent",
      badge: "Best Value",
    },
  ],
  landlords: [
    {
      name: "Free Landlord",
      tag: "Individual Owners",
      price: 0,
      period: "forever",
      color: "#d97706",
      highlight: false,
      description:
        "List your property and find genuine tenants or buyers directly.",
      features: [
        { text: "List up to 3 properties", included: true },
        { text: "Direct tenant/buyer contact", included: true },
        { text: "PDF brochure download", included: true },
        { text: "Basic listing page", included: true },
        { text: "Featured placement", included: false },
        { text: "Tenant screening tools", included: false },
        { text: "Rent agreement builder", included: false },
        { text: "Analytics dashboard", included: false },
      ],
      cta: "List My Property",
      badge: null,
    },
    {
      name: "Pro Landlord",
      tag: "Multiple Property Owners",
      price: 599,
      period: "month",
      color: "#d97706",
      highlight: true,
      description:
        "For landlords with multiple properties who want fast, genuine leads.",
      features: [
        { text: "Unlimited property listings", included: true },
        { text: "Featured in search results", included: true },
        { text: "PDF brochure generation", included: true },
        { text: "Verified Landlord badge", included: true },
        { text: "Lead analytics & view counts", included: true },
        { text: "Rent agreement builder access", included: true },
        { text: "WhatsApp lead alerts", included: true }, // Pro Landlord features validation:
        {
          text: "Zero-Call Privacy Shield (Force WhatsApp Seeker Screening)",
          included: true,
        },
        {
          text: "Automated Monthly Rent Tracker Ledger & WhatsApp Reminders",
          included: true,
        },
        {
          text: "One-Click Standard Digital Lease Agreement Framework",
          included: true,
        }, // Substituted generic secure placeholder
        { text: "Priority support", included: true },
      ],
      cta: "Manage My Properties",
      badge: "Best Value",
    },
  ],
} as const;

const tabs = [
  { key: "seekers", label: "Students & Employees", emoji: "🎓" },
  { key: "agents", label: "Agents", emoji: "🤝" },
  { key: "landlords", label: "Landlords", emoji: "🏠" },
] as const;

const colorMap = {
  "#4161df": { bg: "#eef1fd", border: "#c7d0f9", badge: "#4161df" },
  "#059669": { bg: "#ecfdf5", border: "#a7f3d0", badge: "#059669" },
  "#d97706": { bg: "#fffbeb", border: "#fde68a", badge: "#d97706" },
} as const;

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof plans>("agents");

  const currentPlans = plans[activeTab];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "0 0 80px",
      }}
    >
      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 480px !important;
          }
          .pricing-card-highlight {
            transform: none !important;
          }
          .pricing-header {
            padding: 48px 20px 64px !important;
          }
          .pricing-badge-tag {
            font-size: 11px !important;
            padding: 5px 14px !important;
          }
          .pricing-tab-btn {
            padding: 10px 18px !important;
            font-size: 13px !important;
          }
          .pricing-bottom-banner {
            border-radius: 16px !important;
            padding: 16px 20px !important;
            gap: 14px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          .pricing-header {
            padding: 40px 16px 56px !important;
          }
          .pricing-header h1 {
            font-size: 24px !important;
          }
          .pricing-header p {
            font-size: 14px !important;
          }
          .pricing-grid {
            padding: 0 16px !important;
            margin-top: 36px !important;
          }
          .pricing-tab-btn {
            padding: 8px 14px !important;
            font-size: 12px !important;
          }
          .pricing-card-header {
            padding: 20px 20px 18px !important;
          }
          .pricing-card-body {
            padding: 18px 20px !important;
          }
          .pricing-card-price {
            font-size: 30px !important;
          }
          .pricing-feature-text {
            font-size: 12px !important;
          }
          .pricing-cta-btn {
            font-size: 13px !important;
            padding: 12px 16px !important;
          }
          .pricing-badge-tag {
            font-size: 10px !important;
            padding: 4px 10px !important;
          }
          .pricing-bottom-banner {
            padding: 14px 16px !important;
            gap: 12px !important;
          }
          .pricing-usps {
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          .pricing-tabs-wrap {
            gap: 6px !important;
            padding: 0 16px !important;
            margin-top: -24px !important;
          }
          .pricing-deco-circle {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="pricing-header"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #4161df 100%)",
          padding: "64px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        {[
          { size: 300, top: -100, left: -80, op: 0.06 },
          { size: 200, top: 20, right: -60, op: 0.08 },
          { size: 150, bottom: -60, left: "40%", op: 0.05 },
        ].map((c, i) => (
          <div
            key={i}
            className={c.size >= 200 ? "" : "pricing-deco-circle"}
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

        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 100,
            padding: "6px 18px",
            fontSize: 12,
            fontFamily: "'Arial', sans-serif",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.9)",
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          Simple, Transparent Pricing
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            color: "white",
            margin: "0 0 16px",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          Grow with PropertyBulbul
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
            fontFamily: "'Arial', sans-serif",
            fontStyle: "italic",
          }}
        >
          Tricity's AI-powered real estate platform. Free to start, powerful
          when you grow.
        </p>
      </div>

      {/* Tab Switcher */}
      <div
        className="pricing-tabs-wrap"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          marginTop: -28,
          gap: 8,
          flexWrap: "wrap",
          position: "relative",
          zIndex: 10,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className="pricing-tab-btn"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "12px 24px",
              borderRadius: 100,
              border:
                activeTab === tab.key
                  ? "2px solid transparent"
                  : "2px solid #e5e7eb",
              background: activeTab === tab.key ? "#4161df" : "white",
              color: activeTab === tab.key ? "white" : "#374151",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Arial', sans-serif",
              cursor: "pointer",
              boxShadow:
                activeTab === tab.key
                  ? "0 4px 20px rgba(65,97,223,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div
        className="pricing-grid"
        style={{
          maxWidth: 1100,
          margin: "48px auto 0",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: `repeat(${currentPlans.length}, 1fr)`,
          gap: 20,
        }}
      >
        {currentPlans.map((plan) => {
          const colors = colorMap[plan.color];
          return (
            <div
              key={plan.name}
              className={plan.highlight ? "pricing-card-highlight" : ""}
              style={{
                background: "white",
                borderRadius: 20,
                border: plan.highlight
                  ? `2px solid ${plan.color}`
                  : "2px solid #f3f4f6",
                boxShadow: plan.highlight
                  ? `0 8px 40px ${plan.color}22`
                  : "0 2px 16px rgba(0,0,0,0.06)",
                overflow: "hidden",
                position: "relative",
                transform: plan.highlight ? "translateY(-8px)" : "none",
                transition: "transform 0.2s ease",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="pricing-badge-tag"
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: plan.color,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'Arial', sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 100,
                  }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div
                className="pricing-card-header"
                style={{
                  padding: "28px 28px 24px",
                  background: plan.highlight ? `${plan.color}08` : "white",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div
                  className="pricing-badge-tag"
                  style={{
                    display: "inline-block",
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 100,
                    padding: "3px 12px",
                    fontSize: 11,
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 600,
                    color: plan.color,
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {plan.tag}
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  {plan.name}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontFamily: "'Arial', sans-serif",
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}
                >
                  {plan.description}
                </div>

                {/* Price */}
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                >
                  {plan.price === 0 ? (
                    <span
                      className="pricing-card-price"
                      style={{
                        fontSize: 38,
                        fontWeight: 700,
                        color: plan.color,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Free
                    </span>
                  ) : (
                    <>
                      <span
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          fontFamily: "'Arial', sans-serif",
                          marginBottom: 4,
                        }}
                      >
                        ₹
                      </span>
                      <span
                        className="pricing-card-price"
                        style={{
                          fontSize: 38,
                          fontWeight: 700,
                          color: plan.color,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {plan.price.toLocaleString("en-IN")}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#9ca3af",
                          fontFamily: "'Arial', sans-serif",
                        }}
                      >
                        /{plan.period}
                      </span>
                    </>
                  )}
                </div>

                {plan.price > 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      fontFamily: "'Arial', sans-serif",
                      marginTop: 4,
                    }}
                  >
                    Billed monthly · Cancel anytime
                  </div>
                )}
              </div>

              {/* Features */}
              <div
                className="pricing-card-body"
                style={{ padding: "24px 28px" }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'Arial', sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    marginBottom: 14,
                  }}
                >
                  What's included
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {plan.features.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        opacity: f.included ? 1 : 0.4,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: f.included
                            ? `${plan.color}18`
                            : "#f3f4f6",
                          border: f.included
                            ? `1.5px solid ${plan.color}40`
                            : "1.5px solid #e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {f.included ? (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path
                              d="M2 5l2 2 4-4"
                              stroke={plan.color}
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 8 8">
                            <path
                              d="M2 2l4 4M6 2l-4 4"
                              stroke="#9ca3af"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className="pricing-feature-text"
                        style={{
                          fontSize: 13,
                          fontFamily: "'Arial', sans-serif",
                          color: f.included ? "#374151" : "#9ca3af",
                          lineHeight: 1.4,
                        }}
                      >
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className="pricing-cta-btn"
                  style={{
                    width: "100%",
                    marginTop: 28,
                    padding: "14px 20px",
                    borderRadius: 12,
                    border: plan.highlight
                      ? "none"
                      : `1.5px solid ${plan.color}`,
                    background: plan.highlight ? plan.color : "transparent",
                    color: plan.highlight ? "white" : plan.color,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Arial', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                    boxShadow: plan.highlight
                      ? `0 4px 16px ${plan.color}40`
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {plan.cta} →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div
        style={{
          textAlign: "center",
          marginTop: 60,
          padding: "0 24px",
        }}
      >
        <div
          className="pricing-bottom-banner"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 100,
            padding: "14px 32px",
            flexWrap: "wrap",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {[
            { icon: "🔒", text: "No credit card required" },
            { icon: "✅", text: "Cancel anytime" },
            { icon: "💬", text: "WhatsApp support" },
            { icon: "🏠", text: "Tricity-focused" },
          ].map((item, i) => (
            <div
              key={i}
              className="pricing-usps"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#374151",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "#9ca3af",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          Questions? WhatsApp us or email{" "}
          <a
            href="mailto:bulbulproperty@gmail.com"
            style={{
              color: "#4161df",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            bulbulproperty@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
