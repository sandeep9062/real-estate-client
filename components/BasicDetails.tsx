"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "@/lib/utils";
import { slugify } from "@/lib/slugify";
import {
  PROPERTY_TYPES,
  getCategoriesForType,
  isLandCategory,
  supportsFurnishing,
  supportsAmenities,
  supportsFacing,
  AMENITIES_OPTIONS,
} from "@/lib/propertyOptions";

/** Wizard step 1 — property identity, deal/type/category, area & features. */
interface BasicDetailsProps {
  prevStep: () => void;
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}

function toOptNum(v: unknown): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const form = useForm({
    initialValues: {
      title: propertyDetails.title,
      slug: propertyDetails.slug || "",
      description: propertyDetails.description,
      price: propertyDetails.price,
      deal: propertyDetails.deal,
      type: propertyDetails.type,
      propertyCategory: propertyDetails.propertyCategory,
      areaValue: propertyDetails.area.value,
      areaUnit: propertyDetails.area.unit,
      availability: propertyDetails.availability,
      furnishing: propertyDetails.furnishing,
      facing: propertyDetails.facing || "",
      postedBy: propertyDetails.postedBy,
      commercialPropertyTypes: propertyDetails.commercialPropertyTypes,
      investmentOptions: propertyDetails.investmentOptions,
      ageOfProperty: propertyDetails.ageOfProperty ?? "",
      amenities: propertyDetails.amenities || [],
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value: number) =>
        value == null || !Number.isFinite(value) || value < 1
          ? "Enter a valid price (min ₹1)"
          : null,
      areaValue: (value: number) =>
        value == null || !Number.isFinite(value) || value < 0
          ? "Enter a valid area (0 or more)"
          : null,
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    const titleValue = form.values.title;
    if (titleValue && titleValue.trim()) {
      const generated = slugify(titleValue);
      form.setFieldValue("slug", generated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.title]);

  // Keep Property Category valid whenever the selected Type changes
  useEffect(() => {
    const categories = getCategoriesForType(form.values.type);
    if (
      !form.values.propertyCategory ||
      !categories.includes(form.values.propertyCategory)
    ) {
      form.setFieldValue("propertyCategory", categories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.type]);

  const {
    title,
    slug,
    description,
    price,
    deal,
    type,
    propertyCategory,
    areaValue,
    areaUnit,
    availability,
    furnishing,
    facing,
    postedBy,
    commercialPropertyTypes,
    investmentOptions,
    ageOfProperty,
    amenities,
  } = form.values;

  // ── Field visibility, driven by deal / type / propertyCategory ────────────
  const categoryOptions = getCategoriesForType(type);
  const isLand = isLandCategory(propertyCategory);
  const showCommercialExtras = type === "Commercial";
  const showFurnishing = supportsFurnishing(propertyCategory);
  const showFacing = supportsFacing(propertyCategory);
  const showAmenities = supportsAmenities(propertyCategory);
  const showAgeOfProperty = !isLand;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev: any) => ({
        ...prev,
        title,
        slug,
        description,
        price,
        deal,
        type,
        propertyCategory,
        area: { value: areaValue, unit: areaUnit },
        availability,
        // Hidden fields are cleared so stale values are never submitted
        furnishing: showFurnishing ? furnishing : undefined,
        facing: showFacing ? facing : undefined,
        postedBy,
        commercialPropertyTypes: showCommercialExtras
          ? commercialPropertyTypes
          : [],
        investmentOptions: showCommercialExtras ? investmentOptions : [],
        ageOfProperty: showAgeOfProperty ? toOptNum(ageOfProperty) : undefined,
        amenities: showAmenities && Array.isArray(amenities) ? amenities : [],
      }));
      nextStep();
    }
  };

  return (
    <Box maw="100%" mx="auto" my="md">
      <form
        className="flex flex-col gap-6 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
          description={`Options shown for ${type} properties.`}
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

        <Group justify="center" mt="xl">
          <Button type="submit" color="blue">
            Next step
          </Button>
        </Group>
      </form>
    </Box>
  );
};


export default BasicDetails;
