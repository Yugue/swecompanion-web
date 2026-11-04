# Firestore schema

The application uses two top-level collections. Firebase Authentication stores login identities separately.

```text
users/{uid}                         email, displayName, createdAt, subscription
users/{uid}/private/billing         customerId, checkout attempts, account lock
users/{uid}/private/rateLimits      apiMinute, desktopAuthCode windows
system/stripe                      namespace document
system/stripe/customers/{id}        Stripe customer ID -> Firebase UID
system/stripe/events/{id}           processed webhook receipts
system/auth                        namespace document
system/auth/desktopAuthCodes/{hash} uid, authTime, challenge, expiresAt
```

The user document is owner-readable. Only email/displayName and the initial createdAt timestamp are client-writable. Billing publishes the complete subscription summary with a field mask so profile fields survive. Profile initialization also handles a user document created first by the backend. Subscription access requires both the signed custom claim and the current subscription summary in the user document.

Learning progress is saved only in browser localStorage, under the existing `progress_{kind}_v2` keys, independently of login. There is no cloud progress storage or cross-device sync. All Firestore progress paths deny browser reads and writes. `private` documents and all `system` documents are server-only. Each counter, code, mapping and webhook receipt stays in an independent document. Namespace documents contain no user data and are created during setup so the console is easy to browse.

AI requests allow 60 per account per 60-second fixed window, with no daily cap. Desktop login code creation has its own 10-per-minute window. Counter updates and single-use code redemption remain transactional. Code expiration is checked on redemption; Firestore's `desktopAuthCodes.expiresAt` TTL is cleanup only and applies to the nested collection as well.

## Pre-release reset

The owner authorized deleting existing Firestore data, the legacy quiz collection, and Firebase Authentication accounts. There is no compatibility/migration layer. Deploy both function codebases, the security rules and the website together; clear old data recursively, including user progress subcollections; delete the old Authentication accounts; and initialize `system/auth` and `system/stripe`. Static quiz source files remain part of the website. The legacy database seed bank, seeding command and database migration script are removed.

Progress uses localStorage only; the current key generation is preserved so existing browser progress remains intact. Old browser clients cannot access the removed top-level collections. Deleted/revoked sessions are rejected by the billing and desktop handoff handlers and the paid API gateway.

Stripe sandbox records are outside this reset and remain unchanged. Old Stripe customers have no mapping into the reset application, so their webhook events are ignored. Start a new sandbox checkout with a newly created Firebase account when verifying billing.

## Checks

- Core: `npm run build` and `npm test` in `SWECompanionCore/functions`.
- Website: `npm run billing:build`, `npm run billing:test`, `npx tsc --noEmit`, and `npm run build`.
- Access boundaries and persistence: `bash scripts/test_firestore.sh` in the website repository. This uses demo-project Auth and Firestore emulators, never production.

## Deployment verification — November 4, 2026

Both function codebases, the website and the final security rules were deployed to `swecompanion`. Two existing Firebase Authentication accounts and all prior Firestore documents/subcollections were deleted. Final verification found zero Authentication accounts and zero user, progress, private, quiz or pending login-code documents. Only the two `system/auth` and `system/stripe` namespace documents remain; the `users` collection appears on the next signup.

All 30 Core tests, 17 website tests and seven emulator integration/security tests passed, as did the TypeScript checks, targeted lint and release builds. Eight live checks covered new profile creation, client access boundaries, progress writes, the deployed billing path, nested login codes/counters, code exchange/replay, and the published login/signup/account pages. Disposable verification accounts and their Firestore documents were removed. The active Firestore rules were compared with the tested source. Stripe sandbox records were not changed.

The release was built from committed website source plus the schema changes, excluding unrelated uncommitted site/content edits in the working directory.

## Local-only progress follow-up

The website and rules now keep learning progress in browser localStorage only. Existing `progress_{kind}_v2` keys are preserved. Cloud progress access is denied for all clients, and verification found no remaining progress documents in Firestore. TypeScript, targeted lint, the static release build, seven rules/persistence tests and the updated audit checks passed. Login identities and billing data were not reset for this change.
