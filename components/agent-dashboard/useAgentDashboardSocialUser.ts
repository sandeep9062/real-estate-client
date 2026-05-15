"use client";

import { useMemo } from "react";
import type { User } from "@/services/userApi";
import type { AgentDashboardUserForSocial } from "./SocialConnect";

type UserMaybeSocial = User & {
  socialLinks?: AgentDashboardUserForSocial["socialLinks"];
};

type ReduxAgentUser = {
  _id?: string;
  socialLinks?: AgentDashboardUserForSocial["socialLinks"];
};

/** Builds `{ _id, socialLinks }` from Redux user + optional GET /users/:id payload. */
export function useAgentDashboardSocialUser(
  reduxUser: ReduxAgentUser | null,
  freshUser: User | undefined,
): AgentDashboardUserForSocial | null {
  return useMemo(() => {
    const base = freshUser ?? reduxUser;
    if (!base?._id) return null;
    const fu = freshUser as UserMaybeSocial | undefined;
    const socialLinks =
      fu?.socialLinks ?? reduxUser?.socialLinks;
    return {
      _id: String(base._id),
      socialLinks,
    };
  }, [freshUser, reduxUser]);
}
