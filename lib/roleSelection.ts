/**
 * Shared role-selection ("What brings you to PropertyBulbul?") helpers.
 *
 * The skip flag lets a "Just browsing" user defer role selection without it
 * nagging them on every login. It is intentionally localStorage-only (per
 * device/browser), matching the spec — no schema change on the User model.
 */

export const SKIP_ROLE_SELECTION_KEY = "pb_skipped_role_selection";

export function setSkippedRoleSelection() {
  try {
    localStorage.setItem(SKIP_ROLE_SELECTION_KEY, "true");
  } catch {
    // ignore storage errors (private mode / full storage)
  }
}

export function hasSkippedRoleSelection(): boolean {
  try {
    return localStorage.getItem(SKIP_ROLE_SELECTION_KEY) === "true";
  } catch {
    return false;
  }
}