import type { MathsCognitiveDistribution } from "@/lib/constants/cognitive-levels";
import { DEFAULT_MATHS_COGNITIVE } from "@/lib/constants/cognitive-levels";

export type ExamBody = "DBE" | "IEB";

export type Subject = "Mathematics" | "Life Sciences";

export type Grade = "10" | "11" | "12";

export type AssessmentType =
  | "classroom_exercise"
  | "cycle_test"
  | "assignment"
  | "practical"
  | "june_exam"
  | "trial_exam"
  | "final_exam";

export type ScopeMode = "topics" | "term" | "previous_paper" | "custom_mix";

export type Difficulty = "easy" | "balanced" | "challenging";

export type BloomFocus = "balanced" | "higher_order" | "application" | "knowledge";

export type AssessmentStatus = "draft" | "generated" | "exported" | "archived";

export interface AssessmentWizardData {
  assessmentType: AssessmentType | null;
  examBody: ExamBody | null;
  subject: Subject | null;
  grade: Grade | null;
  term: "1" | "2" | "3" | "4" | null;
  scopeMode: ScopeMode | null;
  selectedTopics: string[];
  previousPaperRef: string;
  totalMarks: number;
  durationMinutes: number;
  difficulty: Difficulty;
  /** Life Sciences — Bloom's focus */
  bloomFocus: BloomFocus;
  /** Mathematics — CAPS cognitive level % (must sum to 100) */
  mathsCognitive: MathsCognitiveDistribution;
  includeDiagrams: boolean;
  includeCalculator: boolean;
  includeMcq: boolean;
  avoidRepeatedQuestions: boolean;
  notes: string;
}

export const defaultWizardData: AssessmentWizardData = {
  assessmentType: null,
  examBody: null,
  subject: null,
  grade: null,
  term: null,
  scopeMode: null,
  selectedTopics: [],
  previousPaperRef: "",
  totalMarks: 50,
  durationMinutes: 60,
  difficulty: "balanced",
  bloomFocus: "balanced",
  mathsCognitive: { ...DEFAULT_MATHS_COGNITIVE },
  includeDiagrams: false,
  includeCalculator: true,
  includeMcq: true,
  avoidRepeatedQuestions: true,
  notes: "",
};
