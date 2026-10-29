import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AuthProvider } from "@/lib/AuthProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swecompanion.web.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SWE Companion — Free L4–L6 Interview Prep",
    template: "%s · SWE Companion",
  },
  description:
    "A free, in-depth study guide for software engineering interviews: LeetCode patterns by topic and a 56-lesson Google ML domain interview curriculum, with mock-interview practice quizzes.",
  openGraph: {
    type: "website",
    siteName: "SWE Companion",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

// Applied before hydration so the default theme (light) never flashes dark first, and a
// returning visitor's saved choice is respected immediately.
const noFlashThemeScript = `
try {
  var saved = localStorage.getItem('theme_v1');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
