"use client";

import { useState } from "react";
import {
  useGetPropertyVisitReviewSummaryQuery,
  useGetPropertyVisitReviewsQuery,
  useGetBookingReviewStatusQuery,
  useSubmitVisitReviewMutation,
} from "@/services/propertiesApi";
import { toast } from "@/hooks/use-toast";
import { FiCalendar, FiStar, FiMessageSquare } from "react-icons/fi";

/**
 * Accessible 1–5 star picker.
 *
 * Built on real radio inputs inside a fieldset, so arrow-key navigation,
 * screen-reader grouping and form semantics all come for free. The radios are
 * visually hidden but stay focusable, with the focus ring drawn on the label.
 */
function StarPicker({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm text-slate-600">{label}</legend>
      <div className="mt-1.5 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const inputId = `${name}-${n}`;
          const filled = n <= value;
          return (
            <span key={n} className="relative">
              <input
                type="radio"
                id={inputId}
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <label
                htmlFor={inputId}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4161df]"
              >
                <FiStar
                  size={22}
                  aria-hidden
                  className={filled ? "text-amber-500" : "text-slate-300"}
                />
                <span className="sr-only">
                  {n} {n === 1 ? "star" : "stars"}
                </span>
              </label>
            </span>
          );
        })}
        <span className="ml-1 text-sm font-semibold text-slate-900">{value}/5</span>
      </div>
    </fieldset>
  );
}

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* h2 to sit under the page h1 in the document outline. */}
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            <FiMessageSquare className="text-[#4161df]" aria-hidden />
            Reviews
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Short ratings from buyers and renters after real site visits — not
            generic star spam.
          </p>
        </div>
        {summary && summary.count > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
            <div>
              <span className="block text-xs text-slate-500">
                Agent helpfulness
              </span>
              <span className="stat-number text-lg text-slate-900">
                {summary.avgAgentHelpfulness ?? "—"}
                <span className="text-sm font-normal text-slate-500"> /5</span>
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">
                Listing accuracy
              </span>
              <span className="stat-number text-lg text-slate-900">
                {summary.avgListingAccuracy ?? "—"}
                <span className="text-sm font-normal text-slate-500"> /5</span>
              </span>
            </div>
            <p className="text-sm text-slate-700">
              <span className="stat-number text-[#3049b8]">
                {summary.count}
              </span>{" "}
              visit{summary.count !== 1 ? "s" : ""} reviewed
            </p>
          </div>
        )}
      </div>

      {!hasPublic && (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center">
          <FiStar className="mx-auto mb-3 text-slate-300" size={28} aria-hidden />
          <p className="text-base font-semibold text-slate-900">
            No reviews yet.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Book a visit to leave the first one.
          </p>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FiCalendar className="text-[#4161df]" aria-hidden />
            Rate your visit
            {bookingDate && (
              <span className="font-normal text-slate-500">· {bookingDate}</span>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StarPicker
              name="agent-helpfulness"
              label="Agent helpfulness"
              value={agent}
              onChange={setAgent}
            />
            <StarPicker
              name="listing-accuracy"
              label="Listing accuracy"
              value={accuracy}
              onChange={setAccuracy}
            />
          </div>
          <label className="mt-4 block">
            <span className="sr-only">Your comments</span>
            <textarea
              className="min-h-[88px] w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
              placeholder="Optional — what stood out? (max 500 characters)"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="mt-3 min-h-11 rounded-xl bg-[#4161df] px-5 text-sm font-semibold text-white transition hover:bg-[#3452c0] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] disabled:opacity-50"
          >
            {isLoading ? "Submitting…" : "Submit visit feedback"}
          </button>
        </div>
      )}

      {reviews.length > 0 && (
        <ul>
          {reviews.map((r: any, i: number) => (
            <li
              key={r.id}
              className={`py-4 text-sm ${
                i > 0 ? "border-t border-slate-200" : ""
              }`}
            >
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Helpfulness {r.agentHelpfulness}/5
                </span>
                <span aria-hidden>·</span>
                <span className="font-semibold text-slate-700">
                  Accuracy {r.listingAccuracy}/5
                </span>
                <span className="ml-auto">
                  {r.reviewerLabel}
                  {r.createdAt &&
                    ` · ${new Date(r.createdAt).toLocaleDateString("en-IN")}`}
                </span>
              </div>
              {r.comment ? (
                <p className="leading-7 text-slate-700">{r.comment}</p>
              ) : (
                <p className="text-xs text-slate-500">No written comment</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
