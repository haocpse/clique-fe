/**
 * Shared profile utility helpers.
 * Used across Discover, MyProfile, and other profile-related pages.
 */

/** Capitalize first letter, lowercase rest */
export const formatLabel = (val?: string): string =>
  val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "—";

/** Calculate age from birthday string */
export const calcAge = (birthday: string): number | null => {
  try {
    const bd = new Date(birthday);
    const now = new Date();
    let age = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
    return age;
  } catch {
    return null;
  }
};

/** Format datetime string to vi-VN locale */
export const formatDateTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Map schedule status code → display label */
export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    AUTO: "Auto",
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };
  return map[status] || status;
};

/** Build display name from profile */
export const getDisplayName = (
  profile: { displayName?: string; firstName?: string; lastName?: string } | null | undefined,
  email?: string,
): string => {
  if (!profile) return "Unknown";
  return (
    profile.displayName ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    email ||
    "Unknown"
  );
};

/** Get initial letter for avatar placeholder */
export const getInitial = (
  profile: { firstName?: string } | null | undefined,
  email?: string,
): string =>
  profile?.firstName?.charAt(0)?.toUpperCase() ||
  email?.charAt(0)?.toUpperCase() ||
  "?";
