"use client";

import { ArrowLeft } from "lucide-react";

export default function NotFoundBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4161df] transition-colors font-medium"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  );
}
