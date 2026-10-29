import type { Metadata } from "next";
import { RlHub } from "@/components/rl/RlHub";
import { RL_PATH } from "@/lib/mlDomains";
import { rlTopicCount, rlParts } from "@/lib/rlStudyData";

export const metadata: Metadata = {
  title: "Reinforcement Learning ML Interview Study Guide",
  description: `${rlTopicCount} lessons across ${rlParts.length} Parts: foundations, value learning, policy optimization, planning, offline learning, reward design, and practical RL systems.`,
  alternates: { canonical: RL_PATH },
};

export default function RlPage() {
  return <RlHub />;
}
