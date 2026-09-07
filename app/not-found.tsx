import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home, Search } from "lucide-react";
import NotFoundBackButton from "./NotFoundBackButton";

export const metadata: Metadata = {
  title: "Page Not Found | PropertyBulbul",
  description:
    "The page you're looking for doesn't exist. Browse properties for sale and rent in Chandigarh, Panchkula, and Mohali on PropertyBulbul.",
  robots: {
    index: false,
    follow: true,
  },
};

const popularLinks = [
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "/about-us" },
  { label: "Journal", href: "/journal" },
  { label: "Contact Us", href: "/contact" },
  { label: "Services", href: "/services" },
];

export default function NotFound() {
  return (
    // Sky-toned page background matches the photo's own sky, so any
    // letterboxing on narrow screens blends in instead of showing a dark bar.
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      {/* --- Artwork ---------------------------------------------------- */}
      {/* The illustration already contains the "404 / address doesn't
          exist" headline (top-right) and the subject (center-left). On
          narrow screens `cover` would crop that text away, so we scale the
          art down to fit instead, and only switch to a cropped, edge-to-edge
          `cover` treatment once there's enough width to keep everything
          in frame. */}
      <div className="absolute inset-0 flex items-start justify-center pt-6 sm:pt-10 md:hidden">
        <div className="relative w-[94%] aspect-[16/9] rounded-2xl overflow-hidden shadow-xl shadow-black/10 ring-1 ring-black/5">
          <Image
            src="/404-image.png"
            alt="404 - this address doesn't exist"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="hidden md:block absolute inset-0">
        <Image
          src="/404-image.png"
          alt="404 - this address doesn't exist"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
      </div>

      {/* Scrim confined to the bottom band only, so the photo and its
          headline stay bright and untouched; darkening exists purely to
          keep the button text legible over grass/path. */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] md:h-[38%] bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent" />

      {/* --- Content ------------------------------------------------------ */}
      <div className="relative min-h-screen flex flex-col justify-end px-4 pb-8 sm:pb-12">
        <div className="max-w-xl w-full mx-auto text-center">
          <p className="text-white/90 text-sm sm:text-base font-medium max-w-md mx-auto drop-shadow-sm">
            No listing at this address — but there are plenty a click away.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-[#4161df] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4161df]/90 active:scale-[0.98] transition-all shadow-lg shadow-black/30"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/20 active:scale-[0.98] backdrop-blur-md transition-all"
            >
              <Search size={18} />
              Browse Properties
            </Link>
          </div>

          <div className="mt-4">
            <NotFoundBackButton />
          </div>

          <div className="mt-8 pt-5 border-t border-white/15">
            <p className="text-xs uppercase tracking-wide text-slate-300 mb-3">
              Popular Pages
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {popularLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-100 hover:text-white bg-white/10 px-4 py-1.5 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
