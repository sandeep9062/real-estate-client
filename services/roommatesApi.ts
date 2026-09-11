import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

// ---------- Types ----------

export interface SearchArea {
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  locality?: string;
  city?: string;
  radiusKm?: number;
}

export interface RoommateHabits {
  smoking?: "yes" | "no";
  drinking?: "yes" | "no";
  nightlifeFriendly?: "yes" | "no";
  foodPreference?: "veg" | "non_veg" | "eggetarian" | "vegan";
  ownsPets?: boolean;
  okayWithPets?: boolean;
  cleanlinessLevel?: "very_tidy" | "moderately_tidy" | "relaxed";
  guestsFrequency?: "rarely" | "sometimes" | "often";
}

export interface LookingFor {
  genderPreference?: "male" | "female" | "any";
  ageRange?: { min?: number; max?: number };
  smoking?: "yes" | "no" | "no_preference";
  drinking?: "yes" | "no" | "no_preference";
  nightlifeFriendly?: "yes" | "no" | "no_preference";
  foodPreference?: "veg" | "non_veg" | "any";
  occupation?: "student" | "working" | "any";
}

export interface RoommateProfile {
  _id: string;
  user: string;
  type: "have_room" | "no_room";
  // Populated by GET /profile/me; otherwise just the RoomFlat id.
  roomFlat?: string | RoomFlat;
  searchArea?: SearchArea;
  budgetRange?: { min?: number; max?: number };
  moveInDate?: string;
  stayDurationMonths?: number;
  bio?: string;
  // Public Cloudinary URLs of the user's profile pictures (the person — the
  // property photos live on RoomFlat.photos).
  photos?: string[];
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  occupation?: "student" | "working_professional" | "self_employed" | "other";
  workSchedule?: string;
  sleepSchedule?: "early_bird" | "night_owl" | "flexible";
  languages?: string[];
  habits?: RoommateHabits;
  lookingFor?: LookingFor;
  idVerified: boolean;
  isComplete: boolean;
  status: "active" | "paused" | "matched" | "closed";
  createdAt: string;
  updatedAt: string;
}

// Never requested/typed here on purpose — documents are select:false on the
// backend and only ever returned via getOwnProfile or an admin-scoped call.
export interface RoommateDocument {
  type: "aadhaar" | "passport" | "driving_license" | "voter_id" | "other";
  lastFourDigits?: string;
  fileKey: string;
  verificationStatus: "pending" | "verified" | "rejected";
}

export interface HouseRules {
  ownerLivesOnPremises?: boolean;
  curfew?: { hasCurfew: boolean; time?: string };
  oppositeGenderGuestsAllowed?:
    | "allowed"
    | "allowed_with_notice"
    | "not_allowed";
  overnightGuestsAllowed?: "allowed" | "allowed_with_notice" | "not_allowed";
  smokingAllowedOnPremises?: boolean;
  drinkingAllowedOnPremises?: boolean;
}

export interface RoomFlatLocation {
  address: string;
  city?: string;
  sector?: string;
  state?: string;
  country?: string;
  pincode?: string;
  landmark?: string;
  coordinates?: { type: "Point"; coordinates: [number, number] };
}

export interface RoomFlat {
  _id: string;
  roommateProfile: string | RoommateProfile;
  owner: string;
  openToSwap?: boolean;
  openToTemporaryStay?: boolean;
  title: string;
  description?: string;
  location: RoomFlatLocation;
  rentAmount: number;
  securityDeposit?: number;
  roomType: "private_room" | "shared_room" | "entire_flat";
  furnishing?: "furnished" | "semi_furnished" | "unfurnished";
  availableFrom?: string;
  minStayMonths?: number;
  photos?: string[];
  houseRules?: HouseRules;
  petsAllowed?: boolean;
  swapDetails?: {
    desiredLocality?: string;
    desiredCity?: string;
    desiredRentRange?: { min?: number; max?: number };
  };
  temporaryDetails?: { startDate?: string; endDate?: string };
  status: "active" | "matched" | "closed";
  interestCount: number;
}

export interface FlatmateConnection {
  _id: string;
  fromProfile: string | RoommateProfile;
  toProfile: RoommateProfile;
  roomFlat?: string | RoomFlat;
  message?: string;
  matchScore?: number;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  createdAt: string;
}

export interface BrowseResult {
  matchedListings: { source: "room_flat"; listing: RoomFlat }[];
  sharingAllowedProperties: { source: "property"; listing: any }[];
}

// ---------- API ----------

