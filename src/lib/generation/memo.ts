import {
  BLOOM_LEVEL_LABELS,
  type BloomLevel,
} from "@/lib/constants/bloom-levels";
import {
  MATHS_COGNITIVE_MEMO_CODES,
  type MathsCognitiveLevel,
} from "@/lib/constants/cognitive-levels";
import type { SeedQuestion } from "@/lib/content/question-bank";
import type {
  AssembledMemoItem,
  AssembledQuestion,
} from "@/lib/generation/types";

/**
 * Derive the marking memo from the locked paper questions.
 * Never generate a memo independently of the paper selection.
 */
export function deriveMemoFromQuestions(
  questions: AssembledQuestion[],
  bankById: Map<string, SeedQuestion>,
): AssembledMemoItem[] {
  return questions.map((q) => {
    const seed = bankById.get(q.bankId);
    const item: AssembledMemoItem = {
      number: q.number,
      bankId: q.bankId,
      marks: q.marks,
      memoAnswer: seed?.memoAnswer ?? "",
      markingPoints: seed?.markingPoints ?? [],
    };

    if (q.cognitiveLevel) {
      item.cognitiveMemoCode = MATHS_COGNITIVE_MEMO_CODES[q.cognitiveLevel];
    }
    if (q.bloomLevel) {
      item.bloomShortCode = BLOOM_LEVEL_LABELS[q.bloomLevel].shortCode;
    }
    return item;
  });
}

export function sumMarks(
  items: { marks: number }[],
): number {
  return items.reduce((sum, item) => sum + item.marks, 0);
}

export type MathsMarksByLevel = Record<MathsCognitiveLevel, number>;

export function emptyMathsMarks(): MathsMarksByLevel {
  return {
    knowledge: 0,
    routine_procedure: 0,
    complex_procedure: 0,
    problem_solving: 0,
  };
}

export function tallyMathsMarks(
  questions: AssembledQuestion[],
): MathsMarksByLevel {
  const tally = emptyMathsMarks();
  for (const q of questions) {
    if (q.cognitiveLevel) {
      tally[q.cognitiveLevel] += q.marks;
    }
  }
  return tally;
}

export function tallyBloomMarks(
  questions: AssembledQuestion[],
): Partial<Record<BloomLevel, number>> {
  const tally: Partial<Record<BloomLevel, number>> = {};
  for (const q of questions) {
    if (!q.bloomLevel) continue;
    tally[q.bloomLevel] = (tally[q.bloomLevel] ?? 0) + q.marks;
  }
  return tally;
}
