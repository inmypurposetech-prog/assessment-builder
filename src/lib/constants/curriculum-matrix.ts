import type { ExamBody, Grade, Subject } from "@/lib/types/assessment";
import { EXAM_BODY_OPTIONS, GRADE_OPTIONS, SUBJECT_LABELS } from "@/lib/constants/subjects";

/**
 * Supported (exam body × subject × grade) combos for the wizard.
 * Add rows as content lands; UI only offers what appears here.
 */
export type CurriculumCombo = {
  examBody: ExamBody;
  subject: Subject;
  grades: Grade[];
};

/** MVP: Maths + Life Sciences for DBE and IEB, Grades 10–12. */
export const SUPPORTED_CURRICULUM: CurriculumCombo[] = [
  { examBody: "DBE", subject: "Mathematics", grades: ["10", "11", "12"] },
  { examBody: "DBE", subject: "Life Sciences", grades: ["10", "11", "12"] },
  { examBody: "IEB", subject: "Mathematics", grades: ["10", "11", "12"] },
  { examBody: "IEB", subject: "Life Sciences", grades: ["10", "11", "12"] },
];

export function getSubjectsForExamBody(examBody: ExamBody | null): Subject[] {
  if (!examBody) return [];
  const subjects = SUPPORTED_CURRICULUM.filter((c) => c.examBody === examBody).map(
    (c) => c.subject,
  );
  return [...new Set(subjects)];
}

export function getGradesFor(
  examBody: ExamBody | null,
  subject: Subject | null,
): Grade[] {
  if (!examBody || !subject) return [];
  const row = SUPPORTED_CURRICULUM.find(
    (c) => c.examBody === examBody && c.subject === subject,
  );
  return row?.grades ?? [];
}

export function isCurriculumSupported(
  examBody: ExamBody | null,
  subject: Subject | null,
  grade: Grade | null,
): boolean {
  if (!examBody || !subject || !grade) return false;
  return getGradesFor(examBody, subject).includes(grade);
}

/** Plain-language reason when a subject is not offered for an exam body. */
export function unavailableSubjectReason(
  examBody: ExamBody,
  subject: Subject,
): string | null {
  if (getSubjectsForExamBody(examBody).includes(subject)) return null;
  const bodyLabel =
    EXAM_BODY_OPTIONS.find((o) => o.value === examBody)?.label ?? examBody;
  return `${SUBJECT_LABELS[subject]} is not available for ${bodyLabel} in AssessMate yet.`;
}

export function gradeOptionLabel(grade: Grade): string {
  return GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? `Grade ${grade}`;
}
