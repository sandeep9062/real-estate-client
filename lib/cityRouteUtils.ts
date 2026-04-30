const SLUGS = ["chandigarh", "mohali", "panchkula", "kharar", "zirakpur"] as const;

const DISPLAY_NAME: Record<(typeof SLUGS)[number], string> = {
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  kharar: "Kharar",
  zirakpur: "Zirakpur",
};

/**
 * Map a `city` query value (slug or display name) to the `/properties/[city]` path segment.
 */
export function cityFilterToPathSlug(
  cityVal: string | undefined | null,
): string {
  if (!cityVal || typeof cityVal !== "string") return "chandigarh";
  const raw = cityVal.trim().toLowerCase().replace(/\s+/g, "");
  if ((SLUGS as readonly string[]).includes(raw)) return raw;
  const match = (Object.entries(DISPLAY_NAME) as [string, string][]).find(
    ([, label]) => label.toLowerCase().replace(/\s+/g, "") === raw,
  );
  if (match) return match[0];
  return "chandigarh";
}

export function buildSavedSearchHref(filters: Record<string, unknown> | undefined) {
  const f = filters ? { ...filters } : {};
  const slug = cityFilterToPathSlug(f.city as string | undefined);
  const params = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v == null || v === "") return;
    params.set(k, String(v));
  });
  return `/properties/${slug}?${params.toString()}`;
}
