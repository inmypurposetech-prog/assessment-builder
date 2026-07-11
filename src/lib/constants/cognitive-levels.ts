import type { Subject } from "@/lib/types/assessment";

/** CAPS Mathematics cognitive levels (not Bloom's). */
export type MathsCognitiveLevel =
  | "knowledge"
  | "routine_procedure"
  | "complex_procedure"
  | "problem_solving";

export type MathsCognitiveDistribution = Record<MathsCognitiveLevel, number>;

/** Dad's department standard — must sum to 100. */
export const DEFAULT_MATHS_COGNITIVE: MathsCognitiveDistribution = {
  knowledge: 20,
  routine_procedure: 35,
  complex_procedure: 30,
  problem_solving: 15,
};

export const MATHS_COGNITIVE_LABELS: Record<
  MathsCognitiveLevel,
  { label: string; description: string }
> = {
  knowledge: {
    label: "Knowledge",
    description: "Recall facts, definitions and simple concepts",
  },
  routine_procedure: {
    label: "Routine procedure",
    description: "Standard methods and familiar multi-step procedures",
  },
  complex_procedure: {
    label: "Complex procedure",
    description: "Non-routine problems needing deeper procedural skill",
  },
  problem_solving: {
    label: "Problem solving",
    description: "Reasoning, modelling and unfamiliar contexts",
  },
};

export function mathsCognitiveTotal(
  distribution: MathsCognitiveDistribution | null | undefined,
): number {
  if (!distribution) return 0;
  return Object.values(distribution).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

export function usesBloomTaxonomy(subject: Subject | null): boolean {
  return subject === "Life Sciences";
}

export function usesMathsCognitiveLevels(subject: Subject | null): boolean {
  return subject === "Mathematics";
}
