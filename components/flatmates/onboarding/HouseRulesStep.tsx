"use client";

import React from "react";
import {
  Divider,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { OPTIONS, enumData } from "./options";
import type { RoomFlatDraft } from "./types";

export interface HouseRulesStepProps {
  roomFlat: RoomFlatDraft;
  intent: string;
  onHouseRule: (key: string, value: any) => void;
  onCurfew: (key: string, value: any) => void;
  onSwapDetail: (key: string, value: any) => void;
  onSwapRentRange: (key: "min" | "max", value: string) => void;
  onTemporaryDetail: (key: "startDate" | "endDate", value: string) => void;
}

/**
 * Step 3 — houseRules for every property intent, plus swapDetails (swap) and
 * temporaryDetails (temporary_offer) where relevant. Two per row.
 */
export default function HouseRulesStep({
  roomFlat,
  intent,
  onHouseRule,
  onCurfew,
  onSwapDetail,
  onSwapRentRange,
  onTemporaryDetail,
}: HouseRulesStepProps) {
  const h = roomFlat.houseRules;

  return (
    <>
      <Text fw={700} size="md" mb={8}>
        House rules
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Switch
          label="Owner lives on premises"
          checked={h.ownerLivesOnPremises}
          onChange={(e) => onHouseRule("ownerLivesOnPremises", e.currentTarget.checked)}
        />
        <Switch
          label="Has a curfew"
          checked={h.curfew.hasCurfew}
          onChange={(e) => onCurfew("hasCurfew", e.currentTarget.checked)}
        />
      </SimpleGrid>

      {h.curfew.hasCurfew && (
        <TextInput
          label="Curfew time"
          type="time"
          value={h.curfew.time}
          onChange={(e) => onCurfew("time", e.currentTarget.value)}
        />
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Switch
          label="Smoking allowed on premises"
          checked={h.smokingAllowedOnPremises}
          onChange={(e) =>
            onHouseRule("smokingAllowedOnPremises", e.currentTarget.checked)
          }
        />
        <Switch
          label="Drinking allowed on premises"
          checked={h.drinkingAllowedOnPremises}
          onChange={(e) =>
            onHouseRule("drinkingAllowedOnPremises", e.currentTarget.checked)
          }
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="Opposite-gender guests"
          placeholder="Select…"
          data={enumData(OPTIONS.guestsAllowed)}
          value={h.oppositeGenderGuestsAllowed || null}
          onChange={(value) =>
            onHouseRule("oppositeGenderGuestsAllowed", value || "")
          }
        />
        <Select
          label="Overnight guests"
          placeholder="Select…"
          data={enumData(OPTIONS.guestsAllowed)}
          value={h.overnightGuestsAllowed || null}
          onChange={(value) => onHouseRule("overnightGuestsAllowed", value || "")}
        />
      </SimpleGrid>

      {intent === "swap" && (
        <>
          <Divider my="sm" />
          <Text fw={700} size="md" mb={8}>
            Swap details
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Desired city"
              value={roomFlat.swapDetails.desiredCity}
              onChange={(e) => onSwapDetail("desiredCity", e.currentTarget.value)}
            />
            <TextInput
              label="Desired locality"
              value={roomFlat.swapDetails.desiredLocality}
              onChange={(e) =>
                onSwapDetail("desiredLocality", e.currentTarget.value)
              }
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Minimum desired rent (₹)"
              type="number"
              value={roomFlat.swapDetails.desiredRentRange?.min ?? ""}
              onChange={(e) => onSwapRentRange("min", e.currentTarget.value)}
            />
            <TextInput
              label="Maximum desired rent (₹)"
              type="number"
              value={roomFlat.swapDetails.desiredRentRange?.max ?? ""}
              onChange={(e) => onSwapRentRange("max", e.currentTarget.value)}
            />
          </SimpleGrid>
        </>
      )}

      {intent === "temporary_offer" && (
        <>
          <Divider my="sm" />
          <Text fw={700} size="md" mb={8}>
            Temporary stay
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Start date"
              type="date"
              value={roomFlat.temporaryDetails.startDate}
              onChange={(e) =>
                onTemporaryDetail("startDate", e.currentTarget.value)
              }
            />
            <TextInput
              label="End date"
              type="date"
              value={roomFlat.temporaryDetails.endDate}
              onChange={(e) =>
                onTemporaryDetail("endDate", e.currentTarget.value)
              }
            />
          </SimpleGrid>
        </>
      )}
    </>
  );
}