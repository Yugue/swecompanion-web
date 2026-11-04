# Authentication and sandbox billing

The static Next.js website uses Firebase Authentication (email/password and Google). Payment operations run in second-generation Firebase Functions, without an extension. Card details are collected only in hosted Checkout and the customer portal.

## One pricing definition

`functions/src/shared/pricing.ts` is imported by the frontend, backend, and catalog synchronization script. It defines USD 299 monthly and USD 2,988 yearly (USD 249/month). Amounts are integer cents. The public product ID is `swecompanion_pro`. Lookup keys include the interval, currency, and amount.

To change prices, edit that file, run `npm run billing:sync` with the sandbox `STRIPE_SECRET_KEY` in the environment, and deploy both the functions and website from the same version. The script creates immutable prices, selects the monthly default, and updates the portal choices using `STRIPE_PORTAL_CONFIGURATION_ID` in `functions/.env.swecompanion`. Existing subscriptions retain their agreed price. Old prices are not deleted.

## Configuration and deployment

Use Node.js 22. Install dependencies with `npm ci` and `npm ci --prefix functions`. Public Firebase configuration is described in `.env.example`; the optional region defaults to `us-central1`.

Copy `functions/.env.example` to `functions/.env.swecompanion` and configure the site origin and portal configuration. `LOCAL_SITE_URL=http://localhost:3000` explicitly permits local sandbox return links. Other caller-supplied return origins are rejected. Remove this local override when preparing a live deployment.

Store the existing sandbox secret key and the webhook signing secret using `firebase functions:secrets:set STRIPE_SECRET_KEY --project swecompanion` and `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET --project swecompanion`. These are server secrets; never use a `NEXT_PUBLIC_` variable or commit them. The backend deliberately rejects live-mode keys and events.

Deploy backend and rules with `firebase deploy --only functions:billing,firestore:rules --project swecompanion`. The existing Hosting workflow only deploys the frontend; backend deployment remains an explicit step. Build the frontend with `npm run build` before publishing Hosting. Do not publish unrelated workspace edits accidentally.

The sandbox webhook URL is `https://us-central1-swecompanion.cloudfunctions.net/stripeWebhook`. Subscribe it to:

- `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`
- `invoice.paid`, `invoice.payment_failed`

Configure the portal for invoice history, payment-method updates, cancellation at the period end, and monthly/yearly price changes with prorations. The current sandbox account is `acct_1UXmDDAM0OhRYdVT`; its portal configuration is `bpc_1UXmUVAM0OhRYdVTZTk2wQ8Z`.

## Access and lifecycle

Authenticated callable functions derive the user ID from the validated token. Browsers supply only a plan choice and an allowlisted return origin; they cannot choose a customer, subscription, price, amount, or claim. A transaction lease serializes checkout and claim updates for each account. Existing open checkouts are reused, and nonterminal subscriptions prevent duplicate purchases. Persisted idempotency keys cover interrupted checkout creation.

The signed webhook validates the raw request body and sandbox mode, resolves the customer through server-only mappings, retrieves current subscription state to handle out-of-order delivery, and ignores already processed event IDs. It merges `subscribed` into existing custom claims. Only an active subscription for our product grants access; incomplete, unpaid, overdue, paused, expired, and canceled subscriptions do not. No trial is offered. Cancellation at the period end keeps the status active and access enabled until cancellation takes effect.

`users/{uid}` holds the owner-readable profile and server-owned `subscription` summary. Clients can edit only profile fields; they cannot change subscription access. `users/{uid}/private/billing` holds the Stripe customer mapping, checkout attempts and lock. The shared backend uses `users/{uid}/private/rateLimits` for the 60-per-minute AI limit and the separate 10-per-minute desktop-login limit. `system/stripe/customers/{customerId}` is the reverse lookup and `system/stripe/events/{eventId}` holds webhook receipts. Private documents and everything under `system` deny all browser access. Quiz content ships with the website; there is no Firestore quiz collection.

After claims update, the billing listener forces an ID-token refresh. The account page also reconciles current billing state when opened or returned from Checkout; the return query alone never grants access. Password changes require reauthentication with the current password. Password-reset confirmations do not disclose whether an account exists.

