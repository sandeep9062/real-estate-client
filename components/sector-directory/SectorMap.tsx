"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  subtitle?: string;
  id?: string;
  /**
   * Optional short text rendered inside the pin disc (e.g. the sector number
   * "40"). Pins without a badge render as a plain dot.
   */
  badge?: string;
  /**
   * When set, the pin is a *navigation* pin: clicking it opens this URL
   * (used by /sectors, where each pin is a sector/locality page).
   * Pins without `href` open an info popup instead.
   */
  href?: string;
}

interface MapProps {
  setLocation?: (location: { lat: number; lng: number }) => void;
  location?: { lat: number; lng: number };
  /**
   * Browse mode: render one pin per listing + auto-fit bounds.
   * When provided (non-empty), the single "position" marker is hidden and
   * these markers are shown instead. Click-to-pick still works if
   * `setLocation` is also given.
   */
  markers?: MapMarker[];
}

const DEFAULT_CENTER: [number, number] = [
  30.751851738730274, 76.77228927612306,
];

/**
 * The map is only ever useful inside the tricity (Chandigarh, Mohali,
 * Panchkula, Zirakpur, Kharar) — panning/zooming out to the rest of India is
 * noise, so the viewport is clamped to this box.
 */
const TRICITY_BOUNDS = L.latLngBounds([30.45, 76.3], [31.1, 77.2]);

/** Escape user-generated text before it goes into Leaflet's string-based
 * popup/tooltip HTML (listing titles are landlord-supplied, so an unescaped
 * `<` here would be a stored-XSS sink). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type PinVariant = "live" | "info";

const PIN_COLORS: Record<PinVariant, { bg: string; ring: string }> = {
  live: { bg: "#4161df", ring: "rgba(65, 97, 223, 0.22)" },
  info: { bg: "#94a3b8", ring: "rgba(148, 163, 184, 0.24)" },
};

/**
 * Brand-styled pin: a numbered disc for grid sectors ("40"), a plain dot for
 * everything else. Blue = clickable (has a live page), grey = listings-only.
 * Built as a divIcon instead of Leaflet's default PNG marker so the page
 * matches the site palette and doesn't depend on the unpkg.com icon CDN.
 */
function pinIcon(variant: PinVariant, badge?: string) {
  const { bg, ring } = PIN_COLORS[variant];
  const shadow = `0 0 0 3px ${ring}, 0 2px 6px rgba(15, 23, 42, 0.35)`;
  const html = badge
    ? `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${bg};color:#fff;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;border:2px solid #fff;box-shadow:${shadow}">${escapeHtml(badge)}</span>`
    : `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${bg};border:3px solid #fff;box-shadow:${shadow}"></span>`;
  return L.divIcon({
    className: "",
    html,
    iconSize: badge ? [26, 26] : [20, 20],
    iconAnchor: badge ? [13, 13] : [10, 10],
    popupAnchor: [0, badge ? -14 : -10],
    tooltipAnchor: [0, badge ? -14 : -10],
  });
}

const SectorMap = ({ setLocation, location, markers }: MapProps) => {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const singleMarkerRef = useRef<L.Marker | null>(null);

  const [position, setPosition] = useState<[number, number]>(
    location && location.lat && location.lng
      ? [location.lat, location.lng]
      : DEFAULT_CENTER,
  );

  const hasMarkers = Array.isArray(markers) && markers.length > 0;

  // Update position when location prop changes (single-pick mode)
  useEffect(() => {
    if (location && location.lat && location.lng) {
      setPosition([location.lat, location.lng]);
    }
  }, [location]);

  useEffect(() => {
    if (!mapRef.current || mapInstance) return;

    // Initialize map — no +/- button controls: users pan by dragging and
    // zoom by scrolling (wheel-zoom engages on focus, see below), so the
    // whole Tricity is explored right on the canvas with no city switcher.
    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      minZoom: 11,
      maxBounds: TRICITY_BOUNDS,
      maxBoundsViscosity: 1,
    }).setView(position, 13);

    // Wheel-zoom only while the map has focus (Leaflet focuses the container
    // on click) — before that the wheel keeps scrolling the page instead of
    // being hijacked whenever the cursor crosses the map.
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const singleMarker = L.marker(position, {
      icon: pinIcon("live"),
    }).addTo(map);
    singleMarkerRef.current = singleMarker;

    const layer = L.layerGroup().addTo(map);
    markersLayerRef.current = layer;

    // Handle map clicks if setLocation is provided
    if (setLocation) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        singleMarker.setLatLng([lat, lng]);
        setPosition([lat, lng]);
        setLocation({ lat, lng });
      });
    }

    setMapInstance(map);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef]);

  // Single-pick mode: keep map + pin in sync (hidden while browse markers show)
  useEffect(() => {
    if (!mapInstance || !singleMarkerRef.current) return;
    if (hasMarkers) {
      singleMarkerRef.current.remove();
      return;
    }
    if (!mapInstance.hasLayer(singleMarkerRef.current)) {
      singleMarkerRef.current.addTo(mapInstance);
    }
    singleMarkerRef.current.setLatLng(position);
    mapInstance.setView(position, 13);
  }, [position, mapInstance, hasMarkers]);

  // Browse mode: render one pin per listing + fit bounds
  useEffect(() => {
    const map = mapInstance;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (!hasMarkers) return;

    const pts: [number, number][] = [];
    for (const m of markers!) {
      if (
        typeof m.lat !== "number" ||
        typeof m.lng !== "number" ||
        !Number.isFinite(m.lat) ||
        !Number.isFinite(m.lng)
      ) {
        continue;
      }
      pts.push([m.lat, m.lng]);
      const pin = L.marker([m.lat, m.lng], {
        icon: pinIcon(m.href ? "live" : "info", m.badge),
      });
      const title = escapeHtml(m.title || "Listing");
      pin.bindTooltip(m.href ? `${title} — click to open` : title, {
        direction: "top",
        offset: [0, -28],
      });

      if (m.href) {
        // Navigation pin (e.g. /sectors): clicking opens the target page.
        const href = m.href;
        pin.on("click", () => router.push(href));
      } else {
        // Info pin: popup with the (escaped) details.
        const sub = m.subtitle
          ? `<div class="text-xs text-gray-600 mt-1">${escapeHtml(m.subtitle)}</div>`
          : "";
        pin.bindPopup(
          `<div class="max-w-[200px]"><div class="font-semibold text-sm">${title}</div>${sub}</div>`,
        );
      }
      layer.addLayer(pin);
    }

    if (pts.length === 1) {
      map.setView(pts[0], 14);
    } else if (pts.length > 1) {
      map.fitBounds(L.latLngBounds(pts).pad(0.15));
    }
  }, [mapInstance, markers, hasMarkers, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{ height: "80vh", width: "100%" }} />
  );
};

export default SectorMap;
