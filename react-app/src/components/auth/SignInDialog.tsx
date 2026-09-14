"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Incorrect email or password.";
  }
  if (code.includes("email-already-in-use")) return "That email already has an account - try signing in instead.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "";
  return "Something went wrong. Please try again.";
}

export function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      onClose();
    } catch (err) {
      const message = friendlyError(err);
      if (message) setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-outline bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">
            {mode === "signin" ? "Sign in" : "Create your free account"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-text-muted">
          Save your progress across devices, and unlock mock-interview quizzes once you go
          premium.
        </p>

        <div className="mb-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => run(signInWithGoogle)}
            className="rounded-lg border border-outline bg-surface-high px-4 py-2.5 text-sm font-semibold text-text hover:brightness-110 disabled:opacity-50"
          >
            Continue with Google
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(signInWithGithub)}
            className="rounded-lg border border-outline bg-surface-high px-4 py-2.5 text-sm font-semibold text-text hover:brightness-110 disabled:opacity-50"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
          <div className="h-px flex-1 bg-outline" />
          or
          <div className="h-px flex-1 bg-outline" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(() => (mode === "signin" ? signInWithEmail(email, password) : signUpWithEmail(email, password)));
          }}
          className="flex flex-col gap-2.5"
        >
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-outline bg-surface-high px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent-blue"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-outline bg-surface-high px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent-blue"
          />
          {error && <p className="text-sm text-accent-red">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-accent-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-accent-blue hover:underline"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
