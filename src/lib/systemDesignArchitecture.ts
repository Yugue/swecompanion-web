export type ArchitecturePathKind = "serving" | "learning" | "ingestion";

export type ArchitectureNode = {
  kind: "service" | "store" | "result";
  x: number;
  y: number;
  title: string[];
  detail: string;
};

export type ArchitectureEdge = {
  path: string;
  kind: ArchitecturePathKind;
  label: string[];
  x: number;
  y: number;
  dashed?: boolean;
};

export type ArchitectureGraph = {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  description: string;
  caption: string;
  primaryLabel?: string;
  learningLabel?: string;
};

