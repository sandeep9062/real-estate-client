"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const defaultSocialApi = "https://social-api.propertybulbul.com";

function socialApiBase() {
  const raw = process.env.NEXT_PUBLIC_SOCIAL_API_URL;
  if (!raw) return defaultSocialApi;
  return String(raw).replace(/\/$/, "");
}

/** Where users land after OAuth exchange (marketing holds SocialConnect). */
export const AGENT_OAUTH_AFTER_PATH = "/agent-dashboard/marketing";

function OAuthBridgeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const socialComplete = searchParams.get("social_complete");
    const socialError = searchParams.get("social_error");

    if (socialError) {
      toast.error("Social connection failed. Please try again.");
      router.replace(AGENT_OAUTH_AFTER_PATH);
      return;
    }

    if (!socialComplete) return;

    let cancelled = false;

    (async () => {
      try {
        const base = socialApiBase();
        const res = await fetch(
          `${base}/api/social/oauth/result?code=${encodeURIComponent(socialComplete)}`,
        );
        const json = await res.json();
        if (cancelled) return;
        if (!json.success) {
          toast.error(json.error || "Could not complete social linking.");
          router.replace(AGENT_OAUTH_AFTER_PATH);
          return;
        }
        const label =
          json.provider === "linkedin"
            ? "LinkedIn"
            : json.provider === "facebook"
              ? "Meta"
              : json.provider;
        toast.success(
          `${label} connected. Save tokens via your API when ready.`,
        );
      } catch {
        if (!cancelled) {
          toast.error("Could not complete social linking.");
        }
      } finally {
        if (!cancelled) {
          router.replace(AGENT_OAUTH_AFTER_PATH);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  return null;
}

export default function AgentDashboardOAuthBridge() {
  return (
    <Suspense fallback={null}>
      <OAuthBridgeInner />
    </Suspense>
  );
}
