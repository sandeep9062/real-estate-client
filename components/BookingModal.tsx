"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import { toast } from "sonner";
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
    <div className="fixed inset-0 bg-black/40 z-1200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Select your visit date</h2>

        <input
          type="date"
          className="w-full border p-2 rounded-lg text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={dayjs().format("YYYY-MM-DD")}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 disabled:opacity-50"
          disabled={!value || isLoading}
          onClick={handleBook}
        >
          Book Visit
        </button>

        <button
          className="w-full border text-gray-600 py-2 rounded-lg mt-2"
          onClick={() => setOpened(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
