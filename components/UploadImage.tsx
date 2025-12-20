"use client";

import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button, Group } from "@mantine/core";

interface UploadImageProps {
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
  prevStep: () => void;
  isEditing: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
  isEditing,
}) => {
  const existingImages = propertyDetails.image || [];
  const existingCount = existingImages.length;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [deleted, setDeleted] = useState<Set<number>>(new Set());

  // Update previews when existingImages change (e.g., when editing)
  React.useEffect(() => {
    setPreviews(existingImages);
    setDeleted(new Set());
    setFiles([]);
  }, [existingImages.length]); // Reset state when switching to edit mode

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    setDeleted((prev) => new Set([...prev, index]));
  };

  const handleNext = () => {
    let image: (string | File)[] = [];
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
    <div className="flex flex-col items-center mt-8 gap-8">
      <label
        htmlFor="image-upload"
        className="flex flex-col justify-center items-center w-full h-[18rem] border-2 border-dashed border-gray-300 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <AiOutlineCloudUpload size={48} className="text-gray-500" />
        <span className="text-sm text-gray-600 mt-2">Drag & drop files here or click to browse</span>
        <span className="text-xs text-gray-500">PNG, JPG up to 10MB each</span>
      </label>

      <div className="flex flex-wrap gap-4 justify-center">
        {previews
          .map((preview, index) => ({ preview, index }))
          .filter(({ index }) => !deleted.has(index))
          .map(({ preview, index }) => (
            <div key={index} className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative">
              <img
                src={preview}
                alt={`preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={totalImages === 0} color="blue">
          Next
        </Button>
      </Group>
    </div>
  );
};

export default UploadImage;
