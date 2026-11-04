import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function Page() { return <AuthPage mode="signin" />; }
