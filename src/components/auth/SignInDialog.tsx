"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { authErrorMessage } from "@/lib/authErrors";
import { GoogleIcon } from "./BrandIcons";

export function SignInDialog({ onClose, onAuthenticated, initialMode = "signin" }: {
  onClose: () => void;
  onAuthenticated?: () => void;
  initialMode?: "signin" | "signup";
}) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function switchMode(next: typeof mode) {
    setMode(next); setError(null); setNotice(null); setPassword("");
  }

  async function run(action: () => Promise<void>, reset = false) {
    if (busy) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      await action();
      if (reset) setNotice("If an account exists for this email, a password reset link has been sent. Check your inbox.");
      else { onClose(); onAuthenticated?.(); }
    } catch (error) {
      setError(authErrorMessage(error, mode));
    } finally { setBusy(false); }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        if (!busy && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-outline bg-surface p-6 text-text shadow-2xl backdrop:bg-black/50"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h2>
        <button type="button" onClick={onClose} disabled={busy} className="rounded-md p-1 text-text-muted hover:bg-surface-high disabled:opacity-50" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-text-muted">
        {mode === "reset" ? "Enter your email and we’ll send you a reset link." : "Save your progress and manage your Pro membership."}
      </p>
      {mode !== "reset" && <>
        <button type="button" disabled={busy} onClick={() => void run(signInWithGoogle)}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-outline px-4 py-3 text-sm font-medium hover:bg-surface-high disabled:opacity-50">
          <GoogleIcon /> Continue with Google
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
          <div className="h-px flex-1 bg-outline" />or with email<div className="h-px flex-1 bg-outline" />
        </div>
      </>}
      <form noValidate onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim() || (mode !== "reset" && !password)) { setError("Incorrect email or password."); return; }
        if (mode === "signup" && password.length < 8) { setError("Choose a password with at least 8 characters."); return; }
        void run(() => mode === "reset" ? resetPassword(email) : mode === "signin" ? signInWithEmail(email, password) : signUpWithEmail(email, password), mode === "reset");
      }} className="flex flex-col gap-3">
        <label htmlFor={emailId} className="text-sm font-medium">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required disabled={busy} value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-outline bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20" />
        {mode !== "reset" && <>
          <label htmlFor={passwordId} className="mt-1 text-sm font-medium">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required disabled={busy} value={password} onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-outline bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20" />
          {mode === "signup" && <p className="text-xs text-text-muted">Use at least 8 characters.</p>}
        </>}
        {error && <p role="alert" className="text-sm text-accent-red">{error}</p>}
        {notice && <p role="status" className="text-sm text-accent-green">{notice}</p>}
        <button type="submit" disabled={busy} className="mt-2 rounded-lg bg-accent-blue px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
      {mode === "signin" && <button type="button" disabled={busy} onClick={() => switchMode("reset")} className="mt-4 w-full text-center text-sm text-accent-blue hover:underline">Forgot password?</button>}
      <button type="button" disabled={busy} onClick={() => switchMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-sm text-accent-blue hover:underline">
        {mode === "signin" ? "New here? Create an account" : "Back to sign in"}
      </button>
    </dialog>
  );
}
