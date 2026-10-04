/**
 * Unit tests for the /sectors directory taxonomy (`lib/sectorDirectory.ts`).
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SECTORS_DESCRIPTION,
  buildCityMapPoints,
  buildSectorDirectory,
  buildSectorDirectorySchemas,
  collectLiveSectorLinks,
  sectorDisplayLabel,
  sectorNumberFromText,
} from "../sectorDirectory.ts";
import type { CityGroup, SectorEntry } from "../sectorDirectory.ts";

function group(groups: CityGroup[], key: string): CityGroup {
  const found = groups.find((g) => g.key === key);
  assert.ok(found, `missing city group "${key}"`);
  return found;
}

function entry(groups: CityGroup[], key: string, label: string): SectorEntry {
  const found = group(groups, key).sectors.find((s) => s.label === label);
  assert.ok(found, `missing entry "${label}" in ${key}`);
  return found;
}

const CHANDIGARH_SECTOR_COUNT = 59; // 1..60 minus the non-existent Sector 13
const MOHALI_SECTOR_COUNT = 81; // 55..135 (Sector 13 is outside this range)
const PANCHKULA_SECTOR_COUNT = 32; // 1..32

test("always contains the five tricity cities with the documented layout", () => {
  const groups = buildSectorDirectory([]);
  assert.deepEqual(
    groups.map((g) => [g.key, g.layout]),
    [
      ["chandigarh", "grid"],
      ["mohali", "grid"],
      ["panchkula", "grid"],
      ["zirakpur", "list"],
      ["kharar", "list"],
    ],
  );
});

test("no live slugs → the complete directory renders, every entry disabled", () => {
  const groups = buildSectorDirectory([]);

  const chd = group(groups, "chandigarh");
  assert.equal(chd.sectors.length, CHANDIGARH_SECTOR_COUNT);
  assert.equal(chd.sectors[0].label, "1");
  assert.equal(chd.sectors[chd.sectors.length - 1].label, "60");
  assert.ok(
    !chd.sectors.some((s) => s.label === "13"),
    "Sector 13 must not be rendered (it does not exist in Chandigarh)",
  );

  const mohali = group(groups, "mohali");
  assert.equal(mohali.sectors.length, MOHALI_SECTOR_COUNT);
  assert.equal(mohali.sectors[0].label, "55");
  assert.equal(mohali.sectors[mohali.sectors.length - 1].label, "135");

  assert.equal(
    group(groups, "panchkula").sectors.length,
    PANCHKULA_SECTOR_COUNT,
  );

  assert.deepEqual(
    group(groups, "zirakpur").sectors.map((s) => s.label),
    [
      "VIP Road",
      "Patiala Road",
      "Dhakoli",
      "Baltana",
      "Peer Muchalla",
      "Singpura",
      "Devi Nagar",
    ],
  );
  assert.equal(group(groups, "kharar").sectors.length, 5);

  for (const g of groups) {
    for (const s of g.sectors) {
      assert.equal(s.href, undefined, `${g.key}/${s.label} should be disabled`);
    }
  }
});

test("sector root slugs light up exactly the matching grid tiles", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-in-sector-40-chandigarh",
    "house-for-rent-in-sector-12-chandigarh",
    "pg-in-sector-66-mohali",
  ]);

  assert.equal(
    entry(groups, "chandigarh", "40").href,
    "/flat-for-rent-in-sector-40-chandigarh",
  );
  assert.equal(
    entry(groups, "chandigarh", "12").href,
    "/house-for-rent-in-sector-12-chandigarh",
  );
  assert.equal(entry(groups, "mohali", "66").href, "/pg-in-sector-66-mohali");

  // Filler entries stay in place — only the three matched tiles are live.
  assert.equal(
    group(groups, "chandigarh").sectors.length,
    CHANDIGARH_SECTOR_COUNT,
  );
  assert.equal(group(groups, "mohali").sectors.length, MOHALI_SECTOR_COUNT);
  const live = groups.flatMap((g) => g.sectors).filter((s) => s.href);
  assert.equal(live.length, 3);
});

test("a sector with several live pages prefers flat → house → PG, order-independent", () => {
  const slugs = [
    "pg-in-sector-40-chandigarh",
    "house-for-rent-in-sector-40-chandigarh",
    "flat-for-rent-in-sector-40-chandigarh",
  ];
  for (const input of [slugs, [...slugs].reverse()]) {
    const groups = buildSectorDirectory(input);
    assert.equal(
      entry(groups, "chandigarh", "40").href,
      "/flat-for-rent-in-sector-40-chandigarh",
    );
    assert.equal(
      group(groups, "chandigarh").sectors.filter((s) => s.label === "40")
        .length,
      1,
      "one sector must produce exactly one tile",
    );
  }

  // No flat page → the house page wins; only PG → the PG page.
  assert.equal(
    entry(
      buildSectorDirectory([
        "pg-in-sector-18-chandigarh",
        "house-for-rent-in-sector-18-chandigarh",
      ]),
      "chandigarh",
      "18",
    ).href,
    "/house-for-rent-in-sector-18-chandigarh",
  );
  assert.equal(
    entry(
      buildSectorDirectory(["pg-in-sector-18-chandigarh"]),
      "chandigarh",
      "18",
    ).href,
    "/pg-in-sector-18-chandigarh",
  );
});

test("landmark pages fill the locality lists of the non-grid cities", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-near-peer-muchalla-zirakpur",
    "house-for-rent-near-zirakpur-chowk-zirakpur",
    "pg-for-rent-near-kharar-bus-stand-kharar",
  ]);

  // Known locality matched by landmark name → live chip in its curated slot.
  assert.equal(
    entry(groups, "zirakpur", "Peer Muchalla").href,
    "/flat-for-rent-near-peer-muchalla-zirakpur",
  );
  assert.equal(entry(groups, "zirakpur", "VIP Road").href, undefined);

  // A live landmark that is not in the curated list is appended, not dropped.
  const zirakpur = group(groups, "zirakpur");
  assert.equal(zirakpur.sectors.length, 8);
  assert.equal(zirakpur.sectors[0].label, "VIP Road");
  assert.equal(zirakpur.sectors[7].label, "Zirakpur Chowk");
  assert.equal(
    zirakpur.sectors[7].href,
    "/house-for-rent-near-zirakpur-chowk-zirakpur",
  );

  const kharar = group(groups, "kharar");
  assert.equal(kharar.sectors.length, 6);
  assert.equal(kharar.sectors[5].label, "Kharar Bus Stand");
  assert.equal(
    kharar.sectors[5].href,
    "/pg-for-rent-near-kharar-bus-stand-kharar",
  );
});

test("city-wide and invalid slugs never fabricate entries", () => {
  const noise = [
    "property-for-rent-in-zirakpur-under-10-thousand", // price bucket: no locality
    "flat-for-rent-near-pgi-chandigarh", // landmark: grid city, not a sector tile
    "flat-for-rent-in-chandigarh", // category pages are always sector-scoped
    "PG-In-Sector-40-Chandigarh", // non-canonical casing
    "not-a-real-slug",
    "",
  ];
  assert.deepEqual(buildSectorDirectory(noise), buildSectorDirectory([]));
});

test("duplicate slugs are collapsed and grid order stays numeric", () => {
  const groups = buildSectorDirectory([
    "pg-in-sector-55-mohali",
    "pg-in-sector-55-mohali",
  ]);
  const mohali = group(groups, "mohali");
  assert.equal(mohali.sectors.length, MOHALI_SECTOR_COUNT);
  assert.equal(mohali.sectors[0].label, "55");
  assert.equal(mohali.sectors[0].href, "/pg-in-sector-55-mohali");
  assert.equal(mohali.sectors.filter((s) => s.href).length, 1);
});

/* ── Map pins (the /sectors map view) ────────────────────────────────────── */

