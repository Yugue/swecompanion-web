import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

/** The landing page ported from SWECompanionCore. Its theme tokens, radii and fonts only resolve
 * inside .core-site (see globals.css), so it renders as designed without touching the guide. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`core-site min-h-screen antialiased ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
