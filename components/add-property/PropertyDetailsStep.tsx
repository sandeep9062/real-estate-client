"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  Text,
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
  LISTING_OPTS,
  OC_OPTIONS,
} from "@/lib/propertyOptions";
import FloorPlanUploadSection from "@/components/FloorPlanUploadSection";
import HouseRulesSection from "@/components/add-property/HouseRulesSection";

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

interface PropertyDetailsStepProps {
  prevStep: () => void;
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Merged step: combines the old separate "Basics" and "Pricing & extras"
 * steps into one screen. Every field here is conditionally shown based on
 * `deal` / `type` / `propertyCategory` so a listing for e.g. agricultural
 * land never shows furnishing, amenities, or OC status — fields that make
 * no sense for it.
 */
const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const form = useForm({
    initialValues: {
      // Basics
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
      commercialPropertyTypes: propertyDetails.commercialPropertyTypes,
      investmentOptions: propertyDetails.investmentOptions,
      ageOfProperty: propertyDetails.ageOfProperty ?? "",
      amenities: propertyDetails.amenities || [],
      // Pricing & extras
      maintenanceCharge: propertyDetails.maintenanceCharge ?? "",
      securityDeposit: propertyDetails.securityDeposit ?? "",
      lockInMonths: propertyDetails.lockInMonths ?? "",
      noticePeriodDays: propertyDetails.noticePeriodDays ?? "",
      allowsSubletting: propertyDetails.allowsSubletting ?? false,
      maxPersonsSharing: propertyDetails.maxPersonsSharing ?? "",
      petsAllowed: propertyDetails.petsAllowed ?? false,
      houseRules: {
        ownerLivesOnPremises:
          propertyDetails.houseRules?.ownerLivesOnPremises ?? false,
        curfew: {
          hasCurfew: propertyDetails.houseRules?.curfew?.hasCurfew ?? false,
          time: propertyDetails.houseRules?.curfew?.time ?? "",
        },
        oppositeGenderGuestsAllowed:
          propertyDetails.houseRules?.oppositeGenderGuestsAllowed ?? "",
        overnightGuestsAllowed:
          propertyDetails.houseRules?.overnightGuestsAllowed ?? "",
        smokingAllowedOnPremises:
          propertyDetails.houseRules?.smokingAllowedOnPremises ?? false,
        drinkingAllowedOnPremises:
          propertyDetails.houseRules?.drinkingAllowedOnPremises ?? false,
      },
      tenantPreference: propertyDetails.tenantPreference || "Any",
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

  // Update form values when propertyDetails changes (e.g., when editing an existing property)
  useEffect(() => {
    if (propertyDetails) {
      form.setValues({
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
        commercialPropertyTypes: propertyDetails.commercialPropertyTypes,
        investmentOptions: propertyDetails.investmentOptions,
        ageOfProperty: propertyDetails.ageOfProperty ?? "",
        amenities: propertyDetails.amenities || [],
        maintenanceCharge: propertyDetails.maintenanceCharge ?? "",
        securityDeposit: propertyDetails.securityDeposit ?? "",
        lockInMonths: propertyDetails.lockInMonths ?? "",
        noticePeriodDays: propertyDetails.noticePeriodDays ?? "",
        allowsSubletting: propertyDetails.allowsSubletting ?? false,
        maxPersonsSharing: propertyDetails.maxPersonsSharing ?? "",
        petsAllowed: propertyDetails.petsAllowed ?? false,
        houseRules: {
          ownerLivesOnPremises:
            propertyDetails.houseRules?.ownerLivesOnPremises ?? false,
          curfew: {
            hasCurfew: propertyDetails.houseRules?.curfew?.hasCurfew ?? false,
            time: propertyDetails.houseRules?.curfew?.time ?? "",
          },
          oppositeGenderGuestsAllowed:
            propertyDetails.houseRules?.oppositeGenderGuestsAllowed ?? "",
          overnightGuestsAllowed:
            propertyDetails.houseRules?.overnightGuestsAllowed ?? "",
          smokingAllowedOnPremises:
            propertyDetails.houseRules?.smokingAllowedOnPremises ?? false,
          drinkingAllowedOnPremises:
            propertyDetails.houseRules?.drinkingAllowedOnPremises ?? false,
        },
        tenantPreference: propertyDetails.tenantPreference || "Any",
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
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyDetails]);

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
    commercialPropertyTypes,
    investmentOptions,
    ageOfProperty,
    amenities,
    maintenanceCharge,
    securityDeposit,
    lockInMonths,
    noticePeriodDays,
    allowsSubletting,
    maxPersonsSharing,
    petsAllowed,
    houseRules,
    tenantPreference,
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

  // ── Field visibility, driven by deal / type / propertyCategory ────────────
  const categoryOptions = getCategoriesForType(type);
  const isLand = isLandCategory(propertyCategory);
  const showCommercialExtras = type === "Commercial";
  const showFurnishing = supportsFurnishing(propertyCategory);
  const showFacing = supportsFacing(propertyCategory);
  const showAmenities = supportsAmenities(propertyCategory);
  const showAgeOfProperty = !isLand;
  const showRentTerms = deal === "Rent";
  const showTenantPreference = deal === "Rent";
  const showSalePricePerSqft = deal === "Sale";
  const showOCStatus = deal === "Sale" && !isLand;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    const nearbyPlaces = {
      schools: splitLines(schoolsText),
      metroStations: splitLines(metroStationsText),
      hospitals: splitLines(hospitalsText),
      malls: splitLines(mallsText),
    };

    setPropertyDetails((prev: any) => ({
      ...prev,
      // Basics
      title,
      slug,
      description,
      price,
      deal,
      type,
      propertyCategory,
      area: { value: areaValue, unit: areaUnit },
      availability,
      furnishing: showFurnishing ? furnishing : undefined,
      facing: showFacing ? facing : undefined,
      // postedBy is derived from the logged-in user's role (see
      // AddPropertyPageContent) — never user-editable here.
      commercialPropertyTypes: showCommercialExtras
        ? commercialPropertyTypes
        : [],
      investmentOptions: showCommercialExtras ? investmentOptions : [],
      ageOfProperty: showAgeOfProperty ? toOptNum(ageOfProperty) : undefined,
      amenities: showAmenities && Array.isArray(amenities) ? amenities : [],
      // Pricing & extras — hidden fields cleared so stale values are never submitted
      maintenanceCharge: showRentTerms
        ? toOptNum(maintenanceCharge)
        : undefined,
      securityDeposit: showRentTerms ? toOptNum(securityDeposit) : undefined,
      lockInMonths: showRentTerms ? toOptNum(lockInMonths) : undefined,
      noticePeriodDays: showRentTerms ? toOptNum(noticePeriodDays) : undefined,
      // Subletting only applies to rentals; the sharing capacity is only kept when allowed.
      allowsSubletting: showRentTerms ? allowsSubletting : false,
      maxPersonsSharing:
        showRentTerms && allowsSubletting ? toOptNum(maxPersonsSharing) : undefined,
      petsAllowed: showRentTerms ? petsAllowed : false,
      houseRules:
        showRentTerms && allowsSubletting
          ? {
              ownerLivesOnPremises: houseRules.ownerLivesOnPremises,
              curfew: {
                hasCurfew: houseRules.curfew.hasCurfew,
                time:
                  houseRules.curfew.hasCurfew && houseRules.curfew.time
                    ? houseRules.curfew.time
                    : undefined,
              },
              oppositeGenderGuestsAllowed:
                houseRules.oppositeGenderGuestsAllowed || undefined,
              overnightGuestsAllowed:
                houseRules.overnightGuestsAllowed || undefined,
              smokingAllowedOnPremises: houseRules.smokingAllowedOnPremises,
              drinkingAllowedOnPremises: houseRules.drinkingAllowedOnPremises,
            }
          : undefined,
      tenantPreference: showTenantPreference ? tenantPreference || "Any" : undefined,
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
        <Text fw={700} size="lg">
          Basic details
        </Text>

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

        {showAgeOfProperty && (
          <NumberInput
            label="Age of property (years)"
            description="Optional — N/A for land/plots"
            min={0}
            {...form.getInputProps("ageOfProperty")}
            classNames={{ input: "border-gray-300" }}
          />
        )}

        {showTenantPreference && (
          <Select
            label="Tenant Preference"
            description="Select the type of tenants you prefer."
            data={["Family", "Bachelors", "Any", "Working Professionals", "Students"]}
            {...form.getInputProps("tenantPreference")}
            classNames={{ input: "border-gray-300" }}
            styles={{ dropdown: { zIndex: 1300 } }}
          />
        )}

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

        <Divider />
        <Text fw={700} size="lg">
          Pricing & extras
        </Text>
        <Text size="sm" c="dimmed">
          {deal === "Rent"
            ? "Price above is monthly rent (₹)."
            : "Price above is total asking amount (₹)."}
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
            <Checkbox
              label="Allow subletting / room-sharing"
              description="Tick if tenants can sublet rooms or share the space with roommates."
              {...form.getInputProps("allowsSubletting", { type: "checkbox" })}
            />
            {allowsSubletting && (
              <NumberInput
                label="How many persons can share the property?"
                description="Maximum number of people who can stay / share together (including sublets)."
                min={1}
                {...form.getInputProps("maxPersonsSharing")}
                classNames={{ input: "border-gray-300" }}
              />
            )}
            <Switch
              label="Pets allowed"
              description="Turn on if tenants can keep pets in the property."
              {...form.getInputProps("petsAllowed", { type: "checkbox" })}
            />
            {allowsSubletting && <HouseRulesSection form={form} />}
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

export default PropertyDetailsStep;
