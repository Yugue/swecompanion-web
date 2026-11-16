# Landing-page walkthrough

The preview loops through Solve → Debug → Optimize → System Design → ML System
Design automatically. Three category tabs above the preview let visitors jump
to Coding, System Design, or ML System Design. Coding uses **Longest Substring Without
Repeating Characters** throughout: generate the solution, fix a backward-moving
window boundary, then replace repeated scans with a linear-time sliding window.

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
