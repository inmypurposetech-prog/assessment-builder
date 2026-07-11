import type { Subject } from "@/lib/types/assessment";

/**
 * CAPS Mathematics cognitive levels (not Bloom's).
 * Definitions distilled from Dad's cognitive guide:
 * `docs/parent-samples/mathematics/dbe/grade-12/cognitive-guides/caps-maths-cognitive-levels-explained.pdf`
 * (Umalusi / CAPS Mathematics taxonomy exemplar — SIR Unit, March 2018).
 */
export type MathsCognitiveLevel =
  | "knowledge"
  | "routine_procedure"
  | "complex_procedure"
  | "problem_solving";

export type MathsCognitiveDistribution = Record<MathsCognitiveLevel, number>;

/** Dad's department / CAPS standard — must sum to 100. */
export const DEFAULT_MATHS_COGNITIVE: MathsCognitiveDistribution = {
  knowledge: 20,
  routine_procedure: 35,
  complex_procedure: 30,
  problem_solving: 15,
};

/** Short codes used on Dad's GDE-style memorandum (K / R / C; P for problem solving). */
export const MATHS_COGNITIVE_MEMO_CODES: Record<MathsCognitiveLevel, string> = {
  knowledge: "K",
  routine_procedure: "R",
  complex_procedure: "C",
  problem_solving: "P",
};

export const MATHS_COGNITIVE_LABELS: Record<
  MathsCognitiveLevel,
  { label: string; description: string; guideBullets: string[] }
> = {
  knowledge: {
    label: "Knowledge",
    description: "Recall facts, definitions and simple concepts",
    guideBullets: [
      "Straight recall of facts, formulae, rules or definitions",
      "Immediate use of mathematical facts; read values from a graph",
      "Identify a formula on the information sheet (no changing the subject)",
      "Substitute values into a known formula; use mathematical vocabulary",
    ],
  },
  routine_procedure: {
    label: "Routine procedure",
    description: "Standard methods and familiar multi-step procedures",
    guideBullets: [
      "Perform well-known procedures similar to classwork",
      "Simple applications with a few familiar steps; little ambiguity",
      "Use (or rearrange) the correct formula from the information sheet",
      "Prescribed theorem proofs and familiar derivations",
    ],
  },
  complex_procedure: {
    label: "Complex procedure",
    description: "Non-routine problems needing deeper procedural skill",
    guideBullets: [
      "Mainly unfamiliar problems without a direct route to the solution",
      "Higher-order reasoning and/or complex calculations",
      "Interpret mathematical concepts, not only apply a memorised method",
    ],
  },
  problem_solving: {
    label: "Problem solving",
    description: "Reasoning, modelling and unfamiliar contexts",
    guideBullets: [
      "Non-routine, unseen problems needing higher-level understanding",
      "No obvious starting point; may require breaking the problem into parts",
      "Self-monitoring of one's own cognitive process while solving",
    ],
  },
};

/** Ordered levels for UI and validators. */
export const MATHS_COGNITIVE_LEVEL_ORDER: MathsCognitiveLevel[] = [
  "knowledge",
  "routine_procedure",
  "complex_procedure",
  "problem_solving",
];

export function mathsCognitiveTotal(
  distribution: MathsCognitiveDistribution | null | undefined,
): number {
  if (!distribution) return 0;
  return Object.values(distribution).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

/** True when percentages are non-negative integers that sum to exactly 100. */
export function isValidMathsCognitiveDistribution(
  distribution: MathsCognitiveDistribution | null | undefined,
): boolean {
  if (!distribution) return false;
  for (const level of MATHS_COGNITIVE_LEVEL_ORDER) {
    const n = distribution[level];
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return false;
  }
  return mathsCognitiveTotal(distribution) === 100;
}

/**
 * Compare actual mark shares to a target distribution.
 * Returns levels that differ from target by more than `tolerancePct` percentage points.
 */
export function mathsCognitiveDrift(
  actualMarks: Partial<Record<MathsCognitiveLevel, number>>,
  target: MathsCognitiveDistribution = DEFAULT_MATHS_COGNITIVE,
  tolerancePct = 5,
): { level: MathsCognitiveLevel; actualPct: number; targetPct: number; delta: number }[] {
  const total = MATHS_COGNITIVE_LEVEL_ORDER.reduce(
    (sum, level) => sum + (Number(actualMarks[level]) || 0),
    0,
  );
  if (total <= 0) return [];

  const drifts: {
    level: MathsCognitiveLevel;
    actualPct: number;
    targetPct: number;
    delta: number;
  }[] = [];

  for (const level of MATHS_COGNITIVE_LEVEL_ORDER) {
    const actualPct = Math.round(((Number(actualMarks[level]) || 0) / total) * 100);
    const targetPct = target[level];
    const delta = actualPct - targetPct;
    if (Math.abs(delta) > tolerancePct) {
      drifts.push({ level, actualPct, targetPct, delta });
    }
  }
  return drifts;
}

export function usesBloomTaxonomy(subject: Subject | null): boolean {
  return subject === "Life Sciences";
}

export function usesMathsCognitiveLevels(subject: Subject | null): boolean {
  return subject === "Mathematics";
}
