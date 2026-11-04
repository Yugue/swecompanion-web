# Firestore security audit — November 4, 2026

## Scope and outcome

Reviewed the new `users` / `system` schema, deployed Firestore rules, both backends, desktop handoff, subscription publishing, runtime service accounts and TTL configuration. Cloud inspection was read-only; all additional behavioral checks ran on local demo-project emulators. No production rules, IAM grants, accounts or data were changed during this audit.

The deployed rules match the local `firestore.rules` exactly. All eight Cloud Functions are active, and none has the `FUNCTIONS_EMULATOR` bypass enabled. At inspection time the only live top-level collection was `system`, containing the namespace documents from the reset; `users` appears when a new account creates its profile.

No cross-account data access or client subscription escalation was reproduced. Three areas remain to harden before production: profile-field validation, direct Firestore session revocation, and backend IAM scope. Cloud progress has since been removed entirely, closing the progress-write finding. Successful access-isolation tests do not imply these other controls are present.

## Schema and trust boundaries

| Path | Data | Browser access |
| --- | --- | --- |
| `users/{uid}` | Email, display name, creation timestamp, optional subscription summary | Owner reads. Owner edits profile fields only; backend writes subscription. |
| Browser localStorage | Completed lesson IDs for each guide | Device-local only; Firestore progress access is denied. |
| `users/{uid}/private/billing` | Stripe customer ID, checkout attempts, checkout metadata and account lock | None. |
| `users/{uid}/private/rateLimits` | Independent AI and desktop-login counter windows | None. |
| `system/stripe` | Namespace metadata only | None. |
| `system/stripe/customers/{customerId}` | Stripe customer-to-Firebase UID lookup | None. |
| `system/stripe/events/{eventId}` | Processed webhook type and timestamp | None. |
| `system/auth` | Namespace metadata only | None. |
| `system/auth/desktopAuthCodes/{hash}` | UID, browser authentication time, PKCE challenge and expiration | None. Raw codes and verifiers are not stored. |

The subscription summary contains `subscribed`, `status`, `plan`, `currentPeriodEnd`, `cancelAtPeriodEnd`, `amount`, `currency`, `claimsVersion` and `updatedAt`. It is intentionally visible to the account owner. Operational billing fields remain in a separate private document because Firestore reads return entire documents.

Parent permissions do not automatically grant subcollection permissions. The owner-readable user document does not make its `private` documents readable. Admin SDK access bypasses these browser rules and is controlled by IAM plus backend authorization.

## Confirmed findings

### F1 — Low: profile values lack type and size validation

Profile field names are allowlisted, but field types and lengths are not. The emulator accepted a map and a 5,000-character string in `displayName`. Apply email/name type and size checks and preserve the intended null display-name case. Treat the profile email as display data; Firebase Authentication remains the identity source.

The original progress-write finding is closed by removing cloud storage entirely. The hook now uses browser localStorage only, retains its existing keys, and has no Firebase/Auth dependency. Rules deny all progress reads and writes, including for the owner. Tests confirm both unknown and known guide paths are denied. This eliminates arbitrary cloud progress documents and malformed cloud completion lists.

### F2 — Medium: direct Firestore access does not check session revocation

Location: `firestore.rules`, lines 6–11.

The rules check only token presence and UID ownership. Using an already-issued ID token, the emulator still allowed reads and profile writes after that account was separately revoked, disabled or deleted. This concerns direct Firestore access to that UID's permitted documents. It does not bypass the private/system rules or grant Pro access.

The HTTP backends have separate live account/revocation checks, and their regression tests reject ended sessions. Direct Firestore rules need their own mechanism if immediate invalidation is required. Otherwise, an existing valid ID token may continue to work until it expires, normally up to one hour. Deleting an Authentication account is not the same as deleting Firestore data, and removing data does not itself prevent an old token from attempting new owner-writable writes.

Recommended change: maintain trusted revocation/disabled metadata that the rules check, with correct handling for signup, disabling, re-enabling and deletion; alternatively, route the relevant operations through backend handlers that check account state. A UI sign-out or token refresh is insufficient as an authorization control.

