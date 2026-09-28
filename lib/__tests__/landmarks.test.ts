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
  getLandmarkBySlug,
  landmarksForCity,
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