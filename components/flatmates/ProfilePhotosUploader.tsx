"use client";

import { useState } from "react";
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

function srcOf(item: string | File): string {
  return typeof item === "string" ? item : URL.createObjectURL(item);
}

function isVideoItem(item: string | File): boolean {
  if (typeof item !== "string") return item.type?.startsWith("video/") === true;
  return (
    item.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(item)
  );
}

/**
 * Multi-image uploader for the user's profile pictures (the person, not the
 * property). Owns a single ordered `items` list — kept Cloudinary URLs
 * (strings) and newly-picked File objects — and mirrors every change up to
 * the parent via `onChange`. The seed comes from `value` at mount: in edit
 * mode AboutYouStep only renders once the saved profile (photos included) has
 * loaded, and in create mode the list starts empty.
 *
 * Uses URL.createObjectURL for previews of untouched File objects, so
 * thumbnails appear instantly without an async FileReader round-trip.
 */
export default function ProfilePhotosUploader({
  value,
  onChange,
}: {
  value: (string | File)[];
  onChange: (next: (string | File)[]) => void;
}) {
  const [items, setItems] = useState<(string | File)[]>(() =>
    Array.isArray(value) ? [...value] : [],
  );

  return (
    <>
      <Dropzone
        onDrop={(dropped) => {
          const next = [...items, ...dropped];
          setItems(next);
          onChange(next);
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
        {items.map((item, index) => (
          <div
            key={`${typeof item === "string" ? item.slice(0, 48) : item.name}-${index}`}
            className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative bg-black"
          >
            {isVideoItem(item) ? (
              <video
                src={srcOf(item)}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={srcOf(item)}
                alt={`photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => {
                const next = items.filter((_, i) => i !== index);
                setItems(next);
                onChange(next);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}