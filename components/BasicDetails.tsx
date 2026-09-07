"use client";

import React, { useEffect } from "react";
import {
  TextInput,
  Box,
  Textarea,
  Group,
  Button,
  NumberInput,
  Select,
  MultiSelect,
  Divider,
  Checkbox,
  Text,
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
} from "@/lib/propertyOptions";
import FloorPlanUploadSection from "@/components/FloorPlanUploadSection";

function splitLines(s: string) {
  return s
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function toOptNum(v: unknown): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Mirrors the `type` enum in backend/models/Property.js */
const LISTING_OPTS = [
  { value: "Available", label: "Available — open enquiries" },
  { value: "Fresh", label: "Fresh listing" },
  { value: "Under offer", label: "Under offer" },
  { value: "Booked", label: "Booked / on hold" },
];

const AMENITIES_OPTIONS = [
  "Parking",
  "Lift",
  "Power Backup",
  "Security",
  "Park",
  "Gas Pipeline",
  "Wifi",
  "Gym",
  "Swimming Pool",
  "Club House",
];

const OC_OPTIONS = [
  { value: "", label: "— Optional —" },
  { value: "Available", label: "OC available" },
  { value: "Applied", label: "OC applied" },
  { value: "Not issued", label: "Not issued yet" },
  { value: "NA", label: "Not applicable" },
];

interface BasicDetailsProps {
  prevStep: () => void;
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  prevStep,
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
      listingAvailability: propertyDetails.listingAvailability || "Available",
      virtualTourUrl: propertyDetails.virtualTourUrl || "",
      schoolsText: (propertyDetails.nearbyPlaces?.schools || []).join("\n"),
      metroStationsText: (
        propertyDetails.nearbyPlaces?.metroStations || []
      ).join("\n"),
      hospitalsText: (propertyDetails.nearbyPlaces?.hospitals || []).join("\n"),
      mallsText: (propertyDetails.nearbyPlaces?.malls || []).join("\n"),
      reraNumber: propertyDetails.reraNumber || "",
      maintenanceCharge: propertyDetails.maintenanceCharge ?? "",
      securityDeposit: propertyDetails.securityDeposit ?? "",
      lockInMonths: propertyDetails.lockInMonths ?? "",
      noticePeriodDays: propertyDetails.noticePeriodDays ?? "",
      ocStatus: propertyDetails.ocStatus || "",
      ageOfProperty: propertyDetails.ageOfProperty ?? "",
      pricePerSqft: propertyDetails.pricePerSqft ?? "",
      negotiable: propertyDetails.negotiable !== false,
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
  }, [form.values.title]);

  // Keep Property Category valid whenever the selected Type changes
  useEffect(() => {
    const categories = getCategoriesForType(form.values.type);
    if (!form.values.propertyCategory || !categories.includes(form.values.propertyCategory)) {
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
    listingAvailability,
    virtualTourUrl,
    schoolsText,
    metroStationsText,
    hospitalsText,
    mallsText,
    reraNumber,
    maintenanceCharge,
    securityDeposit,
    lockInMonths,
    noticePeriodDays,
    ocStatus,
    ageOfProperty,
    pricePerSqft,
    negotiable,
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
  const showRentTerms = deal === "Rent";
  const showSalePricePerSqft = deal === "Sale";
  const showOCStatus = deal === "Sale" && !isLand;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      const nearbyPlaces = {
        schools: splitLines(schoolsText),
        metroStations: splitLines(metroStationsText),
        hospitals: splitLines(hospitalsText),
        malls: splitLines(mallsText),
      };
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
        listingAvailability,
        virtualTourUrl: virtualTourUrl?.trim() || "",
        nearbyPlaces,
        reraNumber: reraNumber?.trim() || "",
        maintenanceCharge: showRentTerms ? toOptNum(maintenanceCharge) : undefined,
        securityDeposit: showRentTerms ? toOptNum(securityDeposit) : undefined,
        lockInMonths: showRentTerms ? toOptNum(lockInMonths) : undefined,
        noticePeriodDays: showRentTerms ? toOptNum(noticePeriodDays) : undefined,
        ocStatus: showOCStatus ? ocStatus || undefined : undefined,
        ageOfProperty: showAgeOfProperty ? toOptNum(ageOfProperty) : undefined,
        pricePerSqft: showSalePricePerSqft ? toOptNum(pricePerSqft) : undefined,
        negotiable,
        amenities:
          showAmenities && Array.isArray(amenities) ? amenities : [],
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

        <Select
          label="Type"
          data={PROPERTY_TYPES}
          description="Drives which property categories and fields are shown below."
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

        <Select
          label="Posted By"
          data={["Owner", "Agent", "Builder"]}
          {...form.getInputProps("postedBy")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        <Divider label="Pricing & terms" labelPosition="center" my="sm" />

        <Text size="sm" c="dimmed">
          {deal === "Rent"
            ? "Price is monthly rent (₹)."
            : "Price is total asking amount (₹)."}
        </Text>

        {showRentTerms && (
          <>
            <NumberInput
              label="Monthly maintenance (₹)"
              description="Society / common charges if any."
              min={0}
              {...form.getInputProps("maintenanceCharge")}
              classNames={{ input: "border-gray-300" }}
            />
            <NumberInput
              label="Security deposit (₹)"
              min={0}
              {...form.getInputProps("securityDeposit")}
              classNames={{ input: "border-gray-300" }}
            />
            <Group grow>
              <NumberInput
                label="Lock-in (months)"
                description="Optional"
                min={0}
                {...form.getInputProps("lockInMonths")}
                classNames={{ input: "border-gray-300" }}
              />
              <NumberInput
                label="Notice period (days)"
                description="Optional"
                min={0}
                {...form.getInputProps("noticePeriodDays")}
                classNames={{ input: "border-gray-300" }}
              />
            </Group>
          </>
        )}

        {showSalePricePerSqft && (
          <NumberInput
            label="Price per sqft (₹)"
            description="Optional — helps buyers compare."
            min={0}
            {...form.getInputProps("pricePerSqft")}
            classNames={{ input: "border-gray-300" }}
          />
        )}

        {showOCStatus && (
          <Select
            label="Occupancy certificate (OC)"
            description="Helps buyers assess legal readiness."
            data={OC_OPTIONS}
            {...form.getInputProps("ocStatus")}
            classNames={{ input: "border-gray-300" }}
            styles={{ dropdown: { zIndex: 1300 } }}
          />
        )}

        {showAgeOfProperty && (
          <NumberInput
            label="Age of property (years)"
            description="Optional — not applicable for land/plot listings."
            min={0}
            {...form.getInputProps("ageOfProperty")}
            classNames={{ input: "border-gray-300" }}
          />
        )}

        <Checkbox
          label="Price is negotiable"
          {...form.getInputProps("negotiable", { type: "checkbox" })}
        />

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

        <Divider
          label="Trust & rich listing (optional)"
          labelPosition="center"
          my="md"
        />

        <Select
          label="Listing status (for buyers)"
          description="Shows on cards — reduce wasted calls when under offer or booked."
          data={LISTING_OPTS}
          {...form.getInputProps("listingAvailability")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        <TextInput
          label="RERA registration ID"
          description="If applicable for your state — shown as a trust badge when set."
          placeholder="e.g. PBRERA-SAS81-RE0834"
          {...form.getInputProps("reraNumber")}
          classNames={{ input: "border-gray-300" }}
        />

        <TextInput
          label="Virtual tour link"
          placeholder="https://…"
          {...form.getInputProps("virtualTourUrl")}
          classNames={{ input: "border-gray-300" }}
        />

        <FloorPlanUploadSection
          urls={propertyDetails.floorPlanImages || []}
          files={propertyDetails.floorPlanFiles || []}
          onUrlsChange={(u) =>
            setPropertyDetails((p: any) => ({ ...p, floorPlanImages: u }))
          }
          onFilesChange={(f) =>
            setPropertyDetails((p: any) => ({ ...p, floorPlanFiles: f }))
          }
        />

        <Textarea
          label="Nearby — schools"
          description="One per line"
          autosize
          minRows={2}
          {...form.getInputProps("schoolsText")}
          classNames={{ input: "border-gray-300" }}
        />
        <Textarea
          label="Nearby — metro / transit"
          autosize
          minRows={2}
          {...form.getInputProps("metroStationsText")}
          classNames={{ input: "border-gray-300" }}
        />
        <Textarea
          label="Nearby — hospitals (optional)"
          autosize
          minRows={2}
          {...form.getInputProps("hospitalsText")}
          classNames={{ input: "border-gray-300" }}
        />
        <Textarea
          label="Nearby — malls & shopping (optional)"
          autosize
          minRows={2}
          {...form.getInputProps("mallsText")}
          classNames={{ input: "border-gray-300" }}
        />

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="blue">
            Next step
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default BasicDetails;
