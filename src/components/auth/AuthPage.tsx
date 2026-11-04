"use client";

import { Suspense, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { authErrorMessage } from "@/lib/authErrors";
import { authPageHref, safeAuthReturnPath } from "@/lib/authNavigation";
import { isDesktopAuthPath } from "@/lib/desktopAuth";
import { Wordmark } from "@/components/site/wordmark";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./BrandIcons";

type Mode = "signin" | "signup" | "reset";

export function AuthPage({ mode }: { mode: Mode }) {
  const title = mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";
  const description = mode === "reset" ? "Enter your email and we’ll send you a reset link." : "Save your progress and manage your Pro membership.";
  return <AuthShell title={title} description={description}>
    <Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading…</p>}>
      <AuthForm key={mode} mode={mode} />
    </Suspense>
  </AuthShell>;
}

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <>
    <header className="border-b border-border">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="SWECompanion home"><Wordmark /></Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to home</Link>
      </div>
    </header>
    <main className="mx-auto w-full max-w-md px-5 py-12 sm:py-20">
      <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-7">{children}</div>
    </main>
  </>;
}

function AuthForm({ mode }: { mode: Mode }) {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = safeAuthReturnPath(search.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signingIn = useRef(false);
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    if (!loading && user && mode !== "reset") router.replace(signingIn.current || isDesktopAuthPath(next) ? next : "/");
  }, [loading, user, mode, next, router]);

  async function run(action: () => Promise<void>) {
    if (busy || loading) return;
    setBusy(true); setError(null); setNotice(null);
    signingIn.current = mode !== "reset";
    try {
      await action();
      if (mode === "reset") setNotice("If an account exists for this email, a password reset link has been sent. Check your inbox.");
    } catch (error) { signingIn.current = false; setError(authErrorMessage(error, mode)); }
    finally { setBusy(false); }
  }

  if (loading || (user && mode !== "reset")) return <p role="status" className="text-sm text-muted-foreground">{loading ? "Loading…" : "Taking you back…"}</p>;

  return <>
    {mode !== "reset" && <>
      <Button type="button" variant="outline" className="h-11 w-full gap-2.5" disabled={busy} onClick={() => void run(signInWithGoogle)}><GoogleIcon />Continue with Google</Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or with email<div className="h-px flex-1 bg-border" /></div>
    </>}
    <form noValidate className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      if (!email.trim() || (mode !== "reset" && !password)) { setError("Incorrect email or password."); return; }
      if (mode === "signup" && password.length < 8) { setError("Choose a password with at least 8 characters."); return; }
      void run(() => mode === "reset" ? resetPassword(email) : mode === "signin" ? signInWithEmail(email, password) : signUpWithEmail(email, password));
    }}>
      <div>
        <label htmlFor={emailId} className="mb-2 block text-sm font-medium">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required disabled={busy} value={email} onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
      </div>
      {mode !== "reset" && <div>
        <label htmlFor={passwordId} className="mb-2 block text-sm font-medium">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required disabled={busy} value={password} onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
        {mode === "signup" && <p className="mt-2 text-xs text-muted-foreground">Use at least 8 characters.</p>}
      </div>}
      {error && <p role="alert" className="text-sm text-accent-red">{error}</p>}
      {notice && <p role="status" className="text-sm text-accent-green">{notice}</p>}
      <Button type="submit" className="h-11 w-full" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</Button>
    </form>
    <div className="mt-5 space-y-4 text-center text-sm">
      {mode === "signin" && <p><Link href={authPageHref("/forgot-password", next)} className="text-brand-blue hover:underline">Forgot password?</Link></p>}
      <p><Link href={authPageHref(mode === "signin" ? "/signup" : "/login", next)} className="text-brand-blue hover:underline">{mode === "signin" ? "New here? Create an account" : "Back to sign in"}</Link></p>
    </div>
  </>;
}
