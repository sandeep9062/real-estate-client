"use client";

import { useEffect, useState } from "react";
import { Group, Text } from "@mantine/core";
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

/**
 * Multi-image uploader for the user's profile pictures (the person, not the
 * property). Kept URLs (strings) are shown as-is; newly-picked File objects
 * get a data-URL preview. Matches the dropzone UX used by
 * PhotosLocationFlat so the flatmates flow feels consistent.
 */
export default function ProfilePhotosUploader({
  value,
  onChange,
}: {
  value: (string | File)[];
  onChange: (next: (string | File)[]) => void;
}) {
  const existing = Array.isArray(value) ? value : [];
  const existingCount = existing.filter((p) => typeof p === "string").length;

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    existing.filter((p): p is string => typeof p === "string"),
  );
  const [deleted, setDeleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    setPreviews(existing.filter((p): p is string => typeof p === "string"));
    setDeleted(new Set());
    setFiles([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCount]);

  function appendFilePreviews(dropped: File[]) {
    setFiles((prev) => [...prev, ...dropped]);
    dropped.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemove(index: number) {
    setDeleted((prev) => new Set([...prev, index]));
  }

  function emit() {
    const next: (string | File)[] = [];
    for (let i = 0; i < previews.length; i++) {
      if (deleted.has(i)) continue;
      if (i < existingCount) {
        next.push(existing[i]);
      } else {
        next.push(files[i - existingCount]);
      }
    }
    onChange(next);
  }

  return (
    <>
      <Dropzone
        onDrop={(dropped) => {
          appendFilePreviews(dropped);
          emit();
        }}
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
        className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 data-[accept]:border-[#4161df] data-[accept]:bg-blue-50/50 transition-colors min-h-[12rem]"
      >
        <Group
          justify="center"
          gap="xl"
          mih={180}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload size={48} stroke={1.5} className="text-[#4161df]" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={48} stroke={1.5} className="text-red-500" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={48} stroke={1.5} className="text-gray-400" />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline>
              Drag photos here, or click to browse
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Add a few photos of yourself to help flatmates recognise you.
              JPEG, PNG, WebP, GIF — up to 100MB per file.
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
                    alt={`photo ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleRemove(index);
                    emit();
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}