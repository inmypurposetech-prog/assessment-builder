import type { AssessmentType } from "@/lib/types/assessment";

export type WizardTerm = "1" | "2" | "3" | "4";

type TermRule = {
  allowedTerms: WizardTerm[];
  /** Shown when the type is disabled for the current term. */
  reason: string;
};

/**
 * Term ↔ assessment-type rules (Dad + Mom Session One).
 * Never leave invalid combos silently selectable — filter/disable/explain.
 */
const TYPE_TERM_RULES: Record<AssessmentType, TermRule> = {
  classroom_exercise: {
    allowedTerms: ["1", "2", "3", "4"],
    reason: "Class exercises can be set in any term.",
  },
  cycle_test: {
    allowedTerms: ["1", "2", "3", "4"],
    reason: "Cycle tests can be set in any term.",
  },
  assignment: {
    allowedTerms: ["1", "2", "3", "4"],
    reason: "Assignments can be set in any term.",
  },
  practical: {
    allowedTerms: ["1", "2", "3", "4"],
    reason: "Practicals can be set in any term.",
  },
  june_exam: {
    allowedTerms: ["2"],
    reason: "A June exam belongs in term 2 (mid-year), not term 1 or later terms.",
  },
  trial_exam: {
    allowedTerms: ["2", "3"],
    reason: "A trial or prelim is usually term 3 (sometimes term 2 if the syllabus is finished early).",
  },
  final_exam: {
    allowedTerms: ["4"],
    reason: "A final exam belongs in term 4.",
  },
};

export function getAllowedTermsForAssessmentType(
  type: AssessmentType | null,
): WizardTerm[] {
  if (!type) return ["1", "2", "3", "4"];
  return TYPE_TERM_RULES[type].allowedTerms;
}

export function isAssessmentTypeAllowedForTerm(
  type: AssessmentType | null,
  term: WizardTerm | null,
): boolean {
  if (!type || !term) return true;
  return TYPE_TERM_RULES[type].allowedTerms.includes(term);
}

export function assessmentTypeTermReason(type: AssessmentType): string {
  return TYPE_TERM_RULES[type].reason;
}

export function termReasonForAssessmentType(
  type: AssessmentType,
  term: WizardTerm,
): string | null {
  if (isAssessmentTypeAllowedForTerm(type, term)) return null;
  return TYPE_TERM_RULES[type].reason;
}
