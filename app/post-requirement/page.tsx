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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
:root{
  --blue:#4161DF;--blue-dk:#2D4BC4;--blue-lt:#EEF1FD;--blue-mid:#C9D4FB;
  --navy:#0E1B4D;--navy2:#1A2B6B;
  --ink:#111827;--ink2:#4B5563;--ink3:#9CA3AF;
  --bg:#F3F5FF;--white:#FFFFFF;--border:#E5E9F7;
  --green:#16A34A;--green-lt:#DCFCE7;
  --sh:0 4px 20px rgba(14,27,77,.10);--sh-lg:0 12px 40px rgba(14,27,77,.14);
}
.pb{font-family:'Inter',sans-serif;background:var(--bg);min-height:100vh;color:var(--ink);}
.pb-hero{background:linear-gradient(135deg,#1e3a5f 0%,#4161df 100%);padding:3rem 1.5rem 5.5rem;text-align:center;position:relative;overflow:hidden;}
.pb-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(65,97,223,.25) 0%,transparent 70%);}
.pb-hero-dots{position:absolute;inset:0;opacity:.07;background-image:radial-gradient(circle,white 1px,transparent 1px);background-size:28px 28px;pointer-events:none;}
.pb-hero-circle{position:absolute;border-radius:50%;background:white;pointer-events:none;}
.pb-hero-wave{position:absolute;bottom:0;left:0;width:100%;overflow:hidden;line-height:0;pointer-events:none;}
.pb-hero-wave svg{fill:var(--bg);}
.pb-logo{display:inline-flex;align-items:center;gap:10px;margin-bottom:1.75rem;position:relative;}
.pb-logo-icon{width:40px;height:40px;background:var(--blue);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;}
.pb-logo-text{font-size:1.2rem;font-weight:700;color:#fff;}
.pb-logo-text span{color:var(--blue-mid);}
.pb-hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:50px;padding:.35rem 1rem;font-size:.72rem;color:rgba(255,255,255,.85);letter-spacing:.08em;text-transform:uppercase;font-weight:500;margin-bottom:1.25rem;position:relative;}
.pb-hero h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;color:#fff;line-height:1.15;letter-spacing:-.02em;margin-bottom:.75rem;position:relative;}
.pb-hero h1 em{font-style:normal;background:linear-gradient(90deg,#93A8FF,#C4D0FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.pb-hero p{color:rgba(255,255,255,.6);font-size:.9rem;font-weight:300;line-height:1.7;position:relative;}
.pb-wrap{max-width:700px;margin:-2.5rem auto 0;padding:0 1rem 4rem;position:relative;z-index:10;}
.pb-pbar{height:4px;background:var(--border);border-radius:99px;margin-bottom:1.75rem;overflow:hidden;}
.pb-pfill{height:100%;background:linear-gradient(90deg,var(--blue),#7B93F5);border-radius:99px;transition:width .45s cubic-bezier(.4,0,.2,1);}
.pb-snav{display:flex;align-items:center;margin-bottom:1.75rem;padding:0 .25rem;}
.pb-sdot{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;}
.pb-dot{width:34px;height:34px;border-radius:50%;border:2px solid var(--border);background:var(--white);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--ink3);transition:all .3s;position:relative;z-index:1;box-shadow:0 1px 3px rgba(14,27,77,.08);}
.pb-dot-a{background:var(--blue)!important;border-color:var(--blue)!important;color:#fff!important;box-shadow:0 0 0 4px rgba(65,97,223,.18)!important;}
.pb-dot-d{background:var(--green)!important;border-color:var(--green)!important;color:#fff!important;}
.pb-dlabel{font-size:10px;color:var(--ink3);text-align:center;font-weight:500;letter-spacing:.02em;}
.pb-dlabel-a{color:var(--blue)!important;}
.pb-dlabel-d{color:var(--green)!important;}
.pb-sline{flex:1;height:2px;background:var(--border);margin-top:-19px;max-width:40px;transition:background .3s;}
.pb-sline-d{background:var(--green)!important;}
.pb-card{background:var(--white);border-radius:20px;padding:2rem;box-shadow:var(--sh-lg);border:1px solid rgba(65,97,223,.08);}
.pb-sh{display:flex;align-items:flex-start;gap:12px;margin-bottom:1.5rem;}
.pb-snum{width:32px;height:32px;border-radius:10px;background:var(--blue-lt);border:1.5px solid var(--blue-mid);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--blue);flex-shrink:0;}
.pb-stitle{font-size:1.15rem;font-weight:700;color:var(--ink);letter-spacing:-.01em;}
.pb-ssub{font-size:.8rem;color:var(--ink3);margin-top:2px;}
.pb-g2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
@media(max-width:520px){.pb-g2{grid-template-columns:1fr;}}
.pb-f{display:flex;flex-direction:column;gap:6px;}
.pb-lbl{font-size:.75rem;font-weight:600;color:var(--ink2);letter-spacing:.04em;text-transform:uppercase;}
.pb-req{color:var(--blue);margin-left:2px;}
.pb-in,.pb-sel,.pb-ta{background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:.7rem 1rem;font-size:.88rem;font-family:'Inter',sans-serif;color:var(--ink);outline:none;transition:all .2s;width:100%;}
.pb-in:focus,.pb-sel:focus,.pb-ta:focus{border-color:var(--blue);background:var(--blue-lt);box-shadow:0 0 0 3px rgba(65,97,223,.12);}
.pb-in::placeholder,.pb-ta::placeholder{color:var(--ink3);}
.pb-sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:calc(100% - 12px) center;padding-right:2.25rem;cursor:pointer;}
.pb-ta{resize:vertical;min-height:90px;}
.pb-err{font-size:.73rem;color:#DC2626;margin-top:2px;font-weight:500;}
.pb-pg{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:6px;}
.pb-pill{display:inline-flex;align-items:center;gap:5px;padding:.45rem .9rem;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-size:.82rem;color:var(--ink2);cursor:pointer;transition:all .18s;font-weight:500;user-select:none;}
.pb-pill:hover{border-color:var(--blue-mid);background:var(--blue-lt);color:var(--blue);}
.pb-pill-a{background:var(--blue-lt)!important;border-color:var(--blue)!important;color:var(--blue)!important;font-weight:600;}
.pb-bg{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.25rem;}
@media(max-width:420px){.pb-bg{grid-template-columns:1fr;}}
.pb-bc{border:1.5px solid var(--border);background:var(--bg);border-radius:14px;padding:1.1rem 1rem;cursor:pointer;transition:all .2s;text-align:center;}
.pb-bc:hover{border-color:var(--blue-mid);background:var(--blue-lt);}
.pb-bc-a{background:var(--blue-lt)!important;border-color:var(--blue)!important;box-shadow:0 0 0 3px rgba(65,97,223,.1);}
.pb-bamt{font-size:1.15rem;font-weight:700;color:var(--ink);letter-spacing:-.01em;}
.pb-bamt-a{color:var(--blue)!important;}
.pb-bsub{font-size:.72rem;color:var(--ink3);margin-top:4px;}
.pb-ag{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:.5rem;}
.pb-ac{border:1.5px solid var(--border);background:var(--bg);border-radius:12px;padding:.65rem .5rem;text-align:center;cursor:pointer;transition:all .18s;font-size:.73rem;color:var(--ink2);display:flex;flex-direction:column;align-items:center;gap:5px;user-select:none;font-weight:500;}
.pb-ac:hover{border-color:var(--blue-mid);background:var(--blue-lt);}
.pb-ac-a{background:var(--blue-lt)!important;border-color:var(--blue)!important;color:var(--blue)!important;font-weight:600;}
.pb-aic{font-size:19px;line-height:1;}
.pb-acnt{font-size:.78rem;color:var(--green);font-weight:600;margin-top:.6rem;}
.pb-nav{display:flex;justify-content:space-between;align-items:center;margin-top:2rem;}
.pb-btn-back{background:none;border:1.5px solid var(--border);border-radius:10px;padding:.65rem 1.4rem;font-size:.87rem;font-family:'Inter',sans-serif;color:var(--ink2);cursor:pointer;transition:all .2s;font-weight:500;}
.pb-btn-back:hover{border-color:var(--ink3);color:var(--ink);}
.pb-btn-next{background:var(--blue);border:none;border-radius:10px;padding:.7rem 2rem;font-size:.9rem;font-family:'Inter',sans-serif;color:#fff;font-weight:600;cursor:pointer;transition:all .2s;}
.pb-btn-next:hover{background:var(--blue-dk);transform:translateY(-1px);box-shadow:0 6px 20px rgba(65,97,223,.35);}
.pb-btn-submit{background:linear-gradient(135deg,var(--navy),var(--navy2));border:none;border-radius:10px;padding:.75rem 2.5rem;font-size:.9rem;font-family:'Inter',sans-serif;color:#fff;font-weight:600;cursor:pointer;transition:all .2s;}
.pb-btn-submit:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(14,27,77,.3);}
.pb-btn-submit:disabled{background:var(--border);color:var(--ink3);cursor:not-allowed;transform:none;box-shadow:none;}
.pb-div{height:1px;background:var(--border);margin:1.5rem 0;}
.pb-cr{display:flex;align-items:flex-start;gap:.75rem;cursor:pointer;}
.pb-cr input[type=checkbox]{width:16px;height:16px;accent-color:var(--blue);flex-shrink:0;margin-top:3px;cursor:pointer;}
.pb-cr span{font-size:.83rem;color:var(--ink2);line-height:1.6;}
.pb-cbox{background:var(--blue-lt);border:1.5px solid var(--blue-mid);border-radius:12px;padding:1rem 1.25rem;margin:1.5rem 0;}
.pb-ctext{font-size:.76rem;color:var(--ink2);line-height:1.65;}
.pb-trust{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin-top:1.25rem;flex-wrap:wrap;}
.pb-ti{font-size:.75rem;color:var(--ink3);display:flex;align-items:center;gap:4px;font-weight:500;}
.pb-done{text-align:center;padding:3rem 1rem;}
.pb-done-ring{width:88px;height:88px;border-radius:50%;background:var(--green-lt);border:3px solid #BBF7D0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto 1.25rem;}
.pb-done h2{font-size:1.75rem;font-weight:800;color:var(--ink);letter-spacing:-.02em;margin-bottom:.6rem;}
.pb-done p{color:var(--ink2);font-size:.9rem;line-height:1.75;max-width:340px;margin:0 auto;}
.pb-badge{display:inline-flex;align-items:center;gap:6px;background:var(--green-lt);color:var(--green);border:1px solid #BBF7D0;border-radius:50px;padding:.4rem 1.1rem;font-size:.8rem;font-weight:600;margin-top:1.5rem;}
.pb-fade{animation:pbFade .35s ease;}
@keyframes pbFade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
`;

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
    className={`pb-pill${active ? " pb-pill-a" : ""}`}
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
  <div className="pb-f">
    <label className="pb-lbl">
      {label}
      {required && <span className="pb-req"> *</span>}
    </label>
    {children}
    {error && <div className="pb-err">⚠ {error}</div>}
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
  <div className="pb-sh">
    <div className="pb-snum">{step}</div>
    <div>
      <div className="pb-stitle">{title}</div>
      <div className="pb-ssub">{sub}</div>
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
      <style>{CSS}</style>
      <div className="pb max-w-7xl">
        {/* Hero */}
        <div className="pb-hero">
          {/* Dot grid */}
          <div className="pb-hero-dots" />
          {/* Decorative circles */}
          <div
            className="pb-hero-circle"
            style={{
              width: 300,
              height: 300,
              top: -100,
              left: -80,
              opacity: 0.06,
            }}
          />
          <div
            className="pb-hero-circle"
            style={{
              width: 200,
              height: 200,
              top: 20,
              right: -60,
              opacity: 0.08,
            }}
          />
          <div
            className="pb-hero-circle"
            style={{
              width: 150,
              height: 150,
              bottom: -60,
              left: "40%",
              opacity: 0.05,
            }}
          />

          <div className="pb-hero-tag mt-2">
            🏆 Tricity's Most Trusted Platform
          </div>
          <h1>
            Find Your <em>Dream Home</em>
            <br />
            Without the Hassle
          </h1>
          <p>
            No hidden charges · No spam calls · Verified listings · Zero
            brokerage surprises
          </p>

          {/* Bottom wave */}
          <div className="pb-hero-wave">
            <svg
              viewBox="0 0 1440 40"
              preserveAspectRatio="none"
              className="w-full h-8"
            >
              <path d="M0,24 C480,40 960,8 1440,24 L1440,40 L0,40 Z" />
            </svg>
          </div>
        </div>

        <div className="pb-wrap">
          <div className="pb-pbar">
            <div className="pb-pfill" style={{ width: `${progress}%` }} />
          </div>

          {!done && (
            <div className="pb-snav">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="pb-sdot">
                    <div
                      className={`pb-dot${i === step ? " pb-dot-a" : i < step ? " pb-dot-d" : ""}`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <div
                      className={`pb-dlabel${i === step ? " pb-dlabel-a" : i < step ? " pb-dlabel-d" : ""}`}
                    >
                      {label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`pb-sline${i < step ? " pb-sline-d" : ""}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="pb-card">
            {/* Step 1 */}
            {step === 0 && (
              <div className="pb-fade">
                <SH
                  step="1"
                  title="Nice to meet you!"
                  sub="Let's start with the basics — how can we reach you?"
                />
                <div className="pb-g2">
                  <Field label="Full Name" required error={errors.fullName}>
                    <input
                      className="pb-in"
                      placeholder="Rahul Sharma"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  </Field>
                  <Field label="Mobile Number" required error={errors.phone}>
                    <input
                      className="pb-in"
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
                      className="pb-in"
                      placeholder="you@email.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Preferred City" required error={errors.city}>
                    <select
                      className="pb-sel"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    >
                      <option value="">Select your city</option>
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="pb-nav">
                  <span />
                  <button className="pb-btn-next" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="pb-fade">
                <SH
                  step="2"
                  title="Describe your dream home"
                  sub="What kind of place are you looking for?"
                />
                <Field label="Looking to" required error={errors.deal}>
                  <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Property Category" required error={errors.type}>
                    <div className="pb-pg">
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
                  <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Bedrooms">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Availability">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Furnishing">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Carpet Area (sq.ft) — optional">
                    <div className="pb-g2">
                      <input
                        className="pb-in"
                        placeholder="Min e.g. 800"
                        type="number"
                        value={form.carpetMin}
                        onChange={(e) => set("carpetMin", e.target.value)}
                      />
                      <input
                        className="pb-in"
                        placeholder="Max e.g. 2000"
                        type="number"
                        value={form.carpetMax}
                        onChange={(e) => set("carpetMax", e.target.value)}
                      />
                    </div>
                  </Field>
                </div>
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Purpose of Purchase">
                    <div className="pb-pg">
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
                <div className="pb-nav">
                  <button className="pb-btn-back" onClick={back}>
                    ← Back
                  </button>
                  <button className="pb-btn-next" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="pb-fade">
                <SH
                  step="3"
                  title="Let's talk budget"
                  sub="No judgement — this helps us match you perfectly."
                />
                <div className="pb-bg">
                  {(form.deal === "Rent" ? BUDGETS_RENT : BUDGETS_SALE).map(
                    ({ label, sub, val }) => (
                      <div
                        key={val}
                        className={`pb-bc${form.budget === val ? " pb-bc-a" : ""}`}
                        onClick={() => set("budget", val)}
                      >
                        <div
                          className={`pb-bamt${form.budget === val ? " pb-bamt-a" : ""}`}
                        >
                          {label}
                        </div>
                        <div className="pb-bsub">{sub}</div>
                      </div>
                    ),
                  )}
                </div>
                {errors.budget && (
                  <div className="pb-err" style={{ marginBottom: "1rem" }}>
                    ⚠ {errors.budget}
                  </div>
                )}
                <div className="pb-div" />
                <div className="pb-g2">
                  <Field label="Annual Income">
                    <select
                      className="pb-sel"
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
                  </Field>
                  <Field label="Home Loan Status">
                    <div className="pb-pg">
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
                <div className="pb-nav">
                  <button className="pb-btn-back" onClick={back}>
                    ← Back
                  </button>
                  <button className="pb-btn-next" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="pb-fade">
                <SH
                  step="4"
                  title="What's on your wish list?"
                  sub="Pick every amenity you'd love — go wild!"
                />
                <div className="pb-ag">
                  {AMENITIES.map(({ ic, label }) => (
                    <div
                      key={label}
                      className={`pb-ac${form.amenities.includes(label) ? " pb-ac-a" : ""}`}
                      onClick={() => toggleAmenity(label)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleAmenity(label)
                      }
                    >
                      <span className="pb-aic">{ic}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                {form.amenities.length > 0 && (
                  <div className="pb-acnt">
                    ✓ {form.amenities.length} amenit
                    {form.amenities.length === 1 ? "y" : "ies"} selected
                  </div>
                )}
                <div className="pb-nav">
                  <button className="pb-btn-back" onClick={back}>
                    ← Back
                  </button>
                  <button className="pb-btn-next" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Details */}
            {step === 4 && (
              <div className="pb-fade">
                <SH
                  step="5"
                  title="Preferences & details"
                  sub="All optional — but every detail helps us match you faster."
                />
                <Field label="Ownership Type Preferred">
                  <div className="pb-pg">
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
                <div className="pb-div" />
                <div
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 700,
                    color: "var(--ink2)",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: ".75rem",
                  }}
                >
                  🛏 Facilities
                </div>
                <div className="pb-g2">
                  <Field label="Bedrooms">
                    <input
                      className="pb-in"
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
                      className="pb-in"
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
                      className="pb-in"
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
                      className="pb-in"
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
                      className="pb-in"
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
                      className="pb-in"
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Parking Type">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Water Supply">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Security Features">
                    <div className="pb-pg">
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
                <label className="pb-cr" style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={form.facilities.powerBackup}
                    onChange={(e) => setFac("powerBackup", e.target.checked)}
                  />
                  <span>Power backup is a must</span>
                </label>
                <div className="pb-div" />
                <div
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 700,
                    color: "var(--ink2)",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: ".75rem",
                  }}
                >
                  📋 House Rules
                </div>
                <label className="pb-cr">
                  <input
                    type="checkbox"
                    checked={form.petsAllowed}
                    onChange={(e) => set("petsAllowed", e.target.checked)}
                  />
                  <span>Pets must be allowed in the property</span>
                </label>
                <label className="pb-cr" style={{ marginTop: ".75rem" }}>
                  <input
                    type="checkbox"
                    checked={form.houseRules.ownerLivesOnPremises}
                    onChange={(e) =>
                      setHR("ownerLivesOnPremises", e.target.checked)
                    }
                  />
                  <span>Owner living on the premises is acceptable</span>
                </label>
                <label className="pb-cr" style={{ marginTop: ".75rem" }}>
                  <input
                    type="checkbox"
                    checked={form.houseRules.smokingAllowedOnPremises}
                    onChange={(e) =>
                      setHR("smokingAllowedOnPremises", e.target.checked)
                    }
                  />
                  <span>Smoking allowed on premises</span>
                </label>
                <label className="pb-cr" style={{ marginTop: ".75rem" }}>
                  <input
                    type="checkbox"
                    checked={form.houseRules.drinkingAllowedOnPremises}
                    onChange={(e) =>
                      setHR("drinkingAllowedOnPremises", e.target.checked)
                    }
                  />
                  <span>Drinking allowed on premises</span>
                </label>
                <label className="pb-cr" style={{ marginTop: ".75rem" }}>
                  <input
                    type="checkbox"
                    checked={form.houseRules.hasCurfew}
                    onChange={(e) => setHR("hasCurfew", e.target.checked)}
                  />
                  <span>Curfew is acceptable</span>
                </label>
                {form.houseRules.hasCurfew && (
                  <div style={{ marginTop: ".75rem" }}>
                    <Field label="Curfew time">
                      <input
                        className="pb-in"
                        placeholder="e.g. 10:00 PM"
                        value={form.houseRules.curfewTime}
                        onChange={(e) => setHR("curfewTime", e.target.value)}
                      />
                    </Field>
                  </div>
                )}
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Opposite Gender Guests">
                    <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Overnight Guests">
                    <div className="pb-pg">
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

                <div className="pb-div" />
                <div
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 700,
                    color: "var(--ink2)",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: ".75rem",
                  }}
                >
                  📍 Nearby Places
                </div>
                <div className="pb-g2">
                  <Field label="Schools">
                    <input
                      className="pb-in"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.schools}
                      onChange={(e) => setNearby("schools", e.target.value)}
                    />
                  </Field>
                  <Field label="Hospitals">
                    <input
                      className="pb-in"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.hospitals}
                      onChange={(e) => setNearby("hospitals", e.target.value)}
                    />
                  </Field>
                  <Field label="Metro Stations">
                    <input
                      className="pb-in"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.metroStations}
                      onChange={(e) =>
                        setNearby("metroStations", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Malls">
                    <input
                      className="pb-in"
                      placeholder="Comma separated"
                      value={form.nearbyPlaces.malls}
                      onChange={(e) => setNearby("malls", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="pb-nav">
                  <button className="pb-btn-back" onClick={back}>
                    ← Back
                  </button>
                  <button className="pb-btn-next" onClick={next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 6 */}
            {step === 5 && (
              <div className="pb-fade">
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
                  <div className="pb-pg">
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
                <div style={{ marginTop: "1.25rem" }}>
                  <Field label="Best time to call you">
                    <div className="pb-pg">
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
                <div className="pb-g2" style={{ marginTop: "1.25rem" }}>
                  <Field label="Anything else to know?">
                    <textarea
                      className="pb-ta"
                      placeholder="Locality preferences, specific projects, special needs..."
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                    />
                  </Field>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <Field label="How did you find us?">
                      <select
                        className="pb-sel"
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
                    </Field>
                    <label className="pb-cr">
                      <input
                        type="checkbox"
                        checked={form.needLoanHelp}
                        onChange={(e) => set("needLoanHelp", e.target.checked)}
                      />
                      <span>Help me explore home loan options</span>
                    </label>
                    <label className="pb-cr">
                      <input
                        type="checkbox"
                        checked={form.reraOnly}
                        onChange={(e) => set("reraOnly", e.target.checked)}
                      />
                      <span>Show RERA-registered properties only</span>
                    </label>
                  </div>
                </div>
                <div className="pb-cbox">
                  <label className="pb-cr">
                    <input
                      type="checkbox"
                      checked={form.consentGiven}
                      onChange={(e) => set("consentGiven", e.target.checked)}
                    />
                    <span className="pb-ctext">
                      By submitting, I agree to be contacted via call, SMS,
                      WhatsApp, or email by PropertyBulbul and its partners.
                      Your data is never sold.
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <div className="pb-err" style={{ marginTop: 8 }}>
                      ⚠ {errors.consentGiven}
                    </div>
                  )}
                </div>
                <div className="pb-nav">
                  <button className="pb-btn-back" onClick={back}>
                    ← Back
                  </button>
                  <button
                    className="pb-btn-submit"
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
              <div className="pb-fade pb-done">
                <div className="pb-done-ring">🏡</div>
                <h2>You're all set!</h2>
                <p>
                  Our property advisor will reach out within 24 hours with
                  verified listings that match exactly what you're looking for.
                </p>
                <div className="pb-badge">
                  ✓ Confirmation sent to your email
                </div>
                <div className="pb-trust" style={{ marginTop: "2rem" }}>
                  <div className="pb-ti">🔒 100% Secure</div>
                  <div className="pb-ti">✅ RERA Verified</div>
                  <div className="pb-ti">📞 No Spam Calls</div>
                </div>
              </div>
            )}
          </div>

          {!done && (
            <div className="pb-trust">
              <div className="pb-ti">🔒 Your data is safe & secure</div>
              <div className="pb-ti">✅ 200+ verified listings</div>
              <div className="pb-ti">📞 Zero spam calls</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
