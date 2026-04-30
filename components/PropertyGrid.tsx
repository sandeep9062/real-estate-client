"use client";

import PropertyCard from "./PropertyCard";

export type PropertyGridColumns = "default" | "two" | "three";

interface PropertyGridProps {
  properties: any[];
  selectedId?: string | null;
  /** @default `three` — 3 cards per row from `lg` up. `two` — 2 per row from `sm` up. `default` — legacy layout. */
  columns?: PropertyGridColumns;
}

const gridClassByColumns: Record<PropertyGridColumns, string> = {
  default:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  two:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  three:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6",
};

export default function PropertyGrid({
  properties,
  selectedId,
  columns = "three",
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
      {properties.map((card: any) => {
        const pid = card.id || card._id;
        return (
          <div key={pid} data-property-id={pid}>
            <PropertyCard
              card={card}
              isSelected={!!selectedId && selectedId === String(pid)}
            />
          </div>
        );
      })}
    </div>
  );
}
