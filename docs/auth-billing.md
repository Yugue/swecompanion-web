# Authentication and sandbox billing

The static Next.js website uses Firebase Authentication (email/password and Google). Payment operations run in second-generation Firebase Functions, without an extension. Card details are collected only in hosted Checkout and the customer portal.

## One pricing definition

`functions/src/shared/pricing.ts` is imported by the frontend, backend, and catalog synchronization script. Enter each plan amount in integer cents. Current offers are USD 149/month (recurring) and USD 349 upfront for the first three calendar months, then USD 149/month until canceled. The website derives the introductory savings from those amounts. Annual billing is no longer purchasable; existing subscriptions keep their agreed price and access. The monthly product ID is `swecompanion_pro`; the paid three-month item uses `swecompanion_pro_three_months`, named **SWECompanion PRO 3-month membership**. Lookup keys include the interval, currency, and amount.

To change prices, edit that file, run `npm run billing:sync -- --prepare` with the sandbox `STRIPE_SECRET_KEY` in the environment, deploy the functions, then run `npm run billing:sync` to retire old purchase links. Deploy the website from the same version. The prepare step keeps the previous backend usable during rollout. The script creates immutable prices, selects the monthly default, retires old purchase prices and open Checkout links, enables cancellation at the paid period end, and disables portal plan switching using `STRIPE_PORTAL_CONFIGURATION_ID` in `functions/.env.swecompanion`. Existing subscriptions retain their agreed price. Old prices are not deleted.

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

Configure the portal for invoice history, payment-method updates, and cancellation at the period end. Catalog sync disables subscription plan switching so annual prices cannot be selected. After a verified three-month payment, the backend creates the deferred monthly subscription using the saved payment method, so its renewal can be canceled through the same portal. Legacy one-time passes retain their original nonrenewing terms. The current sandbox account is `acct_1UXmDDAM0OhRYdVT`; its portal configuration is `bpc_1UXmUVAM0OhRYdVTZTk2wQ8Z`.

## Access and lifecycle

Authenticated callable functions derive the user ID from the validated token. Browsers supply only a plan choice and an allowlisted return origin; they cannot choose a customer, subscription, price, amount, or claim. A transaction lease serializes checkout and claim updates for each account. Existing open checkouts are reused, and nonterminal subscriptions prevent duplicate purchases. Persisted idempotency keys cover interrupted checkout creation.

The signed webhook validates the raw request body and sandbox mode, resolves the customer through server-only mappings, retrieves current subscription state to handle out-of-order delivery, and ignores already processed event IDs. It merges `subscribed` into existing custom claims. An active subscription for our product grants access. A `trialing` subscription grants access only for our tagged paid introduction after the upfront payment is verified: matching customer, upfront price, quantity, amount, currency, and paid status. The original introduction uses its initial subscription invoice; the current paid Checkout uses its stored purchase and successful charge, linked to the renewal by Checkout ID, customer and paid-period timestamps. An ordinary free trial grants no access. Incomplete, unpaid, overdue, paused, expired, and canceled subscriptions do not grant access. Cancellation at the period end keeps paid access enabled until cancellation takes effect.

New three-month purchases use Checkout `mode=payment` with exactly one USD 349 item named **SWECompanion PRO 3-month membership**. Checkout saves the card for subsequent off-session payments, generates a paid invoice, and explicitly discloses the USD 149 monthly renewal after three calendar months. There is no free-trial item in Checkout. Once the stored Checkout, owner, price, amount, currency, line item, PaymentIntent and successful charge are verified, reconciliation creates the monthly subscription with its first charge deferred to exactly three calendar months from payment. Stripe's internal `trialing` status is used only for that post-payment deferral. It grants no access without the matching verified, unrefunded and undisputed upfront purchase. A refund or blocking dispute during the paid period cancels the deferred renewal and revokes paid access.

Subscription creation is serialized under the account lock and idempotent per paid Checkout. Reconciliation searches all subscription history by the paid Checkout ID before creation, so retries cannot recreate a canceled renewal after Stripe's idempotency window expires. Expired and legacy nonrenewing purchases never create a new renewal. The account summary publishes the upfront amount and `renewalAmount` during the introduction, then the regular monthly price afterward. The original payment timestamp remains the monthly usage anchor. The account's **Manage plan** button opens Stripe's portal, where cancellation stops future renewal while retaining access through the paid period.

