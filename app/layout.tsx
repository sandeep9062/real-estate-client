import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "@mantine/core/styles.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import RouteTransitionWrapper from "@/components/RouteTransitionWrapper";
import { Toaster } from "sonner";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import MortgageCalculator from "@/components/Calculator";
import ClientChatBotWrapper from "@/components/ClientChatBotWrapper";

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
    nocache: false,// check it if required or not
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
        <RootStructuredData />
        <Providers>
          <RouteTransitionWrapper>
            <Header />
            <Toaster
              richColors
              closeButton
              duration={2500}
              toastOptions={{
                className:
                  "backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 w-full md:w-auto",
                classNames: {
                  title: "text-[15px] font-semibold",
                  description: "text-sm text-neutral-400",
                  success: "bg-emerald-500/20 text-emerald-400",
                  error: "bg-red-500/20 text-red-400",
                  warning: "bg-yellow-500/20 text-yellow-500",
                  info: "bg-blue-500/20 text-blue-400",
                },
              }}
              style={{ zIndex: 9999 }}
            />
            {children}
            <SocialMediaLinks />
            <Footer />
            <ScrollToTopButton />
            {/* <MortgageCalculator /> */}
            <ClientChatBotWrapper />
          </RouteTransitionWrapper>
        </Providers>
      </body>
    </html>
  );
}
