import {
  bloomFocusPreferredLevels,
  BLOOM_LEVEL_ORDER,
  type BloomLevel,
} from "@/lib/constants/bloom-levels";
import {
  DEFAULT_MATHS_COGNITIVE,
  isValidMathsCognitiveDistribution,
  mathsCognitiveDrift,
  MATHS_COGNITIVE_LEVEL_ORDER,
  type MathsCognitiveDistribution,
  type MathsCognitiveLevel,
} from "@/lib/constants/cognitive-levels";
import type { SeedQuestion } from "@/lib/content/question-bank";
import {
  deriveMemoFromQuestions,
  emptyMathsMarks,
  sumMarks,
  tallyBloomMarks,
  tallyMathsMarks,
} from "@/lib/generation/memo";
import type {
  AssembledQuestion,
  BloomTaxonomyReport,
  GeneratedAssessment,
  GenerationCostMeta,
  MathsTaxonomyReport,
} from "@/lib/generation/types";
import type { AssessmentWizardData } from "@/lib/types/assessment";

const DIFFICULTY_RANK: Record<AssessmentWizardData["difficulty"], number> = {
  easy: 0,
  balanced: 1,
  challenging: 2,
};

const SEED_DIFFICULTY_RANK: Record<SeedQuestion["difficulty"], number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

function bankMap(pool: SeedQuestion[]): Map<string, SeedQuestion> {
  return new Map(pool.map((q) => [q.id, q]));
}

function toAssembled(
  seeds: SeedQuestion[],
): AssembledQuestion[] {
  return seeds.map((seed, index) => ({
    number: index + 1,
    bankId: seed.id,
    topic: seed.topic,
    marks: seed.marks,
    difficulty: seed.difficulty,
    questionText: seed.questionText,
    cognitiveLevel: seed.cognitiveLevel,
    bloomLevel: seed.bloomLevel,
    aim: seed.aim,
    source: seed.source,
  }));
}

function filterPool(
  bank: SeedQuestion[],
  wizard: AssessmentWizardData,
): { pool: SeedQuestion[]; warnings: string[] } {
  const warnings: string[] = [];
  if (!wizard.subject || !wizard.grade || !wizard.examBody) {
    return { pool: [], warnings: ["Wizard incomplete: subject, grade, and exam body are required."] };
  }

  let pool = bank.filter(
    (q) =>
      q.subject === wizard.subject &&
      q.grade === wizard.grade &&
      q.examBody === wizard.examBody,
  );

  if (pool.length === 0) {
    warnings.push(
      `No seed questions for ${wizard.subject} Grade ${wizard.grade} (${wizard.examBody}).`,
    );
    return { pool, warnings };
  }

  if (
    wizard.scopeMode === "topics" &&
    wizard.selectedTopics.length > 0
  ) {
    const topicSet = new Set(wizard.selectedTopics.map((t) => t.toLowerCase()));
    const narrowed = pool.filter((q) => topicSet.has(q.topic.toLowerCase()));
    if (narrowed.length > 0) {
      pool = narrowed;
    } else {
      warnings.push(
        "No bank items matched selected topics — using the full subject/grade pool.",
      );
    }
  }

  return { pool, warnings };
}

function sortByDifficultyPreference(
  pool: SeedQuestion[],
  difficulty: AssessmentWizardData["difficulty"],
): SeedQuestion[] {
  const target = DIFFICULTY_RANK[difficulty];
  return [...pool].sort((a, b) => {
    const da = Math.abs(SEED_DIFFICULTY_RANK[a.difficulty] - target);
    const db = Math.abs(SEED_DIFFICULTY_RANK[b.difficulty] - target);
    if (da !== db) return da - db;
    return a.id.localeCompare(b.id);
  });
}

function targetMarksForLevel(
  totalMarks: number,
  percent: number,
): number {
  return Math.round((totalMarks * percent) / 100);
}

/**
 * Greedy bucket fill for Maths CAPS levels, then top up remaining marks.
 */
