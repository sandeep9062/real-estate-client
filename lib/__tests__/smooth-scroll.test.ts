/**
 * Unit tests for the smooth-scroll helpers (lib/smooth-scroll.ts).
 * Run with: `npm test` (node:test — Node ≥ 23.6 strips TS types natively).
 *
 * These cover the DOM-free logic only. The Lenis instance itself is created in
 * a browser and is exercised by hand; what matters here is that the fallbacks
 * used when no instance exists are correct, since that is the path taken by
 * reduced-motion users.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EASING,
  SCROLL_DURATION,
  parseNavbarOffset,
} from "../smooth-scroll.ts";

test("parseNavbarOffset: reads plain px values", () => {
  assert.equal(parseNavbarOffset("64px"), 64);
  assert.equal(parseNavbarOffset("0"), 0);
});

test("parseNavbarOffset: tolerates whitespace and unit suffixes", () => {
  // getPropertyValue() returns the raw declaration, which may carry a space
  // or be authored in a different unit than we expect.
  assert.equal(parseNavbarOffset("  72px "), 72);
  assert.equal(parseNavbarOffset("3.5rem"), 3.5);
});

test("parseNavbarOffset: falls back to 0 for missing/invalid values", () => {
  // An unset custom property yields "", and parseFloat("") is NaN — a NaN
  // offset would silently break every anchor scroll, so this must be 0.
  assert.equal(parseNavbarOffset(""), 0);
  assert.equal(parseNavbarOffset("   "), 0);
  assert.equal(parseNavbarOffset("auto"), 0);
  assert.equal(parseNavbarOffset("undefined"), 0);
});

test("EASING is monotonic and clamped to [0, 1]", () => {
  // Note: EASING(0) is 0.001, not 0. That is deliberate — the 1.001 factor in
  // the curve guarantees a non-zero first step so the scroll never stalls for
  // a frame before it starts. Only the END must be exactly 1.
  assert.ok(Math.abs(EASING(0) - 0.001) < 1e-9);
  assert.equal(EASING(1), 1, "must land exactly on 1");
  // Past the end of the tween it must stay pinned, never overshoot.
  assert.equal(EASING(1.5), 1);
  assert.equal(EASING(5), 1);

  let previous = -1;
  for (let t = 0; t <= 1; t += 0.05) {
    const value = EASING(t);
    assert.ok(value >= previous, `easing must not go backwards at t=${t}`);
    assert.ok(value >= 0 && value <= 1, `easing out of range at t=${t}`);
    previous = value;
  }
});

test("EASING front-loads the motion (ease-out, not ease-in)", () => {
  // Halfway through the tween an ease-out curve is already well past halfway.
  // This is the "fast start, soft landing" feel the scroll is tuned for.
  assert.ok(EASING(0.5) > 0.5, `expected progress > 0.5, got ${EASING(0.5)}`);
});

test("SCROLL_DURATION is a sane, non-instant value", () => {
  // Lenis takes this in seconds. Sub-0.3 reads as a jump; over ~2.5 feels laggy.
  assert.ok(SCROLL_DURATION >= 0.3 && SCROLL_DURATION <= 2.5);
});