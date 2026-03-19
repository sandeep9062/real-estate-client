"use client";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  setLocation?: (location: { lat: number; lng: number }) => void;
  location?: { lat: number; lng: number };
}

const Map = ({ setLocation, location }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const [position, setPosition] = useState<[number, number]>(
    location && location.lat && location.lng
      ? [location.lat, location.lng]
      : [30.751851738730274, 76.77228927612306]
  );

  // Update position when location prop changes
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(position, {
      icon: L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    }).addTo(map);

    // Handle map clicks if setLocation is provided
    if (setLocation) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
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

  // Update map position when position changes
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setView(position, 13);
      // Reset marker position (assuming marker is on the map)
      const markers = (mapInstance as any)._layers;
      for (const key in markers) {
        if (markers[key] instanceof L.Marker) {
          markers[key].setLatLng(position);
        }
      }
    }
  }, [position, mapInstance]);

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