function selectMathsQuestions(
  pool: SeedQuestion[],
  wizard: AssessmentWizardData,
): { selected: SeedQuestion[]; warnings: string[] } {
  const warnings: string[] = [];
  const distribution: MathsCognitiveDistribution =
    isValidMathsCognitiveDistribution(wizard.mathsCognitive)
      ? wizard.mathsCognitive
      : { ...DEFAULT_MATHS_COGNITIVE };

  if (!isValidMathsCognitiveDistribution(wizard.mathsCognitive)) {
    warnings.push(
      "Wizard cognitive % invalid or incomplete — using CAPS default 20/35/30/15.",
    );
  }

  const targetTotal = wizard.totalMarks;
  const remainingByLevel = emptyMathsMarks();
  for (const level of MATHS_COGNITIVE_LEVEL_ORDER) {
    remainingByLevel[level] = targetMarksForLevel(
      targetTotal,
      distribution[level],
    );
  }

  const sorted = sortByDifficultyPreference(pool, wizard.difficulty);
  const byLevel: Record<MathsCognitiveLevel, SeedQuestion[]> = {
    knowledge: [],
    routine_procedure: [],
    complex_procedure: [],
    problem_solving: [],
  };
  for (const q of sorted) {
    if (q.cognitiveLevel) byLevel[q.cognitiveLevel].push(q);
  }

  const selected: SeedQuestion[] = [];
  const used = new Set<string>();
  let marksSoFar = 0;

  for (const level of MATHS_COGNITIVE_LEVEL_ORDER) {
    for (const q of byLevel[level]) {
      if (used.has(q.id)) continue;
      if (marksSoFar >= targetTotal) break;
      if (remainingByLevel[level] <= 0) break;
      // Prefer items that fit the remaining bucket without huge overshoot
      if (q.marks > remainingByLevel[level] + 2 && remainingByLevel[level] > 0) {
        continue;
      }
      selected.push(q);
      used.add(q.id);
      marksSoFar += q.marks;
      remainingByLevel[level] -= q.marks;
    }
  }

  // Top up if still under target
  for (const q of sorted) {
    if (marksSoFar >= targetTotal) break;
    if (used.has(q.id)) continue;
    if (marksSoFar + q.marks > targetTotal + 3) continue;
    selected.push(q);
    used.add(q.id);
    marksSoFar += q.marks;
  }

  if (selected.length === 0) {
    warnings.push("Could not select any Mathematics questions from the bank.");
  } else if (marksSoFar < targetTotal) {
    warnings.push(
      `Bank shortfall: assembled ${marksSoFar} of ${targetTotal} marks (AI gap-fill not applied).`,
    );
  }

  return { selected, warnings };
}

function selectLifeSciencesQuestions(
  pool: SeedQuestion[],
  wizard: AssessmentWizardData,
): { selected: SeedQuestion[]; warnings: string[] } {
  const warnings: string[] = [];
  const preferred = new Set(bloomFocusPreferredLevels(wizard.bloomFocus));
  const sorted = sortByDifficultyPreference(pool, wizard.difficulty);

  const preferredFirst = [
    ...sorted.filter((q) => q.bloomLevel && preferred.has(q.bloomLevel)),
    ...sorted.filter((q) => !q.bloomLevel || !preferred.has(q.bloomLevel)),
  ];

  const selected: SeedQuestion[] = [];
  const used = new Set<string>();
  let marksSoFar = 0;
  const targetTotal = wizard.totalMarks;

  for (const q of preferredFirst) {
    if (marksSoFar >= targetTotal) break;
    if (used.has(q.id)) continue;
    if (marksSoFar + q.marks > targetTotal + 3) continue;
    if (!q.bloomLevel) {
      warnings.push(`Seed ${q.id} missing bloomLevel — skipped.`);
      continue;
    }
    selected.push(q);
    used.add(q.id);
    marksSoFar += q.marks;
  }

  if (selected.length === 0) {
    warnings.push("Could not select any Life Sciences questions from the bank.");
  } else if (marksSoFar < targetTotal) {
    warnings.push(
      `Bank shortfall: assembled ${marksSoFar} of ${targetTotal} marks (AI gap-fill not applied).`,
    );
  }

  const missingBloom = selected.filter((q) => !q.bloomLevel);
  if (missingBloom.length > 0) {
    warnings.push(`${missingBloom.length} selected item(s) lack Bloom levels.`);
  }

  return { selected, warnings };
}

