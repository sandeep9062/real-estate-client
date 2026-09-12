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
