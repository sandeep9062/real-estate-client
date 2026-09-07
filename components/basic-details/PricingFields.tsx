"use client";

import React from "react";
import {
  Checkbox,
  Group,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { LISTING_OPTS, OC_OPTIONS } from "./constants";
import FloorPlanUploadSection from "@/components/FloorPlanUploadSection";
import type { PropertyDetailsSectionProps } from "./types";

/** Sub-step 2 — pricing terms, trust signals & nearby places. */
const PricingFields: React.FC<PropertyDetailsSectionProps> = ({
  form,
  visibility,
  propertyDetails,
  setPropertyDetails,
}) => {
  const {
    showRentTerms,
    showSalePricePerSqft,
    showOCStatus,
  } = visibility;

  return (
    <>
      <Text size="sm" c="dimmed">
        {form.values.deal === "Rent"
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

      <Checkbox
        label="Price is negotiable"
        {...form.getInputProps("negotiable", { type: "checkbox" })}
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
        onUrlsChange={(u: string[]) =>
          setPropertyDetails((p: any) => ({ ...p, floorPlanImages: u }))
        }
        onFilesChange={(f: any) =>
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
    </>
  );
};

export default PricingFields;
