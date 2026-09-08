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

/**
 * Categories with bedrooms/bathrooms/servant rooms/balconies as meaningful,
 * listable attributes. Bare land and pure industrial/warehouse space don't
 * have "bedrooms" in any meaningful sense, so they're excluded.
 * `type` is accepted for future-proofing (e.g. if an Industrial category is
 * ever reused under a context where room counts matter) but isn't needed by
 * the current logic — category alone is sufficient today.
 */
const ROOM_COUNTS_APPLICABLE: PropertyCategory[] = [
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
export const supportsRoomCounts = (_type: string, category: string): boolean =>
  ROOM_COUNTS_APPLICABLE.includes(category as PropertyCategory);

/**
 * Categories where on-site parking is a meaningful, listable attribute.
 * Bare land has nothing to park in/under, so it's excluded; everything else
 * (including industrial/warehouse, which very much cares about parking/truck
 * access) keeps it.
 */
const PARKING_NOT_APPLICABLE: PropertyCategory[] = ["Land/Plot"];
export const supportsParking = (category: string): boolean =>
  !PARKING_NOT_APPLICABLE.includes(category as PropertyCategory);

// ── Property form option lists ──────────────────────────────────────────────

export const LISTING_OPTS = [
  { value: "Available", label: "Available — open enquiries" },
  { value: "Fresh", label: "Fresh listing" },
  { value: "Under offer", label: "Under offer" },
  { value: "Booked", label: "Booked / on hold" },
];

export const AMENITIES_OPTIONS = [
  "24x7 Water Supply",
  "Access Control",
  "ATM",
  "Balcony",
  "Bank Nearby",
  "Barbeque Area",
  "Biometric Access",
  "Cafeteria",
  "Central AC",
  "CCTV Surveillance",
  "Club House",
  "Composting",
  "Corner Property",
  "Covered Parking",
  "Crèche / Day Care",
  "Deck",
  "Doctor on Call",
  "Earthquake Resistant",
  "EV Charging",
  "False Ceiling",
  "Fire Alarm",
  "Fire Safety",
  "Fountain / Water Body",
  "Garden / Park",
  "Gated Community",
  "Gym",
  "Herb / Organic Garden",
  "Hospital Nearby",
  "Housekeeping",
  "Indoor Games",
  "Intercom",
  "Jogging Track",
  "Kids Play Area",
  "Laundry Service",
  "Library",
  "Lift",
  "Maintenance Staff",
  "Meditation / Yoga Room",
  "Modular Kitchen",
  "Outdoor Sports",
  "Parking",
  "Pet Friendly",
  "Pharmacy Nearby",
  "Piped Gas",
  "Post Office Nearby",
  "Power Backup",
  "Public Transport Nearby",
  "Rain Water Harvesting",
  "Restaurant Nearby",
  "RO Water System",
  "School Nearby",
  "Security",
  "Senior Citizen Area",
  "Servant Room",
  "Sewage Treatment Plant",
  "Shopping Centre / Supermarket",
  "Smart Home / Video Door Phone",
  "Solar Panels",
  "Spa / Salon",
  "Study Room",
  "Swimming Pool",
  "Temple Nearby",
  "Terrace",
  "Vaastu Compliant",
  "Visitor Parking",
  "Wardrobe",
  "Waste Disposal",
  "Wheelchair Accessible",
  "Wifi",
];

export const SOCIETY_AMENITIES_OPTIONS = [
  "24x7 Security",
  "Badminton Court",
  "Basketball Court",
  "Cafeteria",
  "CCTV Surveillance",
  "Children's Play Area",
  "Club House",
  "Concierge Service",
  "Covered Parking",
  "Cricket Ground",
  "Elevator / Lift",
  "EV Charging Station",
  "Fire Safety",
  "Football Ground",
  "Garden / Landscaped Lobby",
  "Gated Community",
  "Gym",
  "Housekeeping Service",
  "Indoor Games",
  "Intercom Facility",
  "Jogging Track",
  "Laundry Service",
  "Library",
  "Maintenance Staff",
  "Multipurpose Hall",
  "Outdoor Sports",
  "Power Backup",
  "Rain Water Harvesting",
  "Sewage Treatment Plant",
  "Smart Home System",
  "Solar Panels",
  "Spa",
  "Swimming Pool",
  "Tennis Court",
  "Terrace Garden",
  "Vaastu Compliant",
  "Visitor Parking",
  "Water Storage",
  "Yoga / Meditation Center",
];

export const OC_OPTIONS = [
  { value: "", label: "— Optional —" },
  { value: "Available", label: "OC available" },
  { value: "Applied", label: "OC applied" },
  { value: "Not issued", label: "Not issued yet" },
  { value: "NA", label: "Not applicable" },
];
