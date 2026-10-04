"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import { toast } from "@/hooks/use-toast";
import { useBookVisitMutation } from "@/services/userApi";

type Props = {
  opened: boolean;
  setOpened: (v: boolean) => void;
  email: string;
  propertyId: string;
};

export default function BookingModal({
  opened,
  setOpened,
  email,
  propertyId,
}: Props) {
  const [value, setValue] = useState<string>("");
  const user = useSelector(selectUser);
  const [bookVisit, { isLoading }] = useBookVisitMutation();

  const handleBook = async () => {
    try {
      const formattedDate = dayjs(value).format("DD/MM/YYYY");
      await bookVisit({ propertyId, date: formattedDate }).unwrap();
      toast.success("You have booked your visit");
      setOpened(false);
    } catch (err: any) {
      toast.error("Failed to book your visit");
    }
  };

  if (!opened) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
    >
      {/* Backdrop click closes; Esc is handled below. */}
      <button
        type="button"
        aria-label="Close booking dialog"
        tabIndex={-1}
        onClick={() => setOpened(false)}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2
          id="booking-modal-title"
          className="font-heading text-lg font-bold text-slate-900"
        >
          Select your visit date
        </h2>

        <label className="mt-4 block">
          <span className="sr-only">Visit date</span>
          <input
            type="date"
            className="min-h-11 w-full rounded-xl border border-slate-300 p-2.5 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min={dayjs().format("YYYY-MM-DD")}
          />
        </label>

        <button
          type="button"
          className="mt-4 min-h-11 w-full rounded-xl bg-[#4161df] text-base font-semibold text-white transition hover:bg-[#3452c0] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] disabled:opacity-50"
          disabled={!value || isLoading}
          onClick={handleBook}
        >
          {isLoading ? "Booking…" : "Book visit"}
        </button>

        <button
          type="button"
          className="mt-2 min-h-11 w-full rounded-xl text-base font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
          onClick={() => setOpened(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
