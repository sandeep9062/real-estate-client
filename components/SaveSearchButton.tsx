"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import {
  useCreateSavedSearchMutation,
} from "@/services/savedSearchesApi";
import { toast } from "@/hooks/use-toast";

export default function SaveSearchButton({
  filters,
}: {
  filters: Record<string, string>;
}) {
  const isAuth = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emailOn, setEmailOn] = useState(true);
  const [inAppOn, setInAppOn] = useState(true);
  const [create, { isLoading }] = useCreateSavedSearchMutation();

  if (!isAuth) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="text-xs font-semibold text-[#4161df] hover:underline"
      >
        Log in to save this search &amp; get alerts
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-[#4161df]/40 bg-[#4161df]/5 text-[#4161df] text-xs font-semibold px-3 py-2 hover:bg-[#4161df]/10"
      >
        Save search &amp; alerts
      </button>
      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Save this search</h3>
            <p className="text-xs text-gray-600">
              We&apos;ll notify you when new listings match these filters (city,
              budget, BHK, locality).
            </p>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Name (e.g. 3BHK Mohali rent)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={emailOn}
                onChange={(e) => setEmailOn(e.target.checked)}
              />
              Email alerts
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inAppOn}
                onChange={(e) => setInAppOn(e.target.checked)}
              />
              In-app notifications
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#4161df]"
                disabled={isLoading}
                onClick={async () => {
                  const clean: Record<string, string> = {};
                  Object.entries(filters).forEach(([k, v]) => {
                    if (v !== undefined && v !== null && String(v) !== "") {
                      clean[k] = String(v);
                    }
                  });
                  try {
                    await create({
                      name: name || "My search",
                      filters: clean,
                      notifyEmail: emailOn,
                      notifyInApp: inAppOn,
                    }).unwrap();
                    toast.success("Search saved — you'll get alerts for new matches.");
                    setOpen(false);
                    setName("");
                    router.push("/saved-searches");
                  } catch {
                    toast.error("Could not save this search. Please try again.");
                  }
                }}
              >
                {isLoading ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
