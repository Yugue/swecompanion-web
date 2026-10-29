import type { Metadata } from "next";
import { DistributedHub } from "@/components/distributed/DistributedHub";
import { DISTRIBUTED_ML_PATH } from "@/lib/mlDomains";
import { distributedTopicCount, distributedParts } from "@/lib/distributedStudyData";

export const metadata: Metadata = {
  title: "Distributed Machine Learning Study Guide",
  description: `${distributedTopicCount} standalone lessons across ${distributedParts.length} Parts: foundations, distributed optimization, communication, model partitioning, scaling, fault recovery, and inference serving.`,
  alternates: { canonical: DISTRIBUTED_ML_PATH },
};

export default function DistributedPage() {
  return <DistributedHub />;
}