test("sector numbers are extracted from sector fields and listing titles", () => {
  assert.equal(sectorNumberFromText("Sector 40"), "40");
  assert.equal(sectorNumberFromText("sector-12"), "12");
  assert.equal(sectorNumberFromText("40"), "40");
  assert.equal(sectorNumberFromText("Sector 40A"), "40");
  assert.equal(
    sectorNumberFromText("1 BHK Apartment for Rent in Sector 40, Chandigarh"),
    "40",
  );
  // Common landlord abbreviations also resolve.
  assert.equal(sectorNumberFromText("1 Room in 2bhk ,Sector-22c"), "22");
  assert.equal(sectorNumberFromText("Sec,22-C, 1bhk fully furnished"), "22");
  assert.equal(sectorNumberFromText("Sec-49 Chandigarh housing board"), "49");
  // 3-digit numbers, plain words and empty values are not sectors.
  assert.equal(sectorNumberFromText("Sector 140"), null);
  assert.equal(sectorNumberFromText("IT Park"), null);
  assert.equal(sectorNumberFromText(""), null);
  assert.equal(sectorNumberFromText(undefined), null);
});

test("grid map pins aggregate real listing coordinates per sector", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-in-sector-40-chandigarh",
  ]);
  const chd = group(groups, "chandigarh");

  const points = buildCityMapPoints(chd, [
    {
      title: "A",
      location: { sector: "Sector 40", coordinates: { lat: 30.7, lng: 76.7 } },
    },
    {
      title: "B",
      location: { sector: "Sector 40", coordinates: { lat: 30.72, lng: 76.72 } },
    },
    {
      title: "Flat in Sector 21",
      location: { sector: "", coordinates: { lat: 30.6, lng: 76.6 } },
    },
    {
      title: "C",
      location: { sector: "Phase 7", coordinates: { lat: 30.65, lng: 76.65 } },
    },
    // Out of Chandigarh's range — must not become a pin.
    {
      title: "D",
      location: { sector: "Sector 99", coordinates: { lat: 30.5, lng: 76.5 } },
    },
    // [0, 0] is the unset-coordinate default — never mappable.
    {
      title: "E",
      location: { sector: "Sector 16", coordinates: { lat: 0, lng: 0 } },
    },
    { title: "F", location: { sector: "Sector 16" } },
  ]);

  assert.equal(points.length, 3, "only the three mappable locations become pins");

  const sector40 = points.find((p) => p.id === "sector-40");
  assert.ok(sector40);
  assert.equal(sector40.title, "Sector 40");
  assert.ok(Math.abs(sector40.lat - 30.71) < 1e-9, "average of both listings");
  assert.ok(Math.abs(sector40.lng - 76.71) < 1e-9, "average of both listings");
  assert.equal(sector40.subtitle, "2 listings");
  assert.equal(sector40.badge, "40");
  assert.equal(sector40.href, "/flat-for-rent-in-sector-40-chandigarh");

  const sector21 = points.find((p) => p.id === "sector-21");
  assert.ok(sector21);
  assert.equal(sector21.subtitle, "1 listing · page coming soon");
  assert.equal(sector21.badge, "21");
  assert.equal(sector21.href, undefined);

  const phase = points.find((p) => p.id === "phase-7");
  assert.ok(phase);
  assert.equal(phase.title, "Phase 7");
});

