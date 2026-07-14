import { SEED_QUESTION_BANK } from "@/lib/content/question-bank";
import {
  buildBloomReport,
  buildMathsReport,
} from "@/lib/generation/assemble";
import {
  deriveMemoFromQuestions,
  sumMarks,
} from "@/lib/generation/memo";
import type {
  AssembledMemoItem,
  AssembledQuestion,
  GeneratedAssessment,
} from "@/lib/generation/types";
import type { AssessmentWizardData } from "@/lib/types/assessment";

function bankMap() {
  return new Map(SEED_QUESTION_BANK.map((q) => [q.id, q]));
}

function renumberQuestions(
  questions: AssembledQuestion[],
): AssembledQuestion[] {
  return questions.map((q, index) => ({ ...q, number: index + 1 }));
}

/**
 * After edit / replace / delete: renumber, refresh mark totals + taxonomy,
 * and keep memo rows aligned to the paper (custom edits preserved by bankId+number).
 */
export function recomputeGeneratedAssessment(
  draft: GeneratedAssessment,
  wizard: AssessmentWizardData,
  options?: {
    /** When true, rebuild memo answers from the seed bank (used after Replace). */
    rederiveMemoFromBank?: boolean;
    /** Preserved custom memo edits keyed by bankId (used when only editing paper text/marks). */
    memoOverrides?: AssembledMemoItem[];
  },
): GeneratedAssessment {
  const questions = renumberQuestions(draft.paper.questions);
  const totalMarksActual = sumMarks(questions);

  let memoItems: AssembledMemoItem[];
  if (options?.rederiveMemoFromBank) {
    memoItems = deriveMemoFromQuestions(questions, bankMap());
  } else {
    const previous =
      options?.memoOverrides ??
      draft.memo.items.map((item) => ({ ...item }));
    const byBankId = new Map(previous.map((item) => [item.bankId, item]));
    memoItems = questions.map((q) => {
      const prior = byBankId.get(q.bankId);
      if (prior) {
        return {
          ...prior,
          number: q.number,
          marks: q.marks,
          bankId: q.bankId,
          cognitiveMemoCode: q.cognitiveLevel
            ? prior.cognitiveMemoCode
            : undefined,
          bloomShortCode: q.bloomLevel ? prior.bloomShortCode : undefined,
        };
      }
      return deriveMemoFromQuestions([q], bankMap())[0];
    });
  }

  // Refresh short codes from paper taxonomy fields
  memoItems = memoItems.map((item, index) => {
    const q = questions[index];
    const derived = deriveMemoFromQuestions([q], bankMap())[0];
    return {
      ...item,
      number: q.number,
      marks: q.marks,
      cognitiveMemoCode: derived.cognitiveMemoCode,
      bloomShortCode: derived.bloomShortCode,
      // Prefer educator-edited answer/points when present
      memoAnswer: item.memoAnswer || derived.memoAnswer,
      markingPoints:
        item.markingPoints?.length > 0
          ? item.markingPoints
          : derived.markingPoints,
    };
  });

  const taxonomy =
    draft.subject === "Mathematics"
      ? buildMathsReport(questions, wizard)
      : buildBloomReport(questions, wizard);

  const warnings = [...draft.warnings].filter(
    (w) =>
      !w.includes("CAPS cognitive mark share") &&
      !w.startsWith("Question ") &&
      !w.includes("lack Bloom"),
  );

  if (
    taxonomy.model === "caps_cognitive" &&
    !taxonomy.withinTolerance &&
    questions.length > 0
  ) {
    warnings.push(
      "CAPS cognitive mark share is outside ±5pp of targets — review before export.",
    );
  }

  if (draft.subject === "Life Sciences") {
    for (const q of questions) {
      if (!q.bloomLevel) {
        warnings.push(`Question ${q.number} (${q.bankId}) has no Bloom level.`);
      }
    }
  }

  return {
    ...draft,
    paper: {
      ...draft.paper,
      questions,
      totalMarksActual,
    },
    memo: {
      items: memoItems,
      totalMarks: sumMarks(memoItems),
    },
    taxonomy,
    warnings,
  };
}
