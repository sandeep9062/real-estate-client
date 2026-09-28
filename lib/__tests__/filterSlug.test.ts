/**
 * Unit tests for the SEO filter-slug utilities.
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MIN_LISTINGS_FOR_SEO_PAGE,
  PRICE_BUCKETS_INR,
  buildFilterSlug,
  buildSeoPath,
  buildSeoHrefFromFilters,
  eligiblePriceBucketCombos,
  eligibleSeoCombos,
  matchesFilterSpec,
  parseFilterSlug,
  specsForProperty,
  sectorSlugToDisplay,
  sectorToSlug,
} from "../filterSlug.ts";
import { seoComboPath } from "../rootSlugPatterns.ts";

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
  // seoComboPath routes root-level kinds (category) to flat URLs and bhk/pg
  // combos to the nested /properties paths.
  const hrefs = combos
    .map((c) => seoComboPath(c) as string)
    .sort();
  assert.deepEqual(hrefs, [
    // City-level counts include sector listings (5 in Chandigarh, 3 in
    // Mohali); Sector 40 hits exactly 3; Sector 41 stays below threshold.
    // NEW: the sector-level category combo gives sector pages accurate
    // Flats-only counts and renders on the root-level flat URL.
    "/flat-for-rent-in-sector-40-chandigarh",
    "/properties/chandigarh/for-rent-2bhk",
    "/properties/chandigarh/sector-40/for-rent-2bhk",
    "/properties/mohali/for-rent-2bhk",
  ]);

  // Sector 41 alone is below the threshold → no page for it.
  const sector41 = combos.filter((c) => c.sectorSlug === "sector-41");
  assert.equal(sector41.length, 0);

  // Category specs are sector-scoped only — no city-level category combo.
  const cityCategory = combos.filter(
    (c) => c.sectorSlug === null && c.spec.kind === "category",
  );
  assert.equal(cityCategory.length, 0);

  // Landmark/sectorSlug are mutually exclusive; sector combos have no
  // landmark and vice versa.
  for (const combo of combos) {
    if (combo.sectorSlug) assert.equal(combo.landmarkSlug, null);
    if (combo.landmarkSlug) assert.equal(combo.sectorSlug, null);
  }
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


/* ── Extended spec system: category / price / subletting specs ─────────── */

test("PRICE_BUCKETS_INR is the fixed closed bucket list", () => {
  assert.deepEqual(PRICE_BUCKETS_INR, [
    5_000, 10_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000,
  ]);
});

test("specsForProperty: PG, BHK and category derivation", () => {
  // PG/Hostel → pg specs only (plus gender variants from title text).
  assert.deepEqual(
    specsForProperty({
      deal: "Rent",
      propertyCategory: "PG/Hostel",
      title: "Boys PG near university",
    }),
    [{ kind: "pg" }, { kind: "pg", gender: "boys" }],
  );

  // Apartment/Flat rent 2bhk → bhk + category (flats count separately now).
  assert.deepEqual(
    specsForProperty({
      deal: "Rent",
      propertyCategory: "Apartment/Flat",
      facilities: { bedrooms: 2 },
    }),
    [
      { kind: "bhk", dealType: "rent", bhk: 2 },
      { kind: "category", dealType: "rent", category: "Apartment/Flat" },
    ],
  );

  // House/Villa sale → sale category + bhk.
  assert.deepEqual(
    specsForProperty({
      deal: "Sale",
      propertyCategory: "House/Villa",
      facilities: { bedrooms: 3 },
    }),
    [
      { kind: "bhk", dealType: "sale", bhk: 3 },
      { kind: "category", dealType: "sale", category: "House/Villa" },
    ],
  );

  // Non-residential categories derive bhk (existing behaviour) but never a
  // category spec.
  assert.deepEqual(
    specsForProperty({
      deal: "Rent",
      propertyCategory: "Land/Plot",
      facilities: { bedrooms: 2 },
    }),
    [{ kind: "bhk", dealType: "rent", bhk: 2 }],
  );
});

test("specsForProperty: subletting-derived specs (open decision #1)", () => {
  const subletRoom = {
    deal: "Rent",
    propertyCategory: "Apartment/Flat",
    allowsSubletting: true,
    maxPersonsSharing: 3,
  };
  assert.ok(
    specsForProperty(subletRoom).some((s) => s.kind === "independent-room"),
  );
  assert.ok(specsForProperty(subletRoom).some((s) => s.kind === "flatmate"));

  // Sharing cap of 1 → independent-room only, never flatmate.
  const soloSpecs = specsForProperty({
    ...subletRoom,
    maxPersonsSharing: 1,
  }).map((s) => s.kind);
  assert.ok(soloSpecs.includes("independent-room"));
  assert.ok(!soloSpecs.includes("flatmate"));

  // allowsSubletting false (default) → neither spec.
  const noSubletKinds = specsForProperty({
    deal: "Rent",
    propertyCategory: "House/Villa",
  }).map((s) => s.kind);
  assert.ok(!noSubletKinds.includes("independent-room"));
  assert.ok(!noSubletKinds.includes("flatmate"));

  // Sale listings never derive subletting specs.
  const saleKinds = specsForProperty({
    ...subletRoom,
    deal: "Sale",
  }).map((s) => s.kind);
  assert.ok(!saleKinds.includes("independent-room"));
  assert.ok(!saleKinds.includes("flatmate"));
});