test("locality map pins use curated landmark coordinates and live hrefs", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-near-peer-muchalla-zirakpur",
  ]);
  const zirakpur = group(groups, "zirakpur");

  const points = buildCityMapPoints(zirakpur, [
    {
      title: "Near Peer Muchalla",
      location: { coordinates: { lat: 30.632, lng: 76.856 } },
    },
  ]);

  assert.equal(points.length, 2, "Zirakpur's two curated landmarks");

  const peer = points.find((p) => p.id === "peer-muchalla");
  assert.ok(peer);
  assert.equal(peer.lat, 30.632);
  assert.equal(peer.lng, 76.856);
  assert.equal(peer.badge, undefined, "locality pins render as plain dots");
  assert.equal(peer.href, "/flat-for-rent-near-peer-muchalla-zirakpur");
  assert.match(peer.subtitle, /1 listing within 8 km/);

  const chowk = points.find((p) => p.id === "zirakpur-chowk");
  assert.ok(chowk);
  assert.equal(chowk.href, undefined, "no live page → info-only pin");

  const empty = buildCityMapPoints(zirakpur, []);
  assert.deepEqual(
    empty.map((p) => p.subtitle),
    ["No live listings yet", "No live listings yet"],
  );
  assert.equal(
    empty.find((p) => p.id === "peer-muchalla")?.href,
    "/flat-for-rent-near-peer-muchalla-zirakpur",
  );
});

