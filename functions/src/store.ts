import { FieldValue, getFirestore } from "firebase-admin/firestore";
import type { SubscriptionSummary } from "./shared/billing";

export const userRef = (uid: string) => getFirestore().doc(`users/${uid}`);
export const privateBillingRef = (uid: string) => getFirestore().doc(`users/${uid}/private/billing`);
export const stripeCustomerRef = (id: string) => getFirestore().doc(`system/stripe/customers/${id}`);
export const stripeEventRef = (id: string) => getFirestore().doc(`system/stripe/events/${id}`);

/** Replace only the server-owned summary; never overwrite the user's profile. */
export async function saveSubscription(uid: string, summary: SubscriptionSummary): Promise<void> {
  await userRef(uid).set({ subscription: { ...summary, updatedAt: FieldValue.serverTimestamp() } }, { mergeFields: ["subscription"] });
}
