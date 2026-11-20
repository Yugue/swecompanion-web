/** Only display known public messages; provider diagnostics can contain private billing data. */
export function billingErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === "functions/unauthenticated") return "Please sign in again to continue.";
  if (code === "functions/already-exists") return "You already have Pro access. Manage it in your account.";
  if (code === "functions/aborted") return "Your account is updating. Please try again shortly.";
  if (code === "functions/failed-precondition") return "Billing is temporarily unavailable. Please try again later.";
  if (code === "functions/invalid-argument") return "Unable to start billing from this page. Please reload and try again.";
  return "Unable to complete this request. Please try again.";
}
