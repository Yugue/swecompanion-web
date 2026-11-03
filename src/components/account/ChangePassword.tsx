"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { authErrorMessage } from "@/lib/authErrors";
import { Button } from "@/components/ui/button";

export function ChangePassword() {
  const { user, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const hasPassword = user?.providerData.some((provider) => provider.providerId === "password");

  if (!hasPassword) return <p className="text-sm text-muted-foreground">You sign in with Google. Manage your password in your Google account.</p>;
  if (!editing) return <div className="space-y-4">
    {success && <p role="status" className="text-sm text-accent-green">Your password has been changed.</p>}
    <Button type="button" variant="outline" className="h-10" onClick={() => {
      setError(null); setSuccess(false); setEditing(true);
    }}>Change password</Button>
  </div>;

  return <form aria-label="Change password" className="max-w-md space-y-4" noValidate onSubmit={async (event) => {
    event.preventDefault();
    if (busy) return;
    setError(null); setSuccess(false);
    if (!current) { setError("Enter your current password."); return; }
    if (password.length < 8) { setError("Choose a password with at least 8 characters."); return; }
    if (password !== confirm) { setError("Your new passwords do not match."); return; }
    if (password === current) { setError("Choose a different password from your current one."); return; }
    setBusy(true);
    try {
      await changePassword(current, password);
      setCurrent(""); setPassword(""); setConfirm(""); setSuccess(true); setEditing(false);
    } catch (error) { setError(authErrorMessage(error, "password")); }
    finally { setBusy(false); }
  }}>
    {[
      { id: "current-password", label: "Current password", value: current, set: setCurrent, autoComplete: "current-password" },
      { id: "new-password", label: "New password", value: password, set: setPassword, autoComplete: "new-password" },
      { id: "confirm-password", label: "Confirm new password", value: confirm, set: setConfirm, autoComplete: "new-password" },
    ].map((field) => <div key={field.id}>
      <label htmlFor={field.id} className="mb-2 block text-sm font-medium">{field.label}</label>
      <input id={field.id} type="password" required disabled={busy} autoComplete={field.autoComplete} value={field.value}
        onChange={(event) => field.set(event.target.value)}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" />
    </div>)}
    <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
    {error && <p role="alert" className="text-sm text-accent-red">{error}</p>}
    <div className="flex gap-3">
      <Button type="submit" disabled={busy} className="h-10">{busy ? "Updating…" : "Save password"}</Button>
      <Button type="button" variant="outline" disabled={busy} className="h-10" onClick={() => {
        setCurrent(""); setPassword(""); setConfirm(""); setError(null); setEditing(false);
      }}>Cancel</Button>
    </div>
  </form>;
}
