/**
 * Unit tests for the curated landmark data used by the root-level
 * `/{type}-for-rent-near-{landmark-slug}-{city}` pages.
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LANDMARKS,
  LANDMARK_RADIUS_KM,
  coordinatesOf,
  distanceKm,
  getLandmarkBySlug,
  landmarksForCity,
  propertiesNearLandmark,
} from "../landmarks.ts";
import { SEO_CITIES } from "../filterSlug.ts";

test("landmark slugs are globally unique across cities", () => {
  const slugs = LANDMARKS.map((l) => l.slug);
  assert.equal(
    new Set(slugs).size,
    slugs.length,
    "duplicate landmark slug — the root URL parser strips the trailing city and looks up by slug alone",
  );
});

test("the two launch landmarks exist (PGI + GCG College Sector 11)", () => {
  const pgi = getLandmarkBySlug("chandigarh", "pgi");
  assert.ok(pgi, "PGI Hospital landmark missing");
  assert.match(pgi.name, /PGI/i);

  const gcg = getLandmarkBySlug("chandigarh", "gcg-college-sector-11");
  assert.ok(gcg, "GCG College Sector 11 landmark missing");
  assert.match(gcg.name, /GCG/i);
});

test("landmark coordinates are plausible (not the [0,0] default)", () => {
  for (const landmark of LANDMARKS) {
    assert.notDeepEqual(
      [landmark.lng, landmark.lat],
      [0, 0],
      `${landmark.slug} has the [0,0] "unset coordinates" default`,
    );
    // Tricity bounding box sanity check.
    assert.ok(landmark.lat > 30.5 && landmark.lat < 31.1, landmark.slug);
    assert.ok(landmark.lng > 76.3 && landmark.lng < 77.1, landmark.slug);
  }
});

test("getLandmarkBySlug: city-mismatched and unknown slugs return null", () => {
  assert.equal(getLandmarkBySlug("mohali", "pgi"), null);
  assert.equal(getLandmarkBySlug("chandigarh", "fortis-hospital-mohali"), null);
  assert.equal(getLandmarkBySlug("chandigarh", "does-not-exist"), null);
  assert.equal(getLandmarkBySlug("chandigarh", ""), null);
  assert.equal(getLandmarkBySlug("chandigarh", "PGI"), null); // non-canonical
});

test("landmarksForCity returns only that city's landmarks", () => {
  for (const city of SEO_CITIES) {
    for (const landmark of landmarksForCity(city)) {
      assert.equal(landmark.city, city);
    }
  }
  assert.ok(landmarksForCity("chandigarh").length >= 2);
});

test("LANDMARK_RADIUS_KM is the documented 8 km proximity radius", () => {
  assert.equal(LANDMARK_RADIUS_KM, 8);
});

/* ── Local proximity fallback (used when the backend geo endpoint fails) ── */

test("distanceKm: haversine sanity checks", () => {
  assert.equal(distanceKm(30.7642, 76.7762, 30.7642, 76.7762), 0);

  // PGI Hospital → Elante Mall is ~6.9 km straight-line in the real world.
  const pgiToElante = distanceKm(30.7642, 76.7762, 30.7055, 76.7979);
  assert.ok(
    pgiToElante > 6.5 && pgiToElante < 7.2,
    `unexpected PGI→Elante distance: ${pgiToElante} km`,
  );

  // One degree of latitude is ~111 km anywhere on the globe.
  const oneDegree = distanceKm(30, 76, 31, 76);
  assert.ok(Math.abs(oneDegree - 111.2) < 1, `got ${oneDegree} km per degree`);
});

