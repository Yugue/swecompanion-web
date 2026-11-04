export type AuthPagePath = "/login" | "/signup" | "/forgot-password";

/** Return only to local pages, never a URL supplied by another site. */
export function safeAuthReturnPath(value: string | null | undefined): string {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/account";
  try {
    const base = "https://swecompanion.invalid";
    const url = new URL(value, base);
    const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "");
    if (url.origin !== base || pathname.startsWith("//") || pathname.includes("\\") ||
      ["/login", "/signup", "/forgot-password"].includes(pathname)) return "/account";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return "/account"; }
}

export function authPageHref(page: AuthPagePath, returnTo?: string | null): string {
  const next = safeAuthReturnPath(returnTo);
  return next === "/account" ? page : `${page}?${new URLSearchParams({ next })}`;
}
