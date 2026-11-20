# Authentication and sandbox billing

The static Next.js website uses Firebase Authentication (email/password and Google). Payment operations run in second-generation Firebase Functions, without an extension. Card details are collected only in hosted Checkout and the customer portal.

## One pricing definition

`functions/src/shared/pricing.ts` is imported by the frontend, backend, and catalog synchronization script. Enter each plan amount in integer cents. Current offers are USD 149/month (recurring) and USD 349 upfront for the first three calendar months, then USD 149/month until canceled. The website derives the introductory savings from those amounts. Annual billing is no longer purchasable; existing subscriptions keep their agreed price and access. The public product ID is `swecompanion_pro`. Lookup keys include the interval, currency, and amount.

To change prices, edit that file, run `npm run billing:sync` with the sandbox `STRIPE_SECRET_KEY` in the environment, and deploy both the functions and website from the same version. The script creates immutable prices, selects the monthly default, retires old purchase prices and open Checkout links, enables cancellation at the paid period end, and disables portal plan switching using `STRIPE_PORTAL_CONFIGURATION_ID` in `functions/.env.swecompanion`. Existing subscriptions retain their agreed price. Old prices are not deleted.

## Configuration and deployment

Use Node.js 22. Install dependencies with `npm ci` and `npm ci --prefix functions`. Public Firebase configuration is described in `.env.example`; the optional region defaults to `us-central1`.

Copy `functions/.env.example` to `functions/.env.swecompanion` and configure the site origin and portal configuration. `LOCAL_SITE_URL=http://localhost:3000` explicitly permits local sandbox return links. Other caller-supplied return origins are rejected. Remove this local override when preparing a live deployment.

Store the existing sandbox secret key and the webhook signing secret using `firebase functions:secrets:set STRIPE_SECRET_KEY --project swecompanion` and `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET --project swecompanion`. These are server secrets; never use a `NEXT_PUBLIC_` variable or commit them. The backend deliberately rejects live-mode keys and events.

Deploy backend and rules with `firebase deploy --only functions:billing,firestore:rules --project swecompanion`. The existing Hosting workflow only deploys the frontend; backend deployment remains an explicit step. Build the frontend with `npm run build` before publishing Hosting. Do not publish unrelated workspace edits accidentally.

The sandbox webhook URL is `https://us-central1-swecompanion.cloudfunctions.net/stripeWebhook`. Subscribe it to:

- `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`
- `invoice.paid`, `invoice.payment_failed`
- `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`

Configure the portal for invoice history, payment-method updates, and cancellation at the period end. Catalog sync disables subscription plan switching so annual prices cannot be selected. New three-month purchases create a subscription immediately, so their monthly renewal can be canceled through the same portal. Legacy one-time passes retain their original nonrenewing terms. The current sandbox account is `acct_1UXmDDAM0OhRYdVT`; its portal configuration is `bpc_1UXmUVAM0OhRYdVTZTk2wQ8Z`.

## Access and lifecycle

Authenticated callable functions derive the user ID from the validated token. Browsers supply only a plan choice and an allowlisted return origin; they cannot choose a customer, subscription, price, amount, or claim. A transaction lease serializes checkout and claim updates for each account. Existing open checkouts are reused, and nonterminal subscriptions prevent duplicate purchases. Persisted idempotency keys cover interrupted checkout creation.

The signed webhook validates the raw request body and sandbox mode, resolves the customer through server-only mappings, retrieves current subscription state to handle out-of-order delivery, and ignores already processed event IDs. It merges `subscribed` into existing custom claims. An active subscription for our product grants access. A `trialing` subscription grants access only for our tagged paid introduction after its initial invoice is verified: matching customer, subscription, upfront price, quantity, amount, currency, and paid status. An ordinary free trial grants no access. Incomplete, unpaid, overdue, paused, expired, and canceled subscriptions do not grant access. Cancellation at the period end keeps paid access enabled until cancellation takes effect.

New three-month purchases use Checkout `mode=subscription`, with a USD 349 one-time price on the initial invoice and the USD 149 monthly recurring price deferred with Stripe's trial-period mechanism. Checkout requires a card and discloses the subsequent monthly charge. The temporary `trialing` Stripe status represents paid introductory access. Reconciliation aligns the first renewal to three calendar months from subscription creation (clamping short month ends), and preserves the original subscription creation timestamp as the monthly usage anchor. During the introduction, the account summary publishes the upfront amount and `renewalAmount`; afterward it reports the regular monthly price. The account's **Manage plan** button opens Stripe's portal, where cancellation stops future renewal while retaining access through the paid period.

The introductory price has a new lookup key, so already open legacy payment Checkouts are never reused for the new offer. Coordinate catalog sync, backend deployment, and Hosting publication; catalog sync retires old purchase prices and open legacy Checkout links. Existing paid legacy passes remain payment-mode purchases and continue to reconcile against their stored checkout price and duration. Their refund/dispute and expiry rules are preserved. The hourly `expirePasses` task also reconciles paid introductory summaries at the boundary; the Core API independently checks `currentPeriodEnd` on each request.

