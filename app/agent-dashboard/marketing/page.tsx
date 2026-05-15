"use client";

import { PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";

import SocialConnect from "@/components/agent-dashboard/SocialConnect";
import { useAgentDashboardSocialUser } from "@/components/agent-dashboard/useAgentDashboardSocialUser";
import { selectUser } from "@/store/authSlice";
import { useGetUserByIdQuery } from "@/services/userApi";

export default function AgentDashboardMarketingPage() {
  const user = useSelector(selectUser);
  const { data: freshUser, isFetching } = useGetUserByIdQuery(
    user?._id as string,
    { skip: !user?._id },
  );

  const dashboardUser = useAgentDashboardSocialUser(user, freshUser);

  if (isFetching || !dashboardUser) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PuffLoader size={56} color="#4161df" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl min-w-0">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#4161df] sm:text-sm">
          Marketing
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Social connections
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-gray-600 sm:text-base">
          Link professional and Meta accounts so listings can reach buyers where
          they already spend time. Connection status updates when your backend
          stores tokens against this user.
        </p>
      </header>

      <SocialConnect user={dashboardUser} />
    </div>
  );
}
