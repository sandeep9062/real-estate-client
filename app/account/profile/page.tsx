"use client";

/**
 * app/account/profile/page.tsx
 *
 * Full-page profile editor. This replaces the "Edit Profile" modal that used
 * to live inside ProfileMenu — same fields, same mutation, same validation,
 * just given room to breathe on its own route (/account/profile).
 *
 * NOTE: getApiBaseUrl / getUserImageUrl are duplicated here from
 * ProfileMenu.tsx for now. Since two places now need them, it's worth
 * moving both into e.g. `lib/api.ts` and importing from there instead —
 * left as-is here so this file works standalone.
 */

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  TextInput,
  Button,
  Image,
  Stack,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ArrowLeft, Camera, X, ShieldCheck, User, IdCard } from "lucide-react";

import { useUpdateProfileMutation } from "@/services/userApi";
import { setUser } from "@/store/authSlice";
import { toast } from "@/hooks/use-toast";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (
      hostname === "www.propertybulbul.com" ||
      hostname === "propertybulbul.com"
    ) {
      return "https://api.propertybulbul.com/api";
    }
  }
  return "http://localhost:9000/api";
};

const getUserImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = getApiBaseUrl().replace("/api", "");
  return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
};

const roleLabels: Record<string, string> = {
  agent: "Agent",
  builder: "Builder",
  user: "User",
  landlord: "Landlord",
};

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  // Adjust this selector path to match your actual auth slice shape.
  const user = useSelector((state: any) => state.auth?.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const openRef = useRef<() => void>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPreview(getUserImageUrl(user.image) || null);
    }
  }, [user]);

  const hasChanges =
    mounted &&
    user &&
    (name.trim() !== (user.name || "") ||
      email.trim() !== (user.email || "") ||
      phone !== (user.phone || "") ||
      !!imageFile);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone || "");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(setUser({ user: { ...user, ...updatedUser } }));
      toast.success("Profile updated successfully");
      router.back();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${TINT_BG} 0%, #F7F8FC 220px, #F7F8FC 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back nav */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 sm:mb-6 transition-colors hover:opacity-70"
          style={{ color: INK_SOFT }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div
          className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_-2px_rgba(22,26,46,0.08),0_12px_32px_-16px_rgba(22,26,46,0.12)]"
          style={{ border: `1px solid ${TINT_LINE}` }}
        >
          {/* Header */}
          <div className="px-6 sm:px-8 pt-7 sm:pt-8 pb-6 flex items-start gap-3">
            <div
              className="hidden sm:flex shrink-0 size-10 items-center justify-center rounded-xl"
              style={{ background: TINT_BG, color: BRAND }}
            >
              <IdCard size={18} />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ color: INK }}
              >
                Edit profile
              </h1>
              <p className="text-sm mt-1" style={{ color: INK_SOFT }}>
                Update your photo and personal details.
              </p>
            </div>
          </div>

          <Divider color={TINT_LINE} />

          {/* Photo section */}
          <div className="px-6 sm:px-8 py-7 sm:py-8">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide mb-4"
              style={{ color: INK_SOFT }}
            >
              Profile photo
            </p>
            <Dropzone
              openRef={openRef}
              onDrop={(files) => {
                setImageFile(files[0]);
                setPreview(URL.createObjectURL(files[0]));
              }}
              onReject={() => toast.error("Invalid image")}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              activateOnClick={false}
              styles={{ root: { border: "none", padding: 0 } }}
            >
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => openRef.current?.()}
                  className="relative shrink-0 group cursor-pointer rounded-full"
                  aria-label="Change profile photo"
                >
                  {preview ? (
                    <Image
                      src={preview}
                      width={76}
                      height={76}
                      radius="999px"
                      style={{ border: `2px solid ${TINT_LINE}` }}
                    />
                  ) : (
                    <Avatar radius="999px" size={76} color="blue">
                      {name?.[0]?.toUpperCase() || <User size={26} />}
                    </Avatar>
                  )}

                  {/* Hover overlay hints that the avatar itself is clickable */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/35 transition-colors duration-200">
                    <Camera
                      size={18}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </span>

                  {preview && imageFile && (
                    <ActionIcon
                      variant="filled"
                      color="red"
                      size="sm"
                      radius="999px"
                      style={{ position: "absolute", top: -4, right: -4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(getUserImageUrl(user.image) || null);
                        setImageFile(null);
                      }}
                    >
                      <X size={13} />
                    </ActionIcon>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: INK }}
                    >
                      {user.name || "Your photo"}
                    </span>
                    {user.role && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: TINT_BG, color: BRAND }}
                      >
                        <ShieldCheck size={11} />
                        {roleLabels[user.role] || user.role}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openRef.current?.()}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-md px-2.5 py-1 -ml-2.5 transition-colors hover:opacity-80"
                    style={{ color: BRAND, background: TINT_BG }}
                  >
                    <Camera size={14} />
                    Change photo
                  </button>
                  <p className="text-xs mt-1.5" style={{ color: INK_SOFT }}>
                    JPG or PNG, up to 3MB.
                  </p>
                </div>
              </div>
            </Dropzone>
          </div>

          <Divider color={TINT_LINE} />

          {/* Details section */}
          <div className="px-6 sm:px-8 py-7 sm:py-8">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide mb-4"
              style={{ color: INK_SOFT }}
            >
              Personal details
            </p>
            <Stack gap="md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Full name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  required
                  radius="md"
                  styles={{
                    input: { borderColor: TINT_LINE },
                    label: { color: INK, fontWeight: 500, marginBottom: 4 },
                  }}
                />
                <TextInput
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                  type="email"
                  radius="md"
                  styles={{
                    input: { borderColor: TINT_LINE },
                    label: { color: INK, fontWeight: 500, marginBottom: 4 },
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-1.5"
                  style={{ color: INK }}
                >
                  Phone number
                </label>
                <div className="phone-input-wrap">
                  <PhoneInput
                    placeholder="Phone number with country code"
                    value={phone}
                    onChange={(value) => setPhone(value || "")}
                    defaultCountry="IN"
                    required
                  />
                </div>
                <style jsx global>{`
                  .phone-input-wrap .PhoneInput {
                    display: flex;
                    align-items: center;
                    border: 1px solid ${TINT_LINE};
                    border-radius: 8px;
                    padding: 0.5rem 0.75rem;
                    transition:
                      border-color 0.15s ease,
                      box-shadow 0.15s ease;
                  }
                  .phone-input-wrap .PhoneInput:focus-within {
                    border-color: ${BRAND};
                    box-shadow: 0 0 0 3px ${TINT_BG};
                  }
                  .phone-input-wrap .PhoneInputInput {
                    border: none;
                    outline: none;
                    font-size: 0.875rem;
                    color: ${INK};
                    background: transparent;
                    flex: 1;
                    min-width: 0;
                  }
                  .phone-input-wrap .PhoneInputCountrySelect {
                    margin-right: 0.5rem;
                  }
                `}</style>
              </div>
            </Stack>
          </div>

          <Divider color={TINT_LINE} />

          {/* Actions */}
          <div
            className="px-6 sm:px-8 py-5 flex items-center justify-end gap-3"
            style={{ background: "#FAFBFE" }}
          >
            <Button
              variant="subtle"
              color="gray"
              radius="md"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isLoading}
              disabled={!hasChanges}
              unstyled
              className="font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm shadow-sm disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-md"
              style={{ background: BRAND, color: "white" }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
