"use client";

import { Container, Modal, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import AddLocation from "./AddLocation";
import UploadImage from "./UploadImage";
import BasicDetails from "./BasicDetails";
import Facilities from "./Facilities";
import useCountries from "../lib/useCountries";
import MagicFill from "./MagicFill";

const AddPropertyModal = ({
  opened,
  setOpened,
  editingProperty,
}: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  editingProperty?: any;
}) => {
  const [active, setActive] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const user = useSelector(selectUser);
  const { getAll } = useCountries();
  const countries = getAll();

  const defaultPropertyDetails = {
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
    commercialPropertyTypes: [],
    investmentOptions: [],
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
    image: [],
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
    userEmail: user?.email,
  };

  const [propertyDetails, setPropertyDetails] = useState(
    defaultPropertyDetails,
  );

  /* ✅ NORMALIZE COUNTRY HERE (KEY FIX) */
  const normalizeCountry = (raw: string) => {
    if (!raw) return "";

    // already code
    if (raw.length === 2) return raw;

    // convert name → code
    const match = countries.find(
      (c) =>
        c.name?.toLowerCase() === raw.toLowerCase() ||
        c.label.toLowerCase().includes(raw.toLowerCase()),
    );

    return match?.value || "";
  };

  // Function to convert GeoJSON coordinates to {lat, lng}
  const convertGeoJSONToLatLng = (coordinates: any) => {
    if (
      coordinates &&
      coordinates.coordinates &&
      Array.isArray(coordinates.coordinates) &&
      coordinates.coordinates.length >= 2
    ) {
      // GeoJSON: [lng, lat]
      return {
        lat: coordinates.coordinates[1],
        lng: coordinates.coordinates[0],
      };
    }
    return { lat: 0, lng: 0 };
  };

  // Function to convert {lat, lng} to GeoJSON
  const convertLatLngToGeoJSON = (coords: { lat: number; lng: number }) => {
    if (
      coords &&
      typeof coords.lat === "number" &&
      typeof coords.lng === "number"
    ) {
      return {
        type: "Point",
        coordinates: [coords.lng, coords.lat], // [lng, lat]
      };
    }
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  };

  useEffect(() => {
    if (editingProperty) {
      const normalizedCoordinates = convertGeoJSONToLatLng(
        editingProperty.location?.coordinates,
      );
      setPropertyDetails({
        ...defaultPropertyDetails,
        ...editingProperty,
        location: {
          ...defaultPropertyDetails.location,
          ...editingProperty.location,
          country: normalizeCountry(editingProperty.location?.country),
          coordinates: normalizedCoordinates,
        },
        userEmail: user?.email,
        floorPlanFiles: [],
      });
      setActive(0);
    } else {
      setPropertyDetails(defaultPropertyDetails);
      setActive(0);
    }
  }, [editingProperty, user?.email, countries]);

  const nextStep = () => setActive((c) => Math.min(c + 1, 4));
  const prevStep = () => setActive((c) => Math.max(c - 1, 0));

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      fullScreen={isMobile}
      size="xl"
      zIndex={1300}
      centered={!isMobile}
      styles={{
        content: { width: "100vw", maxWidth: "none" },
      }}
      overlayProps={{
        style: {
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Container>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="AI Magic" description="Auto-fill data">
            <MagicFill
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              normalizeCountry={normalizeCountry}
            />
          </Stepper.Step>

          <Stepper.Step label="Images">
            <UploadImage
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              isEditing={!!editingProperty}
            />
          </Stepper.Step>
          <Stepper.Step label="Location">
            <AddLocation
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              convertLatLngToGeoJSON={convertLatLngToGeoJSON}
            />
          </Stepper.Step>

          <Stepper.Step label="Basics">
            <BasicDetails
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

          <Stepper.Step label="Facilities">
            <Facilities
              prevStep={prevStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              setOpened={setOpened}
              setActiveStep={setActive}
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
    </Modal>
  );
};

export default AddPropertyModal;