Before activating the offer, enable Stripe's **Send a reminder email seven days before a free trial ends** in [subscription messaging settings](https://dashboard.stripe.com/settings/billing/automatic), including the account/manage-plan link. Stripe treats the deferred recurring portion as a trial for this setting. This account-level email setting is managed in the Dashboard and is not configured by the catalog script. See [Stripe's introductory-offer guidance](https://support.stripe.com/questions/2020-visa-trial-subscription-requirement-changes-faq).

`users/{uid}` holds the owner-readable profile and server-owned `subscription` summary. Clients can edit only profile fields; they cannot change subscription access. `users/{uid}/private/billing` holds the Stripe customer mapping, checkout attempts and lock. The shared backend uses `users/{uid}/private/rateLimits` for the 60-per-minute AI limit and the separate 10-per-minute desktop-login limit. `system/stripe/customers/{customerId}` is the reverse lookup and `system/stripe/events/{eventId}` holds webhook receipts. Private documents and everything under `system` deny all browser access. Quiz content ships with the website; there is no Firestore quiz collection.

After claims update, the billing listener forces an ID-token refresh. The account page also reconciles current billing state when opened or returned from Checkout; the return query alone never grants access. Password changes require reauthentication with the current password. Password-reset confirmations do not disclose whether an account exists.

The subscription summary also publishes Stripe's trusted `billingCycleAnchor`. The AI backend uses it for monthly usage windows for both billing plans; it retains the first usage anchor across plan changes. Private usage counters are not exposed to browsers. See [Firestore schema](firestore-schema.md#ai-request-boundaries) for the request caps, atomic deductions and deadlines.

Authentication uses dedicated `/login`, `/signup`, and `/forgot-password` pages. Existing signed-in users visiting login or signup are redirected to their validated return destination when supplied, or home otherwise. Navigation preserves the upgrade request through login, signup, Google authentication, and password reset. After authentication, `/account?upgrade=true` (or `upgrade=monthly` / `upgrade=threeMonthPass`; old `upgrade=yearly` links open the current offers) opens the pricing modal automatically for eligible free accounts. The user chooses a plan in the modal before Checkout begins; subscribed accounts do not open the modal. Signed-in users can also open the same modal directly from the landing-page Upgrade button. External return URLs and loops back to authentication pages are rejected.

The learning guides and ML quizzes already shipped in the static export remain public. The Mac app's backend verifies the `subscribed` claim and `users/{uid}.subscription.subscribed` on every request; hiding frontend content is not an authorization boundary.

## Mac app sign-in

The Mac app opens `/login` with `/desktop-auth` as the `next` destination, passing a random attempt state and the SHA-256 fingerprint of a secret it keeps in memory. The browser asks the user to confirm their account, then calls `createDesktopAuthCode` to approve the attempt and tells the user to return to the app. The Mac app checks `exchangeDesktopAuthCode` in the background, proving it holds the secret to redeem the approval for a custom token. Older Mac builds still receive a link the user can click to deliver a one-time code.

Those two functions live in SWECompanionCore, which documents the flow in its README, because that codebase deploys automatically and also hosts the `claude` function. The website calls them by name, like its own callables. `claude` admits only tokens with the `subscribed` claim set by the billing functions here, so this claim is what the app shows as Free or Pro. The app's Upgrade button opens `/account?upgrade=true`, so the pricing modal opens after browser authentication. Updated Mac builds are required to send this upgrade request.

## Checks

Run `npm run billing:test`, `npm run billing:build`, `npx tsc --noEmit`, and `npm run build`. With sandbox `STRIPE_SECRET_KEY` set, run `node --import tsx functions/scripts/verifyIntroBilling.ts` for isolated Stripe test-clock verification of the upfront charge, portal cancellation configuration, expiry without a second charge, and successful monthly renewal. It creates temporary test records and cleans them up without changing the published catalog or portal configuration.

The tests cover cancellation timing, nonpayment, product and sandbox isolation, multiple subscription histories, preserving a single public credential error, and preventing diagnostic leakage.

For emulator work, start `firebase emulators:start --only auth,firestore,functions --project demo-swecompanion`, use that demo project in a separate local public configuration, and set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`. Put sandbox-only secrets in the ignored `functions/.secret.local`. The browser connects only in development; production builds cannot activate emulators. Use the signing secret from `stripe listen` when forwarding events locally.

Official references: [Firebase callable functions](https://firebase.google.com/docs/functions/callable), [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [signed webhooks](https://docs.stripe.com/webhooks), and [subscription events](https://docs.stripe.com/billing/subscriptions/webhooks).

## Sandbox verification — November 3, 2026

The functions and rules were deployed to `swecompanion`. The frontend was verified locally and built successfully; publishing Hosting remains a separate release step because this checkout contains other unpublished edits.

Nine business-rule tests, TypeScript, targeted lint checks, and the full static production build passed. A disposable account completed a real sandbox Checkout using the standard test card, received the `subscribed` claim while retaining an unrelated existing claim, and displayed its paid invoice with receipt/PDF links. The portal changed monthly billing to yearly and canceled renewal; the webhook retained active access through the paid period. An immediate test cancellation then revoked the claim and blocked an old signed token from reading protected content.

Additional checks rejected unauthenticated calls, invalid plans, unapproved return origins, forged webhook signatures, browser writes to billing documents, access to private customer mappings, another customer's invoice cursor, and a duplicate subscription purchase. Replayed and out-of-order events did not corrupt access. Password reauthentication and updating were checked against the authentication service, including rejection of the old password afterward. Email privacy protection and authorized Google sign-in domains were checked in project configuration.

## Firestore layout

See [Firestore schema](firestore-schema.md) for the paths, access boundaries, and pre-release reset. Run `bash scripts/test_firestore.sh` to test rules, merged subscription persistence, and ended billing sessions against local Auth/Firestore emulators. Login codes are at `system/auth/desktopAuthCodes/{hash}`; the `desktopAuthCodes.expiresAt` collection-group TTL still applies.
