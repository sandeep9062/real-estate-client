/**
 * Unit tests for the root-level flat SEO URL parsers/builders.
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildRootSlug,
  parseRootSlug,
  quickLinkLabel,
  seoComboPath,
} from "../rootSlugPatterns.ts";
import { PRICE_BUCKETS_INR } from "../filterSlug.ts";

test("parseRootSlug: price-bucket pattern", () => {
  assert.deepEqual(parseRootSlug("property-for-rent-in-mohali-under-10-thousand"), {
    city: "mohali",
    sectorSlug: null,
    landmarkSlug: null,
    spec: { kind: "price", dealType: "rent", maxPrice: 10_000 },
  });
  assert.deepEqual(
    parseRootSlug("property-for-rent-in-chandigarh-under-5-thousand"),
    {
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "price", dealType: "rent", maxPrice: 5_000 },
    },
  );
  // Every fixed bucket round-trips.
  for (const bucket of PRICE_BUCKETS_INR) {
    const slug = `property-for-rent-in-mohali-under-${bucket / 1000}-thousand`;
    const resolved = parseRootSlug(slug);
    assert.ok(resolved, `expected a match for ${slug}`);
    assert.deepEqual(resolved.spec, {
      kind: "price",
      dealType: "rent",
      maxPrice: bucket,
    });
  }
});

test("parseRootSlug: price pattern rejects non-bucket amounts", () => {
  // Parsed by the regex but NOT in PRICE_BUCKETS_INR → must 404.
  assert.equal(parseRootSlug("property-for-rent-in-mohali-under-13-thousand"), null);
  assert.equal(parseRootSlug("property-for-rent-in-mohali-under-1-lakh"), null);
  assert.equal(parseRootSlug("property-for-rent-in-mohali-under-999-thousand"), null);
});

test("parseRootSlug: pg-in-sector pattern (no 'for-rent')", () => {
  assert.deepEqual(parseRootSlug("pg-in-sector-14-chandigarh"), {
    city: "chandigarh",
    sectorSlug: "sector-14",
    landmarkSlug: null,
    spec: { kind: "pg" },
  });
  assert.deepEqual(parseRootSlug("pg-in-sector-9-mohali"), {
    city: "mohali",
    sectorSlug: "sector-9",
    landmarkSlug: null,
    spec: { kind: "pg" },
  });
});

test("parseRootSlug: sector + type-only category pattern", () => {
  assert.deepEqual(parseRootSlug("house-for-rent-in-sector-12-chandigarh"), {
    city: "chandigarh",
    sectorSlug: "sector-12",
    landmarkSlug: null,
    spec: { kind: "category", dealType: "rent", category: "House/Villa" },
  });
  assert.deepEqual(parseRootSlug("flat-for-rent-in-sector-7-mohali"), {
    city: "mohali",
    sectorSlug: "sector-7",
    landmarkSlug: null,
    spec: { kind: "category", dealType: "rent", category: "Apartment/Flat" },
  });
});

test("parseRootSlug: landmark pattern", () => {
  assert.deepEqual(parseRootSlug("flat-for-rent-near-pgi-chandigarh"), {
    city: "chandigarh",
    sectorSlug: null,
    landmarkSlug: "pgi",
    spec: { kind: "category", dealType: "rent", category: "Apartment/Flat" },
  });
  // Multi-word landmark slug whose own name contains a sector number.
  assert.deepEqual(
    parseRootSlug(
      "independent-room-for-rent-near-gcg-college-sector-11-chandigarh",
    ),
    {
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: "gcg-college-sector-11",
      spec: { kind: "independent-room" },
    },
  );
  assert.deepEqual(parseRootSlug("pg-for-rent-near-fortis-hospital-mohali-mohali"), {
    city: "mohali",
    sectorSlug: null,
    landmarkSlug: "fortis-hospital-mohali",
    spec: { kind: "pg" },
  });
  assert.deepEqual(parseRootSlug("house-for-rent-near-pgi-chandigarh"), {
    city: "chandigarh",
    sectorSlug: null,
    landmarkSlug: "pgi",
    spec: { kind: "category", dealType: "rent", category: "House/Villa" },
  });
  assert.deepEqual(parseRootSlug("flatmate-for-rent-near-pgi-chandigarh"), {
    city: "chandigarh",
    sectorSlug: null,
    landmarkSlug: "pgi",
    spec: { kind: "flatmate" },
  });
  // Landmark exists but belongs to another city → null.
  assert.equal(parseRootSlug("flat-for-rent-near-pgi-mohali"), null);
});

test("parseRootSlug: malformed and garbage slugs return null without throwing", () => {
  const bad = [
    "",
    "   ",
    "property-for-rent-in-mohali-under-10-thousandx",
    "property-for-rent-in-under-10-thousand",
    "property-for-rent-in-new-chandigarh-under-10-thousand", // non-canonical city
    "property-for-rent-in-delhi-under-10-thousand", // out-of-program city
    "pg-in-sector-0-chandigarh",
    "pg-in-sector-100-chandigarh",
    "pg-in-sector-14-delhi",
    "pg-in-phase-4-mohali", // not a sector slug
    "house-for-rent-in-sector-12-delhi",
    "house-for-rent-in-sector-", // truncated
    "bungalow-for-rent-in-sector-12-chandigarh", // unsupported type
    "flat-for-rent-near-unknown-landmark-chandigarh", // uncurated landmark
    "flat-for-rent-near-pgi", // missing city
    "flat-for-rent-near-chandigarh", // empty landmark slug
    "pg-near-pgi-chandigarh", // missing 'for-rent'
    "Flat-for-rent-in-sector-12-chandigarh", // uppercase → non-canonical
    "property for rent in mohali", // spaces → non-canonical
    "property-for-rent-in-mohali-under-10,000", // comma → non-canonical
    "for-rent-2bhk", // nested filter slug, not a root pattern
    "privacy-policy", // existing literal route must never match
  ];
  for (const slug of bad) {
    assert.equal(parseRootSlug(slug), null, `expected null for "${slug}"`);
  }
});

/**
 * Regression guard: the root-level `app/[slug]` catch-all must never swallow
 * existing literal top-level routes (Next.js resolves static routes before
 * dynamic ones — this asserts our parser agrees by returning null for each).
 */
