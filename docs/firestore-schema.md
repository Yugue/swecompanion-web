# Firestore schema

The application uses two top-level collections. Firebase Authentication stores login identities separately.

```text
users/{uid}                         email, displayName, createdAt, subscription
users/{uid}/private/billing         customerId, checkout attempts, account lock
users/{uid}/private/rateLimits      apiMinute, desktopAuthCode windows
users/{uid}/private/usage           anchor, monthStart, used, active request deadlines
system/stripe                      namespace document
system/stripe/customers/{id}        Stripe customer ID -> Firebase UID
system/stripe/events/{id}           processed webhook receipts
system/auth                        namespace document
system/auth/desktopAuthCodes/{hash} uid, authTime, challenge, expiresAt
```

The user document is owner-readable. Only email/displayName and the initial createdAt timestamp are client-writable. Billing publishes the complete subscription summary with a field mask so profile fields survive. Profile initialization also handles a user document created first by the backend. Subscription access requires both the signed custom claim and the current subscription summary in the user document.

Learning progress is saved only in browser localStorage, under the existing `progress_{kind}_v2` keys, independently of login. There is no cloud progress storage or cross-device sync. All Firestore progress paths deny browser reads and writes. `private` documents and all `system` documents are server-only. Each counter, code, mapping and webhook receipt stays in an independent document. Namespace documents contain no user data and are created during setup so the console is easy to browse.

AI requests allow 60 per account per 60-second fixed window, with no daily cap. Both active paid plans have a server-only allowance of 1,000 generations per monthly anniversary in UTC. Billing publishes the trusted Stripe `billingCycleAnchor` in the subscription summary. The usage document preserves the first anchor so plan changes cannot refill early; short months clamp to the last day and later months restore the original day. Refills are computed atomically on the next accepted request, with no scheduled job or rollover. Ended subscription periods fail closed even before a cancellation webhook arrives. No allowance, counter or reset date is published to the interface.

Validation, image metadata checks and the provider token-count preflight happen before the atomic deduction. Once charged immediately before generation, failures, cancellations and timeouts retain the deduction. The same transaction permits at most two simultaneous generations per account. Each active entry expires at the request's deadline; normal cleanup removes only that entry. A terminated function cannot permanently occupy a slot or refund usage. Private usage data denies all browser reads and writes under the existing rules.

Desktop login code creation has its own 10-per-minute window. Counter updates and single-use code redemption remain transactional. Code expiration is checked on redemption; Firestore's `desktopAuthCodes.expiresAt` TTL is cleanup only and applies to the nested collection as well.

## AI request boundaries

The server accepts up to six native PNG/JPEG images across the complete conversation, each at most 4 MiB decoded and 8,000 pixels in either dimension, with 18 MiB combined image bytes and a 26 MiB JSON body. Earlier assistant text is limited to 64 KiB; user instructions are fixed server prompts. The total input, including images, prompts and history, must pass a 40,000-token provider preflight. Output is limited to 6,000 tokens and 32,000 UTF-16 code units. Images are checked without pixel decoding or resizing.

Client and server impose a 180-second deadline. The client deadline includes image preparation, authentication, upload and streaming. There is one generation attempt, without automatic retries, fallback models or continuation requests. A rejected authentication token may be refreshed once before generation. An explicit completion event and a complete answer are required before the client saves a turn. Partial output remains visibly failed. Only answer text and fixed public completion/error events leave the proxy; provider metadata, reasoning, diagnostics and stack traces are never relayed.

The Mac undo snapshot keeps completed history and indexes of the screenshots already included in it. Restoring it neither re-uploads those images nor turns a failed or canceled answer into completed history. Screenshot identities are weakly tracked so a released object's reused address cannot suppress a later capture.

## Pre-release reset

The owner authorized deleting existing Firestore data, the legacy quiz collection, and Firebase Authentication accounts. There is no compatibility/migration layer. Deploy both function codebases, the security rules and the website together; clear old data recursively, including user progress subcollections; delete the old Authentication accounts; and initialize `system/auth` and `system/stripe`. Static quiz source files remain part of the website. The legacy database seed bank, seeding command and database migration script are removed.

Progress uses localStorage only; the current key generation is preserved so existing browser progress remains intact. Old browser clients cannot access the removed top-level collections. Deleted/revoked sessions are rejected by the billing and desktop handoff handlers and the paid API gateway.

Stripe sandbox records are outside this reset and remain unchanged. Old Stripe customers have no mapping into the reset application, so their webhook events are ignored. Start a new sandbox checkout with a newly created Firebase account when verifying billing.

## Checks

- Core: `npm run build` and `npm test` in `SWECompanionCore/functions`.
- Mac client: `bash scripts/test_ai.sh` and `bash scripts/test_auth.sh` in the Core repository.
- Website: `npm run billing:build`, `npm run billing:test`, `npx tsc --noEmit`, and `npm run build`.
- Access boundaries and persistence: `bash scripts/test_firestore.sh` in the website repository. This uses demo-project Auth and Firestore emulators, never production.

## Deployment verification — November 4, 2026

Both function codebases, the website and the final security rules were deployed to `swecompanion`. Two existing Firebase Authentication accounts and all prior Firestore documents/subcollections were deleted. Final verification found zero Authentication accounts and zero user, progress, private, quiz or pending login-code documents. Only the two `system/auth` and `system/stripe` namespace documents remain; the `users` collection appears on the next signup.

All 30 Core tests, 17 website tests and seven emulator integration/security tests passed, as did the TypeScript checks, targeted lint and release builds. Eight live checks covered new profile creation, client access boundaries, progress writes, the deployed billing path, nested login codes/counters, code exchange/replay, and the published login/signup/account pages. Disposable verification accounts and their Firestore documents were removed. The active Firestore rules were compared with the tested source. Stripe sandbox records were not changed.

The release was built from committed website source plus the schema changes, excluding unrelated uncommitted site/content edits in the working directory.

## Local-only progress follow-up

The website and rules now keep learning progress in browser localStorage only. Existing `progress_{kind}_v2` keys are preserved. Cloud progress access is denied for all clients, and verification found no remaining progress documents in Firestore. TypeScript, targeted lint, the static release build, seven rules/persistence tests and the updated audit checks passed. Login identities and billing data were not reset for this change.

## Usage limits deployment — November 4, 2026

The billing reconciliation and webhook functions, AI endpoint and website copy were deployed. There were no existing active subscription summaries requiring billing-anchor backfill. A disposable account verified a real provider token preflight followed by the exhausted-counter rejection, with no generation or additional deduction. Its error disclosed no allowance or provider details. Live rules rejected reads/writes of the private counter and edits to the billing anchor. The temporary account and its documents were removed; existing accounts and Stripe records were unchanged.

Unit and emulator checks covered concurrent deductions, monthly and annual refills, short-month anniversaries, plan changes, stale request slots, payload boundaries, output truncation, provider failures, cancellation and deadlines. Mac checks also covered delayed authentication, undo without duplicate image uploads, and retaining only completed history. TypeScript, targeted lint and the isolated static website build passed. The signed Mac release and installer were built without replacing or launching the installed app. The AI endpoint retains one warm instance, with 1 GiB memory and four requests per instance for native-image upload headroom. Each request adds one token-count preflight and one atomic deduction; slot cleanup happens after the response ends.
