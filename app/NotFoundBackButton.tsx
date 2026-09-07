"use client";

import { ArrowLeft } from "lucide-react";

export default function NotFoundBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium text-xs"
    >
      <ArrowLeft size={14} />
      Go Back
    </button>
  );
}
