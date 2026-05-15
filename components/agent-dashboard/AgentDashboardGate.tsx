"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { LayoutDashboard } from "lucide-react";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { useGetUserByIdQuery } from "@/services/userApi";

export function canAccessAgentDashboard(role: string | undefined) {
  return role === "agent" || role === "admin";
}

export default function AgentDashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const { isFetching } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id || !canAccessAgentDashboard(user.role),
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <LayoutDashboard className="h-12 w-12 text-[#4161df]" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Agent dashboard
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to connect social accounts and manage your agent tools.
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

  if (!canAccessAgentDashboard(user.role)) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <LayoutDashboard className="h-12 w-12 text-gray-400" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Agent dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered agents and administrators. If you should
          have access, contact support.
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

  if (isFetching) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center px-4 pt-[calc(6rem+env(safe-area-inset-top))] sm:pt-24">
        <PuffLoader size={80} color="#4161df" aria-label="Loading dashboard" />
      </div>
    );
  }

  return <>{children}</>;
}
