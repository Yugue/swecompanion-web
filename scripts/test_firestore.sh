#!/usr/bin/env bash
# Security rules and subscription persistence checks use only local emulators.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE22_BIN="${NODE22_BIN:-/opt/homebrew/opt/node@22/bin}"
FIREBASE_JS="${FIREBASE_JS:-$(brew --prefix firebase-cli)/libexec/lib/node_modules/firebase-tools/lib/bin/firebase.js}"
export PATH="$NODE22_BIN:$PATH"
TEST_CONFIG="$(mktemp "${TMPDIR:-/tmp}/swecompanion-firestore-tests.XXXXXX")"
trap 'rm -f "$TEST_CONFIG"' EXIT
# Dedicated ports avoid interfering with a running local website or Core emulator.
node -e 'process.stdout.write(JSON.stringify({firestore:{rules:process.argv[1]+"/firestore.rules"},emulators:{auth:{port:9198},firestore:{port:8188},hub:{port:4418},logging:{port:4518},ui:{enabled:false},singleProjectMode:true}}))' "$ROOT" > "$TEST_CONFIG"
TEST_FILES="test/firestore.integration.ts"
if [[ "${1:-}" == "--audit" ]]; then
  TEST_FILES="$TEST_FILES test/firestore.audit.ts"
elif [[ $# -gt 0 ]]; then
  echo "Usage: bash scripts/test_firestore.sh [--audit]" >&2
  exit 2
fi
cd "$ROOT"
node "$FIREBASE_JS" emulators:exec --config "$TEST_CONFIG" --only auth,firestore --project demo-swecompanion-schema \
  "cd functions && npx tsx --test ${TEST_FILES}"