The paid Checkout price has a new lookup key and dedicated product, so neither old trial-based Checkouts nor legacy nonrenewing Checkouts are reused for the new offer. Coordinate catalog preparation, backend deployment, catalog retirement, and Hosting publication. Catalog sync retires old purchase prices and Checkout links only after deployment; `--prepare` leaves them usable during rollout. Existing paid trial-based subscriptions retain their original reconciliation and renewal behavior. Existing paid legacy passes remain payment-mode purchases and continue to reconcile against their stored checkout price and duration. Their refund/dispute and expiry rules are preserved. The hourly `expirePasses` task also reconciles paid introductory summaries at the boundary; the Core API independently checks `currentPeriodEnd` on each request.

For the internal deferred renewal, enable Stripe's **Send a reminder email seven days before a free trial ends** in [subscription messaging settings](https://dashboard.stripe.com/settings/billing/automatic), including the account/manage-plan link. Stripe treats the deferred recurring portion as a trial for this setting. This account-level email setting is managed in the Dashboard and is not configured by the catalog script. See [Stripe's introductory-offer guidance](https://support.stripe.com/questions/2020-visa-trial-subscription-requirement-changes-faq).

`users/{uid}` holds the owner-readable profile and server-owned `subscription` summary. Clients can edit only profile fields; they cannot change subscription access. `users/{uid}/private/billing` holds the Stripe customer mapping, checkout attempts and lock. The shared backend uses `users/{uid}/private/rateLimits` for the 60-per-minute AI limit and the separate 10-per-minute desktop-login limit. `system/stripe/customers/{customerId}` is the reverse lookup and `system/stripe/events/{eventId}` holds webhook receipts. Private documents and everything under `system` deny all browser access. Quiz content ships with the website; there is no Firestore quiz collection.

After claims update, the billing listener forces an ID-token refresh. The account page also reconciles current billing state when opened or returned from Checkout; the return query alone never grants access. Password changes require reauthentication with the current password. Password-reset confirmations do not disclose whether an account exists.

The subscription summary also publishes Stripe's trusted `billingCycleAnchor`. The AI backend uses it for monthly usage windows for both billing plans; it retains the first usage anchor across plan changes. Private usage counters are not exposed to browsers. See [Firestore schema](firestore-schema.md#ai-request-boundaries) for the request caps, atomic deductions and deadlines.

Authentication uses dedicated `/login`, `/signup`, and `/forgot-password` pages. Existing signed-in users visiting login or signup are redirected to their validated return destination when supplied, or home otherwise. Navigation preserves the upgrade request through login, signup, Google authentication, and password reset. After authentication, `/account?upgrade=true` (or `upgrade=monthly` / `upgrade=threeMonthPass`; old `upgrade=yearly` links open the current offers) opens the pricing modal automatically for eligible free accounts. The user chooses a plan in the modal before Checkout begins; subscribed accounts do not open the modal. Signed-in users can also open the same modal directly from the landing-page Upgrade button. External return URLs and loops back to authentication pages are rejected.

The learning guides and ML quizzes already shipped in the static export remain public. The Mac app's backend verifies the `subscribed` claim and `users/{uid}.subscription.subscribed` on every request; hiding frontend content is not an authorization boundary.

## Mac app sign-in

The Mac app opens `/login` with `/desktop-auth` as the `next` destination, passing a random attempt state and the SHA-256 fingerprint of a secret it keeps in memory. The browser asks the user to confirm their account, then calls `createDesktopAuthCode` to approve the attempt and tells the user to return to the app. The Mac app checks `exchangeDesktopAuthCode` in the background, proving it holds the secret to redeem the approval for a custom token. Older Mac builds still receive a link the user can click to deliver a one-time code.

Those two functions live in SWECompanionCore, which documents the flow in its README, because that codebase deploys automatically and also hosts the `claude` function. The website calls them by name, like its own callables. `claude` admits only tokens with the `subscribed` claim set by the billing functions here, so this claim is what the app shows as Free or Pro. The app's Upgrade button opens `/account?upgrade=true`, so the pricing modal opens after browser authentication. Updated Mac builds are required to send this upgrade request.

## Checks

Run `npm run billing:test`, `npm run billing:build`, `npx tsc --noEmit`, and `npm run build`. With sandbox `STRIPE_SECRET_KEY` set, run `node --import tsx functions/scripts/verifyIntroBilling.ts` for isolated Stripe test-clock verification of the single paid Checkout item, saved-card upfront payment, portal cancellation configuration, expiry without a second charge, and successful monthly renewal. Hosted card entry is a separate browser check; the script verifies the Checkout request and runs the production renewal handler against real sandbox payments. It creates temporary test records and cleans them up without changing the published catalog or portal configuration.

The tests cover cancellation timing, nonpayment, product and sandbox isolation, multiple subscription histories, preserving a single public credential error, and preventing diagnostic leakage.

For emulator work, start `firebase emulators:start --only auth,firestore,functions --project demo-swecompanion`, use that demo project in a separate local public configuration, and set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`. Put sandbox-only secrets in the ignored `functions/.secret.local`. The browser connects only in development; production builds cannot activate emulators. Use the signing secret from `stripe listen` when forwarding events locally.

Official references: [Firebase callable functions](https://firebase.google.com/docs/functions/callable), [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [signed webhooks](https://docs.stripe.com/webhooks), and [subscription events](https://docs.stripe.com/billing/subscriptions/webhooks).

## Sandbox verification — November 3, 2026

The functions and rules were deployed to `swecompanion`. The frontend was verified locally and built successfully; publishing Hosting remains a separate release step because this checkout contains other unpublished edits.

Nine business-rule tests, TypeScript, targeted lint checks, and the full static production build passed. A disposable account completed a real sandbox Checkout using the standard test card, received the `subscribed` claim while retaining an unrelated existing claim, and displayed its paid invoice with receipt/PDF links. The portal changed monthly billing to yearly and canceled renewal; the webhook retained active access through the paid period. An immediate test cancellation then revoked the claim and blocked an old signed token from reading protected content.

Additional checks rejected unauthenticated calls, invalid plans, unapproved return origins, forged webhook signatures, browser writes to billing documents, access to private customer mappings, another customer's invoice cursor, and a duplicate subscription purchase. Replayed and out-of-order events did not corrupt access. Password reauthentication and updating were checked against the authentication service, including rejection of the old password afterward. Email privacy protection and authorized Google sign-in domains were checked in project configuration.

## Firestore layout

See [Firestore schema](firestore-schema.md) for the paths, access boundaries, and pre-release reset. Run `bash scripts/test_firestore.sh` to test rules, merged subscription persistence, and ended billing sessions against local Auth/Firestore emulators. Login codes are at `system/auth/desktopAuthCodes/{hash}`; the `desktopAuthCodes.expiresAt` collection-group TTL still applies.


## Checkout trust details — November 20, 2026

Canonical business website: `https://www.swecompanion.com`. The Firebase `swecompanion.web.app` hostname is a temporary holder, not the business's canonical URL. Source metadata, sitemap/robots defaults, environment examples and Checkout policy/contact links use the canonical domain. The site has `/terms`, `/privacy`, `/refund-policy`, and `/contact` pages. The owner identified the operator as SWECompanion, Washington, United States, with support at `support@swecompanion.com`.

Refunds are reviewed case by case after a customer contacts support; there is no automatic approval, promised review deadline, or guaranteed refund window. Mandatory statutory rights are preserved. The privacy notice reflects Firebase account/billing records, Stripe payment processing, Anthropic AI processing, local screenshot caches/conversation state, and browser-local learning progress. The policies include legally permitted warranty/liability limits; they cannot eliminate legal obligations or liability.

All Stripe mutations in this trust update were restricted to sandbox account `acct_1UXmDDAM0OhRYdVT`. The existing products are named **SWECompanion PRO subscription** and **SWECompanion PRO 3-month membership**. The subscription name accommodates legacy annual subscriptions on the same product. Descriptions identify the membership concisely; the three-month renewal and cancellation terms appear above Pay, and the linked Terms explain monthly allowance expiry and paid-period access. Product/price IDs, prices, billing intervals, entitlements, billing portal settings and currency conversion settings were left unchanged. Catalog synchronization uses the same names/descriptions to preserve the Dashboard copy; no catalog sync was run for this trust update.

### Sandbox display and verification

The successful-payment and refund receipt-email switches remained enabled after reload. The receipt branding preview displayed the existing business icon, sandbox account name and colors. **Prefer logo over icon** is off.

Stripe's native Public details screen redirects to the live activation flow even from this sandbox. Its API also rejects updating the account's own business profile, allowing that method only for connected accounts. The live account was not activated or modified. Consequently the account-level support email/reply-to, support website and native legal URL fields remain unconfigured; their display toggles remain off to avoid publishing the old personal reply-to address.

The sandbox integration provides the requested customer-facing details directly instead:

- `branding_settings.display_name` shows **SWECompanion**, alongside the existing business icon.
- `custom_text.after_submit` displays clickable Terms, Privacy, support email, Contact and Refund Policy links immediately below the payment button for both plans.
- `functions/src/shared/business.ts` defines the public business identity, canonical website, support email and approved refund summary, shared with the policy pages.
- Open sessions and interrupted creation attempts are versioned with `CHECKOUT_PRESENTATION_VERSION`; older presentation versions are replaced so returning customers receive the corrected links without reusing an incompatible Stripe idempotency key.

The Dashboard refund-policy URL was changed to `https://www.swecompanion.com/refund-policy` and the case-by-case summary saved. However, real Checkout inspection showed that leaving the standard refund/return/exchange badges off makes Stripe's native Returns panel say **No refunds or exchanges**, contradicting discretionary review. The native preset panel was therefore disabled. The accurate case-by-case summary and full policy link are displayed directly under the payment button instead; no fixed refund window or blanket no-refunds promise was introduced.

Visual inspection of fresh hosted sandbox Checkouts confirmed the icon and business name together, correct $149/month and $349 introductory offers, all five legal/support link destinations, and absence of the misleading Returns panel. Authenticated calls to the deployed sandbox backend verified both plans, replacing an older open presentation and reusing the current presentation. Disposable verification accounts, customers and billing records were cleaned up. The 43 billing tests, backend build, website build and targeted lint passed. Only `createCheckout` was deployed for this follow-up; portal functions/configuration and the live Stripe account were untouched. Website source/canonical metadata was prepared; Hosting was not republished in this sandbox-only follow-up.

### Checkout appearance and local currency

Both plans use white Checkout branding, the SWECompanion icon in the store header and product row, concise membership descriptions, promotion-code entry, and an itemized subtotal/total summary. `allow_promotion_codes` and `adaptive_pricing.enabled` are true on every new Checkout; presentation version `itemized-adaptive-v3` replaces older sessions. The owner explicitly requested Adaptive Pricing in this follow-up, superseding the earlier instruction to leave currency conversion unchanged. Base USD prices, billing intervals, benefits, and billing portal settings remain unchanged. Product images use the existing hosted brand icon asset; customer-facing policy links retain the canonical business domain.

Stripe determines the customer's available local currency and exchange rate. Its Session/PaymentIntent amounts remain in the USD integration currency, while `presentment_details` records the local payment (see Stripe's [Adaptive Pricing documentation](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing.md?payment-ui=stripe-hosted)). Monthly subscriptions created by Checkout use Stripe's local-currency recurring-payment behavior. The separate monthly renewal after the introductory purchase remains the disclosed $149 USD/month; no local recurring price or billing interval was introduced.