export function buildMathsReport(
  questions: AssembledQuestion[],
  wizard: AssessmentWizardData,
): MathsTaxonomyReport {
  const target =
    isValidMathsCognitiveDistribution(wizard.mathsCognitive)
      ? wizard.mathsCognitive
      : { ...DEFAULT_MATHS_COGNITIVE };
  const actualMarks = tallyMathsMarks(questions);
  const total = sumMarks(questions);
  const actualPercent = emptyMathsMarks();
  for (const level of MATHS_COGNITIVE_LEVEL_ORDER) {
    actualPercent[level] =
      total > 0 ? Math.round((actualMarks[level] / total) * 100) : 0;
  }
  const drifts = mathsCognitiveDrift(actualMarks, target, 5);
  return {
    model: "caps_cognitive",
    targetPercent: { ...target },
    actualMarks,
    actualPercent,
    drifts,
    withinTolerance: drifts.length === 0 && total > 0,
  };
}

export function buildBloomReport(
  questions: AssembledQuestion[],
  wizard: AssessmentWizardData,
): BloomTaxonomyReport {
  const preferredLevels = bloomFocusPreferredLevels(wizard.bloomFocus);
  return {
    model: "bloom",
    focus: wizard.bloomFocus,
    preferredLevels,
    actualMarks: tallyBloomMarks(questions),
    perQuestion: questions.map((q) => ({
      number: q.number,
      bankId: q.bankId,
      bloomLevel: q.bloomLevel ?? ("knowledge" as BloomLevel),
      aim: q.aim,
    })),
  };
}

export interface AssembleInput {
  assessmentId: string;
  title: string;
  wizard: AssessmentWizardData;
  bank: SeedQuestion[];
  cost: GenerationCostMeta;
  /** Reserved for Phase 1B+ AI gap-fill results */
  aiFilled?: SeedQuestion[];
}

/**
 * Assemble a structured assessment JSON from wizard + question bank.
 * Memo is always derived from the locked selection.
 */
export function assembleAssessment(input: AssembleInput): GeneratedAssessment {
  const { assessmentId, title, wizard, bank, cost } = input;
  const warnings: string[] = [];

  if (!wizard.subject || !wizard.grade || !wizard.examBody) {
    throw new Error("Wizard incomplete: subject, grade, and exam body are required.");
  }

  const { pool, warnings: filterWarnings } = filterPool(bank, wizard);
  warnings.push(...filterWarnings);

  let selected: SeedQuestion[] = [];
  if (wizard.subject === "Mathematics") {
    const result = selectMathsQuestions(pool, wizard);
    selected = result.selected;
    warnings.push(...result.warnings);
  } else {
    const result = selectLifeSciencesQuestions(pool, wizard);
    selected = result.selected;
    warnings.push(...result.warnings);
  }

  if (input.aiFilled && input.aiFilled.length > 0) {
    const used = new Set(selected.map((q) => q.id));
    for (const q of input.aiFilled) {
      if (used.has(q.id)) continue;
      selected.push(q);
      used.add(q.id);
    }
  }

  const questions = toAssembled(selected);
  const memoItems = deriveMemoFromQuestions(questions, bankMap([...bank, ...selected]));
  const totalMarksActual = sumMarks(questions);

  const taxonomy =
    wizard.subject === "Mathematics"
      ? buildMathsReport(questions, wizard)
      : buildBloomReport(questions, wizard);

  if (
    taxonomy.model === "caps_cognitive" &&
    !taxonomy.withinTolerance &&
    questions.length > 0
  ) {
    warnings.push(
      "CAPS cognitive mark share is outside ±5pp of targets — review before export.",
    );
  }

  // Ensure LS questions all carry Bloom (attach from seed; already on AssembledQuestion)
  if (wizard.subject === "Life Sciences") {
    for (const q of questions) {
      if (!q.bloomLevel) {
        warnings.push(`Question ${q.number} (${q.bankId}) has no Bloom level.`);
      }
    }
  }

  return {
    schemaVersion: 1,
    assessmentId,
    title,
    subject: wizard.subject,
    grade: wizard.grade,
    examBody: wizard.examBody,
    generatedAt: new Date().toISOString(),
    paper: {
      totalMarksTarget: wizard.totalMarks,
      totalMarksActual,
      durationMinutes: wizard.durationMinutes,
      questions,
    },
    memo: {
      items: memoItems,
      totalMarks: sumMarks(memoItems),
    },
    taxonomy,
    warnings,
    cost,
  };
}

/** Exported for tests / diagnostics */
export function listBloomLevelsInOrder(): BloomLevel[] {
  return [...BLOOM_LEVEL_ORDER];
}
