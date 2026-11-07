import type { Metadata } from "next";
import { SystemDesignHub } from "@/components/mlsystemdesign/SystemDesignHub";
import { RRP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { rrpDesignProblems } from "@/lib/rrpSystemDesignData";

export const metadata: Metadata = {
  title: "Recommendation, Ranking & Prediction System Design — 6 Interview Problems",
  description: "Six ML system design lessons covering feeds, search ranking, ad prediction, real-time personalization, payment fraud, and product recommendations.",
  alternates: { canonical: RRP_SYSTEM_DESIGN_PATH },
};

export default function RrpSystemDesignPage() {
  const problems = rrpDesignProblems.map(({ id, title, summary, pattern }) => ({ id, title, summary, pattern }));
  return <SystemDesignHub key="rrp" topicId="rrp" problems={problems} />;
}
