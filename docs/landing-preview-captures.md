# Landing-page walkthrough

The preview loops through Solve → Debug → Optimize → System Design → ML System
Design automatically. Three category tabs above the preview let visitors jump
to Coding, System Design, or ML System Design. Coding uses **Trapping Rain Water — LeetCode 42** throughout: generate a two-pointer solution,
fix two marked bugs (overwritten total and incorrect right maximum), then show
two improvements: O(n²) → O(n) time and O(n) → O(1) extra space.
System Design uses **Ticket booking — Ticketmaster**: 1 million fans competing
for 50,000 seats, with five-minute seat holds, safe payment retries, and no
double booking. The answer covers admission control, transactional holds,
payment reconciliation, ticket outbox delivery, and a native architecture diagram.
F2 reveals the answer progressively inside the native Core window over 3 seconds.
This is a prepared example: live generation was attempted but blocked by DNS
resolution of Google's authentication endpoint in the editing environment.

## Space and readability

The illustrated Chrome/HackerRank window fills the stage. Complete, concise
problem statements, examples, constraints, and tasks fit without scrolling or
animated panning. Mobile stacks the complete problem above the editor using a
content-sized question row rather than clipping the statement.

There is no SWECompanion/workflow banner, macOS menu bar, or separate
technical-interview meeting title. Zoom participants float over the browser;
the Zoom controls are centered at the bottom on desktop and mobile. The
right pane is a framed candidate editor with an author label, saved status,
line numbers, a highlighted current line, and a caret. It is a read-only
illustration rather than an editable field.

A blue YOUR SCREEN badge identifies the private view; a green SCREEN SHARE
badge explicitly says the companion is hidden from the interviewer. Both
labels remain visible during the scan and half-and-half comparison. They float
over the browser chrome without adding a full-width banner or separate windows.

The native companion displays at **70% opacity**. Its entire answer, including
all code, complexity, and design diagrams, fits within the area above the Zoom
bottom toolbar. Desktop and mobile use the same complete answer content.

## Native captures

The capture harness imports the real app's `AnswerStatusBar`, `AnswerView`,
syntax highlighter, code view, and offline Mermaid renderer. Concise, complete
website fixtures live in `scripts/landing-preview-answers.swift`; exporting them
does not change the app's bundled free-preview examples. These are illustrative
example answers, not recorded live requests or timing claims.

The offscreen window, SwiftUI environment, layer backing, and bitmap use 4×
resolution. Desktop uses a 640-point layout exported at 2,560 pixels wide;
mobile uses 380 points exported at 1,520 pixels wide. Lossless WebP preserves
text and diagram lines. Images scale proportionally with `object-fit: contain`.
No answer sections or code lines are removed from the displayed variants.

Regenerate on macOS with Xcode command-line tools installed:

```sh
bash scripts/capture-native-previews.sh
```

Pass the Core checkout path as the first argument if it is not the sibling
`../SWECompanionCore`. The script exports all variants, compresses them to WebP,
and updates `public/previews/manifest.json`. Production builds need neither
Swift nor the Core checkout. `-full` exports contain the same complete content
as the corresponding desktop images.

## Automatic sequence

Coding plays the problem, shortcut, streamed answer, and reading hold for Solve,
then Debug, then Optimize. The first two actions proceed directly to the next
coding problem without a scan or interviewer view. After Optimize, the scan,
halfway comparison, and interviewer screen play once for the whole coding demo.
System Design and ML System Design each retain their complete sequence and
individual comparison. Selecting Coding restarts at Solve.

Coding uses faster timings: 4 seconds for the initial problem, 1.5 seconds
before Debug and Optimize, a 1-second key press, a 1.6-second stream, and a
4-second complete-answer hold. All three coding features finish in 26.8 seconds
before the single capture reveal. The comparison timings and all design timings
in the table below stay unchanged. Phase clocks and CSS animations share the
same duration function, including when switching categories or restarting.

| Phase | Duration | Content |
| --- | --- | --- |
| Problem | 12,000 ms | The entire stationary problem and candidate draft, with no generated answer. |
| Key press | 1,400 ms | A finger depresses F2, F3, or F4 on the small keyboard centered below the display. |
| Stream | 3,000 ms | The native answer appears progressively in 36 steps. |
| Read | 8,000 ms | The complete answer remains visible. |
| Scan | 1,800 ms | The shared desktop reveals from the left to the center. |
| Compare | 6,500 ms | Aligned 50/50 view: shared screen left, private companion right. |
| Finish reveal | 1,400 ms | The divider continues to the right edge. |
| Screen capture | 5,000 ms | The shared browser remains visible without the companion. |

Two aligned desktop layers keep the problem and editor stationary during the
reveal. Zoom chrome changes from the candidate's to the interviewer's view.
The shared layer contains no companion window. Browser, editor, and meeting
controls inside the simulated desktop are decorative; the comparison divider
cannot be dragged. Only the category tabs are interactive. Clicking a category
restarts its first problem with a fresh phase clock; Coding starts at Solve
and then plays Debug and Optimize. Playback continues to the following
categories automatically. Tabs support arrow keys, Home/End, selected states,
and a labeled panel. A stale timer or cleanup from a previous selection cannot
shorten or advance a new selection.

Playback starts when visible. Page visibility pauses both the phase clock and
CSS animations. Reduced-motion preferences use complete static answers and
immediate capture cuts in place of streaming, key motion, and a moving scan.
Assets load eagerly to avoid unloaded images during scene transitions.

HackerRank and Zoom interfaces are illustrated, and no real meeting or
assessment is represented. The native captures use genuine app rendering.
The capture transition illustrates the feature; the app requests restricted
window sharing, but its source cautions that some capture tools may include the
window. Users should verify their setup, as the landing page explains.

Visual references:

- [HackerRank interview interface](https://candidatesupport.hackerrank.com/articles/4350314944-navigate-the-interview-interface-and-controls)
- [Zoom screen-sharing controls](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0060596)
- [Zoom participant controls](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0062674)

## Zoom panel styling

The floating bottom toolbar follows Zoom's screen-sharing layout, with compact
icon/label controls, audio/video menu chevrons, a participant count, a bright
green sharing strip, and red Stop share and Leave controls. The candidate is
muted; the interviewer is unmuted. Both cameras are off, matching the black
16:9 name tiles in the right panel. The private sharing toolbar includes Pause;
the interviewer view ends with the host's End control.

The right panel uses a small layout-selector header, an active-speaker green
outline, lower-left microphone/name plates, and per-tile ellipsis menus. Its
neutral black camera-off tiles replace the previous gradient/initial avatars.
The bottom toolbar remains centered, and both panels scale down for mobile.
All controls remain passive illustrations.

## Feature descriptions

A compact text caption above the desktop identifies the active feature and
explains its result. It changes with the workflow, including during automatic
playback, and announces only these content changes to screen readers.

- **Solve**: Generate the complete solution, code, and complexity.
- **Debug**: Find two bugs and show both fixes.
- **Improve**: Show two improvements: faster code and less memory.

The existing optimization capture and F4 shortcut are presented as Improve in
the landing-page labels. Design workflows have their own concise descriptions.

Debug and Improve show native code diffs: removed lines in red, additions in
amber, using the Core renderer’s change markers. Debug keeps unchanged context;
Improve shows the original scan-based function replaced by the two-pointer function.
