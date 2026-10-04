"use client";

import { useEffect, useState } from "react";

export type PropertySection = { id: string; label: string };

/**
 * Slim sticky jump bar under the gallery.
 *
 * The active section is derived from an IntersectionObserver rather than a
 * scroll handler, so the main thread does no work while the user scrolls.
 *
 * Rendered as plain `<a href="#id">` anchors on purpose: they work without
 * JavaScript, are keyboard-operable, and let Lenis handle the smooth scroll.
 */
export default function PropertySectionNav({
  sections,
}: {
  sections: PropertySection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  // `sections` is a fresh array on every parent render, so depend on a stable
  // key of ids instead — otherwise the observer would be torn down and rebuilt
  // on each render.
  const idsKey = sections.map((s) => s.id).join(",");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (!visible.size) return;
        // Topmost visible section wins.
        const next = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
        setActiveId((prev) => (prev === next ? prev : next));
      },
      // Bias the "reading line" towards the top of the viewport so a section
      // becomes active as its heading reaches the bar.
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 },
    );

    for (const id of idsKey ? idsKey.split(",") : []) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [idsKey]);

  // Sections can change between listings; don't keep a stale active tab.
  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    if (ids.length && !ids.includes(activeId)) setActiveId(ids[0]);
  }, [idsKey, activeId]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Property sections"
      // Hidden on mobile: the fixed bottom action bar owns that space.
      className="sticky top-16 z-30 -mx-4 mb-8 hidden border-y border-slate-200 bg-white/95 px-4 backdrop-blur lg:block"
    >
      <ul className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex h-12 items-center border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4161df] ${
                  isActive
                    ? "border-[#4161df] text-[#3049b8]"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}