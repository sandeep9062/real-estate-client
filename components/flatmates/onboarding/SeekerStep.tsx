"use client";

import React from "react";
import { Divider, SimpleGrid, Text, TextInput } from "@mantine/core";
import type { BudgetRangeDraft, SearchAreaDraft } from "./types";

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

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <TextInput
          label="Search radius (km)"
          type="number"
          value={searchArea.radiusKm}
          onChange={(e) => onSearchArea("radiusKm", e.currentTarget.value)}
        />
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