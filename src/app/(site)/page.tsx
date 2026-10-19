import type { Metadata } from "next";
import { Cta } from "@/components/site/cta";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Nav } from "@/components/site/nav";
import { Pricing } from "@/components/site/pricing";
import { Proof } from "@/components/site/proof";
import { Undetectability } from "@/components/site/undetectability";

export const metadata: Metadata = {
  title: { absolute: "SWECompanion — A quiet companion for interview prep" },
  description:
    "A macOS companion that reads the problem on your screen and returns concise, optimal solutions — invisible to screen capture, screen share, and recording. Free to download, $299/mo to unlock.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Undetectability />
        <HowItWorks />
        <Proof />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
