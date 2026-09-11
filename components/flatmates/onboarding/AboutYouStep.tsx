"use client";

import {
  Divider,
  MultiSelect,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, Clock, Repeat, Search, Users } from "lucide-react";
import { OPTIONS, enumData } from "./options";
import type { ProfileDraft } from "./types";

export interface IntentOption {
  key: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
  popular?: boolean;
}

// Intent choices — radio-selectable inside Step 1 so the wizard no longer
// needs a standalone step-0 picker. Same copy/accent colors as the
// /flatmates landing cards so both entry points feel like one flow. The
// ?intent= deep-link still pre-selects via the page.
export const INTENT_OPTIONS: IntentOption[] = [
  {
    key: "has_room",
    icon: Users,
    tag: "List a room",
    title: "I have a room, need a flatmate",
    description: "List your spare room or flat and find someone who fits.",
    accent: "#059669",
    accentBg: "#ECFDF5",
    popular: true,
  },
  {
    key: "seeking_room",
    icon: Search,
    tag: "Search rooms",
    title: "I'm looking for a room",
    description:
      "Search rooms and flats near you, filtered by budget and lifestyle.",
    accent: "#4161df",
    accentBg: "#EEF1FC",
    popular: true,
  },
  {
    key: "swap",
    icon: Repeat,
    tag: "Swap",
    title: "I want to swap flats",
    description: "Trade places with someone whose location works better for you.",
    accent: "#7C3AED",
    accentBg: "#F5F3FF",
  },
  {
    key: "temporary_offer",
    icon: Clock,
    tag: "Short-term",
    title: "I have a place for temporary stay",
    description: "Offer your room or flat for a short-term stay.",
    accent: "#D97706",
    accentBg: "#FFFBEB",
  },
  {
    key: "temporary_seek",
    icon: CalendarClock,
    tag: "Short-term",
    title: "I need a temporary stay",
    description: "Find a short-term room while you sort out something longer-term.",
    accent: "#E11D48",
    accentBg: "#FFF1F2",
  },
];

// Radios talk in "" (none) while the page tracks null — same semantic, so the
// setter coerces "" → null for the radio and string → string otherwise.
export interface AboutYouStepProps {
  profile: ProfileDraft;
  intent: string | null;
  intentLocked: boolean;
  onIntent: (value: string | null) => void;
  onField: (key: string, value: any) => void;
  onHabit: (key: string, value: any) => void;
  onLookingFor: (key: string, value: any) => void;
  onAgeRange: (key: "min" | "max", value: string) => void;
}

/**
 * Step 1 — intent (radio) + every RoommateProfile field grouped into compact
 * sections. Three fields per row where it fits, two otherwise.
 */
