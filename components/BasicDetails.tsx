"use client";

import React from "react";
import {
  TextInput,
  Box,
  Textarea,
  Group,
  Button,
  NumberInput,
  Select,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "@/lib/utils";

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
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value: number) =>
        value < 1000 ? "Must be greater than 999 rupees" : null,
    },
  });

  const {
    title,
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
  } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev: any) => ({
        ...prev,
        title,
        description,
        price,
        deal,
        type,
        propertyCategory,
        area: { value: areaValue, unit: areaUnit },
        availability,
        furnishing,
        facing,
        postedBy,
        commercialPropertyTypes,
        investmentOptions,
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
          placeholder="1000"
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
          data={["Residential", "Commercial"]}
          {...form.getInputProps("type")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        {form.values.type === "Commercial" && (
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
          data={[
            "Apartment/Flat",
            "House/Villa",
            "Land/Plot",
            "Studio Apartment",
            "Builder Floor",
            "PG/Hostel",
            "Farmhouse",
            "Retail",
            "Office",
            "Industrial",
            "Warehouse",
            "Shop/Showroom",
          ]}
          {...form.getInputProps("propertyCategory")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        <Group grow>
          <NumberInput
            label="Area"
            min={1}
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

        <Select
          label="Furnishing"
          data={["Furnished", "Semi Furnished", "Un-Furnished"]}
          {...form.getInputProps("furnishing")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

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

        <Select
          label="Posted By"
          data={["Owner", "Agent", "Builder"]}
          {...form.getInputProps("postedBy")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
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
