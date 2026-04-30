import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { Providers } from "./providers";
import RouteTransitionWrapper from "@/components/RouteTransitionWrapper";
import { Toaster } from "sonner";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://propertybulbul.com"),
  title: {
    default: "PropertyBulbul - Tricity's Most Helpful Real Estate Partner",
    template: "%s | Propertybulbul",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  },

  description:
    "Search for properties to buy or rent. Find apartments, houses, and commercial properties on Propertybulbul, your trusted real estate partner.",
  keywords: [
    "real estate",
    "bulbul property",
    "bulbul properties",
    "property bulbul",
    "buy property",
    "rent property",
    "dream home",
    "properties in tricity",
    "house",
    "showroom for sale",
    "houses",
    "shop for sale in panchkula",
    "shop",
    "flat",
    "kothi for sale in chandigarh",
    "farm house",
    "villa",
    "room for students",
    "plot",
    "agriculture land",
    "property",
    "apartments",
    "chandigarh",
    "panchkula",
    "mohali",
    "peermuchala",
    "zirakpur",
    "morni hills",
    "room in chandigarh",
    "property in chandigarh",
    "commercial real estate",
    "property in morni hills",
    "house for sale in chandigarh",
    "house for sale in mohali",
    "house for sale in panchkula",
    "room for rent in chandigarh ",
    "room for rent in mohali",
    "room for rent in panchkula",
    "showrooms for sale in panchkula",
    "showrooms for sale in zirakpur",
    "apartment for sale in zirakpur",
    "showrooms for sale in peermuchala",
  ],
  openGraph: {
    title: "PropertyBulbul - Tricity's Most Helpful Real Estate Partner",
    description:
      "Search for properties to buy or rent. Find apartments, houses, and commercial properties on Propertybulbul, your trusted real estate partner.",
    url: "https://propertybulbul.com",
    siteName: "Propertybulbul",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyBulbul - Tricity Real Estate",
    description:
      "Buy, sell & rent properties in Chandigarh, Mohali & Panchkula.",
    images: ["https://propertybulbul.com/property-tricity.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false, // check it if required or not
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://propertybulbul.com",
  },
};

// Root Structured Data Component
function RootStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "PropertyBulbul",
    url: "https://propertybulbul.com",
    logo: "https://propertybulbul.com/propertybulbul.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 15",
      addressLocality: "Chandigarh",
      addressRegion: "CH",
      postalCode: "160001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.7333,
      longitude: 76.7794,
    },
    areaServed: ["Chandigarh", "Mohali", "Panchkula"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-97299-07448",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="preload" href="/real-estate-login.jpg" as="image" />
      </head>
      <body className="antialiased">
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <RootStructuredData />
        <Providers>
          <RouteTransitionWrapper>
            <LayoutWrapper>
              <Toaster
                richColors
                closeButton
                position="top-right"
                expand={false} // Keeps it clean, stacked look
                duration={3000}
                toastOptions={{
                  // Main container styling
                  style: {
                    background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  },
                  // Tailwind class overrides
                  className: "rounded-2xl p-4 border border-white/50",
                  classNames: {
                    toast: "group", // Allows child element targeting
                    title:
                      "text-[14px] font-bold tracking-tight text-slate-900",
                    description: "text-[12px] text-slate-500 font-medium",
                    actionButton:
                      "bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold",
                    cancelButton:
                      "bg-slate-100 text-slate-900 rounded-lg px-3 py-1 text-xs font-bold",
                    // Status-specific color tweaks for better accessibility
                    success:
                      "!bg-emerald-50/80 !text-emerald-700 !border-emerald-200/50",
                    error: "!bg-rose-50/80 !text-rose-700 !border-rose-200/50",
                    info: "!bg-blue-50/80 !text-blue-700 !border-blue-200/50",
                    warning:
                      "!bg-amber-50/80 !text-amber-700 !border-amber-200/50",
                  },
                }}
                style={{ zIndex: 9999 }}
              />
              {children}
            </LayoutWrapper>
          </RouteTransitionWrapper>
        </Providers>
      </body>
    </html>
  );
}
