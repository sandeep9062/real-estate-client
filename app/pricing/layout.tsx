import { Metadata } from "next";

export const metadata: Metadata = {
  // Root layout already applies the "%s | PropertyBulbul" title template
  title: "Pricing & Plans - Simple, Transparent Pricing",
  description:
    "Compare PropertyBulbul plans for property seekers, agents, and landlords in Tricity. Start free, then upgrade to Pro from ₹299/month for unlimited listings, featured placement, WhatsApp lead alerts, and zero-brokerage access. No credit card required.",
  openGraph: {
    title:
      "Pricing & Plans - PropertyBulbul | Free to Start, Pro When You Grow",
    description:
      "Simple, transparent pricing for Tricity's AI-powered real estate platform. Free plans for seekers, agents & landlords — upgrade anytime for more visibility and leads.",
    url: "https://www.propertybulbul.com/pricing",
    siteName: "PropertyBulbul",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Pricing Plans - Seeker, Agent & Landlord Plans in Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pricing & Plans - PropertyBulbul | Free to Start, Pro When You Grow",
    description:
      "Free and Pro plans for property seekers, agents & landlords in Chandigarh, Mohali & Panchkula. Transparent pricing, no credit card required.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/pricing",
  },
};

const PRICING_URL = "https://www.propertybulbul.com/pricing";

const publisher = {
  "@type": "Organization",
  name: "PropertyBulbul",
  url: "https://www.propertybulbul.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.propertybulbul.com/propertybulbul.png",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-97299-07448",
    email: "bulbulproperty@gmail.com",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

// Mirrors the plans rendered by ./page.tsx (seeker, agent & landlord tabs)
const plans = [
  {
    name: "Free Seeker",
    price: 0,
    billingPeriod: null,
    description:
      "Free forever plan for students, freshers, and employees relocating to Tricity: unlimited property search, AI-powered smart search, save up to 5 properties, and view agent contact details.",
  },
  {
    name: "Pro Seeker",
    price: 299,
    billingPeriod: "P1M",
    description:
      "Plan for serious buyers and tenants: unlimited saved properties, instant WhatsApp alerts, early access to new listings, direct landlord contact, and zero-brokerage properties.",
  },
  {
    name: "Starter Agent",
    price: 0,
    billingPeriod: null,
    description:
      "Free forever plan for new agents: list up to 5 properties, basic listing page, PDF brochure generation, and direct WhatsApp leads.",
  },
  {
    name: "Pro Agent",
    price: 1499,
    billingPeriod: "P1M",
    description:
      "Plan for active agents: list up to 50 properties, featured in search results, professional agent profile, lead analytics dashboard, priority placement, and dedicated support.",
  },
  {
    name: "Power Agent",
    price: 3499,
    billingPeriod: "P1M",
    description:
      "Plan for top performers: unlimited listings, top of search results, social media auto-posting, AI-generated listing descriptions, hot lead scoring, and direct routing of high-intent NRI leads.",
  },
  {
    name: "Free Landlord",
    price: 0,
    billingPeriod: null,
    description:
      "Free forever plan for individual owners: list up to 3 properties, direct tenant/buyer contact, PDF brochure download, and a basic listing page.",
  },
  {
    name: "Pro Landlord",
    price: 599,
    billingPeriod: "P1M",
    description:
      "Plan for multiple property owners: unlimited listings, featured placement, verified landlord badge, lead analytics, rent agreement builder, and WhatsApp lead alerts.",
  },
];

// Pricing Page Structured Data Component
function PricingStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pricing & Plans - PropertyBulbul",
    description:
      "Simple, transparent pricing for PropertyBulbul - Tricity's AI-powered real estate platform. Free plans for property seekers, agents, and landlords, with Pro plans from ₹299/month.",
    url: PRICING_URL,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "PropertyBulbul",
      url: "https://www.propertybulbul.com",
    },
    publisher,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.propertybulbul.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: PRICING_URL,
        },
      ],
    },
    mainEntity: {
      "@type": "OfferCatalog",
      name: "PropertyBulbul Pricing Plans",
      itemListElement: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
        price: String(plan.price),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: PRICING_URL,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(plan.price),
          priceCurrency: "INR",
          billingDuration: plan.billingPeriod ?? undefined,
        },
        itemOffered: {
          "@type": "Service",
          name: `${plan.name} Plan`,
          description: plan.description,
          serviceType: "Real estate platform subscription",
          provider: publisher,
        },
      })),
    },
  };

  return (
    <script
      id="pricing-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingStructuredData />
      {children}
    </>
  );
}

