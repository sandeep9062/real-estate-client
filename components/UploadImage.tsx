"use client";

import React, { useState } from "react";
import { Group, Text, Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

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

interface UploadImageProps {
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
  prevStep: () => void;
  isEditing: boolean;
}

function appendFilePreviews(files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>>, setPreviews: React.Dispatch<React.SetStateAction<string[]>>) {
  setFiles((prev) => [...prev, ...files]);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  });
}

const UploadImage: React.FC<UploadImageProps> = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
  isEditing: _isEditing,
}) => {
  const existingImages = propertyDetails.image || [];
  const existingCount = existingImages.length;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [deleted, setDeleted] = useState<Set<number>>(new Set());

  React.useEffect(() => {
    setPreviews(existingImages);
    setDeleted(new Set());
    setFiles([]);
  }, [existingImages.length]);

  const handleRemove = (index: number) => {
    setDeleted((prev) => new Set([...prev, index]));
  };

  const handleNext = () => {
    const image: (string | File)[] = [];
    for (let i = 0; i < previews.length; i++) {
      if (deleted.has(i)) continue;
      if (i < existingCount) {
        image.push(existingImages[i]);
      } else {
        image.push(files[i - existingCount]);
      }
    }
    setPropertyDetails((prev: any) => ({ ...prev, image }));
    nextStep();
  };

  const totalImages = previews.length - deleted.size;

  return (
    <div className="flex flex-col items-center mt-8 gap-8 w-full max-w-2xl mx-auto">
      <Dropzone
        onDrop={(dropped) => appendFilePreviews(dropped, setFiles, setPreviews)}
        onReject={(fileRejections) => {
          const first = fileRejections[0];
          const msg =
            first?.errors?.map((e) => e.message).join(", ") || "Some files were rejected";
          toast.error(msg);
        }}
        accept={ACCEPT}
        maxSize={MAX_SIZE}
        multiple
        className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 data-[accept]:border-[#4161df] data-[accept]:bg-blue-50/50 transition-colors min-h-[14rem]"
      >
        <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: "none" }}>
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
              Optional — add media for better visibility. JPEG, PNG, WebP, GIF, MP4, MOV, WebM — up to
              100MB per file (Cloudinary on save)
            </Text>
          </div>
        </Group>
      </Dropzone>

      <div className="flex flex-wrap gap-4 justify-center w-full">
        {previews
          .map((preview, index) => ({ preview, index }))
          .filter(({ index }) => !deleted.has(index))
          .map(({ preview, index }) => {
            const isNew = index >= existingCount;
            const file = isNew ? files[index - existingCount] : null;
            const isVideo =
              file?.type.startsWith("video/") ||
              (typeof preview === "string" &&
                (preview.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(preview)));

            return (
              <div
                key={`${index}-${typeof preview === "string" ? preview.slice(0, 48) : index}`}
                className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative bg-black"
              >
                {isVideo ? (
                  <video src={preview} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
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

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} color="blue">
          Next
        </Button>
      </Group>
    </div>
  );
};

export default UploadImage;
