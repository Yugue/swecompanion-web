import type { Metadata } from "next";
import { SystemDesignHub } from "@/components/mlsystemdesign/SystemDesignHub";
import { CV_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { cvDesignProblems } from "@/lib/cvSystemDesignData";

export const metadata: Metadata = {
  title: "Computer Vision System Design — 8 Interview Problems",
  description: "Eight computer vision system design lessons covering image retrieval, detection, moderation, OCR, product search, video, segmentation, and anomaly detection.",
  alternates: { canonical: CV_SYSTEM_DESIGN_PATH },
};

export default function CvSystemDesignPage() {
  const problems = cvDesignProblems.map(({ id, title, summary, pattern }) => ({ id, title, summary, pattern }));
  return <SystemDesignHub key="cv" topicId="cv" problems={problems} />;
}
