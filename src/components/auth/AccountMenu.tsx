"use client";

import { useState } from "react";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { usePremium } from "@/lib/usePremium";
import { usePathname } from "next/navigation";
import { authPageHref } from "@/lib/authNavigation";
import { cn } from "@/lib/utils";

export function AccountMenu({
  signInLabel = "Sign in",
  signInClassName,
}: {
  signInLabel?: string;
  signInClassName?: string;
}) {
  const { user, loading, signOut } = useAuth();
  const { premium } = usePremium();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div className="size-9" />;

  if (!user) {
    return <Link href={authPageHref("/login", pathname === "/" ? "/account" : pathname)} className={cn(
      "whitespace-nowrap rounded-lg bg-accent-blue px-3 py-2 sm:px-3.5 text-sm font-semibold text-white hover:brightness-110",
      signInClassName,
    )}>{signInLabel}</Link>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-label="Your account"
        className="flex items-center gap-2 rounded-lg border border-outline/75 bg-surface px-2.5 py-1.5 text-sm text-text"
      >
        <CircleUserRound size={20} className={premium ? "text-accent-yellow" : "text-text-muted"} />
        <span className="hidden max-w-32 truncate sm:inline">
          {user.displayName ?? user.email}
        </span>
      </button>
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-outline bg-surface p-2 shadow-lg">
            <div className="px-2 py-1.5 text-sm text-text-muted">{user.email}</div>
            <div className="px-2 pb-1.5 text-xs font-semibold">
              {premium ? (
                <span className="text-accent-yellow">Pro member</span>
              ) : (
                <span className="text-text-muted">Free account</span>
              )}
            </div>
            <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-text hover:bg-surface-high">
              <Settings size={16} /> Account &amp; billing
            </Link>
            {error && <p role="alert" className="px-2 py-1 text-sm text-accent-red">{error}</p>}
            <button
              type="button"
              onClick={() => {
                setError(null);
                void signOut().then(() => setMenuOpen(false)).catch(() => setError("Unable to sign out. Please try again."));
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-surface-high"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
