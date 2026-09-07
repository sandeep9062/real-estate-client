"use client";

import React from "react";
import {
  Group,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { PROPERTY_TYPES } from "@/lib/propertyOptions";
import { AMENITIES_OPTIONS } from "./constants";
import type { BasicDetailsSectionProps } from "./types";

/** Sub-step 1 — identity, deal/type/category, area & property features. */
const BasicInfoFields: React.FC<BasicDetailsSectionProps> = ({
  form,
  visibility,
}) => {
  const {
    categoryOptions,
    showCommercialExtras,
    showFurnishing,
    showFacing,
    showAmenities,
    showAgeOfProperty,
  } = visibility;

  return (
    <>
      <TextInput
        withAsterisk
        label="Title"
        placeholder="Property Name"
        {...form.getInputProps("title")}
        classNames={{ input: "border-gray-300" }}
      />

      <TextInput
        label="Slug"
        description="Auto-generated from title. Used in the property URL."
        placeholder="auto-generated-slug"
        {...form.getInputProps("slug")}
        classNames={{ input: "border-gray-300 bg-gray-50" }}
        readOnly
      />

      <Textarea
        placeholder="Description"
        label="Description"
        withAsterisk
        {...form.getInputProps("description")}
        autosize
        minRows={3}
        classNames={{ input: "border-gray-300" }}
      />

      <Group grow>
        <NumberInput
          withAsterisk
          label="Price"
          placeholder="e.g. 25000"
          min={0}
          {...form.getInputProps("price")}
          classNames={{ input: "border-gray-300" }}
        />
        <Select
          label="Deal"
          data={["Rent", "Sale"]}
          {...form.getInputProps("deal")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
      </Group>

      <Select
        label="Type"
        data={PROPERTY_TYPES}
        description="Drives which property categories and fields are shown."
        {...form.getInputProps("type")}
        classNames={{ input: "border-gray-300" }}
        styles={{ dropdown: { zIndex: 1300 } }}
      />

      {showCommercialExtras && (
        <>
          <MultiSelect
            label="Commercial Property Types"
            data={[
              "Office",
              "Retail",
              "Industrial",
              "Warehouse",
              "Hospitality",
              "Land",
            ]}
            {...form.getInputProps("commercialPropertyTypes")}
            classNames={{ input: "border-gray-300" }}
            styles={{ dropdown: { zIndex: 1300 } }}
          />
          <MultiSelect
            label="Investment Options"
            data={[
              "Fractional Ownership",
              "REIT",
              "Direct Purchase",
              "Leasehold",
            ]}
            {...form.getInputProps("investmentOptions")}
            classNames={{ input: "border-gray-300" }}
            styles={{ dropdown: { zIndex: 1300 } }}
          />
        </>
      )}

      <Select
        label="Property Category"
        description={`Options shown for ${form.values.type} properties.`}
        data={categoryOptions}
        {...form.getInputProps("propertyCategory")}
        classNames={{ input: "border-gray-300" }}
        styles={{ dropdown: { zIndex: 1300 } }}
      />

      <Group grow>
        <NumberInput
          label="Area"
          min={0}
          {...form.getInputProps("areaValue")}
          classNames={{ input: "border-gray-300" }}
        />
        <Select
          label="Unit"
          data={["sqft", "sqyard", "sqm", "marla", "kanal", "acre"]}
          {...form.getInputProps("areaUnit")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
      </Group>

      <Select
        label="Availability"
        data={["Ready to Move", "Under Construction"]}
        {...form.getInputProps("availability")}
        classNames={{ input: "border-gray-300" }}
        styles={{ dropdown: { zIndex: 1300 } }}
      />

      {showFurnishing && (
        <Select
          label="Furnishing"
          data={["Furnished", "Semi Furnished", "Un-Furnished"]}
          {...form.getInputProps("furnishing")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
      )}

      {showFacing && (
        <Select
          label="Facing"
          data={[
            "North",
            "South",
            "East",
            "West",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
          ]}
          {...form.getInputProps("facing")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
      )}

      <Group grow>
        <Select
          label="Posted By"
          data={["Owner", "Agent", "Builder"]}
          {...form.getInputProps("postedBy")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
        {showAgeOfProperty && (
          <NumberInput
            label="Age of property (years)"
            description="Optional — N/A for land/plots"
            min={0}
            {...form.getInputProps("ageOfProperty")}
            classNames={{ input: "border-gray-300" }}
          />
        )}
      </Group>

      {showAmenities && (
        <MultiSelect
          label="Amenities"
          description="Select all that apply."
          data={AMENITIES_OPTIONS}
          {...form.getInputProps("amenities")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
      )}
    </>
  );
};

export default BasicInfoFields;
