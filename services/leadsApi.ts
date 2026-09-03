import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

/**
 * CRM lead statuses (WhatsApp-click leads).
 * Legacy brochure-request leads (PENDING/CONVERTED/...) are a separate flow.
 */
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Negotiating",
  "Closed",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadProperty {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  deal?: string;
  price?: number;
  status?: string;
}

export interface Lead {
  id: string;
  agentId: string;
  buyerName: string | null;
  buyerPhone: string | null;
  source: string;
  type: string;
  status: LeadStatus;
  notes?: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  property?: LeadProperty | null;
}

export interface LeadStats {
  total: number;
  totalThisWeek: number;
  closed: number;
  conversionRate: number;
  byStatus: Record<string, number>;
}

export interface GetLeadsParams {
  status?: string;
  propertyId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Lead", "LeadStats"],
  endpoints: (builder) => ({
    /** GET /api/leads — all leads for the authenticated agent. */
    getLeads: builder.query<Lead[], GetLeadsParams | void>({
      query: (params) => ({
        url: "/leads",
        params: (params as GetLeadsParams) || undefined,
      }),
      transformResponse: (res: { success: boolean; count: number; data: Lead[] }) =>
        res?.data ?? [],
      providesTags: ["Lead"],
    }),

    /** GET /api/leads/stats — counts for the stats bar. */
    getLeadStats: builder.query<LeadStats, void>({
      query: () => "/leads/stats",
      providesTags: ["LeadStats"],
    }),

    /** PATCH /api/leads/:id — update status and/or notes (agent-only). */
    updateLead: builder.mutation<
      Lead,
      { id: string; status?: LeadStatus; notes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/leads/${id}`,
        method: "PATCH",
        body,
      }),
      // Optimistic update for instant UI feedback; rolled back on failure.
      // Stats are corrected via invalidation refetch.
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const undoLeads = dispatch(
          leadsApi.util.updateQueryData("getLeads", undefined, (draft) => {
            const lead = draft.find((l) => l.id === id);
            if (lead) {
              Object.assign(lead, patch);
              lead.lastActivityAt = new Date().toISOString();
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          undoLeads.undo();
        }
      },
      invalidatesTags: ["Lead", "LeadStats"],
    }),

    /**
     * POST /api/leads — fire-and-forget lead capture when the WhatsApp Connect
     * button is clicked on a listing page. Public + optional auth; agentId is
     * derived server-side from the property owner.
     */
    createLead: builder.mutation<
      { success: boolean; data: Lead },
      {
        propertyId: string;
        source?: string;
        buyerName?: string;
        buyerPhone?: string;
      }
    >({
      query: (body) => ({ url: "/leads", method: "POST", body }),
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadStatsQuery,
  useUpdateLeadMutation,
  useCreateLeadMutation,
} = leadsApi;
