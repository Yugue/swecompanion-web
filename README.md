# SWE Companion

A free, responsive Flutter web guide for L4–L6 data-structure and coding-interview preparation. It includes topic-based study sections, mixed challenge rounds, and direct links to every official LeetCode problem.

Progress, the selected theme, and the currently expanded topic are stored in the browser with `shared_preferences`; the app has no backend or external data dependency. Topic headers behave as a one-at-a-time accordion and generate shareable URL references.

## Run locally

```sh
flutter run -d web-server
```

## Build the static site

```sh
flutter build web
```

The deployable static files are written to `build/web`.
