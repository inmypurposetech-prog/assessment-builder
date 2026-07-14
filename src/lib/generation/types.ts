import type { BloomLevel, IebLifeSciencesAim } from "@/lib/constants/bloom-levels";
import type { MathsCognitiveLevel } from "@/lib/constants/cognitive-levels";
import type {
  AssessmentWizardData,
  ExamBody,
  Grade,
  Subject,
} from "@/lib/types/assessment";

/** Locked paper item after assembly (bank id preserved for edit/replace later). */
export interface AssembledQuestion {
  number: number;
  bankId: string;
  topic: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  /** Mathematics CAPS level — present when subject is Mathematics */
  cognitiveLevel?: MathsCognitiveLevel;
  /** Life Sciences Bloom — present when subject is Life Sciences */
  bloomLevel?: BloomLevel;
  aim?: IebLifeSciencesAim;
  source: string;
}

/** Memo rows derived from the same locked bank items — never re-invented separately. */
export interface AssembledMemoItem {
  number: number;
  bankId: string;
  marks: number;
  memoAnswer: string;
  markingPoints: string[];
  /** GDE-style short code when Maths (K/R/C/P) */
  cognitiveMemoCode?: string;
  bloomShortCode?: string;
}

export interface MathsTaxonomyReport {
  model: "caps_cognitive";
  targetPercent: Record<MathsCognitiveLevel, number>;
  actualMarks: Record<MathsCognitiveLevel, number>;
  actualPercent: Record<MathsCognitiveLevel, number>;
  drifts: {
    level: MathsCognitiveLevel;
    actualPct: number;
    targetPct: number;
    delta: number;
  }[];
  withinTolerance: boolean;
}

export interface BloomTaxonomyReport {
  model: "bloom";
  focus: AssessmentWizardData["bloomFocus"];
  preferredLevels: BloomLevel[];
  actualMarks: Partial<Record<BloomLevel, number>>;
  perQuestion: { number: number; bankId: string; bloomLevel: BloomLevel; aim?: IebLifeSciencesAim }[];
}

export interface GenerationCostMeta {
  model: string;
  maxTokens: number;
  tokensUsed: number;
  source: "question_bank" | "question_bank+ai_gaps";
  monthlyUsed: number;
  monthlyCap: number;
  aiGapFillAttempted: boolean;
}

export interface GeneratedAssessment {
  schemaVersion: 1;
  assessmentId: string;
  title: string;
  subject: Subject;
  grade: Grade;
  examBody: ExamBody;
  generatedAt: string;
  paper: {
    totalMarksTarget: number;
    totalMarksActual: number;
    durationMinutes: number;
    questions: AssembledQuestion[];
  };
  memo: {
    items: AssembledMemoItem[];
    totalMarks: number;
  };
  taxonomy: MathsTaxonomyReport | BloomTaxonomyReport;
  warnings: string[];
  cost: GenerationCostMeta;
}

export interface GenerateRequestBody {
  assessmentId: string;
  /** Assemble and return JSON without writing status/usage (still requires auth). */
  dryRun?: boolean;
}