export const roommatesApi = createApi({
  reducerPath: "roommatesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["RoommateProfile", "RoomFlat", "FlatmateConnection"],
  endpoints: (builder) => ({
    // ---- Profile ----

    getOwnProfile: builder.query<RoommateProfile, void>({
      query: () => "/v1/roommates/profile/me",
      providesTags: [{ type: "RoommateProfile", id: "ME" }],
    }),

    getPublicProfile: builder.query<RoommateProfile, string>({
      query: (id) => `/v1/roommates/profile/${id}`,
      providesTags: (result, error, id) => [{ type: "RoommateProfile", id }],
    }),

    createProfile: builder.mutation<
      RoommateProfile,
      Partial<RoommateProfile> | FormData
    >({
      query: (profileData) => ({
        url: "/v1/roommates/profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: [{ type: "RoommateProfile", id: "ME" }],
    }),

    updateProfile: builder.mutation<
      RoommateProfile,
      Partial<RoommateProfile> | FormData
    >({
      query: (update) => ({
        url: "/v1/roommates/profile",
        method: "PATCH",
        body: update,
      }),
      invalidatesTags: [{ type: "RoommateProfile", id: "ME" }],
    }),

    // fileKey comes from an upstream signed-upload step — this endpoint only
    // records the resulting key, it never accepts raw file bytes.
    uploadDocument: builder.mutation<
      { documents: RoommateDocument[] },
      {
        type: RoommateDocument["type"];
        lastFourDigits?: string;
        fileKey: string;
      }
    >({
      query: (documentData) => ({
        url: "/v1/roommates/profile/documents",
        method: "POST",
        body: documentData,
      }),
      invalidatesTags: [{ type: "RoommateProfile", id: "ME" }],
    }),

    searchSeekers: builder.query<
      { profile: RoommateProfile; matchScore: number | null }[],
      Record<string, any> | undefined
    >({
      query: (params) => ({ url: "/v1/roommates/seekers", params }),
      providesTags: [{ type: "RoommateProfile", id: "SEEKERS" }],
    }),

    // ---- Room/Flat ----

    // Body is either JSON (no new files) or FormData ("payload" JSON string +
    // "photos" files) when PhotosLocationFlat picked new photos/videos.
    createRoomFlat: builder.mutation<RoomFlat, Partial<RoomFlat> | FormData>({
      query: (roomFlatData) => ({
        url: "/v1/roommates/room-flat",
        method: "POST",
        body: roomFlatData,
      }),
      invalidatesTags: [
        { type: "RoomFlat", id: "LIST" },
        { type: "RoommateProfile", id: "ME" },
      ],
    }),

    updateRoomFlat: builder.mutation<
      RoomFlat,
      // `update` is JSON for edits without new files, or FormData ("payload"
      // JSON string + "photos" files) once PhotosLocationFlat picks new files
      // — same dual shape as createRoomFlat.
      { id: string; update: Partial<RoomFlat> | FormData }
    >({
      query: ({ id, update }) => ({
        url: `/v1/roommates/room-flat/${id}`,
        method: "PATCH",
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RoomFlat", id },
        { type: "RoomFlat", id: "LIST" },
        { type: "RoommateProfile", id: "ME" },
      ],
    }),

    browseRoomsAndFlats: builder.query<
      BrowseResult,
      Record<string, any> | undefined
    >({
      query: (params) => ({ url: "/v1/roommates/browse", params }),
      providesTags: [{ type: "RoomFlat", id: "LIST" }],
    }),

    // ---- Connections ----

    sendConnectionRequest: builder.mutation<
      FlatmateConnection,
      { toProfileId: string; roomFlatId?: string; message?: string }
    >({
      query: (requestData) => ({
        url: "/v1/roommates/connections",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: [{ type: "FlatmateConnection", id: "LIST" }],
    }),

    respondToConnectionRequest: builder.mutation<
      FlatmateConnection,
      { id: string; status: "accepted" | "declined" | "withdrawn" }
    >({
      query: ({ id, status }) => ({
        url: `/v1/roommates/connections/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "FlatmateConnection", id },
        { type: "FlatmateConnection", id: "LIST" },
      ],
    }),

    listMyConnections: builder.query<FlatmateConnection[], void>({
      query: () => "/v1/roommates/connections",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "FlatmateConnection" as const,
                id: _id,
              })),
              { type: "FlatmateConnection", id: "LIST" },
            ]
          : [{ type: "FlatmateConnection", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOwnProfileQuery,
  useLazyGetOwnProfileQuery,
  useGetPublicProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useUploadDocumentMutation,
  useSearchSeekersQuery,
  useCreateRoomFlatMutation,
  useUpdateRoomFlatMutation,
  useBrowseRoomsAndFlatsQuery,
  useLazyBrowseRoomsAndFlatsQuery,
  useSendConnectionRequestMutation,
  useRespondToConnectionRequestMutation,
  useListMyConnectionsQuery,
} = roommatesApi;
