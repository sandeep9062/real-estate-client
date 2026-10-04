/**
 * Unit tests for the Indian currency helpers (`lib/formatPrice.ts`).
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatINR,
  formatPricePerSqft,
  formatPriceWithShort,
  formatShortINR,
} from "../formatPrice.ts";

test("formatINR uses the rupee glyph and en-IN grouping", () => {
  assert.equal(formatINR(12500000), "₹1,25,00,000");
  assert.equal(formatINR(4500000), "₹45,00,000");
  assert.equal(formatINR(45000), "₹45,000");
  assert.equal(formatINR(0), "₹0");
  assert.equal(formatINR(999), "₹999");
  // Fractions are not meaningful for prices — they are rounded, not truncated.
  assert.equal(formatINR(45000.4), "₹45,000");
});

test("formatINR never leaks NaN/undefined into the page", () => {
  for (const bad of [undefined, null, "", "abc", NaN, Infinity, {}]) {
    assert.equal(formatINR(bad), "", `expected "" for ${String(bad)}`);
  }
});

test("formatShortINR renders crore and lakh with trimmed zeros", () => {
  assert.equal(formatShortINR(12500000), "₹1.25 Cr");
  assert.equal(formatShortINR(45000000), "₹4.5 Cr");
  assert.equal(formatShortINR(10000000), "₹1 Cr");
  // 12.35 lakh stays in lakhs — crore only starts at one crore.
  assert.equal(formatShortINR(1234567), "₹12.35 L");
  assert.equal(formatShortINR(12345678), "₹1.23 Cr");
  assert.equal(formatShortINR(450000), "₹4.5 L");
  assert.equal(formatShortINR(100000), "₹1 L");
  assert.equal(formatShortINR(4500000), "₹45 L");
});

test("formatShortINR returns null when the short form adds nothing", () => {
  // Rent figures live here: the exact amount is shorter than "₹9.5 K".
  for (const small of [0, 999, 45000, 99999]) {
    assert.equal(formatShortINR(small), null, `expected null for ${small}`);
  }
  for (const bad of [undefined, null, "", "abc", NaN]) {
    assert.equal(formatShortINR(bad), null);
  }
});

test("formatPriceWithShort pairs the exact and compact figures", () => {
  assert.deepEqual(formatPriceWithShort(12500000), {
    full: "₹1,25,00,000",
    short: "₹1.25 Cr",
  });
  assert.deepEqual(formatPriceWithShort(45000), {
    full: "₹45,000",
    short: null,
  });
  assert.deepEqual(formatPriceWithShort(undefined), { full: "", short: null });
});

test("formatPricePerSqft appends the unit and stays empty when missing", () => {
  assert.equal(formatPricePerSqft(6250), "₹6,250/sq ft");
  assert.equal(formatPricePerSqft(undefined), "");
});
