import type { ReactNode } from "react";
import { SystemDesignProgressProvider } from "@/components/mlsystemdesign/SystemDesignShell";

export default function SystemDesignLayout({ children }: { children: ReactNode }) {
  return <SystemDesignProgressProvider>{children}</SystemDesignProgressProvider>;
}
