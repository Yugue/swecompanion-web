import type { Metadata } from "next";
import { CvHub } from "@/components/cv/CvHub";
import { CV_PATH } from "@/lib/mlDomains";

export const metadata: Metadata = {
  title: "Computer Vision / Image Processing Interview Guide",
  description: "48 standalone lessons in image processing, classical vision, CNNs, Transformers, vision tasks, and practical CV system design for ML interviews.",
  alternates: { canonical: CV_PATH },
};

export default function CvPage() {
  return <CvHub />;
}
