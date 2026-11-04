"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "@/lib/AuthProvider";
import { authPageHref } from "@/lib/authNavigation";
import { DESKTOP_AUTH_PATH, desktopCallbackUrl, parseDesktopAuthRequest } from "@/lib/desktopAuth";
import { functions } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { AuthShell } from "./AuthPage";

const createDesktopAuthCode = httpsCallable<{ codeChallenge: string }, { code: string }>(functions, "createDesktopAuthCode");

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
  const [failed, setFailed] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (signedOut) router.replace(loginHref);
  }, [signedOut, loginHref, router]);

  /** Always takes this click, so a link alone can never connect an account. */
  async function connect() {
    if (!request) return;
    setBusy(true); setFailed(false);
    try {
      const { data } = await createDesktopAuthCode({ codeChallenge: request.codeChallenge });
      const url = desktopCallbackUrl(data.code, request.state);
      setCallbackUrl(url);
      window.location.assign(url);
    } catch { setFailed(true); }
    finally { setBusy(false); }
  }

  if (!request) return <p role="alert" className="text-sm text-accent-red">This link isn’t valid. Start signing in from the SWECompanion app.</p>;

  if (callbackUrl) return <>
    <p role="status" className="text-sm">Return to SWECompanion to finish signing in. You can close this tab once it shows your account.</p>
    <p className="mt-4 text-sm text-muted-foreground">Didn’t switch to the app?</p>
    <Button variant="outline" className="mt-2 h-11 w-full" render={<a href={callbackUrl}>Open SWECompanion</a>} />
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">If the app still shows Sign in, click it there to start again.</p>
  </>;

  if (loading || !user) return <p role="status" className="text-sm text-muted-foreground">Loading…</p>;

  return <>
    <p className="break-all text-sm text-muted-foreground">Signed in as {user.email}</p>
    <Button type="button" className="mt-5 h-11 w-full" disabled={busy} onClick={() => void connect()}>{busy ? "Please wait…" : "Continue to the app"}</Button>
    <Button type="button" variant="outline" className="mt-3 h-11 w-full" disabled={busy} onClick={() => void signOut()}>Use a different account</Button>
    {failed && <p role="alert" className="mt-4 text-sm text-accent-red">Unable to connect the app. Please try again.</p>}
    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Only continue if you just clicked Sign in in the SWECompanion app.</p>
  </>;
}
