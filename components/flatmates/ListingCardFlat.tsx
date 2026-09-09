import Link from "next/link";
import { Users, Home, ArrowRight } from "lucide-react";
import type { RoomFlat } from "@/services/roommatesApi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BORDER = "#E5E7F2";
const TINT_BG = "#EEF1FC";

interface PropertyListing {
  _id?: string;
  id?: string;
  title?: string;
  price?: number;
  location?: { city?: string; [key: string]: any };
  [key: string]: any;
}

interface ListingCardProps {
  source: "room_flat" | "property";
  // room_flat cards receive a RoomFlat; "property" cards receive a plain
  // property listing with a different shape.
  listing: RoomFlat | PropertyListing;
}

export default function ListingCardFlat({ source, listing }: ListingCardProps) {
  if (source === "room_flat") {
    const profile = listing.roommateProfile;
    return (
      <div className="rounded-2xl border bg-white p-5 transition-colors hover:border-[#4161df]/30" style={{ borderColor: BORDER }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
            >
              <Users className="h-4 w-4" />
            </span>
            <h3 className="font-semibold leading-snug" style={{ color: INK }}>{listing.title}</h3>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: TINT_BG, color: "#2b3f9e" }}
          >
            Matched
          </span>
        </div>

        <p className="mt-3 text-sm font-semibold" style={{ color: INK }}>
          ₹{listing.rentAmount?.toLocaleString()}
          <span className="font-normal" style={{ color: INK_SOFT }}>/mo · {listing.location?.city}</span>
        </p>

        {profile && (
          <p className="mt-1.5 text-sm" style={{ color: INK_SOFT }}>
            {[
              profile.occupation && humanize(profile.occupation),
              profile.habits?.smoking && `Smoking: ${profile.habits.smoking}`,
              profile.habits?.foodPreference && humanize(profile.habits.foodPreference),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        <Link
          href={`/flatmates/profile/${profile?._id || listing.roommateProfile}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: BRAND }}
        >
          View profile
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // source === "property" — a plain rent listing with allowsSubletting: true, no profile behind it
  const property = listing as PropertyListing;
  return (
    <div className="rounded-2xl border bg-white p-5 transition-colors hover:border-[#4161df]/30" style={{ borderColor: BORDER }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ border: "1.5px solid #B9782F", color: "#B9782F" }}
          >
            <Home className="h-4 w-4" />
          </span>
          <h3 className="font-semibold leading-snug" style={{ color: INK }}>{property.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          Owner allows sharing
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold" style={{ color: INK }}>
        ₹{property.price?.toLocaleString()}
        <span className="font-normal" style={{ color: INK_SOFT }}>/mo · {property.location?.city}</span>
      </p>

      <p className="mt-1.5 text-sm" style={{ color: "#9CA3AF" }}>
        No roommate profile attached — contact the owner directly to ask about sharing.
      </p>

        <Link
          href={`/properties/${property._id || property.id}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: BRAND }}
        >
          View listing
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
    </div>
  );
}

function humanize(str: string) {
  return str.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}