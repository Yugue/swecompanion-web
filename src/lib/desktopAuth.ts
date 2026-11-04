/**
 * Hands a website login over to the Mac app. The app opens the login page with
 * this page as its destination, and this page sends the app a one-time code
 * (see `functions/src/desktopAuth.ts` in SWECompanionCore).
 */
export const DESKTOP_AUTH_PATH = "/desktop-auth";

/** Fixed here and never read from the URL, so no link can send a code anywhere else. */
const APP_CALLBACK_URL = "com.swecompanion.app:/auth/callback";

const VALUE_32_BYTES = /^[A-Za-z0-9_-]{43}$/;

export interface DesktopAuthRequest {
  /** Lets the app tell its own sign-in from a forged one. Passed back untouched. */
  state: string;
  /** Fingerprint of a secret only the app holds. The code is tied to it. */
  codeChallenge: string;
}

export function parseDesktopAuthRequest(search: Pick<URLSearchParams, "get" | "getAll">): DesktopAuthRequest | null {
  if (search.getAll("state").length !== 1 || search.getAll("code_challenge").length !== 1) return null;
  const state = search.get("state");
  const codeChallenge = search.get("code_challenge");
  return state && codeChallenge && VALUE_32_BYTES.test(state) && VALUE_32_BYTES.test(codeChallenge)
    ? { state, codeChallenge }
    : null;
}

export function desktopCallbackUrl(code: string, state: string): string {
  return `${APP_CALLBACK_URL}?${new URLSearchParams({ code, state })}`;
}

export function isDesktopAuthPath(path: string): boolean {
  return new URL(path, "https://swecompanion.invalid").pathname === DESKTOP_AUTH_PATH;
}
