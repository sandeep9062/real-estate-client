"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm } from "@mantine/form";
import { Box, Button, Group, Select, TextInput, Text, Divider } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { validateString } from "@/lib/utils";
import useCountries from "@/lib/useCountries";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const ACCEPT = [
  MIME_TYPES.jpeg,
  MIME_TYPES.png,
  MIME_TYPES.webp,
  MIME_TYPES.gif,
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];
const MAX_SIZE = 100 * 1024 ** 2;

function appendFilePreviews(
  files: File[],
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setFiles((prev) => [...prev, ...files]);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  });
}

interface ResolvedPhotosLocation {
  image: (string | File)[];
  location: Record<string, any>;
}

interface PhotosLocationStepProps {
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  /**
   * Called on successful submit with the resolved photos + location, so
   * container pages (add-property stepper, flatmates onboarding) can act on
   * the exact values even before their own state updates flush.
   */
  nextStep: (result?: ResolvedPhotosLocation) => void;
  prevStep: () => void;
  convertLatLngToGeoJSON: (coords: { lat: number; lng: number }) => any;
  isEditing?: boolean;
}

/**
 * Merged step: combines the old separate "Images" and "Location" steps into
 * one screen — both are "context about the place" rather than distinct data
 * entry tasks, so splitting them across two stepper pages added friction
 * without much benefit.
 */
const PhotosLocationStep: React.FC<PhotosLocationStepProps> = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
  convertLatLngToGeoJSON,
}) => {
  const { getAll } = useCountries();

  // Map expects { lat, lng } but the draft stores GeoJSON
  // { type: "Point", coordinates: [lng, lat] } — convert for the Map prop so
  // the pin actually reflects the saved location (and vice-versa on click).
  const mapLocation = (() => {
    const c = propertyDetails?.location?.coordinates;
    if (!c) return undefined;
    if (
      typeof c.lat === "number" &&
      typeof c.lng === "number" &&
      Number.isFinite(c.lat) &&
      Number.isFinite(c.lng)
    ) {
      return { lat: c.lat, lng: c.lng };
    }
    if (
      Array.isArray(c.coordinates) &&
      c.coordinates.length >= 2 &&
      Number.isFinite(Number(c.coordinates[1])) &&
      Number.isFinite(Number(c.coordinates[0]))
    ) {
      return { lat: Number(c.coordinates[1]), lng: Number(c.coordinates[0]) };
    }
    return undefined;
  })();

  // ── Images sub-section state (unchanged logic from old UploadImage.tsx) ──
  const existingImages = propertyDetails.image || [];
  const existingCount = existingImages.length;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [deleted, setDeleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    setPreviews(existingImages);
    setDeleted(new Set());
    setFiles([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingImages.length]);

  const handleRemove = (index: number) => {
    setDeleted((prev) => new Set([...prev, index]));
  };

  // ── Location sub-section state (unchanged logic from old AddLocation.tsx) ─
  // In edit mode the saved listing arrives AFTER this component first renders
  // (the parent fetches it), so re-seed the form's initial values when the
  // location payload finally shows up.
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

  useEffect(() => {
    const loc = propertyDetails?.location || {};
    if (loc.country || loc.city || loc.address) {
      form.setValues({
        country: loc.country ?? "",
        city: loc.city ?? "",
        address: loc.address ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    propertyDetails?.location?.country,
    propertyDetails?.location?.city,
    propertyDetails?.location?.address,
  ]);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    // Resolve images (existing minus deleted, plus newly added files)
    const image: (string | File)[] = [];
    for (let i = 0; i < previews.length; i++) {
      if (deleted.has(i)) continue;
      if (i < existingCount) {
        image.push(existingImages[i]);
      } else {
        image.push(files[i - existingCount]);
      }
    }

    const { country, city, address } = form.values;

    const resolved: ResolvedPhotosLocation = {
      image,
      location: {
        ...(propertyDetails?.location || {}),
        country,
        city,
        address,
      },
    };

    setPropertyDetails((prev: any) => ({
      ...prev,
      image,
      location: { ...prev.location, country, city, address },
    }));
    nextStep(resolved);
  };

  return (
    <Box className="flex flex-col gap-8 mt-8 w-full">
      <div>
        <Text fw={700} size="lg" mb="sm">
          Photos & videos
        </Text>
        <Dropzone
          onDrop={(dropped) =>
            appendFilePreviews(dropped, setFiles, setPreviews)
          }
          onReject={(fileRejections) => {
            const first = fileRejections[0];
            const msg =
              first?.errors?.map((e) => e.message).join(", ") ||
              "Some files were rejected";
            toast.error(msg);
          }}
          accept={ACCEPT}
          maxSize={MAX_SIZE}
          multiple
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 data-[accept]:border-[#4161df] data-[accept]:bg-blue-50/50 transition-colors min-h-[14rem]"
        >
          <Group
            justify="center"
            gap="xl"
            mih={200}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size={52} stroke={1.5} className="text-[#4161df]" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={52} stroke={1.5} className="text-red-500" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={52} stroke={1.5} className="text-gray-400" />
            </Dropzone.Idle>

            <div>
              <Text size="lg" inline>
                Drag images or videos here, or click to browse
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Optional — add media for better visibility. JPEG, PNG, WebP,
                GIF, MP4, MOV, WebM — up to 100MB per file (Cloudinary on save)
              </Text>
            </div>
          </Group>
        </Dropzone>

        <div className="flex flex-wrap gap-4 justify-center w-full mt-4">
          {previews
            .map((preview, index) => ({ preview, index }))
            .filter(({ index }) => !deleted.has(index))
            .map(({ preview, index }) => {
              const isNew = index >= existingCount;
              const file = isNew ? files[index - existingCount] : null;
              const isVideo =
                file?.type.startsWith("video/") ||
                (typeof preview === "string" &&
                  (preview.startsWith("data:video/") ||
                    /\.(mp4|webm|mov)(\?|$)/i.test(preview)));

              return (
                <div
                  key={`${index}-${typeof preview === "string" ? preview.slice(0, 48) : index}`}
                  className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative bg-black"
                >
                  {isVideo ? (
                    <video
                      src={preview}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={`preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <Divider />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <Text fw={700} size="lg">
          Location
        </Text>

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

        <Text size="sm" fw={500} mt="md" mb={4}>
          Pick on map (latitude &amp; longitude)
        </Text>
        <Text size="xs" c="dimmed" mb={8}>
          Click on the map to drop a pin for your property location. The pin
          is saved as latitude &amp; longitude with the listing.
        </Text>
        <div className="w-full h-72 rounded-lg overflow-hidden border border-gray-300">
          <Map
            location={mapLocation}
            setLocation={(coords: { lat: number; lng: number }) => {
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

export default PhotosLocationStep;
