"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type User, onIdTokenChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential,
  updatePassword, signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

interface AuthContextValue {
  user: User | null;
  subscribed: boolean;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshClaims: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function refreshCurrentClaims() { await auth.currentUser?.getIdToken(true); }

async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    // A webhook may create the subscription summary before the first browser visit.
    const profile = { email: user.email, displayName: user.displayName };
    transaction.set(ref, snapshot.data()?.createdAt ? profile : { ...profile, createdAt: serverTimestamp() }, { merge: true });
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ user: User | null; subscribed: boolean; loading: boolean }>({
    user: null, subscribed: false, loading: true,
  });

  useEffect(() => {
    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        if (active) setSession({ user: null, subscribed: false, loading: false });
        return;
      }
      try {
        const token = await user.getIdTokenResult();
        if (active && auth.currentUser?.uid === user.uid) {
          setSession({ user, subscribed: token.claims.subscribed === true, loading: false });
        }
      } catch {
        if (active && auth.currentUser?.uid === user.uid) setSession({ user, subscribed: false, loading: false });
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const uid = session.user?.uid;
  useEffect(() => {
    if (!uid) return;
    const user = auth.currentUser;
    if (!user || user.uid !== uid) return;
    void ensureUserProfile(user).catch(() => {});
    const unsubscribe = onSnapshot(doc(db, "users", uid), (snapshot) => {
      const version: unknown = snapshot.data()?.subscription?.claimsVersion;
      if (typeof version !== "string") return;
      void user.getIdTokenResult().then((token) => {
        if (auth.currentUser?.uid === uid && token.claims.billingVersion !== version) return user.getIdToken(true);
      }).catch(() => {});
    }, () => {});
    const refreshOnFocus = () => {
      if (auth.currentUser?.uid === uid) void user.getIdToken(true).catch(() => {});
    };
    window.addEventListener("focus", refreshOnFocus);
    return () => { unsubscribe(); window.removeEventListener("focus", refreshOnFocus); };
  }, [uid]);

  const value: AuthContextValue = {
    ...session,
    signUpWithEmail: async (email, password) => { await createUserWithEmailAndPassword(auth, email.trim(), password); },
    signInWithEmail: async (email, password) => { await signInWithEmailAndPassword(auth, email.trim(), password); },
    signInWithGoogle: async () => { await signInWithPopup(auth, googleProvider); },
    resetPassword: async (email) => {
      try { await sendPasswordResetEmail(auth, email.trim()); }
      catch (error) {
        if ((error as { code?: string }).code !== "auth/user-not-found") throw error;
      }
    },
    changePassword: async (currentPassword, newPassword) => {
      const user = auth.currentUser;
      if (!user?.email) throw new Error("Authentication required");
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
      await updatePassword(user, newPassword);
    },
    refreshClaims: refreshCurrentClaims,
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
