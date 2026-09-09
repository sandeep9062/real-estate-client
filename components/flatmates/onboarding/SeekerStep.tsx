"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Divider, SimpleGrid, Text, TextInput } from "@mantine/core";
import type { BudgetRangeDraft, SearchAreaDraft } from "./types";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export interface SeekerStepProps {
  searchArea: SearchAreaDraft;
  budgetRange: BudgetRangeDraft;
  onSearchArea: (key: string, value: any) => void;
  onBudget: (key: "min" | "max", value: string) => void;
}

/**
 * Step 2 for seeker intents (seeking_room / temporary_seek) — every
 * searchArea + budgetRange field.
 */
export default function SeekerStep({
  searchArea,
  budgetRange,
  onSearchArea,
  onBudget,
}: SeekerStepProps) {
  const latNum = Number(searchArea.lat);
  const lngNum = Number(searchArea.lng);
  const hasCoords =
    searchArea.lat !== "" &&
    searchArea.lng !== "" &&
    Number.isFinite(latNum) &&
    Number.isFinite(lngNum);

  return (
    <>
      <Text fw={700} size="md" mb={8}>
        Where are you looking?
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="City"
          withAsterisk
          placeholder="e.g. Chandigarh"
          value={searchArea.city}
          onChange={(e) => onSearchArea("city", e.currentTarget.value)}
        />
        <TextInput
          label="Locality"
          placeholder="e.g. Sector 17"
          value={searchArea.locality}
          onChange={(e) => onSearchArea("locality", e.currentTarget.value)}
        />
      </SimpleGrid>

      <TextInput
        label="Search radius (km)"
        type="number"
        value={searchArea.radiusKm}
        onChange={(e) => onSearchArea("radiusKm", e.currentTarget.value)}
      />

      <Text size="sm" fw={500} mt="md" mb={4}>
        Pick on map (latitude &amp; longitude)
      </Text>
      <Text size="xs" c="dimmed" mb={8}>
        Click on the map to drop a pin — the latitude &amp; longitude fields
        update automatically. You can also type them manually.
      </Text>
      <div className="w-full h-72 rounded-lg overflow-hidden border border-gray-300">
        <Map
          location={hasCoords ? { lat: latNum, lng: lngNum } : undefined}
          setLocation={(coords: { lat: number; lng: number }) => {
            onSearchArea("lat", String(coords.lat));
            onSearchArea("lng", String(coords.lng));
          }}
        />
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
        <TextInput
          label="Latitude"
          type="number"
          placeholder="e.g. 30.7333"
          value={searchArea.lat}
          onChange={(e) => onSearchArea("lat", e.currentTarget.value)}
        />
        <TextInput
          label="Longitude"
          type="number"
          placeholder="e.g. 76.7794"
          value={searchArea.lng}
          onChange={(e) => onSearchArea("lng", e.currentTarget.value)}
        />
      </SimpleGrid>

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Budget
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Min rent (₹/month)"
          type="number"
          value={budgetRange.min}
          onChange={(e) => onBudget("min", e.currentTarget.value)}
        />
        <TextInput
          label="Max rent (₹/month)"
          type="number"
          value={budgetRange.max}
          onChange={(e) => onBudget("max", e.currentTarget.value)}
        />
      </SimpleGrid>
    </>
  );
}