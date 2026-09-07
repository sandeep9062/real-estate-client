"use client";

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  isLandCategory,
  LISTING_OPTS,
  OC_OPTIONS,
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

/** Wizard step 2 — pricing terms, trust signals & nearby places. */
interface PricingDetailsProps {
  prevStep: () => void;
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const form = useForm({
    initialValues: {
      maintenanceCharge: propertyDetails.maintenanceCharge ?? "",
      securityDeposit: propertyDetails.securityDeposit ?? "",
      lockInMonths: propertyDetails.lockInMonths ?? "",
      noticePeriodDays: propertyDetails.noticePeriodDays ?? "",
      pricePerSqft: propertyDetails.pricePerSqft ?? "",
      ocStatus: propertyDetails.ocStatus || "",
      negotiable: propertyDetails.negotiable !== false,
      listingAvailability: propertyDetails.listingAvailability || "Available",
      reraNumber: propertyDetails.reraNumber || "",
      virtualTourUrl: propertyDetails.virtualTourUrl || "",
      schoolsText: (propertyDetails.nearbyPlaces?.schools || []).join("\n"),
      metroStationsText: (
        propertyDetails.nearbyPlaces?.metroStations || []
      ).join("\n"),
      hospitalsText: (propertyDetails.nearbyPlaces?.hospitals || []).join("\n"),
      mallsText: (propertyDetails.nearbyPlaces?.malls || []).join("\n"),
    },
  });

  const {
    deal,
    type,
    propertyCategory,
  }: { deal: string; type: string; propertyCategory: string } =
    propertyDetails;

  // ── Field visibility, driven by deal / type / propertyCategory ────────────
  const isLand = isLandCategory(propertyCategory);
  const showRentTerms = deal === "Rent";
  const showSalePricePerSqft = deal === "Sale";
  const showOCStatus = deal === "Sale" && !isLand;

  const handleSubmit = () => {
    const {
      maintenanceCharge,
      securityDeposit,
      lockInMonths,
      noticePeriodDays,
      pricePerSqft,
      ocStatus,
      negotiable,
      listingAvailability,
      reraNumber,
      virtualTourUrl,
      schoolsText,
      metroStationsText,
      hospitalsText,
      mallsText,
    } = form.values;

    const nearbyPlaces = {
      schools: splitLines(schoolsText),
      metroStations: splitLines(metroStationsText),
      hospitals: splitLines(hospitalsText),
      malls: splitLines(mallsText),
    };

    setPropertyDetails((prev: any) => ({
      ...prev,
      // Hidden fields are cleared so stale values are never submitted
      maintenanceCharge: showRentTerms ? toOptNum(maintenanceCharge) : undefined,
      securityDeposit: showRentTerms ? toOptNum(securityDeposit) : undefined,
      lockInMonths: showRentTerms ? toOptNum(lockInMonths) : undefined,
      noticePeriodDays: showRentTerms ? toOptNum(noticePeriodDays) : undefined,
      pricePerSqft: showSalePricePerSqft ? toOptNum(pricePerSqft) : undefined,
      ocStatus: showOCStatus ? ocStatus || undefined : undefined,
      negotiable,
      listingAvailability,
      reraNumber: reraNumber?.trim() || "",
      virtualTourUrl: virtualTourUrl?.trim() || "",
      nearbyPlaces,
    }));
    nextStep();
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

        <Group justify="center" mt="xl">
          <Button variant="default" type="button" onClick={prevStep}>
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


export default PricingDetails;
