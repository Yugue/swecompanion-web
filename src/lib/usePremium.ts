"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthProvider";

/** Reads users/{uid}.premium live. `premium` can only ever become true via the Firestore
 * console (or a future billing webhook) - see firestore.rules - never from the client. */
export function usePremium(): { premium: boolean; loading: boolean } {
  const { user } = useAuth();
  const [remotePremium, setRemotePremium] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setRemotePremium(snap.data()?.premium === true);
        setRemoteLoading(false);
      },
      () => {
        setRemotePremium(false);
        setRemoteLoading(false);
      }
    );
  }, [user]);

  if (!user) return { premium: false, loading: false };
  return { premium: remotePremium, loading: remoteLoading };
}