test("coordinatesOf: accepts both API shapes, rejects unset defaults", () => {
  // `GET /properties` shape (transformed to { lat, lng }).
  assert.deepEqual(
    coordinatesOf({ location: { coordinates: { lat: 30.7, lng: 76.8 } } }),
    { lat: 30.7, lng: 76.8 },
  );
  // Raw GeoJSON shape used by the `seo/geo-listings` endpoint: [lng, lat].
  assert.deepEqual(
    coordinatesOf({ location: { coordinates: { coordinates: [76.8, 30.7] } } }),
    { lat: 30.7, lng: 76.8 },
  );
  // Tolerance for a flat [lng, lat] array.
  assert.deepEqual(
    coordinatesOf({ location: { coordinates: [76.8, 30.7] } }),
    { lat: 30.7, lng: 76.8 },
  );

  // [0, 0] is the schema default for unset coordinates — never treated as a
  // real point (same exclusion as the backend `$geoNear` query).
  assert.equal(coordinatesOf({ location: { coordinates: { lat: 0, lng: 0 } } }), null);
  assert.equal(coordinatesOf({ location: { coordinates: { coordinates: [0, 0] } } }), null);

  // Malformed / missing inputs never throw.
  assert.equal(coordinatesOf({}), null);
  assert.equal(coordinatesOf(null), null);
  assert.equal(coordinatesOf({ location: { coordinates: { lat: "abc", lng: 1 } } }), null);
  assert.equal(coordinatesOf({ location: { coordinates: { coordinates: [76.8] } } }), null);
  assert.equal(coordinatesOf({ location: { coordinates: { lat: 120, lng: 76 } } }), null);
});

test("propertiesNearLandmark: mirrors the backend $geoNear semantics locally", () => {
  const pgi = getLandmarkBySlug("chandigarh", "pgi");
  assert.ok(pgi);

  const atPgi = {
    _id: "at-pgi",
    location: { coordinates: { lat: 30.7645, lng: 76.7765 } },
  };
  const closer = {
    _id: "closer",
    location: { coordinates: { lat: 30.7643, lng: 76.7762 } },
  };
  // Raw GeoJSON doc from the geo endpoint shape — must also be understood.
  const rawGeo = {
    _id: "raw-geo",
    location: { coordinates: { type: "Point", coordinates: [76.7763, 30.7644] } },
  };
  // IISER Mohali is ~10.7 km from PGI — outside the 8 km radius.
  const far = {
    _id: "far",
    location: { coordinates: { lat: 30.668, lng: 76.729 } },
  };

  const found = propertiesNearLandmark(pgi, [atPgi, far, closer, rawGeo]);
  assert.deepEqual(
    found.map((p) => p._id),
    ["closer", "raw-geo", "at-pgi"],
    "docs must come back nearest-first (like $geoNear)",
  );
  assert.ok(!found.some((p) => p._id === "far"), "out-of-radius doc leaked through");

  // Radius override.
  assert.deepEqual(propertiesNearLandmark(pgi, [atPgi], 0.001).map((p) => p._id), []);

  // Inactive / deleted / malformed docs are skipped without throwing.
  const noisy = [
    null,
    {},
    { _id: "inactive", isActive: false, location: atPgi.location },
    { _id: "deleted", deletedAt: "2026-01-01", location: atPgi.location },
    atPgi,
  ];
  assert.deepEqual(propertiesNearLandmark(pgi, noisy).map((p) => p._id), ["at-pgi"]);
});

test("propertiesNearLandmark: [0, 0] default is never treated as a location", () => {
  // Synthetic landmark at the origin: the Gulf-of-Guinea default point would
  // otherwise sit exactly on top of it and match every unset property.
  const originLandmark = {
    slug: "synthetic-origin",
    name: "Synthetic Origin",
    city: "chandigarh" as const,
    lat: 0,
    lng: 0,
  };
  const unsetDefault = {
    _id: "unset",
    location: { coordinates: { lat: 0, lng: 0 } },
  };
  const genuinelyNearby = {
    _id: "nearby",
    location: { coordinates: { lat: 0.01, lng: 0.01 } },
  };

  assert.deepEqual(
    propertiesNearLandmark(originLandmark, [unsetDefault, genuinelyNearby]).map(
      (p) => p._id,
    ),
    ["nearby"],
  );
});