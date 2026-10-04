/**
 * Indian currency formatting.
 *
 * House rules for money across the product:
 *   - always the `₹` glyph, never "Rs" / "INR" in visible copy
 *   - always `toLocaleString("en-IN")` so the lakh/crore grouping is right
 *   - large amounts get an Indian short form alongside the exact figure
 *     (₹1.25 Cr, ₹45 L) because buyers scan the short form first
 *
 * Pure and dependency-free so it is safe to import from both server and
 * client components, and directly unit-testable with `node:test`.
 */

const CRORE = 10_000_000;
const LAKH = 100_000;

/** Thrown-away guard so callers can pass untyped API payloads straight in. */
function toAmount(value: unknown): number | null {
  // `Number("")` is 0, which would turn a missing price into "₹0".
  if (typeof value === "string" && value.trim() === "") return null;
  const n = typeof value === "string" ? Number(value.trim()) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return n;
}

/** `1.50` -> `1.5`, `1.00` -> `1`, `12.34` -> `12.34` */
function trimDecimals(n: number, places: number): string {
  return n.toFixed(places).replace(/\.?0+$/, "");
}

/**
 * Exact figure with the ₹ sign: `formatINR(12500000)` -> `"₹1,25,00,000"`.
 * Returns `""` for missing / non-numeric input so a bad payload can never
 * render "₹NaN" or "₹undefined" on the page.
 */
export function formatINR(amount: unknown): string {
  const n = toAmount(amount);
  if (n === null) return "";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/**
 * Compact Indian form: `"₹1.25 Cr"`, `"₹45 L"`.
 * Returns `null` below one lakh, where the short form saves no space and
 * the exact figure is easier to read anyway.
 */
export function formatShortINR(amount: unknown): string | null {
  const n = toAmount(amount);
  if (n === null || n < LAKH) return null;

  if (n >= CRORE) {
    return `₹${trimDecimals(n / CRORE, 2)} Cr`;
  }
  return `₹${trimDecimals(n / LAKH, 2)} L`;
}

/**
 * The pair used wherever a big price is shown: the exact amount plus, when
 * it adds something, the short form. Example:
 *   { full: "₹1,25,00,000", short: "₹1.25 Cr" }
 */
export function formatPriceWithShort(amount: unknown): {
  full: string;
  short: string | null;
} {
  return { full: formatINR(amount), short: formatShortINR(amount) };
}

/** Price per square foot, e.g. `"₹6,250/sq ft"`. */
export function formatPricePerSqft(amount: unknown): string {
  const full = formatINR(amount);
  return full ? `${full}/sq ft` : "";
}
