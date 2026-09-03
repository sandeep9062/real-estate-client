"use client";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Share2 } from "lucide-react";

export type AgentDashboardUserForSocial = {
  _id: string;
  socialLinks?: {
    linkedin?: { connected?: boolean };
    facebook?: { connected?: boolean };
  };
};

const ConnectedPill = () => (
  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
    Connected
  </span>
);

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
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
          <Share2 className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Marketing automation
          </h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            Connect accounts to auto-post your listings
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {/* LinkedIn */}
        <div className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0a66c2]/10">
              <FaLinkedin className="text-2xl text-[#0a66c2]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">
                LinkedIn professional
              </p>
              <p className="text-sm text-pretty text-gray-500">
                Post properties to your professional network
              </p>
            </div>
          </div>
          {user.socialLinks?.linkedin?.connected ? (
            <ConnectedPill />
          ) : (
            <button
              type="button"
              onClick={() => handleConnect("linkedin")}
              className="touch-manipulation min-h-[44px] w-full rounded-lg bg-[#0a66c2] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#084d94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:ring-offset-2 active:bg-[#073d78] sm:w-auto sm:min-h-0"
            >
              Connect now
            </button>
          )}
        </div>

        {/* Meta (Facebook + Instagram) */}
        <div className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0866ff]/10">
              <span className="flex gap-1.5">
                <FaFacebook className="text-xl text-[#0866ff]" aria-hidden />
                <FaInstagram className="text-xl text-[#e1306c]" aria-hidden />
              </span>
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">Meta business suite</p>
              <p className="text-sm text-pretty text-gray-500">
                Auto-post to Facebook pages and Instagram feed
              </p>
            </div>
          </div>
          {user.socialLinks?.facebook?.connected ? (
            <ConnectedPill />
          ) : (
            <button
              type="button"
              onClick={() => handleConnect("facebook")}
              className="touch-manipulation min-h-[44px] w-full rounded-lg bg-[#0866ff] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#0653cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866ff] focus-visible:ring-offset-2 active:bg-[#0546ad] sm:w-auto sm:min-h-0"
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
