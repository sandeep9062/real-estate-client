"use client";

import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import {
  selectUser,
  selectToken,
} from "../store/authSlice";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetAllPropertiesQuery,
} from "@/services/propertiesApi";


interface FacilitiesProps {
  prevStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  setOpened: (value: boolean) => void;
  setActiveStep: (value: number) => void;
  editingProperty?: any;
}

const Facilities: React.FC<FacilitiesProps> = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
  editingProperty,
}) => {
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
      servantRooms: propertyDetails.facilities.servantRooms,
    },
    validate: {
      bedrooms: (value: number) =>
        value < 1 ? "Must have atleast one room" : null,
      bathrooms: (value: number) =>
        value < 1 ? "Must have atleast one bathroom" : null,
    },
  });

  const { bedrooms, parkings, bathrooms, servantRooms } = form.values;

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const { refetch: refetchProperties } = useGetAllPropertiesQuery({});
  const [createProperty, { isLoading: createLoading }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: updateLoading }] = useUpdatePropertyMutation();

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add a property");
      return;
    }

    const newProperty = {
      ...propertyDetails,
      facilities: { bedrooms, parkings, bathrooms, servantRooms },
      userEmail: user?.email,
    };

    try {
      if (editingProperty) {
        // Update existing property
        await updateProperty({ id: editingProperty._id, ...newProperty }).unwrap();
        toast.success("Property updated successfully");
      } else {
        // Create new property
        await createProperty({ ...newProperty, token }).unwrap();
        toast.success("Property added successfully");
        setPropertyDetails({
          title: "",
          description: "",
          price: 0,
          country: "",
          city: "",
          address: "",
          image: null,
          facilities: {
            bedrooms: 0,
            parkings: 0,
            bathrooms: 0,
            servantRooms: 0,
          },
          userEmail: user?.email,
        });
      }
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    } catch (error: any) {
      let errorMessage = editingProperty ? "Failed to update property" : "Failed to add property";
      
      // Handle RTK Query errors
      if (error?.status === 'PARSING_ERROR' && error?.originalStatus === 500) {
        errorMessage = "Server error occurred. Please try again later.";
        console.error("Server Error:", {
          status: error.originalStatus,
          data: error.data
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
        <NumberInput
          withAsterisk
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
          classNames={{ input: "border-gray-300" }}
        />

        <NumberInput
          label="No of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
          classNames={{ input: "border-gray-300" }}
        />

        <NumberInput
          withAsterisk
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

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting" : (editingProperty ? "Update Property" : "Add Property")}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;
