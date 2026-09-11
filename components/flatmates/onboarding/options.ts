// Enum option lists + label helpers shared by the flatmates onboarding steps.
// Values mirror the enums in backend/models/RoommateProfile.js and
// backend/models/RoomFlat.js precisely.

export const LABELS: Record<string, string> = {
  wfh: "Work from home",
  prefer_not_to_say: "Prefer not to say",
  no_preference: "No preference",
  working_professional: "Working professional",
  very_tidy: "Very tidy",
  moderately_tidy: "Moderately tidy",
  semi_furnished: "Semi-furnished",
  allowed_with_notice: "Allowed with notice",
  not_allowed: "Not allowed",
};

export const OPTIONS = {
  gender: ["male", "female", "other", "prefer_not_to_say"],
  occupation: ["student", "working_professional", "self_employed", "other"],
  workSchedule: ["wfh", "office", "hybrid", "flexible", "irregular"],
  sleepSchedule: ["early_bird", "night_owl", "flexible"],
  habitYesNo: ["yes", "no"],
  foodPreference: ["veg", "non_veg", "eggetarian", "vegan"],
  cleanlinessLevel: ["very_tidy", "moderately_tidy", "relaxed"],
  guestsFrequency: ["rarely", "sometimes", "often"],
  genderPreference: ["male", "female", "any"],
  prefYesNo: ["yes", "no", "no_preference"],
  foodPrefAny: ["veg", "non_veg", "any"],
  occupationAny: ["student", "working", "any"],
  profileType: ["have_room", "no_room"],
  roomType: ["private_room", "shared_room", "entire_flat"],
  furnishing: ["furnished", "semi_furnished", "unfurnished"],
  guestsAllowed: ["allowed", "allowed_with_notice", "not_allowed"],
  languages: [
    "English",
    "Hindi",
    "Punjabi",
    "Bengali",
    "Marathi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Gujarati",
    "Urdu",
    "Odia",
    "Assamese",
    "Maithili",
    "Sanskrit",
    "Konkani",
    "Sindhi",
    "Nepali",
    "Kashmiri",
    "Dogri",
    "Manipuri",
    "Bhojpuri",
    "Haryanvi",
    "Rajasthani",
    "Chhattisgarhi",
    "French",
    "Spanish",
    "German",
    "Arabic",
    "Chinese",
    "Other",
  ],
} as const;

export function humanize(str: string) {
  if (LABELS[str]) return LABELS[str];
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export function enumData(options: readonly string[]) {
  return options.map((o) => ({ value: o, label: humanize(o) }));
}