export default function AboutYouStep({
  profile,
  intent,
  intentLocked,
  onIntent,
  onField,
  onHabit,
  onLookingFor,
  onAgeRange,
}: AboutYouStepProps) {
  return (
    <>
      <Radio.Group
        name="roommate-intent"
        label="What brings you here?"
        description={
          intentLocked
            ? "Your intent is locked to your saved profile — it can't be changed while editing."
            : "Pick one — the rest of the wizard adapts to your choice."
        }
        value={intent || null}
        onChange={(value) => onIntent(value || "")}
        mb="sm"
      >
        <Stack gap="sm" mt="xs">
          {INTENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const selected = intent === option.key;
            return (
              <Radio
                key={option.key}
                value={option.key}
                disabled={intentLocked}
                label={
                  <span style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      style={{
                        display: "flex",
                        height: 40,
                        width: 40,
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        background: option.accentBg,
                        color: option.accent,
                        opacity: intentLocked && !selected ? 0.55 : 1,
                      }}
                    >
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={600} size="sm">
                        {option.title}
                        {option.popular && (
                          <Text span size="xs" fw={700} ml={8} c="blue">
                            · Popular
                          </Text>
                        )}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2}>
                        {option.description}
                      </Text>
                    </span>
                  </span>
                }
                styles={{
                  body: selected
                    ? {
                        border: `2px solid ${option.accent}`,
                        borderRadius: 10,
                        padding: 12,
                        background: option.accentBg,
                      }
                    : {
                        border: "1px solid #E5E7F2",
                        borderRadius: 10,
                        padding: 12,
                        background: "#fff",
                      },
                }}
              />
            );
          })}
        </Stack>
      </Radio.Group>

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Identity &amp; work
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Select
          label="Gender"
          placeholder="Select…"
          data={enumData(OPTIONS.gender)}
          value={profile.gender || null}
          onChange={(value) => onField("gender", value || "")}
        />
        <Select
          label="Type"
          placeholder="Select…"
          data={enumData(OPTIONS.profileType)}
          value={profile.type || null}
          onChange={(value) => onField("type", value || "")}
        />
        <TextInput
          label="Date of birth"
          type="date"
          value={profile.dateOfBirth}
          onChange={(e) => onField("dateOfBirth", e.currentTarget.value)}
        />
        <Select
          label="Occupation"
          placeholder="Select…"
          data={enumData(OPTIONS.occupation)}
          value={profile.occupation || null}
          onChange={(value) => onField("occupation", value || "")}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="Work schedule"
          placeholder="Select…"
          data={enumData(OPTIONS.workSchedule)}
          value={profile.workSchedule || null}
          onChange={(value) => onField("workSchedule", value || "")}
        />
        <Select
          label="Sleep schedule"
          placeholder="Select…"
          data={enumData(OPTIONS.sleepSchedule)}
          value={profile.sleepSchedule || null}
          onChange={(value) => onField("sleepSchedule", value || "")}
        />
      </SimpleGrid>

      <MultiSelect
        label="Languages"
        description="Select all languages you speak"
        placeholder="Select languages…"
        data={[...OPTIONS.languages]}
        value={Array.isArray(profile.languages) ? profile.languages : []}
        onChange={(value) => onField("languages", value)}
        searchable
        clearable
        nothingFoundMessage="No language found"
        maxDropdownHeight={220}
      />

      <Textarea
        label="Bio"
        autosize
        minRows={3}
        placeholder="A couple of lines about you"
        value={profile.bio}
        onChange={(e) => onField("bio", e.currentTarget.value)}
      />

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Habits
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Select
          label="Smoking"
          placeholder="Select…"
          data={enumData(OPTIONS.habitYesNo)}
          value={profile.habits.smoking || null}
          onChange={(value) => onHabit("smoking", value || "")}
        />
        <Select
          label="Drinking"
          placeholder="Select…"
          data={enumData(OPTIONS.habitYesNo)}
          value={profile.habits.drinking || null}
          onChange={(value) => onHabit("drinking", value || "")}
        />
        <Select
          label="Nightlife-friendly"
          placeholder="Select…"
          data={enumData(OPTIONS.habitYesNo)}
          value={profile.habits.nightlifeFriendly || null}
          onChange={(value) => onHabit("nightlifeFriendly", value || "")}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Select
          label="Food preference"
          placeholder="Select…"
          data={enumData(OPTIONS.foodPreference)}
          value={profile.habits.foodPreference || null}
          onChange={(value) => onHabit("foodPreference", value || "")}
        />
        <Select
          label="Cleanliness"
          placeholder="Select…"
          data={enumData(OPTIONS.cleanlinessLevel)}
          value={profile.habits.cleanlinessLevel || null}
          onChange={(value) => onHabit("cleanlinessLevel", value || "")}
        />
        <Select
          label="Guests frequency"
          placeholder="Select…"
          data={enumData(OPTIONS.guestsFrequency)}
          value={profile.habits.guestsFrequency || null}
          onChange={(value) => onHabit("guestsFrequency", value || "")}
        />
      </SimpleGrid><SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Switch
          label="I own pets"
          checked={profile.habits.ownsPets}
          onChange={(e) => onHabit("ownsPets", e.currentTarget.checked)}
        />
        <Switch
          label="I'm okay with flatmates having pets"
          checked={profile.habits.okayWithPets}
          onChange={(e) => onHabit("okayWithPets", e.currentTarget.checked)}
        />
      </SimpleGrid>

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        What you&apos;re looking for in a flatmate
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Select
          label="Gender preference"
          placeholder="Select…"
          data={enumData(OPTIONS.genderPreference)}
          value={profile.lookingFor.genderPreference || null}
          onChange={(value) => onLookingFor("genderPreference", value || "")}
        />
        <TextInput
          label="Min age"
          type="number"
          placeholder="e.g. 22"
          value={profile.lookingFor.ageRange.min}
          onChange={(e) => onAgeRange("min", e.currentTarget.value)}
        />
        <TextInput
          label="Max age"
          type="number"
          placeholder="e.g. 30"
          value={profile.lookingFor.ageRange.max}
          onChange={(e) => onAgeRange("max", e.currentTarget.value)}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Select
          label="Smoking"
          placeholder="Select…"
          data={enumData(OPTIONS.prefYesNo)}
          value={profile.lookingFor.smoking || null}
          onChange={(value) => onLookingFor("smoking", value || "")}
        />
        <Select
          label="Drinking"
          placeholder="Select…"
          data={enumData(OPTIONS.prefYesNo)}
          value={profile.lookingFor.drinking || null}
          onChange={(value) => onLookingFor("drinking", value || "")}
        />
        <Select
          label="Nightlife-friendly"
          placeholder="Select…"
          data={enumData(OPTIONS.prefYesNo)}
          value={profile.lookingFor.nightlifeFriendly || null}
          onChange={(value) => onLookingFor("nightlifeFriendly", value || "")}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="Food preference"
          placeholder="Select…"
          data={enumData(OPTIONS.foodPrefAny)}
          value={profile.lookingFor.foodPreference || null}
          onChange={(value) => onLookingFor("foodPreference", value || "")}
        />
        <Select
          label="Occupation"
          placeholder="Select…"
          data={enumData(OPTIONS.occupationAny)}
          value={profile.lookingFor.occupation || null}
          onChange={(value) => onLookingFor("occupation", value || "")}
        />
      </SimpleGrid>

      <Divider my="sm" />

      <Text fw={700} size="md" mb={8}>
        Timing
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          label="Move-in date"
          type="date"
          value={profile.moveInDate}
          onChange={(e) => onField("moveInDate", e.currentTarget.value)}
        />
        <TextInput
          label="Stay duration (months)"
          type="number"
          placeholder="e.g. 3"
          description="Relevant for temporary stays"
          value={profile.stayDurationMonths}
          onChange={(e) => onField("stayDurationMonths", e.currentTarget.value)}
        />
      </SimpleGrid>
    </>
  );
}