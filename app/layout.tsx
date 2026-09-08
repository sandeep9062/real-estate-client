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
  metadataBase: new URL("https://www.propertybulbul.com"),
  title: {
    default: "PropertyBulbul - Tricity's Most Helpful Real Estate Partner",
    template: "%s | PropertyBulbul",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  },

  description:
    "Search for properties to buy or rent. Find apartments, houses, and commercial properties on Propertybulbul, your trusted real estate partner.",
  openGraph: {
    title: "PropertyBulbul - Tricity's Most Helpful Real Estate Partner",
    description:
      "Search for properties to buy or rent. Find apartments, houses, and commercial properties on Propertybulbul, your trusted real estate partner.",
    url: "https://www.propertybulbul.com",
    siteName: "PropertyBulbul",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
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
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
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
    canonical: "https://www.propertybulbul.com",
  },
};

// Root Structured Data Component
function RootStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "PropertyBulbul",
    url: "https://www.propertybulbul.com",
    logo: "https://www.propertybulbul.com/propertybulbul.png",
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
              {/* <Toaster
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
              /> */}
              //new toaster design
              <Toaster
                richColors
                closeButton
                position="top-right"
                expand={false}
                duration={3500}
                style={
                  { zIndex: 9999, "--width": "320px" } as React.CSSProperties
                }
                toastOptions={{
                  style: {
                    background: "#ffffff",
                    border: "1px solid rgba(22, 26, 46, 0.08)",
                    boxShadow:
                      "0 4px 12px -2px rgba(22, 26, 46, 0.12), 0 2px 4px -2px rgba(22, 26, 46, 0.06)",
                  },
                  className: "rounded-lg py-3 px-3.5 border-l-[3px]",
                  classNames: {
                    toast: "group",
                    title:
                      "text-[13px] font-semibold tracking-tight text-[#161A2E]",
                    description:
                      "text-[12px] text-[#5C5F73] mt-0.5 leading-snug",
                    actionButton:
                      "!bg-[#4161df] !text-white rounded-md px-3 py-1 text-[11px] font-semibold hover:!bg-[#3451c7] transition-colors",
                    cancelButton:
                      "!bg-[#F1F2F6] !text-[#161A2E] rounded-md px-3 py-1 text-[11px] font-semibold hover:!bg-[#E5E7F2] transition-colors",
                    success:
                      "!bg-white !text-emerald-700 !border-l-emerald-500",
                    error: "!bg-white !text-rose-700 !border-l-rose-500",
                    info: "!bg-white !text-[#2b3f9e] !border-l-[#4161df]",
                    warning: "!bg-white !text-amber-700 !border-l-amber-500",
                  },
                }}
              />
              {children}
            </LayoutWrapper>
          </RouteTransitionWrapper>
        </Providers>
      </body>
    </html>
  );
}
