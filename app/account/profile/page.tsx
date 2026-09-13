"use client";

/**
 * app/account/profile/page.tsx
 *
 * Full-page profile editor.
 *
 * Changes in this pass:
 * - Back button had almost no hit area (just text + tiny icon, no padding),
 *   making it hard to click/tap. Now has real padding, a rounded hover
 *   background, and a proper focus-visible ring.
 * - Added focus-visible rings consistently (previously only :focus, which
 *   some browsers won't show for keyboard nav).
 * - Slightly increased spacing rhythm inside cards and between the two
 *   columns for better visual separation.
 * - Added a border to the role/verified pills so they don't blend into the
 *   white card background.
 * - Added a status dot to the "unsaved changes" bar for quicker scanning.
 */

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button, Stack, ActionIcon } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  ArrowLeft,
  Camera,
  X,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Check,
} from "lucide-react";

import { useUpdateProfileMutation } from "@/services/userApi";
import { setUser } from "@/store/authSlice";
import { toast } from "@/hooks/use-toast";

// ---- Design tokens -------------------------------------------------------
const BRAND = "#4161df";
const BRAND_DEEP = "#3450c4";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const INK_FAINT = "#8B8FA3";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#E3E6F0";
const SUCCESS = "#1A7F5A";
const SUCCESS_BG = "#E8F5EF";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// E.164: leading "+" + country code + subscriber number, e.g. "+919876543210"
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

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
  const [isDragActive, setIsDragActive] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
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

  const emailValid = email.trim().length === 0 || EMAIL_RE.test(email.trim());

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    // Phone is required and must include the country code (stored as E.164)
    if (!PHONE_RE.test(phone.trim())) {
      toast.error(
        "Enter a valid phone number with country code, e.g. +919876543210",
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(setUser({ user: { ...user, ...updatedUser } }));
      toast.success("Profile updated");
      router.back();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const resetPhoto = () => {
    setPreview(getUserImageUrl(user.image) || null);
    setImageFile(null);
  };

  if (!mounted || !user) return null;

  return (
    <div
      className="min-h-screen pb-28 pt-8"
      style={{
        background: `linear-gradient(180deg, ${TINT_BG} 0%, #F7F8FC 260px, #F7F8FC 100%)`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back nav — real hit area now: padded, rounded, hover + focus-visible state */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 rounded-lg px-3 py-2 -ml-3 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2"
          style={{ color: INK_SOFT, ["--tw-ring-color" as any]: TINT_BG }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Page heading — sits on the page, not boxed in a card */}
        <div className="mb-8">
          <h1
            className="text-[26px] sm:text-3xl font-bold leading-tight tracking-tight"
            style={{ color: INK }}
          >
            Edit profile
          </h1>
          <p className="text-[15px] mt-1.5" style={{ color: INK_SOFT }}>
            Update your photo and personal details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* ---------------- Identity sidebar ---------------- */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center"
              style={{
                border: `1px solid ${TINT_LINE}`,
                boxShadow:
                  "0 1px 2px rgba(22,26,46,0.04), 0 8px 24px -12px rgba(22,26,46,0.10)",
              }}
            >
              <Dropzone
                openRef={openRef}
                onDrop={(files) => {
                  setImageFile(files[0]);
                  setPreview(URL.createObjectURL(files[0]));
                  setIsDragActive(false);
                }}
                onReject={() => {
                  toast.error("Please choose a JPG or PNG under 3MB");
                  setIsDragActive(false);
                }}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                activateOnClick={false}
                styles={{
                  root: {
                    border: `1.5px dashed ${isDragActive ? BRAND : "transparent"}`,
                    borderRadius: 16,
                    padding: isDragActive ? 10 : 0,
                    background: isDragActive ? TINT_BG : "transparent",
                    transition: "all 120ms ease",
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() => openRef.current?.()}
                  className="relative group cursor-pointer rounded-full outline-none focus-visible:ring-2"
                  style={{ ["--tw-ring-color" as any]: BRAND }}
                  aria-label="Change profile photo"
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "999px",
                      overflow: "hidden",
                      border: `3px solid ${TINT_BG}`,
                      background: TINT_BG,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt={`${name || "Your"} profile photo`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <span
                        className="text-2xl font-semibold"
                        style={{ color: BRAND }}
                      >
                        {name?.[0]?.toUpperCase() || <User size={30} />}
                      </span>
                    )}
                  </div>

                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors duration-150 group-focus-visible:bg-black/40">
                    <Camera
                      size={20}
                      className="text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
                    />
                  </span>

                  {imageFile && (
                    <ActionIcon
                      variant="filled"
                      color="red"
                      size="sm"
                      radius="999px"
                      style={{ position: "absolute", top: -2, right: -2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetPhoto();
                      }}
                      aria-label="Remove selected photo"
                    >
                      <X size={13} />
                    </ActionIcon>
                  )}
                </button>
              </Dropzone>

              <button
                type="button"
                onClick={() => openRef.current?.()}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3.5 py-2 transition-colors hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  color: BRAND,
                  background: TINT_BG,
                  ["--tw-ring-color" as any]: BRAND,
                }}
              >
                <Camera size={14} />
                Change photo
              </button>
              <p className="text-xs mt-2" style={{ color: INK_FAINT }}>
                JPG or PNG, up to 3MB
              </p>

              <div
                className="w-full mt-6 pt-5"
                style={{ borderTop: `1px solid ${TINT_LINE}` }}
              >
                <p
                  className="font-semibold text-[15px] truncate"
                  style={{ color: INK }}
                >
                  {name || user.name || "Your name"}
                </p>
                <p
                  className="text-[13px] mt-0.5 truncate"
                  style={{ color: INK_SOFT }}
                >
                  {email || user.email}
                </p>

                <div className="flex flex-col items-center gap-1.5 mt-3">
                  {user.role && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: TINT_BG,
                        color: BRAND,
                        border: `1px solid ${BRAND}22`,
                      }}
                    >
                      <ShieldCheck size={12} />
                      {roleLabels[user.role] || user.role}
                    </span>
                  )}
                  {user.isVerified && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: SUCCESS_BG,
                        color: SUCCESS,
                        border: `1px solid ${SUCCESS}22`,
                      }}
                    >
                      <Check size={12} />
                      Verified account
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Details panel ---------------- */}
          <div
            className="bg-white rounded-2xl p-6 sm:p-7"
            style={{
              border: `1px solid ${TINT_LINE}`,
              boxShadow:
                "0 1px 2px rgba(22,26,46,0.04), 0 8px 24px -12px rgba(22,26,46,0.10)",
            }}
          >
            <h2 className="text-[17px] font-semibold" style={{ color: INK }}>
              Personal details
            </h2>
            <p className="text-[13px] mt-1 mb-6" style={{ color: INK_SOFT }}>
              This is how you'll appear to agents, builders, and other users on
              PropertyBulbul.
            </p>

            <Stack gap="lg">
              <TextInput
                label="Full name"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                radius="md"
                leftSection={<User size={16} color={INK_FAINT} />}
                classNames={{ input: "pb-field", label: "pb-label" }}
              />

              <div>
                <TextInput
                  label="Email address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  onBlur={() => setEmailTouched(true)}
                  required
                  type="email"
                  radius="md"
                  leftSection={<Mail size={16} color={INK_FAINT} />}
                  error={
                    emailTouched && !emailValid
                      ? "Enter a valid email address"
                      : undefined
                  }
                  classNames={{ input: "pb-field", label: "pb-label" }}
                />
              </div>

              <div>
                <label
                  className="pb-label"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Phone number
                </label>
                <div className="phone-input-wrap">
                  <Phone
                    size={16}
                    color={INK_FAINT}
                    style={{ marginRight: 8, flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <PhoneInput
                    placeholder="Phone number with country code"
                    value={phone}
                    onChange={(value) => setPhone(value || "")}
                    defaultCountry="IN"
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: INK_FAINT }}>
                  Used for property enquiries and account recovery
                </p>
              </div>
            </Stack>
          </div>
        </div>
      </div>

      {/* ---------------- Sticky save bar ---------------- */}
      <div
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-200 ${
          hasChanges ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderTop: `1px solid ${TINT_LINE}`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <p
            className="text-sm font-medium hidden sm:flex items-center gap-2"
            style={{ color: INK_SOFT }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: BRAND }}
            />
            You have unsaved changes
          </p>
          <div className="flex items-center gap-3 ml-auto">
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
              className="font-semibold py-2.5 px-6 rounded-lg transition-all duration-150 text-sm shadow-sm disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: BRAND,
                color: "white",
                ["--tw-ring-color" as any]: BRAND_DEEP,
              }}
              onMouseEnter={(e) => {
                if (hasChanges)
                  (e.currentTarget as HTMLElement).style.background =
                    BRAND_DEEP;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = BRAND;
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .pb-label {
          color: ${INK};
          font-weight: 500;
          font-size: 13.5px;
        }
        .pb-field {
          border-color: ${TINT_LINE} !important;
          font-size: 14.5px;
        }
        .pb-field:focus,
        .pb-field:focus-visible {
          border-color: ${BRAND} !important;
          box-shadow: 0 0 0 3px ${TINT_BG};
        }
        .phone-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid ${TINT_LINE};
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          background: white;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }
        .phone-input-wrap:focus-within {
          border-color: ${BRAND};
          box-shadow: 0 0 0 3px ${TINT_BG};
        }
        .phone-input-wrap .PhoneInput {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .phone-input-wrap .PhoneInputInput {
          border: none;
          outline: none;
          font-size: 14.5px;
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
  );
}
