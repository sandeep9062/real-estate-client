"use client";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  subtitle?: string;
  id?: string;
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

const DEFAULT_CENTER: [number, number] = [30.751851738730274, 76.77228927612306];

function markerIcon() {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

const Map = ({ setLocation, location, markers }: MapProps) => {
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

    // Initialize map
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView(position, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const singleMarker = L.marker(position, {
      icon: markerIcon(),
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
      const pin = L.marker([m.lat, m.lng], { icon: markerIcon() });
      const title = m.title || "Listing";
      const sub = m.subtitle
        ? `<div class="text-xs text-gray-600 mt-1">${m.subtitle}</div>`
        : "";
      pin.bindPopup(
        `<div class="max-w-[200px]"><div class="font-semibold text-sm">${title}</div>${sub}</div>`,
      );
      layer.addLayer(pin);
    }

    if (pts.length === 1) {
      map.setView(pts[0], 14);
    } else if (pts.length > 1) {
      map.fitBounds(L.latLngBounds(pts).pad(0.15));
    }
  }, [mapInstance, markers, hasMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

export default Map;
