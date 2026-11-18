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

Coding uses Roadside Drainage Capacity throughout, an interview scenario about
retained stormwater in a channel with 1 m × 1 m terrain sections. The numeric
inputs stay the same; the two outputs are 6 m³ and 9 m³. The first example
animates six blue volume cells filling depressions, holds, then resets. It
respects reduced motion and pauses offscreen. Solve shows the complete
two-pointer solution; Debug shows two removed/added lines (accumulate the water
and preserve the right maximum); Improve replaces the original scan-based
function with the complete two-pointer solution. Red means removed and amber
means added. Time improves from O(n²) to O(n); extra space from O(n) to O(1).

System Design and ML System Design show saved Core answers
(`core-system-design-preview.json`, `core-ml-design-preview.json`): Core's
`systemDesign` and `mlSystemDesign` prompts with its system prompt, run on Core's
model against screenshots of the hero problems.

System Design covers Ticketmaster with Core's Summary, Explanation, and
Architecture sections; Nice to Have stays in the JSON but is left out so the
window fits the minimum stage height. ML System Design covers multilingual
support classification and shows the bullets that carry the main decisions,
verbatim: Data (ML Objective, Labels, Flow), Model & Training (Model, Decision
rule), and Evaluation & Scaling (Offline monitoring). The remaining bullets, the
cost-estimate tables, and the cost summary stay in the JSON.

Both Mermaid diagrams are redrawn as SVG by one `ArchitectureDiagram` component:
the same components, numbered edges, and Core's path colours (write/read/async
for Ticketmaster; inference path and training loop for ML). Below a 520px window
width each falls back to one lane per path.

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
for 1.8 seconds, streaming for 2.2 seconds, and complete answers for 4 seconds.
Design workflows each use a 12-second prompt, 2.2-second keypress, 3-second stream,
and 8-second answer hold. Each comparison uses a 1.8-second initial scan, 6.5-second
halfway hold, 1.4-second final reveal, and 5-second shared view.

Playback starts only after choosing Play demo and while visible; leaving the viewport or backgrounding the page
pauses phase clocks and animations. Category changes reset the clock safely.
Reduced-motion preferences remove streaming, key motion, and moving scans.

## Playback controls

The controls appear below the preview in both development and production.
Step-by-step mode is the default. The stream step emits small text chunks with a trailing cursor, retaining syntax highlighting and a stable window size. It also plays when selected manually. Other phases show their final pose.
Previous step and Next step move through the same 32-step sequence as autoplay,
wrapping at either end. Restart returns to the first Coding problem and stays
paused. Category tabs also work in step-by-step mode. The panel labels the current
step, workflow, and phase. Play demo starts automatic playback with a fresh,
synchronized animation and timer for the current phase. Pause returns to
step-by-step mode.

The candidate is always unmuted and is the active speaker in both private and
shared views. The green speaker outline and audio-level bars belong to the
candidate tile; both views show an unmuted microphone in the meeting toolbar.

Candidate audio bars and the candidate Audio-button microphone share a speech
envelope with short syllabic bursts, breaths, and longer quiet pauses. The
interviewer microphone stays neutral in the shared view. The editor caret blinks even during
step-by-step review. These ambient effects pause when the preview is hidden and
remain static when reduced motion is requested.

The coding prompt uses `retained_runoff(height)` consistently in the candidate
editor, solution, and diffs. Mobile gives the illustrated first prompt extra
height to keep the full constraints and coding pad visible without scrolling.

The simulated browser uses the illustrative room address
`hackerrank.com/interview/demo-7f3a9c` (decorative text, not a working invitation).
The page identifies a live technical interview with two participants, a shared
problem, live-synced editing, and a ticking elapsed timer. Recording indicators
appear in both the interview header and Zoom toolbar, on private and shared
views. The candidate can Run code or Leave interview rather than submit a
challenge. These are illustrative session cues; the preview captures no media.
The session design references HackerRank's
[interview interface guide](https://support.hackerrank.com/articles/1597283498-navigate-the-interview-interface-and-controls).

The Core-style answer header uses the shared SWECompanion app mark and named
shortcut reminders (Capture, Solve, Debug, Improve, Scroll up/down, Clear),
following the native `AnswerStatusBar`. On narrow windows the reminders wrap
into two rows and retain their names. Solve explains the water-depth bound,
two-pointer invariant, volume calculation, and both sample results. Complexity
has separate time and space rows with the reason for each bound. The stage is
tall enough to keep the expanded answer visible without internal scrolling.
