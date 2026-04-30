"use client";

import { useState } from "react";
import {
  useGetPropertyVisitReviewSummaryQuery,
  useGetPropertyVisitReviewsQuery,
  useGetBookingReviewStatusQuery,
  useSubmitVisitReviewMutation,
} from "@/services/propertiesApi";
import { toast } from "@/hooks/use-toast";
import { FiCalendar, FiMessageSquare } from "react-icons/fi";

export default function VisitReviewsSection({
  propertyId,
  bookingId,
  bookingDate,
  bookingStatus,
  isAuthenticated,
}: {
  propertyId: string;
  bookingId: string | null;
  bookingDate?: string;
  bookingStatus?: string;
  isAuthenticated: boolean;
}) {
  const { data: summary } = useGetPropertyVisitReviewSummaryQuery(propertyId);
  const { data: reviews = [] } = useGetPropertyVisitReviewsQuery({
    propertyId,
    limit: 8,
  });
  const { data: status } = useGetBookingReviewStatusQuery(bookingId || "", {
    skip: !isAuthenticated || !bookingId || bookingStatus === "Cancelled",
  });
  const [submit, { isLoading }] = useSubmitVisitReviewMutation();

  const [agent, setAgent] = useState(4);
  const [accuracy, setAccuracy] = useState(4);
  const [comment, setComment] = useState("");

  const showForm =
    isAuthenticated &&
    bookingId &&
    status &&
    status.eligible &&
    !status.reviewed &&
    bookingStatus !== "Cancelled";

  const handleSubmit = async () => {
    if (!bookingId) return;
    try {
      await submit({
        bookingId,
        agentHelpfulness: agent,
        listingAccuracy: accuracy,
        comment,
        propertyId,
      }).unwrap();
      toast.success("Thanks — your visit feedback was submitted.");
      setComment("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not submit review");
    }
  };

  const hasPublic =
    (summary && summary.count > 0) || (reviews && reviews.length > 0);

  if (!hasPublic && !showForm) return null;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FiMessageSquare className="text-[#4161df]" />
            Visit feedback
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Short ratings from buyers and renters after real site visits — not
            generic star spam.
          </p>
        </div>
        {summary && summary.count > 0 && (
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2">
              <span className="text-slate-500 block text-xs uppercase font-semibold">
                Agent helpfulness
              </span>
              <span className="text-lg font-bold text-slate-900">
                {summary.avgAgentHelpfulness ?? "—"}
                <span className="text-slate-400 font-normal"> /5</span>
              </span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2">
              <span className="text-slate-500 block text-xs uppercase font-semibold">
                Listing accuracy
              </span>
              <span className="text-lg font-bold text-slate-900">
                {summary.avgListingAccuracy ?? "—"}
                <span className="text-slate-400 font-normal"> /5</span>
              </span>
            </div>
            <div className="rounded-xl bg-[#4161df]/10 border border-[#4161df]/20 px-4 py-2 self-center">
              <span className="font-bold text-[#4161df]">
                {summary.count} visit{summary.count !== 1 ? "s" : ""}
              </span>
              <span className="text-slate-600 text-xs ml-1">reviewed</span>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-dashed border-[#4161df]/30 bg-[#4161df]/5 p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <FiCalendar className="text-[#4161df]" />
            Rate your visit
            {bookingDate && (
              <span className="text-slate-500 font-normal">· {bookingDate}</span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-slate-600">Agent helpfulness (1–5)</span>
              <input
                type="range"
                min={1}
                max={5}
                value={agent}
                onChange={(e) => setAgent(Number(e.target.value))}
                className="w-full mt-1 accent-[#4161df]"
              />
              <span className="font-bold text-slate-900">{agent}</span>
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Listing accuracy (1–5)</span>
              <input
                type="range"
                min={1}
                max={5}
                value={accuracy}
                onChange={(e) => setAccuracy(Number(e.target.value))}
                className="w-full mt-1 accent-[#4161df]"
              />
              <span className="font-bold text-slate-900">{accuracy}</span>
            </label>
          </div>
          <textarea
            className="w-full border border-slate-200 rounded-lg p-3 text-sm min-h-[80px]"
            placeholder="Optional — what stood out? (max 500 characters)"
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="rounded-lg bg-[#4161df] text-white text-sm font-semibold px-4 py-2 disabled:opacity-50"
          >
            {isLoading ? "Submitting…" : "Submit visit feedback"}
          </button>
        </div>
      )}

      {reviews.length > 0 && (
        <ul className="space-y-3">
          {reviews.map((r: any) => (
            <li
              key={r.id}
              className="border border-slate-100 rounded-xl p-4 text-sm bg-slate-50/50"
            >
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700 mb-2">
                <span>Helpfulness {r.agentHelpfulness}/5</span>
                <span>·</span>
                <span>Accuracy {r.listingAccuracy}/5</span>
                <span className="text-slate-400 font-normal ml-auto">
                  {r.reviewerLabel}
                  {r.createdAt &&
                    ` · ${new Date(r.createdAt).toLocaleDateString("en-IN")}`}
                </span>
              </div>
              {r.comment ? (
                <p className="text-slate-700 leading-relaxed">{r.comment}</p>
              ) : (
                <p className="text-slate-400 italic text-xs">No written comment</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