/* ── SEO schema for the directory page ─────────────────────────────────── */

test("sectorDisplayLabel names grid sectors and leaves localities bare", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-in-sector-40-chandigarh",
    "flat-for-rent-near-peer-muchalla-zirakpur",
  ]);
  assert.equal(
    sectorDisplayLabel(entry(groups, "chandigarh", "40"), "grid"),
    "Sector 40",
  );
  assert.equal(
    sectorDisplayLabel(entry(groups, "zirakpur", "Peer Muchalla"), "list"),
    "Peer Muchalla",
    "locality names must never be prefixed with 'Sector'",
  );
});

test("live directory links are absolute, keyword-named, and exclude filler tiles", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-in-sector-40-chandigarh",
    // Peer Muchalla — a registered Zirakpur landmark. A slug whose landmark
    // is unknown (e.g. "vip-road") is rejected by parseRootSlug, so it must
    // never be treated as a live link.
    "flat-for-rent-near-peer-muchalla-zirakpur",
  ]);
  const links = collectLiveSectorLinks(groups);

  // Only entries that have a live page — the disabled filler tiles are never
  // advertised, so the schema can never describe a URL that 404s.
  assert.equal(links.length, 2);
  for (const link of links) {
    assert.ok(
      link.url.startsWith("https://www.propertybulbul.com/"),
      `${link.url} must be absolute`,
    );
    assert.ok(
      !link.url.includes("undefined"),
      "no link may leak an undefined path segment",
    );
  }

  assert.equal(
    links[0].url,
    "https://www.propertybulbul.com/flat-for-rent-in-sector-40-chandigarh",
  );
  assert.equal(links[0].name, "Sector 40, Chandigarh properties");
  assert.equal(links[1].name, "Peer Muchalla, Zirakpur properties");
});

test("directory schemas are well-formed and count only live entries", () => {
  const groups = buildSectorDirectory([
    "flat-for-rent-in-sector-40-chandigarh",
    "pg-in-sector-66-mohali",
  ]);
  const { collectionPage, itemList } = buildSectorDirectorySchemas(groups);

  assert.equal(collectionPage["@type"], "CollectionPage");
  assert.equal(collectionPage["@id"], "https://www.propertybulbul.com/sectors");
  assert.equal(collectionPage.url, "https://www.propertybulbul.com/sectors");
  assert.equal(collectionPage.description, SECTORS_DESCRIPTION);

  assert.equal(itemList["@type"], "ItemList");
  assert.equal(itemList.numberOfItems, 2);
  assert.equal(itemList.itemListElement.length, 2);

  // Positions are 1-based and contiguous, as ItemList requires.
  assert.deepEqual(
    itemList.itemListElement.map((el) => el.position),
    [1, 2],
  );
  for (const el of itemList.itemListElement) {
    assert.equal(el["@type"], "ListItem");
    assert.ok(el.url.startsWith("https://www.propertybulbul.com/"));
    assert.ok(el.name.length > 0);
  }

  // The CollectionPage points at the very same ItemList object it embeds.
  assert.equal(collectionPage.mainEntity, itemList);
});

test("schemas stay valid with zero live sectors (no empty ListItems)", () => {
  const { collectionPage, itemList } = buildSectorDirectorySchemas(
    buildSectorDirectory([]),
  );
  assert.equal(itemList.numberOfItems, 0);
  assert.deepEqual(itemList.itemListElement, []);
  // CollectionPage is still emitted so the page keeps its entity type.
  assert.equal(collectionPage["@type"], "CollectionPage");
});
