"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AccountMenu } from "./auth/AccountMenu";
import { ProductMark } from "./ProductMark";
import { DEFAULT_ML_DOMAIN_PATH } from "@/lib/mlDomains";
import { CODING_PATH } from "@/lib/codingPaths";

export function TopBar({
  activeTrack,
  onMenuPressed,
}: {
  activeTrack: "leetcode" | "ml";
  onMenuPressed?: () => void;
}) {
  return (
    <header className="flex h-[72px] items-center gap-2.5 border-b border-outline/55 bg-bg/95 px-4 sm:px-6">
      {onMenuPressed && (
        <button
          type="button"
          onClick={onMenuPressed}
          className="flex size-9 items-center justify-center text-text-muted lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      )}
      <Link href={CODING_PATH} className="flex items-center gap-2.5">
        <ProductMark size={28} />
        <span className="hidden text-[15px] font-semibold tracking-tight text-text md:inline">
          Interview study workspace
        </span>
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-1 rounded-lg border border-outline/75 bg-surface p-0.5">
        <Link
          href={CODING_PATH}
          className={`rounded-md px-3 py-1.5 text-[13px] font-bold ${
            activeTrack === "leetcode" ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted"
          }`}
        >
          LeetCode
        </Link>
        <Link
          href={DEFAULT_ML_DOMAIN_PATH}
          className={`rounded-md px-3 py-1.5 text-[13px] font-bold ${
            activeTrack === "ml" ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted"
          }`}
        >
          ML
        </Link>
      </div>
      <ThemeToggle />
      <AccountMenu />
    </header>
  );
}
