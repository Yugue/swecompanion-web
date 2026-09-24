"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { DEFAULT_ML_DOMAIN_PATH, ML_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { CODING_PATH } from "@/lib/codingPaths";

export type Track = "leetcode" | "ml" | "mlsd";

// `shortLabel` replaces `label` below the sm breakpoint so the bar fits a phone.
const TRACKS: { id: Track; label: string; shortLabel?: string; href: string }[] = [
  { id: "leetcode", label: "LeetCode", href: CODING_PATH },
  { id: "ml", label: "ML", href: DEFAULT_ML_DOMAIN_PATH },
  { id: "mlsd", label: "ML System Design", shortLabel: "ML SD", href: ML_SYSTEM_DESIGN_PATH },
];

// Every page renders its own top bar, so switching tracks unmounts this toggle mid-slide. The
// outgoing toggle saves where its thumb is, and the incoming one continues the slide from there.
const THUMB_KEY = "track-toggle-thumb";

function placeThumb(thumb: HTMLElement | null, x: number, width: number, animate: boolean) {
  if (!thumb) return;
  thumb.style.transition = animate ? "" : "none";
  thumb.style.transform = `translateX(${x}px)`;
  thumb.style.width = `${width}px`;
  thumb.style.opacity = "1";
}

function placeOnTab(thumb: HTMLElement | null, tab: HTMLElement | null | undefined, animate: boolean) {
  if (tab) placeThumb(thumb, tab.offsetLeft, tab.offsetWidth, animate);
}

/**
 * A segmented control: a recessed track with a raised thumb that slides under the selected tab.
 * The thumb is positioned imperatively (it follows measured tab sizes, which change at the sm
 * breakpoint), so moving it never re-renders the tabs.
 */
export function TrackToggle({ activeTrack }: { activeTrack: Track }) {
  const [selected, setSelected] = useState(activeTrack);
  const selectedRef = useRef(activeTrack);
  const navRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Partial<Record<Track, HTMLAnchorElement | null>>>({});

  const moveThumbTo = (track: Track, animate: boolean) =>
    placeOnTab(thumbRef.current, tabRefs.current[track], animate);

  useLayoutEffect(() => {
    let from: { x: number; width: number } | null = null;
    try {
      from = JSON.parse(sessionStorage.getItem(THUMB_KEY) ?? "null");
      // Consumed once, so a reload doesn't replay a slide from an earlier page.
      sessionStorage.removeItem(THUMB_KEY);
    } catch {}

    const thumb = thumbRef.current;
    const tabs = tabRefs.current;
    if (from) {
      placeThumb(thumb, from.x, from.width, false);
      thumb?.getBoundingClientRect(); // commit the start position before sliding
    }
    placeOnTab(thumb, tabs[activeTrack], Boolean(from));

    const observer = new ResizeObserver(() => placeOnTab(thumb, tabs[selectedRef.current], false));
    if (navRef.current) observer.observe(navRef.current);

    return () => {
      observer.disconnect();
      if (!thumb) return;
      // The computed transform is the thumb's on-screen position, even partway through a slide.
      const style = getComputedStyle(thumb);
      const x = new DOMMatrixReadOnly(style.transform).m41;
      try {
        sessionStorage.setItem(THUMB_KEY, JSON.stringify({ x, width: parseFloat(style.width) }));
      } catch {}
    };
  }, [activeTrack]);

  const select = (track: Track) => {
    selectedRef.current = track;
    setSelected(track);
    moveThumbTo(track, true);
  };

  return (
    <nav
      ref={navRef}
      className="relative flex items-center rounded-[10px] bg-surface-high p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.08)]"
    >
      <span
        ref={thumbRef}
        aria-hidden
        className="absolute top-1 bottom-1 left-0 rounded-[7px] bg-thumb opacity-0 shadow-[0_1px_3px_rgb(0_0_0/0.14),0_1px_1px_rgb(0_0_0/0.06)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.3,1.3,0.5,1)] motion-reduce:transition-none"
      />
      {TRACKS.map((track, i) => (
        <Fragment key={track.id}>
          {/* A divider between two unselected tabs; next to the thumb it would only add noise. */}
          {i > 0 && (
            <span
              aria-hidden
              className={`h-4 w-px bg-outline transition-opacity duration-200 ${
                selected === track.id || selected === TRACKS[i - 1].id ? "opacity-0" : ""
              }`}
            />
          )}
          <Link
            ref={(el) => {
              tabRefs.current[track.id] = el;
            }}
            href={track.href}
            onClick={() => select(track.id)}
            aria-current={selected === track.id ? "page" : undefined}
            className={`relative z-10 whitespace-nowrap rounded-[7px] px-2.5 py-1.5 text-[13px] font-bold transition-colors duration-200 sm:px-3.5 ${
              selected === track.id ? "text-accent-blue" : "text-text-muted hover:text-text"
            }`}
          >
            {track.shortLabel ? (
              <>
                <span className="sm:hidden">{track.shortLabel}</span>
                <span className="hidden sm:inline">{track.label}</span>
              </>
            ) : (
              track.label
            )}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
