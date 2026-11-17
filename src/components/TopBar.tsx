"use client";

import Link from "next/link";
import { PanelLeftOpen } from "lucide-react";
import { ProductMark } from "./ProductMark";
import { ThemeToggle } from "./ThemeToggle";
import { AccountMenu } from "./auth/AccountMenu";
import { TrackToggle, type Track } from "./TrackToggle";

export type { Track };

export function TopBar({
  activeTrack,
  onMenuPressed,
  onSidebarToggle,
  sidebarCollapsed = true,
}: {
  activeTrack: Track;
  onMenuPressed?: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}) {
  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-x-1 gap-y-2 border-b border-outline/55 bg-bg/95 px-2 py-3 sm:gap-x-2.5 sm:px-6 lg:h-[72px] lg:grid-cols-[1fr_auto_1fr] lg:py-0">
      <div className="flex items-center gap-1">
        {onSidebarToggle && sidebarCollapsed && (
          <button type="button" onClick={onSidebarToggle} className="hidden size-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-high lg:flex" aria-label="Expand progress panel" aria-expanded={false} title="Expand progress panel">
            <PanelLeftOpen size={22} />
          </button>
        )}
        {onMenuPressed && (
          <button
            type="button"
            onClick={onMenuPressed}
            className="flex size-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-high lg:hidden"
            aria-label="Expand progress panel"
            aria-expanded={false}
            title="Expand progress panel"
          >
            <PanelLeftOpen size={22} />
          </button>
        )}
        <Link
          href="/"
          aria-label="SWE Companion home"
          title="SWE Companion home"
          className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-1 hover:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${sidebarCollapsed ? "" : "lg:hidden"}`}
        >
          <ProductMark size={30} />
          <span className="whitespace-nowrap text-sm font-bold text-text sm:text-[17px]">SWECompanion</span>
        </Link>
      </div>
      <div className="col-span-2 col-start-1 row-start-2 justify-self-center lg:col-span-1 lg:col-start-2 lg:row-start-1">
        <TrackToggle activeTrack={activeTrack} />
      </div>
      <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 sm:gap-2.5 lg:col-start-3">
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
