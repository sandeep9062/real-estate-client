/**
 * Smooth-scroll helpers — the single source of truth for the Lenis instance.
 *
 * `components/SmoothScroll.tsx` owns the Lenis lifecycle (create/destroy) and
 * publishes the instance here via `setLenis()`. Everything else in the app
 * calls the exported helpers instead of touching `lenis` directly, so there is
 * exactly one place that knows a smooth-scroll engine is running.
 *
 * Every helper degrades gracefully to the platform's native smooth scrolling
 * when no instance is registered. That matters because Lenis is intentionally
 * NOT started for users who prefer reduced motion — the anchor links and the
 * scroll-to-top button still have to work for them.
 */

import type Lenis from "lenis";

export type LenisInstance = Lenis;

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * Ease-out expo — fast start, soft landing. Feels premium without being floaty.
 * Matches Lenis's own default easing; kept explicit so every animated scroll
 * in the app (anchors, scroll-to-top, map selection) feels identical.
 */
export const EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** Duration in seconds used for every programmatic scroll. */
export const SCROLL_DURATION = 1.2;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the user asked the OS to minimise animation.
 *
 * Lenis is not instantiated in that case, so every helper below transparently
 * falls back to native scrolling. Read the preference on each call rather than
 * caching it at module scope: it can change while the tab is open.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Registers (or clears) the active Lenis instance. Called by the
 * `SmoothScroll` provider on mount/unmount.
 */
export function setLenis(instance: Lenis | null): void {
  if (typeof window === "undefined") return;
  window.__lenis = instance;
}

/** Returns the active Lenis instance, or `null` when smoothing is off. */
export function getLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  return window.__lenis ?? null;
}

/**
 * Height of the fixed navbar, in px, read from the `--navbar-height` CSS
 * variable defined in `globals.css`.
 *
 * This is the fallback offset used by `scrollToElement`. The main path is
 * CSS `scroll-padding-top` on <html>, which Lenis and the browser both apply
 * automatically; this exists so we can reason about "is it already visible?"
 * without forcing a synchronous layout read.
 */
export function getNavbarOffset(): number {
  if (typeof document === "undefined") return 0;
  return parseNavbarOffset(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--navbar-height",
    ),
  );
}

/** Parses a CSS length into px. Returns 0 for empty/invalid values. */
export function parseNavbarOffset(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Scrolls to the very top of the page.
 *
 * Used by the scroll-to-top button and on route changes. Route changes pass
 * `immediate` so navigating between pages is a hard cut rather than a long
 * animated sweep from the bottom of one page to the top of the next.
 */
export function scrollToTop({ immediate = false } = {}): void {
  if (typeof window === "undefined") return;

  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(0, {
      immediate,
      duration: immediate ? undefined : SCROLL_DURATION,
      easing: EASING,
    });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
}

/**
 * Scrolls an element into view, honouring the fixed navbar.
 *
 * @param el       Target element.
 * @param immediate Skip the animation (used on route changes with a #hash).
 * @param nearest  Only scroll if the element isn't already comfortably in
 *                 view. This preserves the old `block: "nearest"` behaviour
 *                 used when a property is selected from the map — without it,
 *                 picking a nearby pin would yank the whole page.
 */
export function scrollToElement(
  el: HTMLElement,
  { immediate = false, nearest = false }: { immediate?: boolean; nearest?: boolean } = {},
): void {
  if (typeof window === "undefined" || !el) return;

  const lenis = getLenis();

  // Native path has no "nearest", so do the visibility test ourselves.
  if (nearest) {
    const top = el.getBoundingClientRect().top;
    const bottom = el.getBoundingClientRect().bottom;
    const safeTop = getNavbarOffset();
    const viewport = window.innerHeight || 0;
    if (top >= safeTop && bottom <= viewport) return;
  }

  if (lenis) {
    // Offset 0: the navbar clearance comes from `scroll-padding-top` on
    // <html>, which Lenis subtracts for us. Passing an offset here as well
    // would double-count and overshoot past the target.
    lenis.scrollTo(el, {
      immediate,
      offset: 0,
      duration: immediate ? undefined : SCROLL_DURATION,
      easing: EASING,
    });
    return;
  }

  el.scrollIntoView({
    behavior: immediate ? "auto" : "smooth",
    block: "start",
  });
}