"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  EASING,
  SCROLL_DURATION,
  prefersReducedMotion,
  scrollToElement,
  scrollToTop,
  setLenis,
} from "@/lib/smooth-scroll";

/**
 * SmoothScroll — buttery, momentum-based page scrolling powered by Lenis.
 *
 * Mount this ONCE, high in the tree (app/layout.tsx), and keep it mounted
 * across route transitions: tearing down and re-creating the instance on every
 * navigation drops the in-flight animation and re-measures the document.
 *
 * - Initialised once on mount (autoRaf handles the rAF loop, no manual loop needed)
 * - Respects `prefers-reduced-motion` (skips smoothing for users who opt out)
 * - Scrolls to top on route change so new pages never open mid-way down
 * - Handles `#anchor` links with an offset for the fixed navbar
 * - Publishes the instance through lib/smooth-scroll.ts, so buttons like
 *   ScrollToTopButton get smooth scrolling without importing Lenis themselves
 */

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1) Create / destroy the Lenis instance once.
  useEffect(() => {
    // Accessibility: don't hijack scrolling for users who prefer reduced motion.
    // Helpers in lib/smooth-scroll.ts fall back to native scrolling when no
    // instance is registered, so anchors and scroll-to-top still work.
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: SCROLL_DURATION,
      easing: EASING,
      smoothWheel: true,
      touchMultiplier: 1.5,
      // Native-like on touch for perf; wheel/trackpad gets the smoothing.
      syncTouch: false,
      // Handles same-page `#anchor` clicks. The navbar clearance comes from
      // `scroll-padding-top` on <html> (see globals.css).
      anchors: true,
    });

    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // 2) On route change: jump straight to top (no animated sweep across pages).
  //    If the URL has a #hash, smooth-scroll to that element instead, clearing
  //    the fixed navbar (Lenis applies scroll-padding-top for us).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait a tick so the new page's DOM is painted before measuring.
      const id = requestAnimationFrame(() => {
        // An arbitrary hash isn't guaranteed to be a valid CSS selector
        // (e.g. "#a:b" throws), so guard the lookup.
        let el: HTMLElement | null = null;
        try {
          el = document.querySelector(hash);
        } catch {
          el = null;
        }

        if (el instanceof HTMLElement) {
          scrollToElement(el);
        } else {
          // Anchor points at something that isn't on this page.
          scrollToTop({ immediate: true });
        }
      });
      return () => cancelAnimationFrame(id);
    }

    scrollToTop({ immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
