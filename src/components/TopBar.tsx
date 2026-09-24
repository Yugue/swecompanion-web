"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AccountMenu } from "./auth/AccountMenu";
import { TrackToggle, type Track } from "./TrackToggle";

export type { Track };

export function TopBar({
  activeTrack,
  onMenuPressed,
}: {
  activeTrack: Track;
  onMenuPressed?: () => void;
}) {
  return (
    <header className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-2.5 border-b border-outline/55 bg-bg/95 px-3 sm:px-6">
      <div className="flex items-center">
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
