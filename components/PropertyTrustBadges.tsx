"use client";

import { FiCheckCircle, FiShield } from "react-icons/fi";
import { FaHome, FaUserTie, FaHardHat } from "react-icons/fa";

export function PropertyTrustBadges({
  property,
  compact = false,
}: {
  property: {
    reraNumber?: string;
    isVerified?: boolean;
    bulbulVerified?: boolean;
    ownerVerified?: boolean;
    visitVerified?: boolean;
  };
  compact?: boolean;
}) {
  const items: {
    key: string;
    label: string;
    icon: React.ReactNode;
    className: string;
  }[] = [];

  if (property.bulbulVerified) {
    items.push({
      key: "bulbul",
      label: "Bulbul verified",
      icon: <FiShield className="text-[#4161df]" size={compact ? 12 : 14} />,
      className: "bg-[#4161df]/10 text-[#4161df] border-[#4161df]/25",
    });
  }
  if (property.ownerVerified) {
    items.push({
      key: "owner",
      label: "Owner verified",
      icon: <FaHome className="text-emerald-700" size={compact ? 12 : 14} />,
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    });
  }
  if (property.visitVerified) {
    items.push({
      key: "visit",
      label: "Visit verified",
      icon: (
        <FiCheckCircle className="text-violet-700" size={compact ? 12 : 14} />
      ),
      className: "bg-violet-50 text-violet-800 border-violet-200",
    });
  }
  if (property.reraNumber) {
    items.push({
      key: "rera",
      label: `RERA ${property.reraNumber}`,
      icon: <span className="text-[10px] font-black">R</span>,
      className: "bg-slate-900 text-white border-slate-800",
    });
  }
  if (property.isVerified && !property.bulbulVerified) {
    items.push({
      key: "legacy",
      label: "Verified",
      icon: (
        <FiCheckCircle className="text-blue-600" size={compact ? 12 : 14} />
      ),
      className: "bg-blue-50 text-blue-800 border-blue-200",
    });
  }

  if (!items.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "max-w-full" : ""}`}>
      {items.map((b) => (
        <span
          key={b.key}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${b.className}`}
          title={b.label}
        >
          {b.icon}
          {!compact && (
            <span className="truncate max-w-[140px]">{b.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ListingAvailabilityPill({
  listingAvailability,
}: {
  listingAvailability?: string;
}) {
  const v = listingAvailability || "Available";
  const styles: Record<string, string> = {
    Available: "bg-slate-100 text-slate-700 border-slate-200",
    Fresh: "bg-lime-50 text-lime-900 border-lime-200",
    "Under offer": "bg-amber-50 text-amber-900 border-amber-200",
    Booked: "bg-rose-50 text-rose-800 border-rose-200",
    "Review Required": "bg-yellow-100 text-yellow-900 border-yellow-400",
  };
  const labels: Record<string, string> = {
    Available: "Available",
    Fresh: "Fresh listing",
    "Under offer": "Under offer",
    Booked: "Booked / hold",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[v] || styles.Available}`}
    >
      {labels[v] || v}
    </span>
  );
}

/**
 * Tag showing who listed the property: "Agent listed" | "Owner listed" | "Builder listed".
 *
 * The listing user's role is the most reliable source (agent → Agent, landlord/user → Owner,
 * builder → Builder). When that isn't available (e.g. admin-created listings), we fall back
 * to the property's `postedBy` field (Owner | Agent | Builder).
 */
export function ListingPostedByTag({
  postedBy,
  userRole,
}: {
  postedBy?: string;
  userRole?: string;
}) {
  const role = (userRole || "").trim().toLowerCase();
  const rawPostedBy = (postedBy || "").trim().toLowerCase();

  let source: string;
  if (
    role === "agent" ||
    role === "landlord" ||
    role === "builder" ||
    role === "user"
  ) {
    // "user" = individual listing without a chosen role yet → they are the Owner.
    source = role === "landlord" || role === "user" ? "owner" : role;
  } else if (
    rawPostedBy === "owner" ||
    rawPostedBy === "agent" ||
    rawPostedBy === "builder"
  ) {
    source = rawPostedBy;
  } else {
    source = "";
  }

  if (!source) return null;

  const isAgent = source === "agent";
  const isOwner = source === "owner";

  const label = isAgent
    ? "Agent listed"
    : isOwner
      ? "Owner listed"
      : "Builder listed";

  const styles = isAgent
    ? "bg-[#4161df]/10 text-[#4161df] border-[#4161df]/25"
    : isOwner
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-orange-50 text-orange-700 border-orange-200";

  const icon = isAgent ? (
    <FaUserTie className="shrink-0" size={12} aria-hidden />
  ) : isOwner ? (
    <FaHome className="shrink-0" size={12} aria-hidden />
  ) : (
    <FaHardHat className="shrink-0" size={12} aria-hidden />
  );

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles}`}
      title={label}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}
