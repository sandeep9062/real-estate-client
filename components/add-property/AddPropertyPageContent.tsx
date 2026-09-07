"use client";

import { Container, Stepper, Center, Loader, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import useCountries from "@/lib/useCountries";
import MagicFill from "@/components/MagicFill";
import PhotosLocationStep from "@/components/add-property/PhotosLocationStep";
import PropertyDetailsStep from "@/components/add-property/PropertyDetailsStep";
import FacilitiesStep from "@/components/add-property/FacilitiesStep";
import { useGetPropertyQuery } from "@/services/propertiesApi";

const TOTAL_STEPS = 4; // MagicFill, Photos & Location, Property Details, Facilities & Submit
const LAST_STEP_INDEX = TOTAL_STEPS - 1;

function buildDefaultPropertyDetails(userEmail?: string) {
  return {
    title: "",
    slug: "",
    description: "",
    price: 0,
    deal: "Rent",
    type: "Residential",
    propertyCategory: "Apartment/Flat",
    area: { value: 1000, unit: "sqft" },
    availability: "Ready to Move",
    furnishing: "Un-Furnished",
    facing: "",
    postedBy: "Owner",
    location: {
      address: "",
      city: "Chandigarh",
      state: "",
      country: "IN",
      pincode: "",
      coordinates: { lat: 0, lng: 0 },
    },
    commercialPropertyTypes: [] as string[],
    investmentOptions: [] as string[],
    listingAvailability: "Available",
    virtualTourUrl: "",
    floorPlanImages: [] as string[],
    nearbyPlaces: {
      schools: [] as string[],
      metroStations: [] as string[],
      hospitals: [] as string[],
      malls: [] as string[],
    },
    reraNumber: "",
    floorPlanFiles: [] as File[],
    image: [] as (string | File)[],
    maintenanceCharge: undefined as number | undefined,
    securityDeposit: undefined as number | undefined,
    lockInMonths: undefined as number | undefined,
    noticePeriodDays: undefined as number | undefined,
    ocStatus: "" as string,
    ageOfProperty: undefined as number | undefined,
    pricePerSqft: undefined as number | undefined,
    negotiable: true,
    amenities: [] as string[],
    facilities: {
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
      servantRooms: 0,
      balconies: 0,
    },
    userEmail,
  };
}

export default function AddPropertyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");
  const initialStep = Number(searchParams.get("step") ?? 0);

  const user = useSelector(selectUser);
  const { getAll } = useCountries();
  const countries = getAll();

  const [active, setActive] = useState(
    Number.isFinite(initialStep)
      ? Math.min(Math.max(initialStep, 0), LAST_STEP_INDEX)
      : 0,
  );

  const defaultPropertyDetails = buildDefaultPropertyDetails(user?.email);
  const [propertyDetails, setPropertyDetails] = useState(
    defaultPropertyDetails,
  );
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // ── Edit mode: fetch the existing property when ?id= is present ──────────
  const {
    data: fetchedProperty,
    isLoading: isLoadingProperty,
    isError: isFetchError,
  } = useGetPropertyQuery(editingId as string, { skip: !editingId });

  const normalizeCountry = (raw: string) => {
    if (!raw) return "";
    if (raw.length === 2) return raw;
    const match = countries.find(
      (c) =>
        c.name?.toLowerCase() === raw.toLowerCase() ||
        c.label.toLowerCase().includes(raw.toLowerCase()),
    );
    return match?.value || "";
  };

  // Backend's transformPropertyCoordinates returns { lat, lng } directly.
  // This normalizer handles both that format and raw GeoJSON { coordinates: [lng, lat] }
  // for backwards-compatibility, defaulting to { lat: 0, lng: 0 } when unset.
  const convertGeoJSONToLatLng = (coordinates: any) => {
    if (!coordinates) return { lat: 0, lng: 0 };

    // Already-transformed format from backend: { lat, lng }
    if (typeof coordinates.lat === "number" && typeof coordinates.lng === "number") {
      return { lat: coordinates.lat, lng: coordinates.lng };
    }

    // Raw GeoJSON format: { type: "Point", coordinates: [lng, lat] }
    if (
      coordinates.coordinates &&
      Array.isArray(coordinates.coordinates) &&
      coordinates.coordinates.length >= 2
    ) {
      return {
        lat: coordinates.coordinates[1],
        lng: coordinates.coordinates[0],
      };
    }

    return { lat: 0, lng: 0 };
  };

  const convertLatLngToGeoJSON = (coords: { lat: number; lng: number }) => {
    if (
      coords &&
      typeof coords.lat === "number" &&
      typeof coords.lng === "number"
    ) {
      return { type: "Point", coordinates: [coords.lng, coords.lat] };
    }
    return { type: "Point", coordinates: [0, 0] };
  };

  useEffect(() => {
    if (editingId && fetchedProperty) {
      const normalizedCoordinates = convertGeoJSONToLatLng(
        fetchedProperty.location?.coordinates,
      );
      setPropertyDetails({
        ...defaultPropertyDetails,
        ...fetchedProperty,
        location: {
          ...defaultPropertyDetails.location,
          ...fetchedProperty.location,
          country: normalizeCountry(fetchedProperty.location?.country),
          coordinates: normalizedCoordinates,
        },
        userEmail: user?.email,
        floorPlanFiles: [],
      });
      setEditingProperty(fetchedProperty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId, fetchedProperty, user?.email, countries]);

  // Keep the URL's ?step= in sync so refresh/back-forward at least land on
  // the right step (full form-data persistence across a hard refresh is a
  // separate, larger piece of work — not attempted here).
  const goToStep = (step: number) => {
    const clamped = Math.min(Math.max(step, 0), LAST_STEP_INDEX);
    setActive(clamped);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(clamped));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const nextStep = () => goToStep(active + 1);
  const prevStep = () => goToStep(active - 1);

  const handleSubmitted = () => {
    // Land back on the agent/landlord dashboard after a successful
    // create/update — adjust this destination if your routing differs.
    router.push(
      user?.role === "landlord" ? "/landlord/dashboard" : "/agent-dashboard",
    );
  };

  if (editingId && isLoadingProperty) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  if (editingId && isFetchError) {
    return (
      <Center h={400}>
        <Text c="red">
          Couldn&apos;t load this property for editing. It may have been
          removed, or you may not have access to it.
        </Text>
      </Center>
    );
  }

  return (
    <Container size="md" py="xl" mt={60}>
      <Stepper active={active} onStepClick={goToStep}>
        <Stepper.Step label="AI Magic" description="Auto-fill data">
          <MagicFill
            nextStep={nextStep}
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
            normalizeCountry={normalizeCountry}
          />
        </Stepper.Step>

        <Stepper.Step label="Photos & Location">
          <PhotosLocationStep
            prevStep={prevStep}
            nextStep={nextStep}
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
            convertLatLngToGeoJSON={convertLatLngToGeoJSON}
            isEditing={!!editingProperty}
          />
        </Stepper.Step>

        <Stepper.Step label="Property Details">
          <PropertyDetailsStep
            key={
              editingProperty?._id
                ? String(editingProperty._id)
                : "new-property"
            }
            prevStep={prevStep}
            nextStep={nextStep}
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
          />
        </Stepper.Step>

        <Stepper.Step label="Facilities & Submit">
          <FacilitiesStep
            prevStep={prevStep}
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
            onSubmitted={handleSubmitted}
            editingProperty={editingProperty}
            emptyPropertyDraft={{
              ...defaultPropertyDetails,
              userEmail: user?.email,
              location: { ...defaultPropertyDetails.location },
              nearbyPlaces: {
                schools: [],
                metroStations: [],
                hospitals: [],
                malls: [],
              },
              floorPlanImages: [],
              floorPlanFiles: [],
              facilities: { ...defaultPropertyDetails.facilities },
            }}
          />
        </Stepper.Step>

        <Stepper.Completed>Property saved successfully</Stepper.Completed>
      </Stepper>
    </Container>
  );
}