The subscription summary also publishes Stripe's trusted `billingCycleAnchor`. The AI backend uses it for monthly usage windows for both billing plans; it retains the first usage anchor across plan changes. Private usage counters are not exposed to browsers. See [Firestore schema](firestore-schema.md#ai-request-boundaries) for the request caps, atomic deductions and deadlines.

Authentication uses dedicated `/login`, `/signup`, and `/forgot-password` pages. Existing signed-in users visiting login or signup are redirected home. Navigation preserves a validated local return destination for a new sign-in, including a selected monthly or yearly upgrade. After sign-in, the account page resumes checkout for that plan. External return URLs and loops back to authentication pages are rejected.

The learning guides and ML quizzes already shipped in the static export remain public. The Mac app's backend verifies the `subscribed` claim and `users/{uid}.subscription.subscribed` on every request; hiding frontend content is not an authorization boundary.

## Mac app sign-in

The Mac app signs in on this website. It opens `/login` with `/desktop-auth` as the `next` destination, passing a random `state` and the SHA-256 fingerprint of a secret it keeps in memory. Signed-in users who reach the login page with that destination continue there instead of going home. The page requires a click, then calls `createDesktopAuthCode` and redirects to `com.swecompanion.app:/auth/callback`, an address fixed in `src/lib/desktopAuth.ts` rather than read from the URL. The app exchanges the one-time code and its secret through `exchangeDesktopAuthCode` for a custom token.

Those two functions live in SWECompanionCore, which documents the flow in its README, because that codebase deploys automatically and also hosts the `claude` function. The website calls them by name, like its own callables. `claude` admits only tokens with the `subscribed` claim set by the billing functions here, so this claim is what the app shows as Free or Pro. The app's Upgrade button opens `/account`.

## Checks

Run `npm run billing:test`, `npm run billing:build`, `npx tsc --noEmit`, and `npm run build`. The tests cover cancellation timing, nonpayment, product and sandbox isolation, multiple subscription histories, preserving a single public credential error, and preventing diagnostic leakage.

For emulator work, start `firebase emulators:start --only auth,firestore,functions --project demo-swecompanion`, use that demo project in a separate local public configuration, and set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`. Put sandbox-only secrets in the ignored `functions/.secret.local`. The browser connects only in development; production builds cannot activate emulators. Use the signing secret from `stripe listen` when forwarding events locally.

Official references: [Firebase callable functions](https://firebase.google.com/docs/functions/callable), [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [signed webhooks](https://docs.stripe.com/webhooks), and [subscription events](https://docs.stripe.com/billing/subscriptions/webhooks).

## Sandbox verification — November 3, 2026

The functions and rules were deployed to `swecompanion`. The frontend was verified locally and built successfully; publishing Hosting remains a separate release step because this checkout contains other unpublished edits.

Nine business-rule tests, TypeScript, targeted lint checks, and the full static production build passed. A disposable account completed a real sandbox Checkout using the standard test card, received the `subscribed` claim while retaining an unrelated existing claim, and displayed its paid invoice with receipt/PDF links. The portal changed monthly billing to yearly and canceled renewal; the webhook retained active access through the paid period. An immediate test cancellation then revoked the claim and blocked an old signed token from reading protected content.

Additional checks rejected unauthenticated calls, invalid plans, unapproved return origins, forged webhook signatures, browser writes to billing documents, access to private customer mappings, another customer's invoice cursor, and a duplicate subscription purchase. Replayed and out-of-order events did not corrupt access. Password reauthentication and updating were checked against the authentication service, including rejection of the old password afterward. Email privacy protection and authorized Google sign-in domains were checked in project configuration.

## Firestore layout

See [Firestore schema](firestore-schema.md) for the paths, access boundaries, and pre-release reset. Run `bash scripts/test_firestore.sh` to test rules, merged subscription persistence, and ended billing sessions against local Auth/Firestore emulators. Login codes are at `system/auth/desktopAuthCodes/{hash}`; the `desktopAuthCodes.expiresAt` collection-group TTL still applies.
