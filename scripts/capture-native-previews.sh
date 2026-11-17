#!/usr/bin/env bash
# Requires macOS, Xcode command-line tools, and the sibling SWECompanionCore checkout.
# Reuses the app's actual renderer with complete landing examples. No account or network required.
set -euo pipefail
WEB_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CORE_ROOT="${1:-$WEB_ROOT/../SWECompanionCore}/SWEcompanion"
CAPTURE_BUILD="${CAPTURE_BUILD_DIR:-$(mktemp -d /tmp/swecompanion-previews.XXXXXX)}"
if [[ "${2:-}" != "--prepare" ]]; then trap 'rm -rf "$CAPTURE_BUILD"' EXIT; fi
APP_PATH="$CAPTURE_BUILD/NativePreviews.app/Contents"
mkdir -p "$APP_PATH/MacOS" "$APP_PATH/Resources" "$WEB_ROOT/public/previews"
cp "$CORE_ROOT/Resources/mermaid-template.html" "$CORE_ROOT/Resources/mermaid.min.js" \
   "$CORE_ROOT/Resources/SWECompanionMark.png" "$APP_PATH/Resources/"
cat > "$APP_PATH/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>com.swecompanion.native-previews</string>
<key>CFBundleExecutable</key><string>NativePreviews</string>
<key>CFBundleName</key><string>NativePreviews</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>LSUIElement</key><true/>
</dict></plist>
PLIST
# The compiler's nested macro sandbox is unavailable inside a sandboxed runner.
# This flag changes compiler subprocess handling, not the runner's permissions.
swiftc -disable-sandbox -swift-version 5 -parse-as-library -module-cache-path "$CAPTURE_BUILD/modules" \
  "$CORE_ROOT/AppConfig.swift" "$CORE_ROOT/Logger.swift" \
  "$CORE_ROOT/Hotkeys/HotKeyAction.swift" "$CORE_ROOT/Hotkeys/Shortcuts.swift" \
  "$CORE_ROOT/Views/Theme.swift" "$CORE_ROOT/Views/SyntaxHighlighter.swift" \
  "$CORE_ROOT/Views/AnswerView.swift" "$CORE_ROOT/Views/AnswerStatusBar.swift" \
  "$CORE_ROOT/Views/CodeBlockView.swift" "$CORE_ROOT/Views/MermaidDiagramView.swift" \
  "$WEB_ROOT/scripts/landing-preview-answers.swift" \
  "$WEB_ROOT/scripts/capture-native-previews.swift" -o "$APP_PATH/MacOS/NativePreviews"
if [[ "${2:-}" == "--prepare" ]]; then
  echo "Prepared $CAPTURE_BUILD/NativePreviews.app"
  exit 0
fi
"$APP_PATH/MacOS/NativePreviews" "$CAPTURE_BUILD"
node "$WEB_ROOT/scripts/optimize-native-previews.mjs" "$CAPTURE_BUILD" "$WEB_ROOT/public/previews"
