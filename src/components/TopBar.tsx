"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
    <header className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-2.5 border-b border-outline/55 bg-bg/95 px-2 sm:px-6">
      <div className="flex items-center">
        {onSidebarToggle && (
          <button type="button" onClick={onSidebarToggle} className="hidden size-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-high lg:flex" aria-label={sidebarCollapsed ? "Expand progress panel" : "Collapse progress panel"} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? "Expand progress panel" : "Collapse progress panel"}>
            {sidebarCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
          </button>
        )}
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
      </div>
      <TrackToggle activeTrack={activeTrack} />
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
