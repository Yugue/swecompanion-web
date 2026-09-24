"use client";

import { useState } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { usePremium } from "@/lib/usePremium";
import { SignInDialog } from "./SignInDialog";

export function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const { premium } = usePremium();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div className="size-9" />;

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="whitespace-nowrap rounded-lg bg-accent-blue px-3 py-2 sm:px-3.5 text-sm font-semibold text-white hover:brightness-110"
        >
          Sign in
        </button>
        {dialogOpen && <SignInDialog onClose={() => setDialogOpen(false)} />}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
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
                <span className="text-accent-yellow">Premium member</span>
              ) : (
                <span className="text-text-muted">Free account</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                void signOut();
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
