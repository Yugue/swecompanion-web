"use client";

import { useAuth } from "./AuthProvider";

/** Access is derived only from the signed, server-managed token claim. */
export function usePremium(): { premium: boolean; loading: boolean } {
  const { subscribed, loading } = useAuth();
  return { premium: subscribed, loading };
}
