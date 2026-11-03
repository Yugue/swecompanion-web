import { randomUUID } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret, defineString } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { PRICING, isBillingPlan, priceLookupKey, type BillingPlan } from "./shared/pricing";
import type { InvoicePage, SubscriptionSummary } from "./shared/billing";
import { isOurSubscription, subscriptionSummary } from "./subscriptions";

initializeApp();
const db = getFirestore();
const adminAuth = getAuth();
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const siteUrl = defineString("SITE_URL", { default: "https://swecompanion.web.app" });
const localSiteUrl = defineString("LOCAL_SITE_URL", { default: "" });
const portalConfiguration = defineString("STRIPE_PORTAL_CONFIGURATION_ID", { default: "" });
setGlobalOptions({ region: "us-central1", maxInstances: 10, timeoutSeconds: 120 });

function stripeClient(): Stripe {
  const key = stripeSecret.value();
  // Sandbox is intentional. Going live requires an explicit code/configuration change.
  if (!/^(sk|rk)_test_/.test(key)) throw new Error("Sandbox key required");
  return new Stripe(key, { timeout: 15_000, maxNetworkRetries: 1 });
}

function accountUrl(request: CallableRequest): string {
  const url = new URL(siteUrl.value());
  if (url.protocol !== "https:" && !(process.env.FUNCTIONS_EMULATOR && url.hostname === "localhost")) {
    throw new Error("Invalid site origin");
  }
  const requested = request.data?.returnOrigin;
  if (requested === undefined || requested === url.origin) return `${url.origin}/account`;
  // Optional explicit localhost origin for sandbox development, never arbitrary return URLs.
  const local = localSiteUrl.value();
  if (local && requested === local && new URL(local).hostname === "localhost") return `${local}/account`;
  throw new HttpsError("invalid-argument", "Unable to return to this site.");
}

function requireUser(request: CallableRequest): string {
  if (!request.auth) throw new HttpsError("unauthenticated", "Please sign in to continue.");
  return request.auth.uid;
}

function safeCall<T>(handler: (request: CallableRequest) => Promise<T>) {
  return onCall({ secrets: [stripeSecret], cors: true }, async (request) => {
    requireUser(request);
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      // Do not log requests, tokens, or raw provider errors containing customer data.
      logger.error("Billing request failed", { type: error instanceof Error ? error.name : "unknown" });
      throw new HttpsError("internal", "Unable to complete this request. Please try again.");
    }
  });
}

/** Serialize all subscription/claim writes and checkout creation for the same account. */
async function withAccountLock<T>(uid: string, action: () => Promise<T>): Promise<T> {
  const ref = db.doc(`billingCustomers/${uid}`);
  const lockId = randomUUID();
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if ((snapshot.get("lockUntil")?.toMillis() ?? 0) > Date.now()) {
      throw new HttpsError("aborted", "Your account is updating. Please try again shortly.");
    }
    transaction.set(ref, { lockId, lockUntil: Timestamp.fromMillis(Date.now() + 180_000) }, { merge: true });
  });
  try {
    return await action();
  } finally {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (snapshot.get("lockId") === lockId) {
        transaction.update(ref, { lockId: FieldValue.delete(), lockUntil: FieldValue.delete() });
      }
    });
  }
}

async function customerFor(uid: string, stripe: Stripe, create = false): Promise<string | null> {
  const ref = db.doc(`billingCustomers/${uid}`);
  const customerId = (await ref.get()).get("customerId") as string | undefined;
  if (customerId) return customerId;
  if (!create) return null;
  const user = await adminAuth.getUser(uid);
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.displayName,
    metadata: { firebaseUID: uid, application: "swecompanion" },
  }, { idempotencyKey: `customer:${uid}` });
  // The reverse mapping is created atomically, and is never writable by a browser.
  const batch = db.batch();
  batch.set(ref, { customerId: customer.id }, { merge: true });
  batch.set(db.doc(`stripeCustomers/${customer.id}`), { uid });
  await batch.commit();
  return customer.id;
}

async function subscriptionsFor(stripe: Stripe, customerId: string): Promise<Stripe.Subscription[]> {
  const subscriptions: Stripe.Subscription[] = [];
  for await (const subscription of stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 })) {
    subscriptions.push(subscription);
  }
  return subscriptions;
}

