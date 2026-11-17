import type { Metadata } from "next";
import { Cta } from "@/components/site/cta";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Nav } from "@/components/site/nav";
import { Pricing } from "@/components/site/pricing";
import { Undetectability } from "@/components/site/undetectability";

export const metadata: Metadata = {
  title: { absolute: "SWECompanion — A quiet companion for interview prep" },
  description:
    "Capture a problem and generate clean code, precise fixes, or complete system designs with one key. Explore real SWECompanion examples and try the macOS app free.",
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
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
