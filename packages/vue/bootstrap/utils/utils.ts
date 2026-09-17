import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_AUTH_REDIRECT = "/dashboard";

/**
 * Validates a redirect target to protect against open-redirect phishing attacks.
 * Rejects external URLs (`https://evil.com`), protocol-relative URLs (`//evil.com`),
 * and backslash bypasses (`/\evil.com`), returning the safe fallback.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
): string {
  const candidate = value?.trim();
  if (!candidate) return fallback;
  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  )
    return fallback;

  try {
    const url = new URL(candidate, "https://uipkge.local");
    if (url.origin !== "https://uipkge.local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
