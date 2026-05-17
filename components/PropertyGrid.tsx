"use client";

import PropertyCard from "./PropertyCard";

export type PropertyGridColumns = "default" | "two" | "three" | "four";

interface PropertyGridProps {
  properties: any[];
  selectedId?: string | null;
  /** `two` — 2 per row (narrow list beside map). `four` — up to 4 per row on `lg+` (full-width list). `three` — same as `two`. `default` — legacy layout. */
  columns?: PropertyGridColumns;
  variant?: "default" | "carousel";
}

const gridClassByColumns: Record<PropertyGridColumns, string> = {
  default:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  two: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  three:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  four: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6",
};

export default function PropertyGrid({
  properties,
  selectedId,
  columns = "three",
  variant = "carousel",
}: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full flex flex-col gap-2 justify-center items-center py-12 text-gray-600">
        <span>No properties found.</span>
        <span className="text-sm">Try adjusting your search.</span>
      </div>
    );
  }

  return (
    <div className={`w-full grid ${gridClassByColumns[columns]}`}>
      {properties.map((card: any, index: number) => {
        const pid = card.id || card._id;
        return (
          <div
            key={pid}
            data-property-id={pid}
            className={
              variant === "carousel"
                ? "mx-auto flex h-[396px] w-full max-w-full min-h-0 flex-col sm:h-[420px] animate-fade-in-up"
                : "animate-fade-in-up"
            }
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
          >
            <PropertyCard
              card={card}
              isSelected={!!selectedId && selectedId === String(pid)}
              variant={variant}
            />
          </div>
        );
      })}
    </div>
  );
}
