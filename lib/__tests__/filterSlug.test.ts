/**
 * Unit tests for the SEO filter-slug utilities.
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MIN_LISTINGS_FOR_SEO_PAGE,
  buildFilterSlug,
  buildSeoPath,
  buildSeoHrefFromFilters,
  eligibleSeoCombos,
  matchesFilterSpec,
  parseFilterSlug,
  sectorSlugToDisplay,
  sectorToSlug,
} from "../filterSlug.ts";

test("MIN_LISTINGS_FOR_SEO_PAGE is the tuned threshold", () => {
  assert.equal(MIN_LISTINGS_FOR_SEO_PAGE, 3);
});

test("parseFilterSlug: BHK rent/sale patterns", () => {
  assert.deepEqual(parseFilterSlug("for-rent-2bhk"), {
    kind: "bhk",
    dealType: "rent",
    bhk: 2,
  });
  assert.deepEqual(parseFilterSlug("for-sale-3bhk"), {
    kind: "bhk",
    dealType: "sale",
    bhk: 3,
  });
});

test("parseFilterSlug: PG patterns", () => {
  assert.deepEqual(parseFilterSlug("pg-boys"), {
    kind: "pg",
    gender: "boys",
  });
  assert.deepEqual(parseFilterSlug("pg-girls"), {
    kind: "pg",
    gender: "girls",
  });
  assert.deepEqual(parseFilterSlug("pg"), { kind: "pg" });
});

test("parseFilterSlug: rejects garbage slugs", () => {
  for (const bad of [
    "",
    "for-rent-bhk",
    "for-rent-9bhk", // beyond MAX_BHK_SLUG
    "for-lease-2bhk",
    "rent-2bhk",
    "pg-xyz",
    "pg-boys-girls",
    "for-rent-2bhk-extra",
  ]) {
    assert.equal(parseFilterSlug(bad), null, `expected null for "${bad}"`);
  }
});

test("buildFilterSlug is the inverse of parseFilterSlug", () => {
  const roundTrip = (spec: any) => parseFilterSlug(buildFilterSlug(spec));
  assert.deepEqual(roundTrip({ kind: "bhk", dealType: "rent", bhk: 2 }), {
    kind: "bhk",
    dealType: "rent",
    bhk: 2,
  });
  assert.deepEqual(roundTrip({ kind: "pg", gender: "girls" }), {
    kind: "pg",
    gender: "girls",
  });
  assert.equal(buildFilterSlug({ kind: "pg" }), "pg");
});

test("sector slug helpers round-trip", () => {
  assert.equal(sectorToSlug("Sector 40"), "sector-40");
  assert.equal(sectorToSlug("Phase 4"), "phase-4");
  assert.equal(sectorSlugToDisplay("sector-40"), "Sector 40");
  assert.equal(sectorSlugToDisplay("phase-4"), "Phase 4");
});

test("buildSeoPath: city-only and city+sector variants", () => {
  assert.equal(
    buildSeoPath("chandigarh", { kind: "bhk", dealType: "rent", bhk: 2 }),
    "/properties/chandigarh/for-rent-2bhk",
  );
  assert.equal(
    buildSeoPath(
      "chandigarh",
      { kind: "pg", gender: "boys" },
      "sector-34",
    ),
    "/properties/chandigarh/sector-34/pg-boys",
  );
});

test("matchesFilterSpec: deal type + BHK, PG gender narrowing", () => {
  const rent2 = { kind: "bhk", dealType: "rent", bhk: 2 } as const;
  assert.equal(
    matchesFilterSpec(
      { deal: "Rent", propertyCategory: "Apartment/Flat", facilities: { bedrooms: 2 } },
      rent2,
    ),
    true,
  );
  assert.equal(
    matchesFilterSpec(
      { deal: "Sale", propertyCategory: "House/Villa", facilities: { bedrooms: 2 } },
      rent2,
    ),
    false,
  );
  // PG never counts toward BHK pages.
  assert.equal(
    matchesFilterSpec(
      { deal: "Rent", propertyCategory: "PG/Hostel", facilities: { bedrooms: 2 }, title: "PG for boys" },
      rent2,
    ),
    false,
  );

  const boys = { kind: "pg", gender: "boys" } as const;
  assert.equal(matchesFilterSpec({ propertyCategory: "PG/Hostel", title: "Boys PG Sector 34" }, boys), true);
  assert.equal(matchesFilterSpec({ propertyCategory: "PG/Hostel", title: "Girls Hostel" }, boys), false);
  assert.equal(matchesFilterSpec({ propertyCategory: "Apartment/Flat", title: "Boys PG" }, boys), false);

  const anyPg = { kind: "pg" } as const;
  assert.equal(matchesFilterSpec({ propertyCategory: "PG/Hostel", title: "Co-living studio" }, anyPg), true);
});

test("eligibleSeoCombos: only combos meeting the threshold survive", () => {
  const mk = (over: Record<string, unknown>) => ({
    isActive: true,
    deletedAt: null,
    location: { city: "Chandigarh", sector: "" },
    deal: "Rent",
    propertyCategory: "Apartment/Flat",
    facilities: { bedrooms: 2 },
    ...over,
  });
  const listings = [
    mk({ location: { city: "Chandigarh", sector: "Sector 40" } }),
    mk({ location: { city: "Chandigarh", sector: "Sector 40" } }),
    mk({ location: { city: "Chandigarh", sector: "Sector 40" } }),
    // Only 2 in Sector 41 → must NOT pass the guardrail.
    mk({ location: { city: "Chandigarh", sector: "Sector 41" } }),
    mk({ location: { city: "Chandigarh", sector: "Sector 41" } }),
    // A different city counts toward its own combination.
    mk({ location: { city: "Mohali", sector: "" } }),
    mk({ location: { city: "Mohali", sector: "" } }),
    mk({ location: { city: "Mohali", sector: "" } }),
  ];

  const combos = eligibleSeoCombos(listings);
  const hrefs = combos.map((c) => buildSeoPath(c.city, c.spec, c.sectorSlug));
  assert.deepEqual(hrefs.sort(), [
    // City-level counts include sector listings (5 in Chandigarh, 3 in
    // Mohali); Sector 40 hits exactly 3; Sector 41 stays below threshold.
    "/properties/chandigarh/for-rent-2bhk",
    "/properties/chandigarh/sector-40/for-rent-2bhk",
    "/properties/mohali/for-rent-2bhk",
  ]);

  // Sector 41 alone is below the threshold → no page for it.
  const sector41 = combos.filter((c) => c.sectorSlug === "sector-41");
  assert.equal(sector41.length, 0);
});

test("eligibleSeoCombos: inactive/deleted/out-of-program listings are ignored", () => {
  const mk = (over: Record<string, unknown>) => ({
    isActive: true,
    deletedAt: null,
    location: { city: "Kharar", sector: "" },
    deal: "Rent",
    propertyCategory: "Apartment/Flat",
    facilities: { bedrooms: 1 },
    ...over,
  });
  const listings = [
    mk({}),
    mk({}),
    mk({ isActive: false }),
    mk({ deletedAt: new Date() }),
    // Out-of-program city is ignored entirely.
    mk({ location: { city: "Delhi", sector: "" } }),
    mk({ location: { city: "Delhi", sector: "" } }),
    mk({ location: { city: "Delhi", sector: "" } }),
  ];
  // Kharar 1BHK-rent has only 2 active listings → below threshold; Delhi is
  // out of program → no eligible combos at all.
  assert.equal(eligibleSeoCombos(listings).length, 0);
});

test("buildSeoHrefFromFilters: UI filters map to canonical SEO URLs", () => {
  assert.equal(
    buildSeoHrefFromFilters({
      city: "chandigarh",
      sector: "Sector 40",
      deal: "rent",
      bedrooms: "2",
    }),
    "/properties/chandigarh/sector-40/for-rent-2bhk",
  );
  assert.equal(
    buildSeoHrefFromFilters({ city: "Chandigarh", propertyCategory: "PG/Hostel" }),
    "/properties/chandigarh/pg",
  );
  assert.equal(
    buildSeoHrefFromFilters({ city: "Mohali", deal: "sale", bedrooms: 3 }),
    "/properties/mohali/for-sale-3bhk",
  );
  // Extra filters survive as leftover query params.
  assert.equal(
    buildSeoHrefFromFilters({
      city: "chandigarh",
      deal: "rent",
      bedrooms: "2",
      furnishing: "Furnished",
    }),
    "/properties/chandigarh/for-rent-2bhk?furnishing=Furnished",
  );
  // No city / unsupported filters → keep the query-string URL (null).
  assert.equal(buildSeoHrefFromFilters({ deal: "rent", bedrooms: "2" }), null);
  assert.equal(buildSeoHrefFromFilters({ city: "chandigarh" }), null);
  assert.equal(buildSeoHrefFromFilters(null), null);
});

