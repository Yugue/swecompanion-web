// Characterization checks reproduce current rule gaps. A finding is expected to be
// accepted until hardened; this script is an opt-in audit, not a passing security gate.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const project = process.env.GCLOUD_PROJECT!;
assert.match(project, /^demo-/);
assert.ok(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_AUTH_EMULATOR_HOST);
initializeApp({ projectId: project });
const auth = getAuth();
const db = getFirestore();
const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${project}/databases/(default)/documents`;
const results: { check: string; status: number; outcome: "protected" | "finding" }[] = [];

async function account() {
  const { uid } = await auth.createUser({ email: `${randomUUID()}@example.com` });
  const response = await fetch(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=test`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: await auth.createCustomToken(uid), returnSecureToken: true }),
  });
  assert.equal(response.status, 200);
  return { uid, token: ((await response.json()) as { idToken: string }).idToken };
}

async function client(path: string, token: string, fields?: object, mask: string[] = [], method?: string) {
  const query = new URLSearchParams();
  for (const name of mask) query.append("updateMask.fieldPaths", name);
  return fetch(`${base}/${path}?${query}`, {
    method: method ?? (fields ? "PATCH" : "GET"),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    ...(fields ? { body: JSON.stringify({ fields }) } : {}),
  });
}

async function observe(check: string, response: Response, status: number, outcome: "protected" | "finding") {
  assert.equal(response.status, status, check);
  results.push({ check, status, outcome });
}

async function main() {
  const owner = await account();
  const other = await account();
  const path = `users/${owner.uid}`;
  await db.doc(path).set({ email: "owner@example.com", displayName: "Owner", subscription: { subscribed: false } });
  await db.doc(`users/${other.uid}`).set({ email: "other@example.com" });
  await observe("cross-account profile edits denied", await client(`users/${other.uid}`, owner.token, { displayName: { stringValue: "Attacker" } }, ["displayName"]), 403, "protected");
  await observe("deleting a user document cannot erase its subscription controls", await client(path, owner.token, undefined, [], "DELETE"), 403, "protected");
  await observe("listing all users denied", await client("users", owner.token), 403, "protected");
  await observe("listing system documents denied", await client("system", owner.token), 403, "protected");
  await observe("nested field subscription tampering denied", await client(path, owner.token, { subscription: { mapValue: { fields: { subscribed: { booleanValue: true } } } } }, ["subscription.subscribed"]), 403, "protected");
  await observe("whole-document replacement cannot remove server-owned subscription", await client(path, owner.token, { email: { stringValue: "owner@example.com" } }), 403, "protected");
  await observe("subcollections underneath private billing remain denied", await client(`${path}/private/billing/extra/record`, owner.token, { data: { stringValue: "test" } }), 403, "protected");

  await observe("profile fields reject maps instead of strings", await client(path, owner.token, { displayName: { mapValue: { fields: { unexpected: { booleanValue: true } } } } }, ["displayName"]), 403, "protected");
  await observe("profile fields reject excessively long strings", await client(path, owner.token, { displayName: { stringValue: "x".repeat(5000) } }, ["displayName"]), 403, "protected");
  await observe("cloud progress is denied for unknown kinds", await client(`${path}/progress/arbitrary-${randomUUID()}`, owner.token, { arbitrary: { booleanValue: true } }), 403, "protected");
  await observe("cloud progress is denied even for known guides", await client(`${path}/progress/ml`, owner.token, { completed: { integerValue: "123" } }), 403, "protected");

  for (const action of ["revoked", "disabled", "deleted"] as const) {
    const user = await account();
    const ref = db.doc(`users/${user.uid}`);
    await ref.set({ email: "session@example.com" });
    if (action === "revoked") {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await auth.revokeRefreshTokens(user.uid);
    } else if (action === "disabled") await auth.updateUser(user.uid, { disabled: true });
    else await auth.deleteUser(user.uid);
    await observe(`${action} session's existing ID token can still read Firestore`, await client(ref.path, user.token), 200, "finding");
    await observe(`${action} session's existing ID token can still write Firestore`, await client(ref.path, user.token, { displayName: { stringValue: "stale-session" } }, ["displayName"]), 200, "finding");
  }
  console.log(JSON.stringify({ project, checks: results }, null, 2));
}
void main().catch((error) => { console.error(error); process.exitCode = 1; });
