import type { Metadata } from "next";
import { SpeechHub } from "@/components/speech/SpeechHub";
import { SPEECH_PATH } from "@/lib/mlDomains";

export const metadata: Metadata = {
  title: "Speech / Audio ML Interview Study Guide",
  description: "31 standalone lessons covering audio signals, neural foundations, recognition, speakers, sound events, generation, evaluation, and real-time systems.",
  alternates: { canonical: SPEECH_PATH },
};

export default function SpeechPage() {
  return <SpeechHub />;
}
