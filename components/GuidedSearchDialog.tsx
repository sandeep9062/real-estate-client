"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CITIES = [
  { slug: "chandigarh", label: "Chandigarh" },
  { slug: "mohali", label: "Mohali" },
  { slug: "panchkula", label: "Panchkula" },
  { slug: "kharar", label: "Kharar" },
  { slug: "zirakpur", label: "Zirakpur" },
];

export default function GuidedSearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [deal, setDeal] = useState("");
  const [citySlug, setCitySlug] = useState("chandigarh");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [locality, setLocality] = useState("");

  if (!open) return null;

  const reset = () => {
    setStep(0);
    setDeal("");
    setCitySlug("chandigarh");
    setPriceMin("");
    setPriceMax("");
    setLocality("");
  };

  const finish = () => {
    const params = new URLSearchParams();
    if (deal) params.set("deal", deal);
    const pMin = priceMin.replace(/\D/g, "");
    const pMax = priceMax.replace(/\D/g, "");
    if (pMin) params.set("priceMin", pMin);
    if (pMax) params.set("priceMax", pMax);
    if (locality.trim()) params.set("sector", locality.trim());
    const city = CITIES.find((c) => c.slug === citySlug)?.label || "Chandigarh";
    params.set("city", city);
    onClose();
    reset();
    router.push(`/properties/${citySlug}?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
          onClick={() => {
            onClose();
            reset();
          }}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 pr-8 mb-1">
          Guided search
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Step {step + 1} of 3 — rent or buy, budget, then locality.
        </p>

        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">You want to</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Rent", "Sale"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeal(d)}
                  className={`py-3 rounded-xl border text-sm font-semibold ${
                    deal === d
                      ? "border-[#4161df] bg-[#4161df]/10 text-[#4161df]"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {d === "Rent" ? "Rent" : "Buy"}
                </button>
              ))}
            </div>
            <Button
              className="w-full mt-2 bg-[#4161df]"
              disabled={!deal}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">City</p>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={citySlug}
              onChange={(e) => setCitySlug(e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-sm font-medium text-gray-700">Budget (INR)</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Min"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Max"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="flex-1 bg-[#4161df]" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Locality / sector (optional)
            </p>
            <input
              type="text"
              placeholder="e.g. Sector 22, JLPL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1 bg-[#4161df]" onClick={finish}>
                See listings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