Introductory fulfillment verifies the original price ID, quantity, USD catalog subtotal, Stripe-computed discount, item/session totals, and matching charge/customer/payment intent. Discounts affect the actual paid amount, not access duration or the later $149 monthly renewal. A 100% promotion requires a completed zero-total Checkout (`paid` with invoice creation, or `no_payment_required`) and its matching paid zero-total invoice; it retains three-month access. With no saved card, Stripe cancels the deferred renewal at period end unless a payment method has been added. No discount is copied from the upfront purchase onto the separate monthly renewal. Monthly subscription discounts are handled by Stripe on that subscription.

47 billing checks cover discounted payment totals, zero-total invoice ownership, local presentment, renewal creation, and existing access protections. Hosted sandbox inspection confirmed CAD/USD selection, both icons, concise copy, promotion-code entry and totals on both plans. A temporary 10% code correctly reduced the CAD total; an actual 100% discounted Checkout produced a paid invoice, passed entitlement verification, and created the correctly deferred renewal. Authenticated calls verified both deployed plans and unchanged base prices. Only the four functions that create or reconcile checkout access are deployed for this change; the portal function/configuration is unchanged. Temporary verification promotions are deactivated and preview sessions expired after inspection.

The sandbox test return reached a GoDaddy parked page for `www.swecompanion.com`; connect the canonical domain to the app before relying on its return or legal/support URLs in production.

### Copying to production later

Do not run catalog synchronization just to copy branding: it also manages prices and portal features. Copy only the requested product names/descriptions, branding preference and successful-payment/refund email switches in the production Dashboard. Set the native production public fields when that account is ready:

| Field | Value |
| --- | --- |
| Business name | SWECompanion |
| Website | `https://www.swecompanion.com` |
| Terms | `https://www.swecompanion.com/terms` |
| Privacy | `https://www.swecompanion.com/privacy` |
| Refund policy | `https://www.swecompanion.com/refund-policy` |
| Support email | `support@swecompanion.com` |
| Support website | `https://www.swecompanion.com/contact` |

Confirm that the policy/contact pages are publicly reachable on the canonical domain. Carry over the Checkout integration's display-name and trust-message settings as well: the sandbox's native Dashboard legal/support toggles are not the mechanism showing those links. Enable native legal/support display only after the correct public details save. Preserve the case-by-case refund wording and avoid Stripe's preset refund window/no-refunds panel unless the business policy changes. Retain the existing portal, price, interval, benefit and currency-conversion configuration. Switching billing out of sandbox still requires the explicit code/configuration review documented above; do not replace a secret with a live key without that change.