### F3 — Medium: most backend functions run with the project Editor role

Live IAM inspection confirmed `roles/editor` on `221728066217-compute@developer.gserviceaccount.com`. The AI function and all five billing functions use that account. Consequently, the private/system document separation does not constrain those server credentials; browser rules do not apply to Admin SDK operations. A compromised runtime would have substantially more project permissions than the application needs.

The desktop-auth account is separate and has Datastore User, Firebase Auth Viewer and Logging Writer. Its token-creator binding is on itself; the GitHub deployer has permission to deploy using it. No public token-creator binding was found in that service account policy.

Recommended change: move AI and billing to dedicated runtime service accounts, grant only the API/database/secret/log permissions each needs, verify the new identities, then remove the broad Editor grant after checking its other users. Datastore User is itself database-wide; nesting paths does not create server-side IAM isolation between documents.

## Controls that held

- Another UID cannot read or edit another user's profile; anonymous access is denied.
- Broad listings of `users` and `system` are denied.
- Owners cannot create/change subscription access, update its nested fields, erase it by replacing the user document, or delete the user document to reset controls.
- Clients cannot read/write private billing, counters, Stripe lookups, webhook receipts, namespace documents or pending auth codes. Further descendants under private billing are denied as well.
- Old top-level paths, including `quizzes`, are denied.
- `createdAt` is initialized with server time, can be filled once after a backend-first user creation, and cannot be changed afterward.
- Subscription publishing replaces only the subscription field and preserves profile fields. Browser profile updates preserve the subscription summary.
- Paid API access requires a non-revoked valid token, the signed paid claim and the current user-document subscription flag. Missing/false flags fail closed.
- Rate limits remain 60 AI requests per minute per account, no daily cap, plus a separate 10-per-minute desktop code limit. Counters use Firestore transactions and cannot be edited by browser clients.
- Login codes are hashed, short-lived, PKCE-bound and consumed transactionally. Account status and original browser authentication time are checked before creating/exchanging a code. The nested `desktopAuthCodes.expiresAt` TTL policy is active; expiration is enforced in code rather than relying on timely TTL cleanup.
- Stripe webhook signatures, server-owned customer mappings and the account lock remain the authorization/idempotency boundary; the schema changes did not introduce caller-selected UID/customer paths.

## Reproduction and limits

Run:

```bash
bash scripts/test_firestore.sh --audit
```

The normal seven integration tests still run. The opt-in audit script performs 17 additional checks: nine successful protection checks, two accepted malformed-profile cases and six stale-session read/write cases. The latter cases deliberately characterize current gaps; their expected acceptance is not a passing production-security gate. These checks use only `demo-swecompanion-schema` emulators.

All 30 Core backend tests also passed, including paid authorization, ended sessions, concurrent rate limiting and code replay/expiry/PKCE. IAM and deployed-rule comparisons were read-only against `swecompanion`. The emulator demonstrates rule behavior but is not a live test of Google's token verifier; the stale-token window is also consistent with Firebase's documented token/revocation model. No exploit attempts were made against live user accounts.

This is a targeted schema/access audit, not a dependency, device-signing, full billing-provider, or infrastructure penetration test. Existing self-signed Mac Keychain and private URL-scheme limitations remain outside the Firestore change.

## Official references

- [Firestore field access, update restrictions and data types](https://firebase.google.com/docs/firestore/security/rules-fields)
- [Firebase session and ID-token revocation](https://firebase.google.com/docs/auth/admin/manage-sessions)
- [Firestore subcollection rule matching](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Google Cloud IAM roles and least privilege](https://cloud.google.com/iam/docs/roles-overview)

## Follow-up: local-only learning progress

At the owner's request, progress is stored only on the user's device. The cloud-sync code and its rule allowance are removed. Existing localStorage keys are retained. Reset dialogs now describe browser-local reset behavior. This change does not alter the remaining profile validation, stale-token or IAM findings.
