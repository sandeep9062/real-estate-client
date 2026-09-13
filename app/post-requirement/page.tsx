"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectUser } from "@/store/authSlice";

interface HouseRules {
  ownerLivesOnPremises: boolean;
  hasCurfew: boolean;
  curfewTime: string;
  oppositeGenderGuestsAllowed: string;
  overnightGuestsAllowed: string;
  smokingAllowedOnPremises: boolean;
  drinkingAllowedOnPremises: boolean;
}

interface Facilities {
  bedrooms: string;
  servantRooms: string;
  bathrooms: string;
  parkings: string;
  balconies: string;
  parkingType: string;
  securityFeatures: string[];
  waterSupply: string;
  powerBackup: boolean;
  totalFloors: string;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  deal: string;
  type: string;
  propertyCategory: string;
  bedrooms: string;
  purpose: string;
  availability: string;
  furnishing: string;
  carpetMin: string;
  carpetMax: string;
  budget: string;
  income: string;
  loanStatus: string;
  amenities: string[];
  houseRules: HouseRules;
  petsAllowed: boolean;
  ownershipType: string;
  facilities: Facilities;
  nearbyPlaces: {
    schools: string;
    hospitals: string;
    metroStations: string;
    malls: string;
  };
  timeline: string;
  callbackTime: string;
  message: string;
  source: string;
  needLoanHelp: boolean;
  reraOnly: boolean;
  consentGiven: boolean;
}

const INITIAL: FormData = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  deal: "",
  type: "",
  propertyCategory: "",
  bedrooms: "",
  purpose: "",
  availability: "",
  furnishing: "Un-Furnished",
  carpetMin: "",
  carpetMax: "",
  budget: "",
  income: "",
  loanStatus: "",
  amenities: [],
  houseRules: {
    ownerLivesOnPremises: false,
    hasCurfew: false,
    curfewTime: "",
    oppositeGenderGuestsAllowed: "",
    overnightGuestsAllowed: "",
    smokingAllowedOnPremises: false,
    drinkingAllowedOnPremises: false,
  },
  petsAllowed: false,
  ownershipType: "",
  facilities: {
    bedrooms: "",
    servantRooms: "",
    bathrooms: "",
    parkings: "",
    balconies: "",
    parkingType: "",
    securityFeatures: [],
    waterSupply: "",
    powerBackup: false,
    totalFloors: "",
  },
  nearbyPlaces: {
    schools: "",
    hospitals: "",
    metroStations: "",
    malls: "",
  },
  timeline: "",
  callbackTime: "",
  message: "",
  source: "",
  needLoanHelp: false,
  reraOnly: false,
  consentGiven: true,
};

const AMENITIES = [
  { ic: "🌿", label: "Garden" },
  { ic: "🏗", label: "Balcony" },
  { ic: "🚗", label: "Parking" },
  { ic: "🏊", label: "Swimming Pool" },
  { ic: "🛝", label: "Kids Play Area" },
  { ic: "💪", label: "Gym" },
  { ic: "🏛", label: "Clubhouse" },
  { ic: "🔒", label: "24/7 Security" },
  { ic: "📹", label: "CCTV" },
  { ic: "🔋", label: "Power Backup" },
  { ic: "🛗", label: "Lift/Elevator" },
  { ic: "🔥", label: "Fire Safety" },
  { ic: "🎭", label: "Community Hall" },
  { ic: "🏃", label: "Jogging Track" },
  { ic: "🎮", label: "Indoor Games" },
  { ic: "🏸", label: "Outdoor Sports" },
  { ic: "🛍", label: "Shopping Center" },
  { ic: "☕", label: "Café/Rest." },
  { ic: "🐾", label: "Pet Friendly" },
  { ic: "📶", label: "Wi-Fi" },
  { ic: "💧", label: "24x7 Water" },
  { ic: "🌧", label: "Rainwater Harvest" },
  { ic: "☀️", label: "Solar Panels" },
  { ic: "🚘", label: "Visitor Parking" },
  { ic: "👕", label: "Laundry Room" },
  { ic: "📚", label: "Library" },
  { ic: "🏥", label: "Medical Facility" },
  { ic: "🎉", label: "Party Lawn" },
  { ic: "⚡", label: "EV Charging" },
  { ic: "🏠", label: "Smart Home" },
];

const BUDGETS_SALE = [
  { label: "Under ₹1 Cr", sub: "Starter Homes", val: "Less than ₹1 Crore" },
  {
    label: "₹1 – 2 Crore",
    sub: "Prime Apartments",
    val: "₹1 Crore - ₹2 Crores",
  },
  { label: "₹2 – 5 Crore", sub: "Luxury Living", val: "₹2 Crores - ₹5 Crores" },
  { label: "₹5 Cr+", sub: "Ultra Premium", val: "₹5 Crores & Above" },
];

