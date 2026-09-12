import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// One-off redirects that can't go in next.config.js because the source
// path contains characters (like ":") that path-to-regexp misinterprets
// as route-parameter syntax. Matched here against the raw, decoded
// pathname instead, so special characters are treated literally.
const RAW_PATH_REDIRECTS: Record<string, string> = {
  "/journal/the-tricity-real-estate-disruption:-why-propertybulbul-is-leaving-legacy-portals-far-behind":
    "/about-us",
};

export function middleware(request: NextRequest) {
  // Crawlers/browsers may send the colon either literally or percent-encoded
  // (%3A) — decode first so both forms match the same lookup key.
  let pathname: string;
  try {
    pathname = decodeURIComponent(request.nextUrl.pathname);
  } catch {
    pathname = request.nextUrl.pathname;
  }

  const destination = RAW_PATH_REDIRECTS[pathname];
  if (destination) {
    const url = new URL(destination, request.url);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Only run this middleware for journal routes — no need to pay the
// middleware cost on every request across the whole site.
export const config = {
  matcher: "/journal/:path*",
};
