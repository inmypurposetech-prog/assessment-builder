import type { MathsCognitiveLevel } from "@/lib/constants/cognitive-levels";
import type { BloomLevel, IebLifeSciencesAim } from "@/lib/constants/bloom-levels";
import type { ExamBody, Grade, Subject } from "@/lib/types/assessment";

/** In-repo question bank item (Phase 1A seed). Original pedagogical content — not past-paper text. */
export interface SeedQuestion {
  id: string;
  subject: Subject;
  grade: Grade;
  examBody: ExamBody;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  /** Mathematics CAPS level */
  cognitiveLevel?: MathsCognitiveLevel;
  /** Life Sciences Bloom level */
  bloomLevel?: BloomLevel;
  /** IEB LS AIM when applicable */
  aim?: IebLifeSciencesAim;
  questionText: string;
  memoAnswer: string;
  markingPoints: string[];
  source: string;
  assessmentType: string;
  language: "en";
}

export function filterSeedQuestions(
  questions: SeedQuestion[],
  filters: {
    subject?: Subject;
    grade?: Grade;
    examBody?: ExamBody;
    topic?: string;
  },
): SeedQuestion[] {
  return questions.filter((q) => {
    if (filters.subject && q.subject !== filters.subject) return false;
    if (filters.grade && q.grade !== filters.grade) return false;
    if (filters.examBody && q.examBody !== filters.examBody) return false;
    if (filters.topic && q.topic !== filters.topic) return false;
    return true;
  });
}