test("parseRootSlug: existing top-level routes never match", () => {
  const existingTopLevelRoutes = [
    "about-us",
    "account",
    "add-property",
    "agents",
    "bookings",
    "choose-role",
    "compare",
    "contact",
    "developers",
    "disclaimer",
    "emi-calculator",
    "faq",
    "favourites",
    "find-roommate",
    "flatmates",
    "guides",
    "journal",
    "landlord",
    "other-services",
    "owned",
    "post-requirement",
    "pricing",
    "privacy-policy",
    "projects",
    "properties",
    "property",
    "refund",
    "saved-searches",
    "services",
    "student",
    "students",
    "terms",
  ];
  for (const route of existingTopLevelRoutes) {
    assert.equal(
      parseRootSlug(route),
      null,
      `"${route}" must remain a literal route, not be swallowed by app/[slug]`,
    );
  }
});

test("buildRootSlug is the inverse of parseRootSlug", () => {
  const roundTrip = (resolved: NonNullable<ReturnType<typeof parseRootSlug>>) =>
    parseRootSlug(
      buildRootSlug(resolved.city, resolved.spec, {
        sectorSlug: resolved.sectorSlug,
        landmarkSlug: resolved.landmarkSlug,
      }) || "",
    );
  assert.deepEqual(
    roundTrip({
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: "pgi",
      spec: { kind: "category", dealType: "rent", category: "Apartment/Flat" },
    }),
    {
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: "pgi",
      spec: { kind: "category", dealType: "rent", category: "Apartment/Flat" },
    },
  );
  assert.deepEqual(
    roundTrip({
      city: "chandigarh",
      sectorSlug: "sector-14",
      landmarkSlug: null,
      spec: { kind: "pg" },
    }),
    {
      city: "chandigarh",
      sectorSlug: "sector-14",
      landmarkSlug: null,
      spec: { kind: "pg" },
    },
  );
  assert.deepEqual(
    roundTrip({
      city: "mohali",
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "price", dealType: "rent", maxPrice: 10_000 },
    }),
    {
      city: "mohali",
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "price", dealType: "rent", maxPrice: 10_000 },
    },
  );

  // Combinations without a root-level URL → null.
  assert.equal(
    buildRootSlug("chandigarh", { kind: "bhk", dealType: "rent", bhk: 2 }),
    null,
  );
  assert.equal(
    buildRootSlug("chandigarh", { kind: "pg", gender: "boys" }, {
      sectorSlug: "sector-34",
    }),
    null,
  );
});

test("seoComboPath routes combos to nested or root URLs correctly", () => {
  assert.equal(
    seoComboPath({
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "bhk", dealType: "rent", bhk: 2 },
    }),
    "/properties/chandigarh/for-rent-2bhk",
  );
  assert.equal(
    seoComboPath({
      city: "chandigarh",
      sectorSlug: "sector-12",
      landmarkSlug: null,
      spec: { kind: "category", dealType: "rent", category: "House/Villa" },
    }),
    "/house-for-rent-in-sector-12-chandigarh",
  );
  assert.equal(
    seoComboPath({
      city: "chandigarh",
      sectorSlug: null,
      landmarkSlug: "pgi",
      spec: { kind: "category", dealType: "rent", category: "Apartment/Flat" },
    }),
    "/flat-for-rent-near-pgi-chandigarh",
  );
  assert.equal(
    seoComboPath({
      city: "mohali",
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "price", dealType: "rent", maxPrice: 10_000 },
    }),
    "/property-for-rent-in-mohali-under-10-thousand",
  );
});
test("quickLinkLabel: short labels for homepage quick-link chips", () => {
  assert.equal(
    quickLinkLabel("flat-for-rent-in-sector-40-chandigarh"),
    "Flats in Sector 40, Chandigarh",
  );
  assert.equal(
    quickLinkLabel("house-for-rent-in-sector-12-chandigarh"),
    "Houses in Sector 12, Chandigarh",
  );
  assert.equal(
    quickLinkLabel("pg-in-sector-14-chandigarh"),
    "PG in Sector 14, Chandigarh",
  );
  assert.equal(
    quickLinkLabel("flat-for-rent-near-pgi-chandigarh"),
    "Flats near PGI Hospital (PGIMER)",
  );
  assert.equal(
    quickLinkLabel("pg-for-rent-near-gcg-college-sector-11-chandigarh"),
    "PG near GCG College Sector 11",
  );
  assert.equal(
    quickLinkLabel("property-for-rent-in-mohali-under-10-thousand"),
    "Under ₹10,000 in Mohali",
  );
  assert.equal(
    quickLinkLabel("property-for-rent-in-chandigarh-under-50-thousand"),
    "Under ₹50,000 in Chandigarh",
  );
  // Garbage / nested slugs never produce a label.
  assert.equal(quickLinkLabel("privacy-policy"), null);
  assert.equal(quickLinkLabel("for-rent-2bhk"), null);
  assert.equal(quickLinkLabel(""), null);
});