const BUDGETS_RENT = [
  {
    label: "Under ₹10k/mo",
    sub: "Budget Stays",
    val: "Less than ₹10,000/month",
  },
  {
    label: "₹10k – 25k/mo",
    sub: "Mid-range Rentals",
    val: "₹10,000 - ₹25,000/month",
  },
  {
    label: "₹25k – 50k/mo",
    sub: "Premium Rentals",
    val: "₹25,000 - ₹50,000/month",
  },
  {
    label: "₹50k+/mo",
    sub: "Luxury Rentals",
    val: "₹50,000 & Above/month",
  },
];

const STEPS = ["You", "Home", "Budget", "Wishes", "Details", "Almost!"];

const CITIES = [
  "Chandigarh",
  "New Chandigarh (Mullapur)",
  "Panchkula",
  "Mohali",
  "Kharar",
  "Zirakpur",

  "Delhi",
  "Gurgaon",
  "Noida",
];

const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={`inline-flex items-center gap-[5px] px-3.5 py-[.45rem] rounded-lg border-[1.5px] border-[#E5E9F7] bg-[#F3F5FF] text-[.82rem] text-[#4B5563] cursor-pointer transition-all font-medium select-none hover:border-[#C9D4FB] hover:bg-[#EEF1FD] hover:text-[#4161DF]${active ? " bg-[#EEF1FD]! border-[#4161DF]! text-[#4161DF]! font-semibold!" : ""}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    {children}
  </div>
);

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#4B5563] tracking-[.04em] uppercase">
      {label}
      {required && <span className="text-[#4161DF] ml-0.5"> *</span>}
    </label>
    {children}
    {error && <div className="text-[.73rem] text-[#DC2626] mt-0.5 font-medium">⚠ {error}</div>}
  </div>
);

const SH = ({
  step,
  title,
  sub,
}: {
  step: string;
  title: string;
  sub: string;
}) => (
  <div className="flex items-start gap-3 mb-6">
    <div className="w-8 h-8 rounded-[10px] bg-[#EEF1FD] border-[1.5px] border-[#C9D4FB] flex items-center justify-center text-[13px] font-bold text-[#4161DF] shrink-0">{step}</div>
    <div>
      <div className="text-lg font-bold text-[#111827] tracking-tight">{title}</div>
      <div className="text-[.8rem] text-[#9CA3AF] mt-0.5">{sub}</div>
    </div>
  </div>
);

export default function DreamHomeEnquiry() {
  const user = useSelector(selectUser);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  // Auto-fill name, email and phone from the logged-in user (if any).
  // Only fills empty fields so anything the user has already typed is kept.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      fullName: f.fullName || user.name || "",
      email: f.email || user.email || "",
      // Stored phones may be E.164 (e.g. +91XXXXXXXXXX) — keep last 10 digits
      phone: f.phone || (user.phone || "").replace(/\D/g, "").slice(-10),
    }));
  }, [user]);

  const set = useCallback(
    <K extends keyof FormData>(key: K, val: FormData[K]) => {
      setForm((f) => ({ ...f, [key]: val }));
      setErrors((e) => ({ ...e, [key]: undefined }));
    },
    [],
  );

  const toggleAmenity = (label: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(label)
        ? f.amenities.filter((a) => a !== label)
        : [...f.amenities, label],
    }));
  };

  const setHR = <K extends keyof HouseRules>(key: K, val: HouseRules[K]) =>
    setForm((f) => ({ ...f, houseRules: { ...f.houseRules, [key]: val } }));

  const setFac = <K extends keyof Facilities>(key: K, val: Facilities[K]) =>
    setForm((f) => ({ ...f, facilities: { ...f.facilities, [key]: val } }));

  const toggleSecurity = (label: string) =>
    setForm((f) => ({
      ...f,
      facilities: {
        ...f.facilities,
        securityFeatures: f.facilities.securityFeatures.includes(label)
          ? f.facilities.securityFeatures.filter((s) => s !== label)
          : [...f.facilities.securityFeatures, label],
      },
    }));

  const setNearby = (key: keyof FormData["nearbyPlaces"], val: string) =>
    setForm((f) => ({ ...f, nearbyPlaces: { ...f.nearbyPlaces, [key]: val } }));

  const validate = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 0) {
      if (!form.fullName.trim()) errs.fullName = "Please tell us your name";
      if (!/^[0-9]{10}$/.test(form.phone))
        errs.phone = "Enter a valid 10-digit number";
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        errs.email = "Please enter a valid email";
      if (!form.city) errs.city = "Please pick a city";
    }
    if (s === 1) {
      if (!form.deal) errs.deal = "Are you looking to rent or buy?";
      if (!form.type) errs.type = "Please pick a property category";
      if (!form.propertyCategory)
        errs.propertyCategory = "Please pick a property type";
    }
    if (s === 2 && !form.budget) errs.budget = "Please select a budget range";
    if (s === 5) {
      if (!form.timeline) errs.timeline = "Please pick a timeline";
      if (!form.consentGiven) errs.consentGiven = "You must agree to continue";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validate(5)) return;
    setSubmitting(true);
    try {
      const num = (v: string) => (v.trim() === "" ? undefined : Number(v));
      const list = (v: string) =>
        v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      const hr = form.houseRules;
      // Map form fields onto the backend Enquiry schema.
      const payload = {
        ...form,
        // Legacy keys → schema fields
        location: form.city,
        carpetAreaMin: num(form.carpetMin),
        carpetAreaMax: num(form.carpetMax),
        purchasePurpose: form.purpose || undefined,
        preApprovedLoan: form.loanStatus || undefined,
        needLoanAssistance: form.needLoanHelp,
        // Property requirement fields
        propertyCategory: form.propertyCategory || undefined,
        // Keep the legacy free-text propertyType populated from the category
        propertyType: form.propertyCategory || undefined,
        availability: form.availability || undefined,
        furnishing: form.furnishing || undefined,
        ownershipType: form.ownershipType || undefined,
        houseRules: {
          ownerLivesOnPremises: hr.ownerLivesOnPremises,
          curfew: { hasCurfew: hr.hasCurfew, time: hr.curfewTime || undefined },
          oppositeGenderGuestsAllowed:
            hr.oppositeGenderGuestsAllowed || undefined,
          overnightGuestsAllowed: hr.overnightGuestsAllowed || undefined,
          smokingAllowedOnPremises: hr.smokingAllowedOnPremises,
          drinkingAllowedOnPremises: hr.drinkingAllowedOnPremises,
        },
        facilities: {
          bedrooms: num(form.facilities.bedrooms),
          servantRooms: num(form.facilities.servantRooms),
          bathrooms: num(form.facilities.bathrooms),
          parkings: num(form.facilities.parkings),
          balconies: num(form.facilities.balconies),
          parkingType: form.facilities.parkingType || undefined,
          securityFeatures: form.facilities.securityFeatures,
          waterSupply: form.facilities.waterSupply || undefined,
          powerBackup: form.facilities.powerBackup,
          totalFloors: num(form.facilities.totalFloors),
        },
        nearbyPlaces: {
          schools: list(form.nearbyPlaces.schools),
          hospitals: list(form.nearbyPlaces.hospitals),
          metroStations: list(form.nearbyPlaces.metroStations),
          malls: list(form.nearbyPlaces.malls),
        },
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/enquiry`,
        payload,
      );
      setDone(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409)
        alert("Email or phone already registered.");
      else alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <div className="min-h-screen bg-[#F3F5FF] text-[#111827] [font-family:Inter,sans-serif] max-w-7xl">
        {/* Hero */}
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_50%,rgba(65,97,223,.25)_0%,transparent_70%),linear-gradient(135deg,#1e3a5f_0%,#4161df_100%)] text-center px-6 pt-12 pb-[5.5rem]">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[.07] pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
          {/* Decorative circles */}
          <div
            className="absolute rounded-full bg-white pointer-events-none w-[300px] h-[300px] -top-[100px] -left-[80px] opacity-[.06]"
          />
          <div
            className="absolute rounded-full bg-white pointer-events-none w-[200px] h-[200px] top-[20px] -right-[60px] opacity-[.08]"
          />
          <div
            className="absolute rounded-full bg-white pointer-events-none w-[150px] h-[150px] -bottom-[60px] left-[40%] opacity-[.05]"
          />

          <div className="relative inline-flex items-center gap-1.5 bg-white/[.12] border border-white/[.2] rounded-full px-4 py-1.5 text-[.72rem] text-white/[.85] tracking-[.08em] uppercase font-medium mb-5 mt-2">
            🏆 Tricity's Most Trusted Platform
          </div>
          <h1 className="relative text-white font-extrabold leading-[1.15] tracking-tight mb-3 text-[clamp(1.75rem,4vw,2.5rem)]">
            Find Your <em className="bg-[linear-gradient(90deg,#93A8FF,#C4D0FF)] bg-clip-text text-transparent not-italic">
              Dream Home
            </em>
            <br />
            Without the Hassle
          </h1>
          <p className="relative text-white/[.6] text-[.9rem] font-extralight leading-[1.7]">
            No hidden charges · No spam calls · Verified listings · Zero
            brokerage surprises
          </p>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none [&_svg]:fill-[#F3F5FF]">
            <svg
              viewBox="0 0 1440 40"
              preserveAspectRatio="none"
              className="w-full h-8"
            >
              <path d="M0,24 C480,40 960,8 1440,24 L1440,40 L0,40 Z" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-[700px] mx-auto -mt-10 px-4 pb-16">
          <div className="h-1 bg-[#E5E9F7] rounded-full mb-7 overflow-hidden">
            <div className="h-full bg-[linear-gradient(90deg,#4161DF,#7B93F5)] rounded-full transition-[width_.45s_cubic-bezier(.4,0,.2,1)]" style={{ width: `${progress}%` }} />
          </div>

          {!done && (
            <div className="flex items-center mb-7 px-1">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-[5px] flex-1">
                    <div
                      className={`w-[34px] h-[34px] rounded-full border-2 border-[#E5E9F7] bg-white flex items-center justify-center text-xs font-semibold text-[#9CA3AF] transition-all relative z-10 shadow-[0_1px_3px_rgba(14,27,77,.08)]${i === step ? " bg-[#4161DF]! border-[#4161DF]! text-white! shadow-[0_0_0_4px_rgba(65,97,223,.18)]!" : i < step ? " bg-[#16A34A]! border-[#16A34A]! text-white!" : ""}`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <div
                      className={`text-[10px] text-[#9CA3AF] text-center font-medium tracking-[.02em]${i === step ? " text-[#4161DF]!" : i < step ? " text-[#16A34A]!" : ""}`}
                    >
                      {label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 bg-[#E5E9F7] -mt-[19px] max-w-[40px] transition-colors${i < step ? " bg-[#16A34A]!" : ""}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="bg-white rounded-[20px] p-8 shadow-[0_12px_40px_rgba(14,27,77,.14)] border border-[rgba(65,97,223,.08)]">
            {/* Step 1 */}
            {step === 0 && (
              <div className="animate-fade">
                <SH
                  step="1"
                  title="Nice to meet you!"
                  sub="Let's start with the basics — how can we reach you?"
                />
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field label="Full Name" required error={errors.fullName}>
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="Rahul Sharma"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  </Field>
                  <Field label="Mobile Number" required error={errors.phone}>
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="10-digit mobile"
                      type="tel"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) =>
                        set(
                          "phone",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                    />
                  </Field>
                  <Field label="Email Address" required error={errors.email}>
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="you@email.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Preferred City" required error={errors.city}>
                    <div className="relative">
                    <select
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)] appearance-none pr-9 cursor-pointer"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    >
                      <option value="">Select your city</option>
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-2 w-3 text-[#9CA3AF]"
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M1 1l5 5 5-5" />
                    </svg>
                  </div>
                </Field>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <span />
                  <button className="bg-[#4161DF] border-none rounded-[10px] px-8 py-[.7rem] text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:bg-[#2D4BC4] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(65,97,223,.35)]" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="animate-fade">
                <SH
                  step="2"
                  title="Describe your dream home"
                  sub="What kind of place are you looking for?"
                />
                <Field label="Looking to" required error={errors.deal}>
                  <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                    {[
                      ["🔑", "Rent"],
                      ["💰", "Sale"],
                    ].map(([ic, val]) => (
                      <Pill
                        key={val}
                        active={form.deal === val}
                        onClick={() => {
                          set("deal", val);
                          // Budget ranges differ for Rent vs Sale — reset it
                          if (form.budget) set("budget", "");
                        }}
                      >
                        {ic} {val === "Sale" ? "Buy" : val}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <div className="mt-5">
                  <Field label="Property Category" required error={errors.type}>
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["🏘", "Residential"],
                        ["🏙", "Commercial"],
                        ["🏭", "Industrial"],
                        ["🌾", "Agricultural"],
                      ].map(([ic, val]) => (
                        <Pill
                          key={val}
                          active={form.type === val}
                          onClick={() => set("type", val)}
                        >
                          {ic} {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <Field
                  label="Property Type"
                  required
                  error={errors.propertyCategory}
                >
                  <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                    {[
                      ["🏢", "Apartment/Flat"],
                      ["🏠", "House/Villa"],
                      ["📐", "Land/Plot"],
                      ["🛋", "Studio Apartment"],
                      ["🏗", "Builder Floor"],
                      ["🛏", "PG/Hostel"],
                      ["🏡", "Farmhouse"],
                      ["🛍", "Retail"],
                      ["💼", "Office"],
                      ["📦", "Warehouse"],
                      ["🏬", "Shop/Showroom"],
                    ].map(([ic, val]) => (
                      <Pill
                        key={val}
                        active={form.propertyCategory === val}
                        onClick={() => set("propertyCategory", val)}
                      >
                        {ic} {val}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <div className="mt-5">
                  <Field label="Bedrooms">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        "1 BHK",
                        "2 BHK",
                        "3 BHK",
                        "4+ BHK",
                        "No preference",
                      ].map((b) => (
                        <Pill
                          key={b}
                          active={form.bedrooms === b}
                          onClick={() => set("bedrooms", b)}
                        >
                          {b}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Availability">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["🏠", "Ready to Move"],
                        ["🏗", "Under Construction"],
                      ].map(([ic, val]) => (
                        <Pill
                          key={val}
                          active={form.availability === val}
                          onClick={() => set("availability", val)}
                        >
                          {ic} {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Furnishing">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        "Furnished",
                        "Fully Furnished",
                        "Semi Furnished",
                        "Un-Furnished",
                      ].map((val) => (
                        <Pill
                          key={val}
                          active={form.furnishing === val}
                          onClick={() => set("furnishing", val)}
                        >
                          {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Carpet Area (sq.ft) — optional">
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <input
                        className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                        placeholder="Min e.g. 800"
                        type="number"
                        value={form.carpetMin}
                        onChange={(e) => set("carpetMin", e.target.value)}
                      />
                      <input
                        className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                        placeholder="Max e.g. 2000"
                        type="number"
                        value={form.carpetMax}
                        onChange={(e) => set("carpetMax", e.target.value)}
                      />
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Purpose of Purchase">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["🏠", "Self-Use"],
                        ["📈", "Investment"],
                        ["👴", "For Parents"],
                        ["🎁", "Gift"],
                      ].map(([ic, val]) => (
                        <Pill
                          key={val}
                          active={form.purpose === val}
                          onClick={() => set("purpose", val)}
                        >
                          {ic} {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <button className="bg-transparent border-[1.5px] border-[#E5E9F7] rounded-[10px] px-[1.4rem] py-[.65rem] text-[.87rem] text-[#4B5563] cursor-pointer transition-all font-medium [font-family:Inter,sans-serif] hover:border-[#9CA3AF] hover:text-[#111827]" onClick={back}>
                    ← Back
                  </button>
                  <button className="bg-[#4161DF] border-none rounded-[10px] px-8 py-[.7rem] text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:bg-[#2D4BC4] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(65,97,223,.35)]" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="animate-fade">
                <SH
                  step="3"
                  title="Let's talk budget"
                  sub="No judgement — this helps us match you perfectly."
                />
                <div className="grid grid-cols-2 gap-3 mb-5 max-sm:grid-cols-1">
                  {(form.deal === "Rent" ? BUDGETS_RENT : BUDGETS_SALE).map(
                    ({ label, sub, val }) => (
                      <div
                        key={val}
                        className={`border-[1.5px] border-[#E5E9F7] bg-[#F3F5FF] rounded-[14px] p-[1.1rem_1rem] cursor-pointer transition-all text-center hover:border-[#C9D4FB] hover:bg-[#EEF1FD]${form.budget === val ? " bg-[#EEF1FD]! border-[#4161DF]! shadow-[0_0_0_3px_rgba(65,97,223,.1)]!" : ""}`}
                        onClick={() => set("budget", val)}
                      >
                        <div
                          className={`text-lg font-bold text-[#111827] tracking-tight${form.budget === val ? " text-[#4161DF]!" : ""}`}
                        >
                          {label}
                        </div>
                        <div className="text-[.72rem] text-[#9CA3AF] mt-1">{sub}</div>
                      </div>
                    ),
                  )}
                </div>
                {errors.budget && (
                  <div className="text-[.73rem] text-[#DC2626] mt-0.5 font-medium mb-4">
                    ⚠ {errors.budget}
                  </div>
                )}
                <div className="h-[1px] bg-[#E5E9F7] my-6" />
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field label="Annual Income">
                    <div className="relative">
                    <select
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)] appearance-none pr-9 cursor-pointer"
                      value={form.income}
                      onChange={(e) => set("income", e.target.value)}
                    >
                      <option value="">Select range</option>
                      {[
                        "Below ₹5 LPA",
                        "₹5–10 LPA",
                        "₹10–20 LPA",
                        "₹20+ LPA",
                      ].map((i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-2 w-3 text-[#9CA3AF]"
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M1 1l5 5 5-5" />
                    </svg>
                  </div>
                </Field>
                  <Field label="Home Loan Status">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["✅", "Pre-approved"],
                        ["❌", "Not yet"],
                        ["🤝", "Need help"],
                      ].map(([ic, val]) => (
                        <Pill
                          key={val}
                          active={form.loanStatus === val}
                          onClick={() => set("loanStatus", val)}
                        >
                          {ic} {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <button className="bg-transparent border-[1.5px] border-[#E5E9F7] rounded-[10px] px-[1.4rem] py-[.65rem] text-[.87rem] text-[#4B5563] cursor-pointer transition-all font-medium [font-family:Inter,sans-serif] hover:border-[#9CA3AF] hover:text-[#111827]" onClick={back}>
                    ← Back
                  </button>
                  <button className="bg-[#4161DF] border-none rounded-[10px] px-8 py-[.7rem] text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:bg-[#2D4BC4] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(65,97,223,.35)]" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="animate-fade">
                <SH
                  step="4"
                  title="What's on your wish list?"
                  sub="Pick every amenity you'd love — go wild!"
                />
                <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(105px,1fr))]">
                  {AMENITIES.map(({ ic, label }) => (
                    <div
                      key={label}
                      className={`border-[1.5px] border-[#E5E9F7] bg-[#F3F5FF] rounded-xl px-2 py-[.65rem] text-center cursor-pointer transition-all text-[.73rem] text-[#4B5563] flex flex-col items-center gap-[5px] select-none font-medium hover:border-[#C9D4FB] hover:bg-[#EEF1FD]${form.amenities.includes(label) ? " bg-[#EEF1FD]! border-[#4161DF]! text-[#4161DF]! font-semibold!" : ""}`}
                      onClick={() => toggleAmenity(label)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleAmenity(label)
                      }
                    >
                      <span className="text-[19px] leading-none">{ic}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                {form.amenities.length > 0 && (
                  <div className="text-[.78rem] text-[#16A34A] font-semibold mt-2.5">
                    ✓ {form.amenities.length} amenit
                    {form.amenities.length === 1 ? "y" : "ies"} selected
                  </div>
                )}
                <div className="flex justify-between items-center mt-8">
                  <button className="bg-transparent border-[1.5px] border-[#E5E9F7] rounded-[10px] px-[1.4rem] py-[.65rem] text-[.87rem] text-[#4B5563] cursor-pointer transition-all font-medium [font-family:Inter,sans-serif] hover:border-[#9CA3AF] hover:text-[#111827]" onClick={back}>
                    ← Back
                  </button>
                  <button className="bg-[#4161DF] border-none rounded-[10px] px-8 py-[.7rem] text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:bg-[#2D4BC4] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(65,97,223,.35)]" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Details */}
            {step === 4 && (
              <div className="animate-fade">
                <SH
                  step="5"
                  title="Preferences & details"
                  sub="All optional — but every detail helps us match you faster."
                />
                <Field label="Ownership Type Preferred">
                  <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                    {[
                      "Freehold",
                      "Leasehold",
                      "Co-operative",
                      "Power of Attorney",
                    ].map((val) => (
                      <Pill
                        key={val}
                        active={form.ownershipType === val}
                        onClick={() => set("ownershipType", val)}
                      >
                        {val}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <div className="h-[1px] bg-[#E5E9F7] my-6" />
                <div
                  className="text-[.8rem] font-bold text-[#4B5563] uppercase tracking-[.08em] mb-3"
                >
                  🛏 Facilities
                </div>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field label="Bedrooms">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 2"
                      value={form.facilities.bedrooms}
                      onChange={(e) =>
                        setFac(
                          "bedrooms",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                  </Field>
                  <Field label="Bathrooms">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 2"
                      value={form.facilities.bathrooms}
                      onChange={(e) =>
                        setFac(
                          "bathrooms",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                  </Field>
                  <Field label="Balconies">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 1"
                      value={form.facilities.balconies}
                      onChange={(e) =>
                        setFac(
                          "balconies",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                  </Field>
                  <Field label="Servant Rooms">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 0"
                      value={form.facilities.servantRooms}
                      onChange={(e) =>
                        setFac(
                          "servantRooms",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                  </Field>
                  <Field label="Parkings">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 1"
                      value={form.facilities.parkings}
                      onChange={(e) =>
                        setFac(
                          "parkings",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                  </Field>
                  <Field label="Total Floors">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      type="number"
                      min={0}
                      placeholder="e.g. 12"
                      value={form.facilities.totalFloors}
                      onChange={(e) =>
                        setFac(
                          "totalFloors",
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                    />
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Parking Type">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {["None", "Open", "Covered", "Both"].map((val) => (
                        <Pill
                          key={val}
                          active={form.facilities.parkingType === val}
                          onClick={() => setFac("parkingType", val)}
                        >
                          {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Water Supply">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {["Municipal", "Borewell", "Both"].map((val) => (
                        <Pill
                          key={val}
                          active={form.facilities.waterSupply === val}
                          onClick={() => setFac("waterSupply", val)}
                        >
                          {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Security Features">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {["CCTV", "Guard", "Biometric", "Gated"].map((val) => (
                        <Pill
                          key={val}
                          active={form.facilities.securityFeatures.includes(
                            val,
                          )}
                          onClick={() => toggleSecurity(val)}
                        >
                          {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <label className="flex items-start gap-3 cursor-pointer mt-4">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.facilities.powerBackup}
                    onChange={(e) => setFac("powerBackup", e.target.checked)}
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Power backup is a must</span>
                </label>
                <div className="h-[1px] bg-[#E5E9F7] my-6" />
                <div
                  className="text-[.8rem] font-bold text-[#4B5563] uppercase tracking-[.08em] mb-3"
                >
                  📋 House Rules
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.petsAllowed}
                    onChange={(e) => set("petsAllowed", e.target.checked)}
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Pets must be allowed in the property</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.houseRules.ownerLivesOnPremises}
                    onChange={(e) =>
                      setHR("ownerLivesOnPremises", e.target.checked)
                    }
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Owner living on the premises is acceptable</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.houseRules.smokingAllowedOnPremises}
                    onChange={(e) =>
                      setHR("smokingAllowedOnPremises", e.target.checked)
                    }
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Smoking allowed on premises</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.houseRules.drinkingAllowedOnPremises}
                    onChange={(e) =>
                      setHR("drinkingAllowedOnPremises", e.target.checked)
                    }
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Drinking allowed on premises</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer mt-3">
                  <input
                    type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                    checked={form.houseRules.hasCurfew}
                    onChange={(e) => setHR("hasCurfew", e.target.checked)}
                  />
                  <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Curfew is acceptable</span>
                </label>
                {form.houseRules.hasCurfew && (
                  <div className="mt-3">
                    <Field label="Curfew time">
                      <input
                        className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                        placeholder="e.g. 10:00 PM"
                        value={form.houseRules.curfewTime}
                        onChange={(e) => setHR("curfewTime", e.target.value)}
                      />
                    </Field>
                  </div>
                )}
                <div className="mt-5">
                  <Field label="Opposite Gender Guests">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["allowed", "Allowed"],
                        ["allowed_with_notice", "With Notice"],
                        ["not_allowed", "Not Allowed"],
                      ].map(([val, lbl]) => (
                        <Pill
                          key={val}
                          active={
                            form.houseRules.oppositeGenderGuestsAllowed === val
                          }
                          onClick={() =>
                            setHR("oppositeGenderGuestsAllowed", val)
                          }
                        >
                          {lbl}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Overnight Guests">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["allowed", "Allowed"],
                        ["allowed_with_notice", "With Notice"],
                        ["not_allowed", "Not Allowed"],
                      ].map(([val, lbl]) => (
                        <Pill
                          key={val}
                          active={
                            form.houseRules.overnightGuestsAllowed === val
                          }
                          onClick={() => setHR("overnightGuestsAllowed", val)}
                        >
                          {lbl}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="h-[1px] bg-[#E5E9F7] my-6" />
                <div
                  className="text-[.8rem] font-bold text-[#4B5563] uppercase tracking-[.08em] mb-3"
                >
                  📍 Nearby Places
                </div>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field label="Schools">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.schools}
                      onChange={(e) => setNearby("schools", e.target.value)}
                    />
                  </Field>
                  <Field label="Hospitals">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.hospitals}
                      onChange={(e) => setNearby("hospitals", e.target.value)}
                    />
                  </Field>
                  <Field label="Metro Stations">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.metroStations}
                      onChange={(e) =>
                        setNearby("metroStations", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Malls">
                    <input
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)]"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.malls}
                      onChange={(e) => setNearby("malls", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button className="bg-transparent border-[1.5px] border-[#E5E9F7] rounded-[10px] px-[1.4rem] py-[.65rem] text-[.87rem] text-[#4B5563] cursor-pointer transition-all font-medium [font-family:Inter,sans-serif] hover:border-[#9CA3AF] hover:text-[#111827]" onClick={back}>
                    ← Back
                  </button>
                  <button className="bg-[#4161DF] border-none rounded-[10px] px-8 py-[.7rem] text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:bg-[#2D4BC4] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(65,97,223,.35)]" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 6 */}
            {step === 5 && (
              <div className="animate-fade">
                <SH
                  step="6"
                  title="Almost there!"
                  sub="Last few details and you're all set — we promise."
                />
                <Field
                  label="When are you planning to buy?"
                  required
                  error={errors.timeline}
                >
                  <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                    {[
                      ["🔥", "Within 1 Month"],
                      ["📅", "Within 3 Months"],
                      ["🌿", "After 3 Months"],
                    ].map(([ic, val]) => (
                      <Pill
                        key={val}
                        active={form.timeline === val}
                        onClick={() => set("timeline", val)}
                      >
                        {ic} {val}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <div className="mt-5">
                  <Field label="Best time to call you">
                    <div className="flex flex-wrap gap-[.45rem] mt-1.5">
                      {[
                        ["🌅", "Morning"],
                        ["☀️", "Afternoon"],
                        ["🌙", "Evening"],
                        ["🎲", "Anytime"],
                      ].map(([ic, val]) => (
                        <Pill
                          key={val}
                          active={form.callbackTime === val}
                          onClick={() => set("callbackTime", val)}
                        >
                          {ic} {val}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 mt-5">
                  <Field label="Anything else to know?">
                    <textarea
                      className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)] resize-y min-h-[90px]"
                      placeholder="Locality preferences, specific projects, special needs..."
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                    />
                  </Field>
                  <div
                    className="flex flex-col gap-4"
                  >
                    <Field label="How did you find us?">
                      <div className="relative">
                        <select
                          className="bg-[#F3F5FF] border-[1.5px] border-[#E5E9F7] rounded-[10px] px-4 py-[.7rem] text-[.88rem] text-[#111827] outline-none transition-all w-full [font-family:Inter,sans-serif] placeholder:text-[#9CA3AF] focus:border-[#4161DF] focus:bg-[#EEF1FD] focus:shadow-[0_0_0_3px_rgba(65,97,223,.12)] appearance-none pr-9 cursor-pointer"
                          value={form.source}
                          onChange={(e) => set("source", e.target.value)}
                        >
                          <option value="">Select</option>
                          {[
                            "Google",
                            "Instagram",
                            "LinkedIn",
                            "Friend / Referral",
                            "Advertisement",
                            "Other",
                          ].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-2 w-3 text-[#9CA3AF]"
                          viewBox="0 0 12 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          <path d="M1 1l5 5 5-5" />
                        </svg>
                      </div>
                    </Field>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                        checked={form.needLoanHelp}
                        onChange={(e) => set("needLoanHelp", e.target.checked)}
                      />
                      <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Help me explore home loan options</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                        checked={form.reraOnly}
                        onChange={(e) => set("reraOnly", e.target.checked)}
                      />
                      <span className="text-[.83rem] text-[#4B5563] leading-[1.6]">Show RERA-registered properties only</span>
                    </label>
                  </div>
                </div>
                <div className="bg-[#EEF1FD] border-[1.5px] border-[#C9D4FB] rounded-xl px-5 py-4 my-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox" className="w-4 h-4 accent-[#4161DF] shrink-0 mt-[3px] cursor-pointer"
                      checked={form.consentGiven}
                      onChange={(e) => set("consentGiven", e.target.checked)}
                    />
                    <span className="text-[.76rem]! text-[#4B5563] leading-[1.65]!">
                      By submitting, I agree to be contacted via call, SMS,
                      WhatsApp, or email by PropertyBulbul and its partners.
                      Your data is never sold.
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <div className="text-[.73rem] text-[#DC2626] mt-2 font-medium">
                      ⚠ {errors.consentGiven}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-8">
                  <button className="bg-transparent border-[1.5px] border-[#E5E9F7] rounded-[10px] px-[1.4rem] py-[.65rem] text-[.87rem] text-[#4B5563] cursor-pointer transition-all font-medium [font-family:Inter,sans-serif] hover:border-[#9CA3AF] hover:text-[#111827]" onClick={back}>
                    ← Back
                  </button>
                  <button
                    className="bg-[linear-gradient(135deg,#0E1B4D,#1A2B6B)] border-none rounded-[10px] px-10 py-3 text-[.9rem] text-white font-semibold cursor-pointer transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(14,27,77,.3)] disabled:bg-[#E5E9F7] disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:shadow-none"
                    disabled={submitting}
                    onClick={submit}
                  >
                    {submitting ? "Submitting…" : "Submit My Enquiry →"}
                  </button>
                </div>
              </div>
            )}

            {/* Done */}
            {done && (
              <div className="animate-fade text-center py-12 px-4">
                <div className="w-[88px] h-[88px] rounded-full bg-[#DCFCE7] border-[3px] border-[#BBF7D0] flex items-center justify-center text-4xl mx-auto mb-5">🏡</div>
                <h2 className="text-[1.75rem] font-extrabold text-[#111827] tracking-tight mb-2.5">You're all set!</h2>
                <p className="text-[#4B5563] text-[.9rem] leading-[1.75] max-w-[340px] mx-auto">
                  Our property advisor will reach out within 24 hours with
                  verified listings that match exactly what you're looking for.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-full py-[.4rem] px-[1.1rem] text-[.8rem] font-semibold mt-6">
                  ✓ Confirmation sent to your email
                </div>
                <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                  <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">🔒 100% Secure</div>
                  <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">✅ RERA Verified</div>
                  <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">📞 No Spam Calls</div>
                </div>
              </div>
            )}
          </div>

          {!done && (
            <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
              <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">🔒 Your data is safe & secure</div>
              <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">✅ 200+ verified listings</div>
              <div className="text-[.75rem] text-[#9CA3AF] flex items-center gap-1 font-medium">📞 Zero spam calls</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
