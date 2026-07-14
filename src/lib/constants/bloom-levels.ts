import type { BloomFocus } from "@/lib/types/assessment";

/**
 * Bloom's taxonomy levels used for Life Sciences (IEB analysis grids).
 * Pattern from Mom's 2023 Paper 1 & 2 analysis grids under
 * `docs/parent-samples/life-sciences/ieb/grade-12/final-exam/2023/`.
 */
export type BloomLevel =
  | "knowledge"
  | "comprehension"
  | "application"
  | "analysis"
  | "synthesis"
  | "evaluation";

export type BloomDifficulty = "easy" | "moderate" | "difficult" | "very_difficult";

/** IEB Life Sciences learning-outcome / AIM columns on analysis grids. */
export type IebLifeSciencesAim = "aim_1" | "aim_2" | "aim_3";

export const BLOOM_LEVEL_ORDER: BloomLevel[] = [
  "knowledge",
  "comprehension",
  "application",
  "analysis",
  "synthesis",
  "evaluation",
];

export const BLOOM_LEVEL_LABELS: Record<
  BloomLevel,
  { label: string; shortCode: string; description: string }
> = {
  knowledge: {
    label: "Knowledge",
    shortCode: "K",
    description: "Recall facts, terms and basic concepts",
  },
  comprehension: {
    label: "Comprehension",
    shortCode: "C",
    description: "Explain ideas or concepts in your own words",
  },
  application: {
    label: "Application",
    shortCode: "Ap",
    description: "Use knowledge in a new or practical context",
  },
  analysis: {
    label: "Analysis",
    shortCode: "An",
    description: "Break information into parts; find relationships",
  },
  synthesis: {
    label: "Synthesis",
    shortCode: "S",
    description: "Combine ideas to form a new whole or plan",
  },
  evaluation: {
    label: "Evaluation",
    shortCode: "E",
    description: "Judge or justify a decision using evidence",
  },
};

export const BLOOM_DIFFICULTY_LABELS: Record<
  BloomDifficulty,
  { label: string; shortCode: string }
> = {
  easy: { label: "Easy", shortCode: "E" },
  moderate: { label: "Moderate", shortCode: "M" },
  difficult: { label: "Difficult", shortCode: "D" },
  very_difficult: { label: "Very difficult", shortCode: "VD" },
};

export const IEB_LS_AIM_LABELS: Record<
  IebLifeSciencesAim,
  { label: string; description: string }
> = {
  aim_1: {
    label: "AIM 1",
    description: "Knowledge of Life Sciences (recall and understanding)",
  },
  aim_2: {
    label: "AIM 2",
    description: "Investigating phenomena (scientific method / practical)",
  },
  aim_3: {
    label: "AIM 3",
    description: "Applying knowledge and skills in unfamiliar contexts",
  },
};

/**
 * Target mark % from Mom's 2023 Paper II analysis grid (“Targeted percentages”).
 * Used as the default Bloom / AIM pattern for IEB Life Sciences reports.
 */
export const IEB_LS_PAPER2_TARGET_PERCENT: {
  aims: Record<IebLifeSciencesAim, number>;
  bloom: Record<BloomLevel, number>;
  difficultyEasyVsRest: { easy: number; moderateToVeryDifficult: number };
} = {
  aims: { aim_1: 30, aim_2: 10, aim_3: 60 },
  bloom: {
    knowledge: 20,
    comprehension: 10,
    application: 10,
    analysis: 15,
    synthesis: 20,
    evaluation: 25,
  },
  difficultyEasyVsRest: { easy: 40, moderateToVeryDifficult: 60 },
};

/** Wizard focus options (coarse) — maps to preferred Bloom bands for generation later. */
export const BLOOM_FOCUS_OPTIONS: {
  value: BloomFocus;
  label: string;
  description: string;
  preferredLevels: BloomLevel[];
}[] = [
  {
    value: "balanced",
    label: "Balanced",
    description: "Mix close to the IEB analysis-grid targets",
    preferredLevels: [...BLOOM_LEVEL_ORDER],
  },
  {
    value: "knowledge",
    label: "Knowledge",
    description: "More recall and comprehension questions",
    preferredLevels: ["knowledge", "comprehension"],
  },
  {
    value: "application",
    label: "Application",
    description: "Use concepts in context (AIM 3 lean)",
    preferredLevels: ["application", "analysis"],
  },
  {
    value: "higher_order",
    label: "Higher order",
    description: "More analysis, synthesis and evaluation",
    preferredLevels: ["analysis", "synthesis", "evaluation"],
  },
];

export function bloomFocusPreferredLevels(focus: BloomFocus): BloomLevel[] {
  return (
    BLOOM_FOCUS_OPTIONS.find((o) => o.value === focus)?.preferredLevels ?? [
      ...BLOOM_LEVEL_ORDER,
    ]
  );
}
