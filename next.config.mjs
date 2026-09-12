const nextConfig = {
  // Enforce strict no-trailing-slash policy to prevent Google Search Console redirect errors
  trailingSlash: false,

  // 1. Permanent Redirect (non-www to www)
  async redirects() {
    return [
      {
        source: "/agent-dashbaord",
        destination: "/agent-dashboard",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "propertybulbul.com",
          },
        ],
        destination: "https://www.propertybulbul.com/:path*",
        permanent: true, // 301 Redirect: Google ko batayega ki 'www' hi asli version hai
      },

      // changed these url redirect of Journal posts for better SEO
      // --- Zero-brokerage cluster: merge into the most comprehensive one ---
      {
        source:
          "/journal/no-brokerage-renting-guide-bypassing-high-fees-in-chandigarh-tricity",
        destination:
          "/journal/tricity-rental-secrets-how-to-find-zero-brokerage-flats-pgs-chandigarh-mohali-zirakpur-kharar",
        permanent: true,
      },
      {
        source:
          "/journal/the-zero-brokerage-blueprint-find-owner-properties-in-tricity",
        destination:
          "/journal/tricity-rental-secrets-how-to-find-zero-brokerage-flats-pgs-chandigarh-mohali-zirakpur-kharar",
        permanent: true,
      },
      {
        source:
          "/journal/the-death-of-brokerage-how-modern-tech-is-cleaning-up-tricity-s-real-estate-game",
        destination:
          "/journal/tricity-rental-secrets-how-to-find-zero-brokerage-flats-pgs-chandigarh-mohali-zirakpur-kharar",
        permanent: true,
      },

      // --- Pure brand-vanity posts: fold into About/Services, not Journal ---
      {
        source:
          "/journal/why-propertybulbul-is-the-best-real-estate-platform-in-tricity-2026",
        destination: "/about-us",
        permanent: true,
      },
      {
        source:
          "/journal/how-propertybulbul-is-transforming-real-estate-in-tricity-2026-saas-features",
        destination: "/services",
        permanent: true,
      },
      {
        source:
          "/journal/propertybulbul-saas-features-automation-services-for-real-estate-2026",
        destination: "/services",
        permanent: true,
      },
      {
        source:
          "/journal/the-tech-behind-fast-property-search-propertybulbul-2026",
        destination: "/services",
        permanent: true,
      },
      {
        source:
          "/journal/the-trust-engine-how-propertybulbul-strict-verification-standards-are-eliminating-real-estate-fraud-in-tricity",
        destination: "/about-us",
        permanent: true,
      },

      // NOTE: The colon-slug redirect ("the-tricity-real-estate-disruption:-why...")
      // is intentionally NOT here. next.config.js redirects are parsed by
      // path-to-regexp, which treats ":" as the start of a named route
      // parameter (e.g. /:slug) even when escaped as "\:" — so it does not
      // match reliably across Next.js versions. That one redirect is handled
      // in middleware.ts instead, which compares the raw pathname directly.

      // --- Product how-to, belongs in FAQ/Help, not Journal ---
      {
        source:
          "/journal/how-to-search-best-properties-on-propertybulbul-platform",
        destination: "/faq",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "real-estate-server-6pzl.onrender.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },
  experimental: {
    optimizePackageImports: [
      "lodash",
      "react-icons",
      "framer-motion",
      "@mantine/core",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Proxy API requests to the Render backend in production
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://real-estate-server-6pzl.onrender.com/api";

    // Only add rewrites if we're proxying through the frontend domain
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
