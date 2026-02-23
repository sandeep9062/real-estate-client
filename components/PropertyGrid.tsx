"use client";

import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: any[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full flex flex-col gap-2 justify-center items-center py-12 text-gray-600">
        <span>No properties found.</span>
        <span className="text-sm">Try adjusting your search.</span>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {properties.map((card: any) => (
        <PropertyCard key={card.id || card._id} card={card} />
      ))}
    </div>
  );
}
