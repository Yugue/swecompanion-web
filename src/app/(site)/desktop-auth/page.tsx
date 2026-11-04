import type { Metadata } from "next";
import { DesktopAuthPage } from "@/components/auth/DesktopAuthPage";

export const metadata: Metadata = { title: "Sign in to the Mac app", robots: { index: false, follow: false } };

export default function Page() { return <DesktopAuthPage />; }
