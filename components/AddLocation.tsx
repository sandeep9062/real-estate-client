"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useForm } from "@mantine/form";
import { validateString } from "../lib/utils";
import { Button, Group, Select, TextInput } from "@mantine/core";
import useCountries from "../lib/useCountries";

interface AddLocationProps {
  propertyDetails: any;
  setPropertyDetails: (details: any) => void;
  nextStep: () => void;
  convertLatLngToGeoJSON?: (coords: { lat: number; lng: number }) => any;
}

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

const AddLocation = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  convertLatLngToGeoJSON,
}: AddLocationProps) => {
  const { getAll } = useCountries();

  const form = useForm({
    initialValues: {
      country: propertyDetails?.location?.country,
      city: propertyDetails?.location?.city,

      address: propertyDetails?.location?.address,
    },
    validate: {
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
    },
  });

  const handleSubmit = () => {
    const { country, city, address } = form.values;
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev: any) => ({
        ...prev,
        location: { ...prev.location, country, city, address },
      }));
      nextStep();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col items-center justify-center gap-4 mt-8"
    >
      <div className="w-full flex flex-col gap-4">
        <Select
          w="100%"
          withAsterisk
          label="Country"
          clearable
          searchable
          data={getAll().map((country) => ({
            value: country.value,
            label: `${country.label}`,
          }))}
          {...form.getInputProps("country")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />
        
        <TextInput
          w="100%"
          withAsterisk
          label="City"
          {...form.getInputProps("city")}
          classNames={{ input: "border-gray-300" }}
        />

        <TextInput
          w="100%"
          withAsterisk
          label="Address"
          {...form.getInputProps("address")}
          classNames={{ input: "border-gray-300" }}
        />
      </div>

      <div className="w-full h-72 rounded-lg overflow-hidden border border-gray-300">
        <Map
          location={propertyDetails?.location?.coordinates}
          setLocation={(coords) => {
            const geoJSONCoords = convertLatLngToGeoJSON
              ? convertLatLngToGeoJSON(coords)
              : coords;
            setPropertyDetails((prev: any) => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: geoJSONCoords,
              },
            }));
          }}
        />
      </div>

      <Group justify="center" mt="xl">
        <Button type="submit" color="blue">
          Next step
        </Button>
      </Group>
    </form>
  );
};

export default AddLocation;
