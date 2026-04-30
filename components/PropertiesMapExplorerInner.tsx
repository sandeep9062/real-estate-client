"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function validCoord(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !(Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6)
  );
}

function MapDrawToolbar({
  drawMode,
  setDrawMode,
  ring,
  setRing,
  onPolygonApply,
}: {
  drawMode: boolean;
  setDrawMode: React.Dispatch<React.SetStateAction<boolean>>;
  ring: [number, number][];
  setRing: React.Dispatch<React.SetStateAction<[number, number][]>>;
  onPolygonApply?: (polygonJson: string) => void;
}) {
  return (
    <div className="pointer-events-none absolute top-3 right-3 z-[400] flex max-w-[85%] flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={() => {
          setDrawMode((d) => {
            const next = !d;
            if (d) setRing([]);
            return next;
          });
        }}
        className={`pointer-events-auto rounded-lg px-3 py-2 text-xs font-semibold shadow-md ${
          drawMode
            ? "bg-amber-500 text-white"
            : "border border-gray-200 bg-white/95 text-gray-800"
        }`}
      >
        {drawMode ? "Exit draw" : "Draw area"}
      </button>
      {drawMode && (
        <>
          <button
            type="button"
            onClick={() => setRing([])}
            className="pointer-events-auto rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs font-semibold shadow-md"
          >
            Clear shape
          </button>
          <button
            type="button"
            disabled={ring.length < 3}
            onClick={() => {
              if (ring.length < 3 || !onPolygonApply) return;
              onPolygonApply(JSON.stringify(ring));
              setDrawMode(false);
              setRing([]);
            }}
            className="pointer-events-auto rounded-lg bg-[#4161df] px-3 py-2 text-xs font-semibold text-white shadow-md disabled:opacity-50"
          >
            Apply outline
          </button>
        </>
      )}
    </div>
  );
}

export interface PropertiesMapExplorerProps {
  properties: any[];
  selectedId?: string | null;
  onSelectProperty?: (id: string) => void;
  onSearchThisArea?: (bbox: string) => void;
  onPolygonApply?: (polygonJson: string) => void;
  heightClass?: string;
}

const DEFAULT_MAP_CENTER = L.latLng(30.75, 76.78);
const OSM_TILE =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

/** Imperative Leaflet only—no react-leaflet MapContainer (avoids "already initialized" under Strict Mode / Turbopack). */
export default function PropertiesMapExplorerInner({
  properties,
  selectedId,
  onSelectProperty,
  onSearchThisArea,
  onPolygonApply,
  heightClass = "h-[min(52vh,480px)]",
}: PropertiesMapExplorerProps) {
  const [drawMode, setDrawMode] = useState(false);
  const [ring, setRing] = useState<[number, number][]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterLayerRef = useRef<L.Layer | null>(null);
  const drawLayerRef = useRef<L.Layer | null>(null);

  const handleAddPoint = useCallback((lng: number, lat: number) => {
    setRing((r) => [...r, [lng, lat]]);
  }, []);

  const handleSearchBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !onSearchThisArea) return;
    const b = map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    onSearchThisArea(`${sw.lng},${sw.lat},${ne.lng},${ne.lat}`);
  }, [onSearchThisArea]);

  // Create / destroy map (single owner of the container DOM)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: DEFAULT_MAP_CENTER,
      zoom: 12,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer(OSM_TILE, { attribution: OSM_ATTR }).addTo(map);

    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      clusterLayerRef.current = null;
      drawLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Marker clusters + fit bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (clusterLayerRef.current) {
      map.removeLayer(clusterLayerRef.current);
      clusterLayerRef.current = null;
    }

    const mcg = (L as any).markerClusterGroup({ chunkedLoading: true });
    const coords: [number, number][] = [];

    for (const p of properties) {
      const lat = p.location?.coordinates?.lat;
      const lng = p.location?.coordinates?.lng;
      if (!validCoord(lat, lng)) continue;
      coords.push([lat, lng]);
      const m = L.marker([lat, lng], { icon: defaultIcon });
      const id = String(p._id || p.id);
      m.on("click", () => onSelectProperty?.(id));
      m.bindPopup(
        `<div class="max-w-[200px]"><div class="font-semibold text-sm">${p.title || "Listing"}</div><div class="text-xs text-gray-600 mt-1">₹${(p.price || 0).toLocaleString("en-IN")}</div></div>`,
      );
      mcg.addLayer(m);
    }

    map.addLayer(mcg);
    clusterLayerRef.current = mcg;

    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else if (coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords).pad(0.15));
    }

    return () => {
      map.removeLayer(mcg);
      if (clusterLayerRef.current === mcg) clusterLayerRef.current = null;
    };
  }, [properties, onSelectProperty]);

  // Draw mode: map clicks add vertices
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !drawMode) return;
    const onClick = (e: L.LeafletMouseEvent) => {
      handleAddPoint(e.latlng.lng, e.latlng.lat);
    };
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [drawMode, handleAddPoint]);

  // Polyline / polygon while drawing
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (drawLayerRef.current) {
      map.removeLayer(drawLayerRef.current);
      drawLayerRef.current = null;
    }

    const latlngs = ring.map(([lng, lat]) => L.latLng(lat, lng));
    let layer: L.Layer | null = null;

    if (ring.length >= 3 && drawMode) {
      layer = L.polygon(latlngs, {
        color: "#4161df",
        fillOpacity: 0.12,
        weight: 2,
      });
    } else if (ring.length > 1) {
      layer = L.polyline(latlngs, { color: "#4161df", weight: 3 });
    }

    if (layer) {
      layer.addTo(map);
      drawLayerRef.current = layer;
    }

    return () => {
      if (drawLayerRef.current) {
        map.removeLayer(drawLayerRef.current);
        drawLayerRef.current = null;
      }
    };
  }, [ring, drawMode]);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm ${heightClass}`}
    >
      <div
        ref={containerRef}
        className="relative z-0 h-full w-full min-h-[240px]"
      />

      <MapDrawToolbar
        drawMode={drawMode}
        setDrawMode={setDrawMode}
        ring={ring}
        setRing={setRing}
        onPolygonApply={onPolygonApply}
      />

      {onSearchThisArea && (
        <div className="absolute bottom-3 left-3 z-[400]">
          <button
            type="button"
            onClick={handleSearchBounds}
            className="rounded-lg bg-[#4161df] px-3 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Search this map area
          </button>
        </div>
      )}

      {selectedId && (
        <p className="pointer-events-none absolute bottom-12 left-3 right-3 z-[500] truncate rounded bg-white/90 px-2 py-1 text-[11px] text-gray-600">
          Map and list stay in sync when you pick a listing.
        </p>
      )}
    </div>
  );
}
