/**
 * Shared option lists & visibility rules for the property form.
 * Mirrors the enums in backend/models/Property.js — keep in sync.
 */

export const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Agricultural",
] as const;

export const PROPERTY_CATEGORIES = [
  "Apartment/Flat",
  "House/Villa",
  "Land/Plot",
  "Studio Apartment",
  "Builder Floor",
  "PG/Hostel",
  "Farmhouse",
  "Retail",
  "Office",
  "Industrial",
  "Warehouse",
  "Shop/Showroom",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

/** Which property categories make sense for each property type. */
export const CATEGORIES_BY_TYPE: Record<PropertyType, PropertyCategory[]> = {
  Residential: [
    "Apartment/Flat",
    "House/Villa",
    "Land/Plot",
    "Studio Apartment",
    "Builder Floor",
    "PG/Hostel",
    "Farmhouse",
  ],
  Commercial: ["Retail", "Office", "Industrial", "Warehouse", "Shop/Showroom"],
  Industrial: ["Industrial", "Warehouse"],
  Agricultural: ["Land/Plot", "Farmhouse"],
};

/** Categories for a given property type (falls back to all categories). */
export const getCategoriesForType = (type: string): PropertyCategory[] =>
  CATEGORIES_BY_TYPE[type as PropertyType] ?? [...PROPERTY_CATEGORIES];

/** Categories that are bare land — building-specific fields don't apply. */
const LAND_LIKE: PropertyCategory[] = ["Land/Plot"];
export const isLandCategory = (category: string): boolean =>
  LAND_LIKE.includes(category as PropertyCategory);

/** Categories with usable interiors, where furnishing applies. */
const FURNISHING_APPLICABLE: PropertyCategory[] = [
  "Apartment/Flat",
  "House/Villa",
  "Studio Apartment",
  "Builder Floor",
  "PG/Hostel",
  "Farmhouse",
  "Office",
  "Retail",
  "Shop/Showroom",
];
export const supportsFurnishing = (category: string): boolean =>
  FURNISHING_APPLICABLE.includes(category as PropertyCategory);

/** Categories where society/building amenities apply (same set as furnishing). */
export const supportsAmenities = supportsFurnishing;

/** Categories where a facing direction is meaningful (not shared accommodations). */
export const supportsFacing = (category: string): boolean =>
  category !== "PG/Hostel";
