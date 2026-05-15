"use client";

import { FaFacebook, FaInstagram, FaLinkedin, FaCheckCircle } from "react-icons/fa";

export type AgentDashboardUserForSocial = {
  _id: string;
  socialLinks?: {
    linkedin?: { connected?: boolean };
    facebook?: { connected?: boolean };
  };
};

const SocialConnect = ({ user }: { user: AgentDashboardUserForSocial }) => {
  const socialOrigin =
    (process.env.NEXT_PUBLIC_SOCIAL_API_URL &&
      String(process.env.NEXT_PUBLIC_SOCIAL_API_URL).replace(/\/$/, "")) ||
    "https://social-api.propertybulbul.com";
  const API_BASE = `${socialOrigin}/api/social`;

  const handleConnect = (platform: "linkedin" | "facebook") => {
    window.location.href = `${API_BASE}/auth/${platform}?userId=${user._id}`;
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">
        Marketing automation
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-lg border p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <FaLinkedin className="mt-0.5 shrink-0 text-3xl text-blue-700 sm:mt-0" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">LinkedIn professional</p>
              <p className="text-sm text-pretty text-gray-500">
                Post properties to your professional network
              </p>
            </div>
          </div>
          {user.socialLinks?.linkedin?.connected ? (
            <span className="flex items-center gap-2 font-medium text-green-600 sm:shrink-0">
              <FaCheckCircle /> Connected
            </span>
          ) : (
            <button
              type="button"
              onClick={() => handleConnect("linkedin")}
              className="touch-manipulation min-h-[44px] w-full rounded-md bg-blue-700 px-4 py-3 text-center text-base font-medium text-white transition hover:bg-blue-800 active:bg-blue-900 sm:w-auto sm:self-center sm:py-2.5 sm:text-sm sm:min-h-0"
            >
              Connect now
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div className="mt-0.5 flex shrink-0 gap-2 sm:mt-0">
              <FaFacebook className="text-3xl text-blue-600" />
              <FaInstagram className="text-3xl text-pink-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">Meta business suite</p>
              <p className="text-sm text-pretty text-gray-500">
                Auto-post to Facebook pages and Instagram feed
              </p>
            </div>
          </div>
          {user.socialLinks?.facebook?.connected ? (
            <span className="flex items-center gap-2 font-medium text-green-600 sm:shrink-0">
              <FaCheckCircle /> Connected
            </span>
          ) : (
            <button
              type="button"
              onClick={() => handleConnect("facebook")}
              className="touch-manipulation min-h-[44px] w-full rounded-md bg-blue-600 px-4 py-3 text-center text-base font-medium text-white transition hover:bg-blue-700 active:bg-blue-800 sm:w-auto sm:self-center sm:py-2.5 sm:text-sm sm:min-h-0"
            >
              Connect now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialConnect;
