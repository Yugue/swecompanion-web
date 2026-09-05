# SWE Companion

A responsive Flutter web checklist for data structures and coding interview preparation. It includes topic-based study sections, mixed challenge rounds, and direct links to every official LeetCode problem.

Progress and the selected theme are stored in the browser with `shared_preferences`; the app has no backend or external data dependency.

## Run locally

```sh
flutter run -d web-server
```

## Build the static site

```sh
flutter build web
```

The deployable static files are written to `build/web`.
