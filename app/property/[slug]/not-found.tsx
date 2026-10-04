import type { Metadata } from "next";
import Link from "next/link";
import { FiMapPin, FiSearch } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Property not found | PropertyBulbul",
  description:
    "This property is no longer available. Browse properties for sale and rent in Chandigarh, Mohali and Panchkula on PropertyBulbul.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <span
          aria-hidden
          className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#4161df]/10 text-[#3049b8]"
        >
          <FiMapPin size={24} />
        </span>

        <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          This property is no longer available
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-7 text-slate-700">
          The listing may have been sold, rented out, or removed by the owner.
          There are plenty more homes to look at in and around the Tricity.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#4161df] px-5 text-base font-semibold text-white transition hover:bg-[#3452c0] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
          >
            <FiSearch size={18} aria-hidden />
            Browse properties
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-base font-semibold text-slate-800 ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}