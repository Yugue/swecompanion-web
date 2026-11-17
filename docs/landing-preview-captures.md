# Landing-page walkthrough

The hero is an interactive walkthrough that starts in step-by-step mode. Optional
autoplay loops through Solve → Debug → Improve → System Design → ML System Design. Category tabs above the stage let
visitors restart Coding, System Design, or ML System Design. These are prepared
examples, not live generation or timing claims.

## Editable companion window

`src/components/site/companion-preview.tsx` renders the Core-style status bar,
shortcut hints, answer sections, syntax-highlighted Python, code diffs, complexity,
and architecture diagrams as React elements. Its styles live in
`companion-preview.module.css`. There are no screenshot images in the stage and
no dependency on `public/previews/manifest.json`. The older capture script and
assets remain available as historical visual references; regenerating captures
is not required to update the hero.

Coding uses Trapping Rain Water (LeetCode 42) throughout. Solve shows the complete
two-pointer solution; Debug shows two removed/added lines (accumulate the water
and preserve the right maximum); Improve replaces the original scan-based
function with the complete two-pointer solution. Red means removed and amber
means added. Time improves from O(n²) to O(n); extra space from O(n) to O(1).

System Design covers Ticketmaster: a signed waiting room, advisory seat caches,
transactional five-minute holds, payment idempotency and reconciliation, and
outbox-driven ticket delivery. ML System Design covers multilingual support
classification, reviewed multilabel data, XLM-R, calibration, evaluation,
versioned serving, and the online and learning pipelines. Architecture nodes,
arrows, and labels are web elements, so they can be customized with the answers.

## Presentation and interaction

The illustrated browser, editor, companion, and meeting controls are decorative.
The stage is inert and hidden from the accessibility tree; the adjacent summary
provides an accessible description. Category tabs and playback controls are interactive and remain outside the inert
stage. Tabs support arrow keys and Home/End.

The preview disables text selection, touch callouts, normal copy/cut, dragging,
and context menus locally. It does not change selection or copy behavior elsewhere
on the page. This is video-like presentation, not DRM: browser inspection and
screen capture remain possible.

Every keypress shows F2, F3, and F4 in that order, animating the appropriate key.
The private and shared views have one title each: “Your screen” and “What others
see.” The shared layer contains no companion window. A scan pauses at the midpoint
for a six-and-a-half-second comparison before revealing the full shared view.
The divider is not draggable. Answers fit above the meeting toolbar, with
responsive typography and no internal scrolling. The companion uses a nearly
opaque dark surface so the underlying editor does not obscure the answer.

## Playback

Coding plays its three actions before one shared-screen comparison. The initial
problem holds for 4 seconds, subsequent coding prompts for 1.5 seconds, keypresses
for 1 second, streaming for 1.6 seconds, and complete answers for 4 seconds.
Design workflows each use a 12-second prompt, 1.4-second keypress, 3-second stream,
and 8-second answer hold. Each comparison uses a 1.8-second initial scan, 6.5-second
halfway hold, 1.4-second final reveal, and 5-second shared view.

Playback starts only after choosing Play demo and while visible; leaving the viewport or backgrounding the page
pauses phase clocks and animations. Category changes reset the clock safely.
Reduced-motion preferences remove streaming, key motion, and moving scans.

## Playback controls

The controls appear below the preview in both development and production.
Step-by-step mode is the default and shows each phase in its final pose.
Previous step and Next step move through the same 32-step sequence as autoplay,
wrapping at either end. Restart returns to the first Coding problem and stays
paused. Category tabs also work in step-by-step mode. The panel labels the current
step, workflow, and phase. Play demo starts automatic playback with a fresh,
synchronized animation and timer for the current phase. Pause returns to
step-by-step mode.
