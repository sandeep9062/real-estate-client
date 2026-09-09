"use client";

import React from "react";
import {
  Divider,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { OPTIONS, enumData } from "./options";
import type { RoomFlatDraft } from "./types";

export interface PropertyStepProps {
  roomFlat: RoomFlatDraft;
  onField: (key: string, value: any) => void;
  onLocationExtra: (key: string, value: string) => void;
}

/**
 * Step 2 for property intents (has_room / swap / temporary_offer) — the
 * RoomFlat base fields, laid out two per row.
 */
export default function PropertyStep({
  roomFlat,
  onField,
  onLocationExtra,
}: PropertyStepProps) {
  return (
    <>
      <Text fw={700} size="md" mb={8}>
        Listing basics
      </Text>

      <TextInput
        label="Listing title"
        withAsterisk
        placeholder="e.g. Sunny private room in Sector 21"
        value={roomFlat.title}
        onChange={(e) => onField("title", e.currentTarget.value)}
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Rent (₹/month)"
          withAsterisk
          type="number"
          value={roomFlat.rentAmount}
          onChange={(e) => onField("rentAmount", e.currentTarget.value)}
        />
        <TextInput
          label="Security deposit (₹)"
          type="number"
          value={roomFlat.securityDeposit}
          onChange={(e) => onField("securityDeposit", e.currentTarget.value)}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="Room type"
          data={enumData(OPTIONS.roomType)}
          value={roomFlat.roomType || null}
          onChange={(value) => onField("roomType", value || "")}
        />
        <Select
          label="Furnishing"
          placeholder="Select…"
          data={enumData(OPTIONS.furnishing)}
          value={roomFlat.furnishing || null}
          onChange={(value) => onField("furnishing", value || "")}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Available from"
          type="date"
          value={roomFlat.availableFrom}
          onChange={(e) => onField("availableFrom", e.currentTarget.value)}
        />
        <TextInput
          label="Minimum stay (months)"
          type="number"
          value={roomFlat.minStayMonths}
          onChange={(e) => onField("minStayMonths", e.currentTarget.value)}
        />
      </SimpleGrid>

      <Textarea
        label="Description"
        autosize
        minRows={4}
        placeholder="What's the place like? Locality, nearby landmarks, vibe…"
        value={roomFlat.description}
        onChange={(e) => onField("description", e.currentTarget.value)}
      />

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Location extras (optional)
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Sector"
          placeholder="e.g. Sector 21"
          value={roomFlat.location.sector}
          onChange={(e) => onLocationExtra("sector", e.currentTarget.value)}
        />
        <TextInput
          label="State"
          value={roomFlat.location.state}
          onChange={(e) => onLocationExtra("state", e.currentTarget.value)}
        />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Pincode"
          value={roomFlat.location.pincode}
          onChange={(e) => onLocationExtra("pincode", e.currentTarget.value)}
        />
        <TextInput
          label="Landmark"
          value={roomFlat.location.landmark}
          onChange={(e) => onLocationExtra("landmark", e.currentTarget.value)}
        />
      </SimpleGrid>

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Sharing preferences
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Switch
          label="Open to swapping this room/flat later"
          checked={roomFlat.openToSwap}
          onChange={(e) => onField("openToSwap", e.currentTarget.checked)}
        />
        <Switch
          label="Pets allowed"
          checked={roomFlat.petsAllowed}
          onChange={(e) => onField("petsAllowed", e.currentTarget.checked)}
        />
      </SimpleGrid>
    </>
  );
}