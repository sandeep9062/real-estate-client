"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { LayoutDashboard } from "lucide-react";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

export function canAccessUserDashboard(role: string | undefined) {
  // Any authenticated user (buyer, student, landlord, agent, admin) can access
  return true;
}

export default function UserDashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <LayoutDashboard className="h-12 w-12 text-[#4161df]" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          User dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to view your dashboard, favourite properties, and booking history.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-lg bg-[#4161df] px-6 py-3 text-base font-medium text-white transition hover:bg-[#3759dd] active:bg-[#314cbf]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!canAccessUserDashboard(user.role)) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <LayoutDashboard className="h-12 w-12 text-gray-400" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          User dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered users. If you should have access, contact
          support.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50 active:bg-gray-100"
        >
          Back to home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
