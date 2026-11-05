"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "@/lib/AuthProvider";
import { authPageHref } from "@/lib/authNavigation";
import { DESKTOP_AUTH_PATH, desktopCallbackUrl, parseDesktopAuthRequest } from "@/lib/desktopAuth";
import { auth, functions } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { AuthShell } from "./AuthPage";

const createDesktopAuthCode = httpsCallable<
  { codeChallenge: string; state?: string },
  { code: string } | { approved: true }
>(functions, "createDesktopAuthCode");

export function DesktopAuthPage() {
  return <AuthShell title="Sign in to the Mac app" description="Connect SWECompanion for Mac to your account.">
    <Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading…</p>}>
      <DesktopAuth />
    </Suspense>
  </AuthShell>;
}

function DesktopAuth() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const request = parseDesktopAuthRequest(search);
  const signedOut = request !== null && !loading && !user;
  const loginHref = authPageHref("/login", `${DESKTOP_AUTH_PATH}?${search}`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<{ legacyLink?: string } | null>(null);

  useEffect(() => {
    if (signedOut) router.replace(loginHref);
  }, [signedOut, loginHref, router]);

  const switchAccount = () => signOut().catch(() => setError("Unable to switch accounts. Please try again."));

  /** Always takes this click, so a link alone can never connect an account. */
  async function connect() {
    if (!request || !user || busy) return;
    setBusy(true); setError(null);
    try {
      const { data } = await createDesktopAuthCode({
        codeChallenge: request.codeChallenge,
        ...(request.poll ? { state: request.state } : {}),
      });
      // The account may have changed in another tab while we waited.
      if (auth.currentUser?.uid !== user.uid) return;
      if (request.poll && "approved" in data) setCompletion({});
      else if (!request.poll && "code" in data) setCompletion({ legacyLink: desktopCallbackUrl(data.code, request.state) });
      else setError("Unable to connect the app. Please try again.");
    } catch (error) {
      // The browser's session has ended, as after a password change elsewhere, though
      // its token still looks valid here. Signing out sends the user back to log in.
      const code = (error as { code?: string }).code;
      if (code === "functions/unauthenticated") await switchAccount();
      else if (code === "functions/failed-precondition") setError("Start a new sign-in from the SWECompanion app.");
      else setError("Unable to connect the app. Please try again.");
    } finally { setBusy(false); }
  }

  if (!request) return <p role="alert" className="text-sm text-accent-red">This link isn’t valid. Start signing in from the SWECompanion app.</p>;

  if (completion) return <>
    <p role="status" className="text-sm">{completion.legacyLink
      ? "Open SWECompanion below to finish signing in."
      : "Sign-in confirmed. Return to SWECompanion on your Mac. You can close this tab."}</p>
    {completion.legacyLink
      ? <a className={cn(buttonVariants({ variant: "outline" }), "mt-4 h-11 w-full")} href={completion.legacyLink}>Open SWECompanion</a>
      : <p className="mt-4 text-sm text-muted-foreground">If the app is hidden, use your Hide / Show shortcut (F8 by default).</p>}
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">If the app still shows Sign in, start again from the app.</p>
  </>;

  if (loading || !user) return <p role="status" className="text-sm text-muted-foreground">Loading…</p>;

  return <>
    <p className="break-all text-sm text-muted-foreground">Signed in as {user.email}</p>
    <Button type="button" className="mt-5 h-11 w-full" disabled={busy} onClick={() => void connect()}>{busy ? "Please wait…" : "Confirm sign-in"}</Button>
    <Button type="button" variant="outline" className="mt-3 h-11 w-full" disabled={busy} onClick={() => void switchAccount()}>Use a different account</Button>
    {error && <p role="alert" className="mt-4 text-sm text-accent-red">{error}</p>}
    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Only continue if you just clicked Sign in in the SWECompanion app.</p>
  </>;
}
