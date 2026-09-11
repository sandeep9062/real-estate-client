"use client";

import {
  Divider,
  MultiSelect,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";

import { OPTIONS, enumData } from "./options";
import type { ProfileDraft } from "./types";
import ProfilePhotosUploader from "@/components/flatmates/ProfilePhotosUploader";

export interface AboutYouStepProps {
  profile: ProfileDraft;
  onField: (key: string, value: any) => void;
  onHabit: (key: string, value: any) => void;
  onLookingFor: (key: string, value: any) => void;
  onAgeRange: (key: "min" | "max", value: string) => void;
}

/**
 * Step 1 — every RoommateProfile field grouped into compact
 * sections. Three fields per row where it fits, two otherwise.
 */
export default function AboutYouStep({
  profile,
  onField,
  onHabit,
  onLookingFor,
  onAgeRange,
}: AboutYouStepProps) {
  return (
    <>
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
        Your photos
      </Text>
      <ProfilePhotosUploader
        value={profile.photos ?? []}
        onChange={(next) => onField("photos", next)}
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
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
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
