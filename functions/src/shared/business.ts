/** Public business details shared by the website and sandbox Checkout. */
export const BUSINESS = {
  name: "SWECompanion",
  siteUrl: "https://www.swecompanion.com",
  location: "Washington, United States",
  supportEmail: "support@swecompanion.com",
  policyDate: "November 20, 2026",
  refundSummary: "If you are dissatisfied, contact support@swecompanion.com. Refund requests are reviewed case by case; approval is not guaranteed. Your statutory rights are unaffected.",
} as const;

/** New presentation versions deliberately replace open sessions and interrupted creation attempts. */
export const CHECKOUT_PRESENTATION_VERSION = `itemized-adaptive-v3:${BUSINESS.siteUrl}`;

export const CHECKOUT_TRUST_MESSAGE = [
  `[Terms](${BUSINESS.siteUrl}/terms) · [Privacy](${BUSINESS.siteUrl}/privacy) · [Contact](${BUSINESS.siteUrl}/contact) · [Refund policy](${BUSINESS.siteUrl}/refund-policy)`,
  `Support: [${BUSINESS.supportEmail}](mailto:${BUSINESS.supportEmail})`,
  "Refunds reviewed case-by-case; approval is not guaranteed. Statutory rights unaffected.",
].join("\n\n");
