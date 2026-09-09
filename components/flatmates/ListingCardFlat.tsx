import Link from "next/link";
import type { RoomFlat } from "@/services/roommatesApi";

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
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-slate-900">{listing.title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            Matched listing
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          ₹{listing.rentAmount?.toLocaleString()}/mo · {listing.location?.city}
        </p>
        {profile && (
          <p className="mt-2 text-sm text-slate-700">
            {profile.occupation && humanize(profile.occupation)}
            {profile.habits?.smoking && ` · Smoking: ${profile.habits.smoking}`}
            {profile.habits?.foodPreference &&
              ` · ${humanize(profile.habits.foodPreference)}`}
          </p>
        )}
        <Link
          href={`/flatmates/profile/${profile?._id || listing.roommateProfile}`}
          className="mt-3 inline-block text-sm font-medium text-slate-900 underline underline-offset-2"
        >
          View profile
        </Link>
      </div>
    );
  }

  // source === "property" — a plain rent listing with allowsSubletting: true, no profile behind it
  const property = listing as PropertyListing;
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-slate-900">{property.title}</h3>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
          Owner allows sharing
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        ₹{property.price?.toLocaleString()}/mo · {property.location?.city}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        No roommate profile attached — contact the owner directly to ask about
        sharing.
      </p>
      <a
        href={`/properties/${property._id || property.id}`}
        className="mt-3 inline-block text-sm font-medium text-slate-900 underline underline-offset-2"
      >
        View listing
      </a>
    </div>
  );
}

function humanize(str: string) {
  return str.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