test("matchesFilterSpec: category specs match deal + propertyCategory", () => {
  const flatRent = {
    kind: "category",
    dealType: "rent",
    category: "Apartment/Flat",
  } as const;
  assert.equal(
    matchesFilterSpec(
      { deal: "Rent", propertyCategory: "Apartment/Flat", facilities: { bedrooms: 3 } },
      flatRent,
    ),
    true,
  );
  assert.equal(
    matchesFilterSpec({ deal: "Rent", propertyCategory: "House/Villa" }, flatRent),
    false,
  );
  assert.equal(
    matchesFilterSpec({ deal: "Sale", propertyCategory: "Apartment/Flat" }, flatRent),
    false,
  );
  // PG never matches a category spec.
  assert.equal(
    matchesFilterSpec({ deal: "Rent", propertyCategory: "PG/Hostel" }, flatRent),
    false,
  );
});

test("matchesFilterSpec: price specs match deal + price ceiling", () => {
  const under10k = { kind: "price", dealType: "rent", maxPrice: 10_000 } as const;
  assert.equal(matchesFilterSpec({ deal: "Rent", price: 9_999 }, under10k), true);
  assert.equal(matchesFilterSpec({ deal: "Rent", price: 10_000 }, under10k), true);
  assert.equal(matchesFilterSpec({ deal: "Rent", price: 10_001 }, under10k), false);
  assert.equal(matchesFilterSpec({ deal: "Rent" }, under10k), false);
  assert.equal(matchesFilterSpec({ deal: "Sale", price: 5_000 }, under10k), false);
});

test("matchesFilterSpec: subletting specs (open decision #1)", () => {
  const independentRoom = { kind: "independent-room" } as const;
  const flatmate = { kind: "flatmate" } as const;
  const subletShareable = {
    deal: "Rent",
    allowsSubletting: true,
    maxPersonsSharing: 2,
  };
  assert.equal(matchesFilterSpec(subletShareable, independentRoom), true);
  assert.equal(matchesFilterSpec(subletShareable, flatmate), true);
  assert.equal(
    matchesFilterSpec(
      { deal: "Rent", allowsSubletting: true, maxPersonsSharing: 1 },
      flatmate,
    ),
    false,
  );
  assert.equal(
    matchesFilterSpec({ deal: "Rent", allowsSubletting: false }, independentRoom),
    false,
  );
});

test("eligiblePriceBucketCombos: city-level price combos with guardrail", () => {
  const mk = (over: Record<string, unknown>) => ({
    isActive: true,
    deletedAt: null,
    location: { city: "Mohali", sector: "" },
    deal: "Rent",
    price: 8_000,
    propertyCategory: "Apartment/Flat",
    facilities: { bedrooms: 2 },
    ...over,
  });
  const listings = [
    mk({}), // 8k rent → counts for the 10k…50k buckets
    mk({ price: 6_000 }),
    mk({ price: 12_000 }), // counts for 15k and above only
    mk({ price: 4_000 }), // sole 5k-bucket match → below threshold
    // Sale listings and non-program cities never count.
    mk({ deal: "Sale", price: 2_000 }),
    mk({ location: { city: "Delhi", sector: "" }, price: 3_000 }),
  ];

  const combos = eligiblePriceBucketCombos(listings);
  const hrefs = combos.map((c) => seoComboPath(c) as string).sort();
  // 5k bucket: only the 4k listing matches → below threshold → skipped.
  assert.deepEqual(hrefs, [
    "/property-for-rent-in-mohali-under-10-thousand",
    "/property-for-rent-in-mohali-under-15-thousand",
    "/property-for-rent-in-mohali-under-20-thousand",
    "/property-for-rent-in-mohali-under-25-thousand",
    "/property-for-rent-in-mohali-under-30-thousand",
    "/property-for-rent-in-mohali-under-40-thousand",
    "/property-for-rent-in-mohali-under-50-thousand",
  ]);

  // Inactive/deleted listings are ignored, same as eligibleSeoCombos.
  assert.equal(
    eligiblePriceBucketCombos([
      mk({ price: 5_000 }),
      mk({ price: 5_000 }),
      mk({ price: 5_000, isActive: false }),
      mk({ price: 5_000, deletedAt: new Date() }),
    ]).length,
    0,
  );
});