async function syncSubscription(uid: string, stripe: Stripe, customerId: string): Promise<SubscriptionSummary> {
  // Read current state rather than trusting the event snapshot: delivery order is not guaranteed.
  const summary = subscriptionSummary(await subscriptionsFor(stripe, customerId));
  const user = await adminAuth.getUser(uid);
  const prior = user.customClaims ?? {};
  const claimsVersion = randomUUID();
  await adminAuth.setCustomUserClaims(uid, { ...prior, subscribed: summary.subscribed, billingVersion: claimsVersion });
  const result = { ...summary, claimsVersion };
  // Publish only after claims succeed, so the listener can safely force-refresh the token.
  await db.doc(`billing/${uid}`).set({ ...result, updatedAt: FieldValue.serverTimestamp() });
  return result;
}

async function catalogPrice(stripe: Stripe, plan: BillingPlan): Promise<Stripe.Price> {
  const prices = await stripe.prices.list({ active: true, lookup_keys: [priceLookupKey(plan)], limit: 1 });
  const price = prices.data[0];
  const expected = PRICING[plan];
  if (!price || price.livemode || price.product !== PRICING.productId ||
    price.unit_amount !== expected.amount || price.currency !== PRICING.currency ||
    price.recurring?.interval !== expected.interval || price.recurring.interval_count !== 1) {
    throw new HttpsError("failed-precondition", "Subscriptions are temporarily unavailable. Please try again later.");
  }
  return price;
}

export const createCheckout = safeCall(async (request) => {
  const uid = requireUser(request);
  const plan: unknown = request.data?.plan;
  if (!isBillingPlan(plan)) throw new HttpsError("invalid-argument", "Please choose a billing plan.");
  const returnUrl = accountUrl(request);
  return withAccountLock(uid, async () => {
    const stripe = stripeClient();
    const customerId = (await customerFor(uid, stripe, true))!;
    const subscriptions = (await subscriptionsFor(stripe, customerId)).filter(isOurSubscription);
    if (subscriptions.some((subscription) => !["canceled", "incomplete_expired"].includes(subscription.status))) {
      throw new HttpsError("already-exists", "You already have a subscription. Manage it in your account.");
    }
    const price = await catalogPrice(stripe, plan);
    const ref = db.doc(`billingCustomers/${uid}`);
    const existing = await ref.get();
    const checkoutId = existing.get("checkoutId") as string | undefined;
    if (checkoutId) {
      const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
      if (checkout.status === "open" && checkout.url) {
        if (existing.get("checkoutPlan") === plan && existing.get("checkoutPrice") === price.id && existing.get("checkoutReturnUrl") === returnUrl) return { url: checkout.url };
        await stripe.checkout.sessions.expire(checkout.id);
      }
      if (checkout.status === "complete") {
        // A completed checkout may still be waiting for subscription activation.
        const subscriptionId = typeof checkout.subscription === "string" ? checkout.subscription : checkout.subscription?.id;
        const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
        if (subscription && !["canceled", "incomplete_expired"].includes(subscription.status)) {
          throw new HttpsError("already-exists", "Your subscription is being updated. Check your account shortly.");
        }
      }
    }
    // Persist the attempt before calling Stripe, so retries after a crash use the same key.
    const pending = existing.get("pendingCheckout") as { id: string; plan: string; priceId: string; returnUrl: string; createdAt: number } | undefined;
    const attempt = pending?.plan === plan && pending.priceId === price.id && pending.returnUrl === returnUrl && Date.now() - pending.createdAt < 23 * 60 * 60 * 1000
      ? pending : { id: randomUUID(), plan, priceId: price.id, returnUrl, createdAt: Date.now() };
    await ref.set({ pendingCheckout: attempt }, { merge: true });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: uid,
      line_items: [{ price: price.id, quantity: 1 }],
      payment_method_types: ["card"],
      adaptive_pricing: { enabled: false },
      subscription_data: { metadata: { firebaseUID: uid, application: "swecompanion" } },
      metadata: { firebaseUID: uid },
      success_url: `${returnUrl}?checkout=success`,
      cancel_url: `${returnUrl}?checkout=canceled`,
    }, { idempotencyKey: `checkout:${uid}:${attempt.id}` });
    await ref.set({ checkoutId: session.id, checkoutPlan: plan, checkoutPrice: price.id, checkoutReturnUrl: returnUrl, pendingCheckout: FieldValue.delete() }, { merge: true });
    if (!session.url) throw new Error("Missing checkout URL");
    return { url: session.url };
  });
});

