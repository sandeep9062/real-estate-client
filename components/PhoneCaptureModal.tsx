"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "@/services/authApi";
import { updateUser } from "@/store/authSlice";
import { PhoneCall } from "lucide-react";

/**
 * Google OAuth phone-capture modal.
 *
 * Shows immediately after Google auth succeeds when the user has no phone on
 * file, BEFORE the role-selection / home redirect. Not blocking: "Skip for
 * now" dismisses it and the caller proceeds straight to the redirect chain.
 * Because the phone stays empty on the server, it keeps asking on next login
 * (WhatsApp-connect depends on it).
 */
export default function PhoneCaptureModal({
  onSave,
  onSkip,
}: {
  onSave: () => void;
  onSkip: () => void;
}) {
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!phone || phone.trim().length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await updateProfile({ phone }).unwrap();
      const updated = (res as any)?.user;
      if (updated) {
        dispatch(updateUser({ phone: updated.phone || phone }));
      }
      toast.success("Phone number saved.");
      onSave();
    } catch (err) {
      console.error("phone save error:", err);
      toast.error(
        (err as any)?.data?.message ||
          (err as any)?.message ||
          "Couldn't save your phone. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    toast.success("No problem — you can add it later.");
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-capture-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
      >
        <div className="px-5 pb-5 pt-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-[#4161df]">
            <PhoneCall className="h-6 w-6" aria-hidden />
          </div>
          <h2
            id="phone-capture-title"
            className="text-center text-lg font-bold text-gray-900 sm:text-xl"
          >
            What&apos;s your WhatsApp number?
          </h2>
          <p className="mt-1.5 text-center text-sm text-gray-600">
            We use this to connect you directly with buyers and agents.
          </p>

          <div className="mt-5">
            <label className="block text-xs font-medium text-gray-700">
              Phone number
            </label>
            <PhoneInput
              value={phone}
              onChange={(value) => setPhone(value ?? "")}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 pr-14 text-sm"
              defaultCountry="IN"
            />
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="mt-5 w-full rounded-lg bg-[#4161df] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3759dd] disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save number"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSkip}
            className="mt-2 w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}