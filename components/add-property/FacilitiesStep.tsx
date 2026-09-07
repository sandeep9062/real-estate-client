"use client";

import { Box, Button, Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { selectUser } from "@/store/authSlice";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetAllPropertiesQuery,
} from "@/services/propertiesApi";
import { supportsRoomCounts, supportsParking } from "@/lib/propertyOptions";

interface FacilitiesStepProps {
  prevStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  onSubmitted: () => void;
  editingProperty?: any;
  emptyPropertyDraft?: Record<string, unknown>;
}

const FacilitiesStep: React.FC<FacilitiesStepProps> = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  onSubmitted,
  editingProperty,
  emptyPropertyDraft,
}) => {
  const { type, propertyCategory } = propertyDetails;
  const showRoomCounts = supportsRoomCounts(type, propertyCategory);
  const showParking = supportsParking(propertyCategory);
  const showNothing = !showRoomCounts && !showParking;

  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
      servantRooms: propertyDetails.facilities.servantRooms,
      balconies: propertyDetails.facilities.balconies ?? 0,
      parkingType: propertyDetails.facilities.parkingType || "",
    },
    validate: {
      bedrooms: (value: number) =>
        showRoomCounts && value < 0 ? "Cannot be negative" : null,
      bathrooms: (value: number) =>
        showRoomCounts && value < 0 ? "Cannot be negative" : null,
    },
  });

  const {
    bedrooms,
    parkings,
    bathrooms,
    servantRooms,
    balconies,
    parkingType,
  } = form.values;

  const user = useSelector(selectUser);
  const { refetch: refetchProperties } = useGetAllPropertiesQuery({});
  const [createProperty, { isLoading: createLoading }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: updateLoading }] =
    useUpdatePropertyMutation();

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add a property");
      return;
    }

    // Hidden fields are cleared so stale values are never submitted
    const newProperty = {
      ...propertyDetails,
      facilities: {
        ...propertyDetails.facilities,
        bedrooms: showRoomCounts ? bedrooms : undefined,
        parkings: showParking ? parkings : undefined,
        bathrooms: showRoomCounts ? bathrooms : undefined,
        servantRooms: showRoomCounts ? servantRooms : undefined,
        balconies: showRoomCounts ? balconies : undefined,
        ...(showParking && parkingType ? { parkingType } : {}),
      },
      userEmail: user?.email,
    };

    try {
      if (editingProperty) {
        await updateProperty({
          id: editingProperty._id,
          ...newProperty,
        }).unwrap();
        toast.success("Property updated successfully");
      } else {
        await createProperty(newProperty).unwrap();
        toast.success("Property added successfully");
        if (emptyPropertyDraft) {
          setPropertyDetails(emptyPropertyDraft as any);
        }
      }
      refetchProperties();
      onSubmitted();
    } catch (error: any) {
      let errorMessage = editingProperty
        ? "Failed to update property"
        : "Failed to add property";

      if (error?.status === "PARSING_ERROR" && error?.originalStatus === 500) {
        errorMessage = "Server error occurred. Please try again later.";
        console.error("Server Error:", {
          status: error.originalStatus,
          data: error.data,
        });
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Error submitting property:", error);
    }
  };

  const isLoading = editingProperty ? updateLoading : createLoading;

  return (
    <Box maw="100%" mx="auto" my="sm">
      <form
        className="flex flex-col gap-6 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {showNothing && (
          <Text c="dimmed" size="sm">
            No additional facility details needed for this property type.
          </Text>
        )}

        {showRoomCounts && (
          <>
            <NumberInput
              label="No of Bedrooms"
              min={0}
              {...form.getInputProps("bedrooms")}
              classNames={{ input: "border-gray-300" }}
            />

            <NumberInput
              label="No of Bathrooms"
              min={0}
              {...form.getInputProps("bathrooms")}
              classNames={{ input: "border-gray-300" }}
            />

            <NumberInput
              label="No of Servant Rooms"
              min={0}
              {...form.getInputProps("servantRooms")}
              classNames={{ input: "border-gray-300" }}
            />

            <NumberInput
              label="Balconies"
              min={0}
              {...form.getInputProps("balconies")}
              classNames={{ input: "border-gray-300" }}
            />
          </>
        )}

        {showParking && (
          <>
            <NumberInput
              label="No of Parkings"
              min={0}
              {...form.getInputProps("parkings")}
              classNames={{ input: "border-gray-300" }}
            />

            <Select
              label="Parking type"
              data={[
                { value: "", label: "— Not specified —" },
                { value: "None", label: "None" },
                { value: "Open", label: "Open" },
                { value: "Covered", label: "Covered" },
                { value: "Both", label: "Both" },
              ]}
              {...form.getInputProps("parkingType")}
              classNames={{ input: "border-gray-300" }}
              styles={{ dropdown: { zIndex: 1300 } }}
            />
          </>
        )}

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading
              ? "Submitting"
              : editingProperty
                ? "Update Property"
                : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default FacilitiesStep;
