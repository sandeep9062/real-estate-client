"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Group, Stepper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "@/lib/utils";
import { slugify } from "@/lib/slugify";
import {
  getCategoriesForType,
  isLandCategory,
  supportsFurnishing,
  supportsAmenities,
  supportsFacing,
} from "@/lib/propertyOptions";
import BasicInfoFields from "@/components/basic-details/BasicInfoFields";
import PricingFields from "@/components/basic-details/PricingFields";
import type { FieldVisibility } from "@/components/basic-details/types";

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

const SUB_STEPS = [
  { label: "Property details", description: "Type, category, area & features" },
  { label: "Pricing & extras", description: "Terms, trust & nearby" },
];

/** Fields that must be valid before leaving each sub-step. */
const REQUIRED_BY_SUB_STEP: string[][] = [
  ["title", "description", "price", "areaValue"],
  [],
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
  const [subStep, setSubStep] = useState(0);

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
  const visibility: FieldVisibility = {
    categoryOptions: getCategoriesForType(type),
    isLand: isLandCategory(propertyCategory),
    showCommercialExtras: type === "Commercial",
    showFurnishing: supportsFurnishing(propertyCategory),
    showFacing: supportsFacing(propertyCategory),
    showAmenities: supportsAmenities(propertyCategory),
    showAgeOfProperty: !isLandCategory(propertyCategory),
    showRentTerms: deal === "Rent",
    showSalePricePerSqft: deal === "Sale",
    showOCStatus: deal === "Sale" && !isLandCategory(propertyCategory),
  };

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
        furnishing: visibility.showFurnishing ? furnishing : undefined,
        facing: visibility.showFacing ? facing : undefined,
        postedBy,
        commercialPropertyTypes: visibility.showCommercialExtras
          ? commercialPropertyTypes
          : [],
        investmentOptions: visibility.showCommercialExtras
          ? investmentOptions
          : [],
        listingAvailability,
        virtualTourUrl: virtualTourUrl?.trim() || "",
        nearbyPlaces,
        reraNumber: reraNumber?.trim() || "",
        maintenanceCharge: visibility.showRentTerms
          ? toOptNum(maintenanceCharge)
          : undefined,
        securityDeposit: visibility.showRentTerms
          ? toOptNum(securityDeposit)
          : undefined,
        lockInMonths: visibility.showRentTerms
          ? toOptNum(lockInMonths)
          : undefined,
        noticePeriodDays: visibility.showRentTerms
          ? toOptNum(noticePeriodDays)
          : undefined,
        ocStatus: visibility.showOCStatus ? ocStatus || undefined : undefined,
        ageOfProperty: visibility.showAgeOfProperty
          ? toOptNum(ageOfProperty)
          : undefined,
        pricePerSqft: visibility.showSalePricePerSqft
          ? toOptNum(pricePerSqft)
          : undefined,
        negotiable,
        amenities:
          visibility.showAmenities && Array.isArray(amenities) ? amenities : [],
      }));
      nextStep();
    }
  };

  /** Validate only the fields relevant to the current sub-step. */
  const validateSubStep = (step: number): boolean => {
    let ok = true;
    (REQUIRED_BY_SUB_STEP[step] || []).forEach((field) => {
      const result = form.validateField(field);
      if (result.hasError) ok = false;
    });
    return ok;
  };

  const goNext = () => {
    if (!validateSubStep(subStep)) return;
    if (subStep === SUB_STEPS.length - 1) {
      handleSubmit();
    } else {
      setSubStep(subStep + 1);
    }
  };

  const goBack = () => {
    if (subStep === 0) prevStep();
    else setSubStep(subStep - 1);
  };

  const isLastSubStep = subStep === SUB_STEPS.length - 1;

  return (
    <Box maw="100%" mx="auto" my="md">
      <form
        className="flex flex-col gap-6 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
      >
        <Stepper
          active={subStep}
          size="sm"
          iconSize={32}
          allowNextStepsSelect={false}
          onStepClick={(idx) => setSubStep(idx)}
        >
          {SUB_STEPS.map((step) => (
            <Stepper.Step
              key={step.label}
              label={step.label}
              description={step.description}
            />
          ))}
        </Stepper>

        {subStep === 0 && (
          <BasicInfoFields form={form} visibility={visibility} />
        )}
        {subStep === 1 && (
          <PricingFields
            form={form}
            visibility={visibility}
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
          />
        )}

        <Group justify="center" mt="xl">
          <Button variant="default" type="button" onClick={goBack}>
            Back
          </Button>
          <Button type="submit" color="blue">
            {isLastSubStep ? "Next step" : "Continue"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default BasicDetails;

