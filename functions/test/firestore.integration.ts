import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { before, test } from "node:test";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { privateBillingRef, saveSubscription, stripeCustomerRef, stripeEventRef, userRef } from "../src/store";

const project = process.env.GCLOUD_PROJECT!;
let owner: { uid: string; token: string };
let other: { uid: string; token: string };

async function account() {
  const { uid } = await getAuth().createUser({ email: `${randomUUID()}@example.com` });
  const reply = await fetch(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=test`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: await getAuth().createCustomToken(uid), returnSecureToken: true }),
  });
  assert.equal(reply.status, 200);
  return { uid, token: ((await reply.json()) as { idToken: string }).idToken };
}

/** REST uses real emulator-issued user tokens, so security rules are exercised. */
async function client(path: string, token?: string, fields?: object, mask: string[] = []) {
  const query = new URLSearchParams();
  for (const field of mask) query.append("updateMask.fieldPaths", field);
  return fetch(`http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${project}/databases/(default)/documents/${path}?${query}`, {
    method: fields ? "PATCH" : "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(fields ? { body: JSON.stringify({ fields }) } : {}),
  });
}

before(async () => {
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_AUTH_EMULATOR_HOST);
  assert.match(project, /^demo-/);
  initializeApp({ projectId: project });
  owner = await account();
  other = await account();
});

test("billing and profile writes preserve one another in the merged user document", async () => {
  await userRef(owner.uid).set({ email: "owner@example.com", displayName: "Owner" });
  await saveSubscription(owner.uid, {
    subscribed: true, status: "active", plan: "monthly", currentPeriodEnd: 200, billingCycleAnchor: 100,
    cancelAtPeriodEnd: false, amount: 29900, currency: "usd", claimsVersion: "v1",
  });
  const snapshot = await userRef(owner.uid).get();
  assert.equal(snapshot.get("email"), "owner@example.com");
  assert.equal(snapshot.get("displayName"), "Owner");
  assert.equal(snapshot.get("subscription.subscribed"), true);
  assert.ok(snapshot.get("subscription.updatedAt"));

  const changed = await client(`users/${owner.uid}`, owner.token, { displayName: { stringValue: "Updated" } }, ["displayName"]);
  assert.equal(changed.status, 200, await changed.text());
  assert.equal((await userRef(owner.uid).get()).get("subscription.subscribed"), true);
  assert.equal((await client(`users/${owner.uid}`, owner.token)).status, 200);
});

test("a browser can initialize its profile after the backend created the subscription", async () => {
  const user = await account();
  await userRef(user.uid).set({ subscription: { subscribed: false } });
  const { initializeApp: initClient, deleteApp } = await import("firebase/app");
  const { getAuth: clientAuth, connectAuthEmulator, signInWithCustomToken } = await import("firebase/auth");
  const { getFirestore: clientDb, connectFirestoreEmulator, doc, runTransaction, serverTimestamp, terminate } = await import("firebase/firestore");
  const app = initClient({ projectId: project, apiKey: "test" }, randomUUID());
  const auth = clientAuth(app);
  connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
  const db = clientDb(app);
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST!.split(":");
  connectFirestoreEmulator(db, host, Number(port));
  try {
    await signInWithCustomToken(auth, await getAuth().createCustomToken(user.uid));
    const ref = doc(db, "users", user.uid);
    await runTransaction(db, async (transaction) => {
      await transaction.get(ref);
      transaction.set(ref, { email: "profile@example.com", displayName: null, createdAt: serverTimestamp() }, { merge: true });
    });
    assert.equal((await userRef(user.uid).get()).get("subscription.subscribed"), false);
    assert.ok((await userRef(user.uid).get()).get("createdAt"));
    // A client cannot replace its creation timestamp afterward.
    assert.equal((await client(`users/${user.uid}`, user.token, { createdAt: { timestampValue: "2020-01-01T00:00:00Z" } }, ["createdAt"])).status, 403);
  } finally { await terminate(db); await deleteApp(app); }
});

test("users cannot create, alter or delete subscription access", async () => {
  const newcomer = await account();
  const paid = { subscription: { mapValue: { fields: { subscribed: { booleanValue: true } } } } };
  assert.equal((await client(`users/${newcomer.uid}`, newcomer.token, paid)).status, 403);
  assert.equal((await client(`users/${owner.uid}`, owner.token, paid, ["subscription"])).status, 403);
  assert.equal((await client(`users/${owner.uid}`, owner.token, {}, ["subscription"])).status, 403);
  assert.equal((await client(`users/${owner.uid}`, owner.token, { premium: { booleanValue: true } }, ["premium"])).status, 403);
});

test("profile values allow bounded strings and null, but reject other types and oversized values", async () => {
  for (const [field, max] of [["email", 320], ["displayName", 256]] as const) {
    for (const value of [{ nullValue: null }, { stringValue: "x".repeat(max) }]) {
      assert.equal((await client(`users/${owner.uid}`, owner.token, { [field]: value }, [field])).status, 200);
    }
    for (const value of [{ stringValue: "x".repeat(max + 1) }, { integerValue: "1" }, { mapValue: { fields: {} } }, { arrayValue: { values: [] } }]) {
      assert.equal((await client(`users/${owner.uid}`, owner.token, { [field]: value }, [field])).status, 403);
    }
  }
});

test("new profiles enforce the same value limits with a server creation timestamp", async () => {
  for (const [value, expected] of [[{ nullValue: null }, 200], [{ mapValue: { fields: {} } }, 403], [{ stringValue: "x".repeat(257) }, 403]] as const) {
    const user = await account();
    const name = `projects/${project}/databases/(default)/documents/users/${user.uid}`;
    const response = await fetch(`http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${project}/databases/(default)/documents:commit`, {
      method: "POST", headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ writes: [{ update: { name, fields: { displayName: value } },
        updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }] }] }),
    });
    assert.equal(response.status, expected, await response.text());
    assert.equal((await userRef(user.uid).get()).exists, expected === 200);
  }
});

test("profiles are private to the owner and progress has no client-accessible cloud storage", async () => {
  assert.equal((await client(`users/${owner.uid}`, other.token)).status, 403);
  assert.equal((await client(`users/${owner.uid}`)).status, 403);
  const path = `users/${owner.uid}/progress/ml`;
  const fields = { completed: { arrayValue: { values: [{ stringValue: "lesson-1" }] } } };
  assert.equal((await client(path, owner.token, fields)).status, 403);
  assert.equal((await client(path, owner.token)).status, 403);
  assert.equal((await client(path, other.token)).status, 403);
  assert.equal((await client(path, other.token, fields)).status, 403);
});

test("all private billing, counters, Stripe records and auth codes deny client access", async () => {
  const paths = [privateBillingRef(owner.uid).path, `users/${owner.uid}/private/rateLimits`, `users/${owner.uid}/private/usage`,
    stripeCustomerRef("cus_test").path, stripeEventRef("evt_test").path,
    "system/auth/desktopAuthCodes/hash", "system/stripe", "system/auth"];
  for (const path of paths) {
    await getFirestore().doc(path).set({ internal: true });
    assert.equal((await client(path, owner.token)).status, 403, path);
    assert.equal((await client(path, other.token)).status, 403, path);
    assert.equal((await client(path)).status, 403, path);
    assert.equal((await client(path, owner.token, { internal: { booleanValue: false } })).status, 403, path);
  }
});

test("removed top-level collections, including quizzes, deny all browser access", async () => {
  for (const collection of ["billing", "billingCustomers", "billingEvents", "stripeCustomers", "rateLimits", "ipRateLimits", "desktopAuthCodes", "quizzes"]) {
    const path = `${collection}/${owner.uid}`;
    await getFirestore().doc(path).set({ old: true });
    assert.equal((await client(path, owner.token)).status, 403, collection);
    assert.equal((await client(path, owner.token, { old: { booleanValue: false } })).status, 403, collection);
  }
});

test("billing refuses deleted and revoked login sessions before creating private data", async () => {
  // index initializes its default Admin app; reuse the one this test suite owns.
  const { deleteApp, getApp } = await import("firebase-admin/app");
  await deleteApp(getApp());
  const { refreshSubscription } = await import("../src/index");
  for (const end of [
    (uid: string) => getAuth().deleteUser(uid),
    (uid: string) => getAuth().revokeRefreshTokens(uid),
  ]) {
    const user = await account();
    await end(user.uid);
    await assert.rejects(refreshSubscription.run({
      data: {}, auth: { uid: user.uid, token: { auth_time: Math.floor(Date.now() / 1000) - 60 } },
    } as never), { code: "unauthenticated" });
    assert.equal((await privateBillingRef(user.uid).get()).exists, false);
  }
});
