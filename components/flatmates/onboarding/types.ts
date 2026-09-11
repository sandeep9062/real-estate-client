// Shared draft-state types for the flatmates onboarding flow.
// Field names mirror backend/models/RoommateProfile.js and RoomFlat.js so the
// submit mapping in the page stays 1:1 with the API.

export interface HabitsDraft {
  smoking: string;
  drinking: string;
  nightlifeFriendly: string;
  foodPreference: string;
  ownsPets: boolean;
  okayWithPets: boolean;
  cleanlinessLevel: string;
  guestsFrequency: string;
}

export interface LookingForDraft {
  genderPreference: string;
  ageRange: { min: string; max: string };
  smoking: string;
  drinking: string;
  nightlifeFriendly: string;
  foodPreference: string;
  occupation: string;
}

export interface SearchAreaDraft {
  city: string;
  locality: string;
  radiusKm: string;
  lat: string;
  lng: string;
}

export interface BudgetRangeDraft {
  min: string;
  max: string;
}

export interface ProfileDraft {
  bio: string;
  type: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  workSchedule: string;
  sleepSchedule: string;
  languages: string[];
  // Public profile pictures (the person) — kept URLs or newly-picked Files,
  // same shape as RoomFlatDraft.photos used by PhotosLocationFlat.
  photos?: (string | File)[];
  habits: HabitsDraft;
  lookingFor: LookingForDraft;
  searchArea: SearchAreaDraft;
  budgetRange: BudgetRangeDraft;
  moveInDate: string;
  stayDurationMonths: string;
}

export interface HouseRulesDraft {
  ownerLivesOnPremises: boolean;
  curfew: { hasCurfew: boolean; time: string };
  oppositeGenderGuestsAllowed: string;
  overnightGuestsAllowed: string;
  smokingAllowedOnPremises: boolean;
  drinkingAllowedOnPremises: boolean;
}

export interface SwapDetailsDraft {
  desiredCity?: string;
  desiredLocality?: string;
  desiredRentRange?: { min?: string; max?: string };
}

export interface TemporaryDetailsDraft {
  startDate?: string;
  endDate?: string;
}

export interface RoomFlatLocationDraft {
  sector?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  country?: string;
  city?: string;
  address?: string;
  coordinates?: any;
}

export interface RoomFlatDraft {
  title: string;
  description: string;
  rentAmount: string;
  securityDeposit: string;
  roomType: string;
  furnishing: string;
  availableFrom: string;
  minStayMonths: string;
  openToSwap: boolean;
  openToTemporaryStay: boolean;
  petsAllowed: boolean;
  location: RoomFlatLocationDraft;
  houseRules: HouseRulesDraft;
  swapDetails: SwapDetailsDraft;
  temporaryDetails: TemporaryDetailsDraft;
  photos?: (string | File)[];
}

export interface RoomFlatMediaDraft {
  image: (string | File)[];
  location: {
    country?: string;
    city?: string;
    address?: string;
    coordinates?: any;
  };
}