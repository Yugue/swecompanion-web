/** Never render provider messages or error objects in the interface. */
export function authErrorMessage(error: unknown, mode: "signin" | "signup" | "reset" | "password" = "signin"): string | null {
  const code = (error as { code?: string } | null)?.code;
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return null;
  if (code === "auth/too-many-requests") return "Too many attempts. Please try again later.";
  if (code === "auth/network-request-failed") return "Unable to connect. Check your connection and try again.";
  if (code === "auth/popup-blocked") return "Allow pop-ups for this site and try again.";
  if (code === "auth/requires-recent-login") return "Please sign in again before changing your password.";
  if ((mode === "signup" || mode === "password") && (code === "auth/weak-password" || code === "auth/password-does-not-meet-requirements")) {
    return "Choose a stronger password with at least 8 characters.";
  }
  if (["auth/invalid-email", "auth/invalid-credential", "auth/invalid-login-credentials", "auth/wrong-password", "auth/user-not-found", "auth/missing-password", "auth/user-disabled"].includes(code ?? "")) {
    return "Incorrect email or password.";
  }
  if (mode === "signup") return "Unable to create an account with these details. Try signing in or resetting your password.";
  if (mode === "reset") return "Unable to send a reset link. Please try again.";
  if (mode === "password") return "Unable to change your password. Please try again.";
  return "Unable to sign in. Please try again.";
}
