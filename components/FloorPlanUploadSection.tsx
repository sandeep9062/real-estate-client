"use client";

import React, { useState } from "react";
import { Group, Text, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

const MAX_SIZE = 20 * 1024 ** 2;

interface FloorPlanUploadSectionProps {
  urls: string[];
  files: File[];
  onUrlsChange: (urls: string[]) => void;
  onFilesChange: (files: File[]) => void;
}

export default function FloorPlanUploadSection({
  urls,
  files,
  onUrlsChange,
  onFilesChange,
}: FloorPlanUploadSectionProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    const next: string[] = [];
    let pending = files.length;
    if (!pending) {
      setPreviews([]);
      return;
    }
    files.forEach((file, i) => {
      const r = new FileReader();
      r.onloadend = () => {
        if (cancelled) return;
        next[i] = r.result as string;
        pending -= 1;
        if (pending === 0) setPreviews([...next]);
      };
      r.readAsDataURL(file);
    });
    return () => {
      cancelled = true;
    };
  }, [files]);

  const removeUrl = (index: number) => {
    onUrlsChange(urls.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Text size="sm" fw={600}>
        Floor plans
      </Text>
      <Text size="xs" c="dimmed">
        Drag and drop images here (JPEG, PNG, WebP). Uploaded to Cloudinary when you save the listing.
      </Text>

      <Dropzone
        onDrop={(dropped) => onFilesChange([...files, ...dropped])}
        onReject={(rej) => {
          const msg =
            rej[0]?.errors?.map((e) => e.message).join(", ") ||
            "Some files were rejected";
          toast.error(msg);
        }}
        accept={IMAGE_MIME_TYPE}
        maxSize={MAX_SIZE}
        multiple
        className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 data-[accept]:border-[#4161df] data-[accept]:bg-blue-50/50 transition-colors min-h-[10rem]"
      >
        <Group justify="center" gap="md" mih={120} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload size={40} stroke={1.5} className="text-[#4161df]" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={40} stroke={1.5} className="text-red-500" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={40} stroke={1.5} className="text-gray-400" />
          </Dropzone.Idle>
          <div>
            <Text size="sm" inline>
              Drop floor plan images or click to browse
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Up to 20MB per image
            </Text>
          </div>
        </Group>
      </Dropzone>

      {(urls.length > 0 || files.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <div
              key={`url-${url.slice(-24)}-${index}`}
              className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 relative bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <Button
                type="button"
                size="xs"
                color="red"
                variant="filled"
                className="!absolute top-1 right-1 !min-w-0 !w-7 !h-7 !p-0"
                onClick={() => removeUrl(index)}
              >
                ×
              </Button>
            </div>
          ))}
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 relative bg-slate-100"
            >
              {previews[index] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previews[index]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-center p-1 text-slate-500">
                  {file.name}
                </div>
              )}
              <Button
                type="button"
                size="xs"
                color="red"
                variant="filled"
                className="!absolute top-1 right-1 !min-w-0 !w-7 !h-7 !p-0"
                onClick={() => removeFile(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
