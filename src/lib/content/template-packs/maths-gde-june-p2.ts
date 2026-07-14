/**
 * Template pack v1 — Dad's Grade 12 Maths June Paper 2 (GDE-style).
 * Layout notes only; Word binaries stay local/gitignored (ADR-007).
 *
 * Source pack:
 * `docs/parent-samples/mathematics/dbe/grade-12/june-exam/2026/`
 */

export type TemplatePackAssetRole =
  | "question_paper"
  | "memorandum"
  | "answer_book"
  | "cognitive_guide"
  | "paper_exemplar"
  | "memo_exemplar";

export interface TemplatePackAsset {
  role: TemplatePackAssetRole;
  /** Path relative to `docs/parent-samples/` (binary may be gitignored). */
  relativePath: string;
  notes: string;
}

export interface MathsGdeJuneP2TemplatePack {
  id: "maths-gde-june-p2-v1";
  version: 1;
  visibility: "private";
  subject: "Mathematics";
  examBody: "DBE";
  grade: "12";
  assessmentType: "june_exam";
  paper: 2;
  title: "CAPS / GDE-style Mathematics June Paper 2 pack";
  description: string;
  /** Structural defaults observed in the June 2026 exemplar. */
  paperDefaults: {
    totalMarks: number;
    durationMinutes: number;
    questionCount: number;
    /** Sub-totals per question as printed on the cover. */
    questionMarkAllocation: number[];
    instructions: string[];
  };
  memoConventions: {
    cognitiveCodes: string[];
    consistentAccuracy: boolean;
    geometryStatementReason: boolean;
    notes: string[];
  };
  answerBookConventions: {
    perSubQuestionLines: boolean;
    markBoxesBesideWorking: boolean;
    honourPledgeBlock: boolean;
    notes: string[];
  };
  exportOrder: TemplatePackAssetRole[];
  assets: TemplatePackAsset[];
}

export const MATHS_GDE_JUNE_P2_TEMPLATE_PACK: MathsGdeJuneP2TemplatePack = {
  id: "maths-gde-june-p2-v1",
  version: 1,
  visibility: "private",
  subject: "Mathematics",
  examBody: "DBE",
  grade: "12",
  assessmentType: "june_exam",
  paper: 2,
  title: "CAPS / GDE-style Mathematics June Paper 2 pack",
  description:
    "Gold-standard layout for Maths export: school header + instructions + question paper, department-style memorandum with cognitive codes, and lined answer book. Branding stays private to the educator’s school.",
  paperDefaults: {
    totalMarks: 150,
    durationMinutes: 180,
    questionCount: 9,
    questionMarkAllocation: [10, 16, 24, 38, 12, 9, 12, 11, 18],
    instructions: [
      "Complete the front cover of your answer booklet.",
      "Answer ALL questions in the answer booklet provided.",
      "Show ALL calculations, diagrams and graphs used.",
      "Answers only, with no calculations, will NOT necessarily earn full marks.",
      "An approved scientific calculator (non-programmable, non-graphical) may be used unless stated otherwise.",
      "Round to TWO decimal places unless stated otherwise.",
      "Diagrams are NOT necessarily drawn to scale.",
      "Write neatly and legibly.",
    ],
  },
  memoConventions: {
    cognitiveCodes: ["K", "R", "C", "P"],
    consistentAccuracy: true,
    geometryStatementReason: true,
    notes: [
      "Mark only the first attempt if a question is answered twice.",
      "Consistent accuracy (CA) applies; stop after a second calculation error on the same path.",
      "Geometry: S = statement mark, R = reason mark, S/R = both.",
      "Sub-item cognitive tags observed on the June 2026 memo: K / R / C (map to CAPS Knowledge / Routine / Complex); use P for Problem solving when tagging exports.",
    ],
  },
  answerBookConventions: {
    perSubQuestionLines: true,
    markBoxesBesideWorking: true,
    honourPledgeBlock: true,
    notes: [
      "Front cover: school name, subject, paper number, date, learner name, class, teacher.",
      "Rules block: blue ink, no correction fluid, no writing in margins, rough work crossed out.",
      "Per question: solution lines + marks column; diagrams where the paper supplies them.",
    ],
  },
  exportOrder: ["question_paper", "memorandum", "answer_book"],
  assets: [
    {
      role: "question_paper",
      relativePath:
        "mathematics/dbe/grade-12/june-exam/2026/paper-2/2026-june-paper-2-question-paper.docx",
      notes: "Cover mark table + numbered questions with sub-mark allocations.",
    },
    {
      role: "memorandum",
      relativePath:
        "mathematics/dbe/grade-12/june-exam/2026/paper-2/2026-june-paper-2-memorandum.docx",
      notes: "Department memo style with cognitive letter codes per sub-item.",
    },
    {
      role: "answer_book",
      relativePath:
        "mathematics/dbe/grade-12/june-exam/2026/paper-2/2026-june-paper-2-answer-book.docx",
      notes: "Learner booklet with lined working space and mark columns.",
    },
    {
      role: "cognitive_guide",
      relativePath:
        "mathematics/dbe/grade-12/cognitive-guides/caps-maths-cognitive-levels-explained.pdf",
      notes: "Authoritative CAPS Mathematics cognitive demand definitions (not Bloom’s).",
    },
    {
      role: "paper_exemplar",
      relativePath:
        "mathematics/dbe/grade-12/templates/gde-style-paper-exemplar-grade12-june-p2.docx",
      notes: "Copy kept as layout exemplar for future DOCX export fidelity.",
    },
    {
      role: "memo_exemplar",
      relativePath:
        "mathematics/dbe/grade-12/templates/gde-style-memo-exemplar-grade12-june-p2.docx",
      notes: "Copy kept as memo layout exemplar.",
    },
  ],
};