export const refreshSubscription = safeCall(async (request) => {
  const uid = requireUser(request);
  return withAccountLock(uid, async () => {
    const stripe = stripeClient();
    const customerId = await customerFor(uid, stripe);
    return customerId ? syncSubscription(uid, stripe, customerId) : null;
  });
});

export const createBillingPortal = safeCall(async (request) => {
  const uid = requireUser(request);
  const stripe = stripeClient();
  const customerId = await customerFor(uid, stripe);
  if (!customerId) throw new HttpsError("not-found", "No subscription to manage yet.");
  const configuration = portalConfiguration.value();
  if (!configuration) throw new HttpsError("failed-precondition", "Account management is temporarily unavailable.");
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId, configuration, return_url: accountUrl(request),
  });
  return { url: session.url };
});

export const listInvoices = safeCall(async (request): Promise<InvoicePage> => {
  const uid = requireUser(request);
  const stripe = stripeClient();
  const customerId = await customerFor(uid, stripe);
  if (!customerId) return { invoices: [], hasMore: false };
  const cursor: unknown = request.data?.cursor;
  if (cursor !== undefined && (typeof cursor !== "string" || !/^in_[A-Za-z0-9]+$/.test(cursor))) {
    throw new HttpsError("invalid-argument", "Unable to load invoices.");
  }
  if (typeof cursor === "string") {
    const invoice = await stripe.invoices.retrieve(cursor);
    const owner = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    if (owner !== customerId) throw new HttpsError("permission-denied", "Unable to load invoices.");
  }
  const page = await stripe.invoices.list({ customer: customerId, limit: 10, ...(cursor ? { starting_after: cursor as string } : {}) });
  return {
    invoices: page.data.map((invoice) => ({
      id: invoice.id, number: invoice.number, created: invoice.created,
      amount: invoice.total, currency: invoice.currency, status: invoice.status ?? "draft",
      url: invoice.hosted_invoice_url ?? null, pdf: invoice.invoice_pdf ?? null,
    })),
    hasMore: page.has_more,
  };
});

export const stripeWebhook = onRequest({ secrets: [stripeSecret, webhookSecret], cors: false }, async (request, response) => {
  if (request.method !== "POST") { response.status(405).send("Method not allowed"); return; }
  const signature = request.header("stripe-signature");
  if (!signature) { response.status(400).send("Invalid request"); return; }
  const stripe = stripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, signature, webhookSecret.value());
  } catch {
    response.status(400).send("Invalid request"); return;
  }
  if (event.livemode) { response.status(400).send("Invalid mode"); return; }
  const supported = new Set([
    "checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed",
    "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted",
    "customer.subscription.paused", "customer.subscription.resumed", "invoice.paid", "invoice.payment_failed",
  ]);
  if (!supported.has(event.type)) { response.sendStatus(200); return; }
  const object = event.data.object as { customer?: string | { id: string } | null };
  const customerId = typeof object.customer === "string" ? object.customer : object.customer?.id;
  if (!customerId) { response.sendStatus(200); return; }
  try {
    const uid = (await db.doc(`stripeCustomers/${customerId}`).get()).get("uid") as string | undefined;
    if (!uid) { response.sendStatus(200); return; }
    await withAccountLock(uid, async () => {
      const receipt = db.doc(`billingEvents/${event.id}`);
      if ((await receipt.get()).exists) return;
      // A signed event alone cannot link itself to an arbitrary account.
      if ((await db.doc(`billingCustomers/${uid}`).get()).get("customerId") !== customerId) throw new Error("Customer mismatch");
      await syncSubscription(uid, stripe, customerId);
      await receipt.set({ processedAt: FieldValue.serverTimestamp(), type: event.type });
    });
    response.sendStatus(200);
  } catch {
    logger.error("Subscription event failed", { eventId: event.id, type: event.type });
    response.status(500).send("Please retry");
  }
});
